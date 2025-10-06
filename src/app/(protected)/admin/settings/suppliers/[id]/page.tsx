'use client';

import React, {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useSuppliers} from "@/hooks/use-supplier";
import SupplierDetailPage from "@/components/detail/supliers-detail";
import PageHeader from "@/components/layout/page-header";

export default function SupplierDetail() {
    const params = useParams();
    const router = useRouter();
    const supplierId = params.id as string;


    const {
        selectedSupplier,
        fetchSupplierById,
        loading,
        deleteSupplier
    } = useSuppliers();


    useEffect(() => {
        const loadSupplier = async () => {
            try {
                await fetchSupplierById(supplierId);
            } catch (error) {
                console.error('Yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (supplierId) {
            loadSupplier();
        }
    }, [supplierId, fetchSupplierById]);





    const handleEdit = () => {
        router.push(`/admin/settings/suppliers/${supplierId}/edit`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteSupplier(supplierId);
                router.push('/admin/settings/suppliers');
            } catch (error) {
                console.error('Sipariş silinirken hata oluştu:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!selectedSupplier) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Sipariş Bulunamadı</h2>
                <p className="text-gray-600 mb-6">İstenen sipariş bilgisi bulunamadı veya silinmiş olabilir.</p>
                <button
                    onClick={() => router.push('/admin/orders')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Sipariş Listesine Dön
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <PageHeader/>
            <SupplierDetailPage
                supplier={selectedSupplier}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}

            /></div>
    );
}