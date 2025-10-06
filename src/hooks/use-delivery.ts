import { useState, useCallback, useEffect } from 'react';
import {Delivery, DeliveryFormData} from '@/types/delivery';
import {deliveryService} from "@/services/api/delivery-service";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";

interface UseDeliveryReturn {
    deliveries: Delivery[];
    selectedDelivery: Delivery | null;
    loading: boolean;
    error: Error | null;
    fetchDeliveries: () => Promise<void>;
    fetchDeliveryById: (id: string) => Promise<void>;
    searchDeliveriesByOffer: (offerId: string) => Promise<void>;
    searchDeliveriesByOrder: (orderId: string) => Promise<void>;
    createDelivery: (delivery: DeliveryFormData) => Promise<void>;
    updateDelivery: (delivery: DeliveryFormData) => Promise<void>;
    deleteDelivery: (id: string) => Promise<void>;
}

export const useDeliveries = (): UseDeliveryReturn => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchDeliveries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryService.getAllDeliveries();
            setDeliveries(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDeliveryById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryService.getDeliveryById(id);
            setSelectedDelivery(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchDeliveriesByOffer = useCallback(async (offerId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryService.findByOfferId(offerId);
            setDeliveries(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchDeliveriesByOrder = useCallback(async (orderId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryService.findByOrderId(orderId);
            setDeliveries(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDelivery = useCallback(async (delivery: DeliveryFormData) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryService.createDelivery(delivery);
            await fetchDeliveries();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/deliveries`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu! ' + err);
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveries, router]);

    const updateDelivery = useCallback(async (delivery: DeliveryFormData) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryService.updateDelivery(delivery.id || '', delivery);
            await fetchDeliveries();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/deliveries`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveries, router]);

    const deleteDelivery = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryService.deleteDelivery(id);
            await fetchDeliveries();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/deliveries`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveries, router]);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    return {
        deliveries,
        selectedDelivery,
        loading,
        error,
        fetchDeliveries,
        fetchDeliveryById,
        searchDeliveriesByOffer,
        searchDeliveriesByOrder,
        createDelivery,
        updateDelivery,
        deleteDelivery
    };
};