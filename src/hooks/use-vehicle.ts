import { useState, useCallback, useEffect } from 'react';
import {Vehicle, VehicleFormData} from '@/types/vehicle';
import {vehicleService} from "@/services/api/vehicle-service";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";


interface UseVehicleReturn {
    vehicles: Vehicle[];
    selectedVehicle: Vehicle | null;
    loading: boolean;
    error: Error | null;
    fetchVehicles: () => Promise<void>;
    fetchVehicleById: (id: string) => Promise<void>;
    searchVehiclesByLicensePlate: (name: string) => Promise<void>;
    createVehicle: (vehicle: VehicleFormData) => Promise<void>;
    updateVehicle: (vehicle: VehicleFormData) => Promise<void>;
    deleteVehicle: (id: string) => Promise<void>;
}

export const useVehicles = (): UseVehicleReturn => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchVehicles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleService.getAllVehicles();
            setVehicles(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVehicleById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleService.getVehicleById(id);
            setSelectedVehicle(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchVehiclesByLicensePlate = useCallback(async (licensePlate: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleService.getVehiclesByLicensePlate(licensePlate);
            setVehicles(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVehicle = useCallback(async (vehicle: VehicleFormData) => {
        try {
            setLoading(true);
            setError(null);
            await vehicleService.createVehicle(vehicle);
            await fetchVehicles();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/vehicles`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicles, router]);

    const updateVehicle = useCallback(async (vehicle: VehicleFormData) => {
        try {
            setLoading(true);
            setError(null);
            await vehicleService.updateVehicle(vehicle.id || '', vehicle);
            await fetchVehicles();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/vehicles`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicles, router]);

    const deleteVehicle = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await vehicleService.deleteVehicle(id);
            await fetchVehicles();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/vehicles`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicles, router]);

    useEffect(() => {
        //fetchVehicles();
    }, [fetchVehicles]);

    return {
        vehicles,
        selectedVehicle,
        loading,
        error,
        fetchVehicles,
        fetchVehicleById,
        searchVehiclesByLicensePlate,
        createVehicle,
        updateVehicle,
        deleteVehicle
    };
};