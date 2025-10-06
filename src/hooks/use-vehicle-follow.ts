import { useState, useCallback, } from 'react';
import {VehicleFollow, VehicleFollowFormData} from '@/types/vehicle';
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";
import {vehicleFollowService} from "@/services/api/vehicle-follow-service";


interface UseVehicleFollowReturn {
    vehicleFollows: VehicleFollow[];
    selectedVehicleFollow: VehicleFollow | null;
    loading: boolean;
    error: Error | null;
    fetchVehicleFollows: () => Promise<void>;
    fetchVehicleFollowById: (id: string) => Promise<void>;
    getVehicleFollowByVehicleDriver: (id: string) => Promise<void>;
    getVehicleFollowByVehicle: (id: string) => Promise<void>;
    getVehicleFollowByDelivery: (id: string) => Promise<void>;
    createVehicleFollow: (vehicleFollow: VehicleFollowFormData) => Promise<void>;
    updateVehicleFollow: (vehicleFollow: VehicleFollowFormData) => Promise<void>;
    deleteVehicleFollow: (id: string) => Promise<void>;
}

export const useVehicleFollows = (): UseVehicleFollowReturn => {
    const [vehicleFollows, setVehicleFollows] = useState<VehicleFollow[]>([]);
    const [selectedVehicleFollow, setSelectedVehicleFollow] = useState<VehicleFollow | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchVehicleFollows = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleFollowService.getAllVehicleFollows();
            setVehicleFollows(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVehicleFollowById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleFollowService.getVehicleFollowById(id);
            setSelectedVehicleFollow(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getVehicleFollowByVehicleDriver = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleFollowService.getVehicleFollowByVehicleDriver(id);
            setVehicleFollows(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);
    const getVehicleFollowByVehicle = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleFollowService.getVehicleFollowByVehicle(id);
            setVehicleFollows(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);
    const getVehicleFollowByDelivery = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await vehicleFollowService.getVehicleFollowByDelivery(id);
            setVehicleFollows(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVehicleFollow = useCallback(async (vehicleFollow: VehicleFollowFormData) => {
        try {
            setLoading(true);
            setError(null);

            await vehicleFollowService.createVehicleFollow(vehicleFollow);
            await fetchVehicleFollows();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicleFollows, router]);

    const updateVehicleFollow = useCallback(async (vehicleFollow: VehicleFollowFormData) => {
        try {
            setLoading(true);
            setError(null);
            await vehicleFollowService.updateVehicleFollow(vehicleFollow.id || '', vehicleFollow);
            await fetchVehicleFollows();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicleFollows, router]);

    const deleteVehicleFollow = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await vehicleFollowService.deleteVehicleFollow(id);
            await fetchVehicleFollows();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchVehicleFollows, router]);



    return {
        vehicleFollows,
        selectedVehicleFollow,
        loading,
        error,
        fetchVehicleFollows,
        fetchVehicleFollowById,
        getVehicleFollowByVehicleDriver,
        getVehicleFollowByVehicle,
        getVehicleFollowByDelivery,
        createVehicleFollow,
        updateVehicleFollow,
        deleteVehicleFollow
    };
};