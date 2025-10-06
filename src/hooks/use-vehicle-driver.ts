import { useState, useCallback, useEffect } from 'react';
import {VehicleDriver, VehicleDriverFormData} from '@/types/vehicle';
import {vehicleDriverService} from "@/services/api/vehicle-driver-service";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";


interface UseVehicleDriverReturn {
    vehicleDrivers: VehicleDriver[];
    selectedVehicleDriver: VehicleDriver | null;
    loading: boolean;
    error: Error | null;
    fetchVehicleDrivers: () => Promise<void>;
    fetchVehicleDriverById: (id: string) => Promise<void>;
    searchVehicleDriversByName: (name: string) => Promise<void>;
    createVehicleDriver: (vehicleDriver: VehicleDriverFormData) => Promise<void>;
    updateVehicleDriver: (vehicleDriver: VehicleDriverFormData) => Promise<void>;
    deleteVehicleDriver: (id: string) => Promise<void>;
}

export const useVehicleDrivers = (): UseVehicleDriverReturn => {
    const [vehicleDrivers, setVehicleDrivers] = useState<VehicleDriver[]>([]);
    const [selectedVehicleDriver, setSelectedVehicleDriver] = useState<VehicleDriver | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchVehicleDrivers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleDriverService.getAllVehicleDrivers();
            setVehicleDrivers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVehicleDriverById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleDriverService.getVehicleDriverById(id);
            setSelectedVehicleDriver(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchVehicleDriversByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleDriverService.getVehicleDriversByName(name);
            setVehicleDrivers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVehicleDriver = useCallback(async (vehicleDriver: VehicleDriverFormData) => {
        try {
            setLoading(true);
            setError(null);

            await vehicleDriverService.createVehicleDriver(vehicleDriver);
            await fetchVehicleDrivers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/vehicle-drivers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicleDrivers, router]);

    const updateVehicleDriver = useCallback(async (vehicleDriver: VehicleDriverFormData) => {
        try {
            setLoading(true);
            setError(null);
            await vehicleDriverService.updateVehicleDriver(vehicleDriver.id || '', vehicleDriver);
            await fetchVehicleDrivers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/vehicle-drivers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicleDrivers, router]);

    const deleteVehicleDriver = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await vehicleDriverService.deleteVehicleDriver(id);
            await fetchVehicleDrivers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/vehicle-drivers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicleDrivers, router]);

    useEffect(() => {
      //  fetchVehicleDrivers();
    }, [fetchVehicleDrivers]);

    return {
        vehicleDrivers,
        selectedVehicleDriver,
        loading,
        error,
        fetchVehicleDrivers,
        fetchVehicleDriverById,
        searchVehicleDriversByName,
        createVehicleDriver,
        updateVehicleDriver,
        deleteVehicleDriver
    };
};