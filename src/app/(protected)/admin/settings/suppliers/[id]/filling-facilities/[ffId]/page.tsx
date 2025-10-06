'use client';

import {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';

import {useFillingFacilities} from "@/hooks/use-filling-facilities";
import FillingFacilityDetailPage from "@/components/detail/filling-facility-detail";

export default function FillingFacilityDetail() {
    const params = useParams();
    const router = useRouter();
    const fillingFacilityId = params.ffId as string;
    const supplierId = params.id as string;


    const {
        selectedFillingFacility,
        fetchFillingFacilityById,
        loading,
        deleteFillingFacility
    } = useFillingFacilities();


    useEffect(() => {
        const loadFillingFacility = async () => {
            try {
                await fetchFillingFacilityById(fillingFacilityId);
            } catch (error) {
                console.error('Yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (fillingFacilityId) {
            loadFillingFacility();
        }
    }, [fillingFacilityId, fetchFillingFacilityById]);





    const handleEdit = () => {
        router.push(`/admin/settings/suppliers/${supplierId}/filling-facilities/${fillingFacilityId}/edit`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteFillingFacility(fillingFacilityId);
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

    if (!selectedFillingFacility) {
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
            <FillingFacilityDetailPage
                fillingFacility={selectedFillingFacility}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}

            /></div>
    );
}