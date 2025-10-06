'use client';

import React, {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";
import VehicleDriverDetailPage from "@/components/detail/vehicle-driver-detail";
import PageHeader from "@/components/layout/page-header";

export default function VehicleDriverDetail() {
    const params = useParams();
    const router = useRouter();
    const vehicleDriverId = params.id as string;

    const {
        selectedVehicleDriver,
        fetchVehicleDriverById,
        loading,
        deleteVehicleDriver
    } = useVehicleDrivers();


    useEffect(() => {
        const loadVehicleDriver = async () => {
            try {
                await fetchVehicleDriverById(vehicleDriverId);
            } catch (error) {
                console.error('Yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (vehicleDriverId) {
            loadVehicleDriver();
        }
    }, [vehicleDriverId, fetchVehicleDriverById]);


    const handleEdit = () => {
        router.push(`/admin/settings/vehicle-drivers/${vehicleDriverId}/edit`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteVehicleDriver(vehicleDriverId);
                router.push('/admin/settings/vehicle-drivers');
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

    if (!selectedVehicleDriver) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Nakliye Firması Bulunamadı</h2>
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
            <VehicleDriverDetailPage
                vehicleDriver={selectedVehicleDriver}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            /></div>
    );
}