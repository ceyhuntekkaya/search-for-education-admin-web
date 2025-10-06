import { useState, useCallback, useEffect } from 'react';
import {DeliveryProgress, DeliveryProgressFormData} from '@/types/delivery';
import {deliveryProgressService} from "@/services/api/delivery-progress-service";
import {showNotification} from "@/lib/notification";


interface UseDeliveryProgressReturn {
    deliveryProgress: DeliveryProgress[];
    selectedDeliveryProgress: DeliveryProgress | null;
    loading: boolean;
    error: Error | null;
    fetchDeliveryProgress: () => Promise<void>;
    fetchDeliveryProgressById: (id: string) => Promise<void>;
    searchDeliveryProgressByDeliver: (id: string) => Promise<void>;
    createDeliveryProgress: (deliveryProgress: DeliveryProgressFormData) => Promise<void>;
    updateDeliveryProgress: (id: string, deliveryProgress: DeliveryProgressFormData) => Promise<void>;
    deleteDeliveryProgress: (id: string) => Promise<void>;
}

export const useDeliveryProgress = (): UseDeliveryProgressReturn => {
    const [deliveryProgress, setDeliveryProgresss] = useState<DeliveryProgress[]>([]);
    const [selectedDeliveryProgress, setSelectedDeliveryProgress] = useState<DeliveryProgress | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchDeliveryProgress = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryProgressService.getAllDeliveryProgress();
            setDeliveryProgresss(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDeliveryProgressById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryProgressService.getDeliveryProgressById(id);
            setSelectedDeliveryProgress(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchDeliveryProgressByDeliver = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryProgressService.getDeliveryProgressByDeliveryId(id);
            setDeliveryProgresss(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDeliveryProgress = useCallback(async (deliveryProgress: DeliveryProgressFormData) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryProgressService.createDeliveryProgress(deliveryProgress);
            await fetchDeliveryProgress();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryProgress]);

    const updateDeliveryProgress = useCallback(async (id: string, deliveryProgress: DeliveryProgressFormData) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryProgressService.updateDeliveryProgress(id, deliveryProgress);
            await fetchDeliveryProgress();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryProgress]);

    const deleteDeliveryProgress = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryProgressService.deleteDeliveryProgress(id);
            await fetchDeliveryProgress();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryProgress]);

    useEffect(() => {
        fetchDeliveryProgress();
    }, [fetchDeliveryProgress]);

    return {
        deliveryProgress,
        selectedDeliveryProgress,
        loading,
        error,
        fetchDeliveryProgress,
        fetchDeliveryProgressById,
        searchDeliveryProgressByDeliver,
        createDeliveryProgress,
        updateDeliveryProgress,
        deleteDeliveryProgress
    };
};