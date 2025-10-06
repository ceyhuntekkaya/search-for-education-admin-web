import { useState, useCallback, useEffect } from 'react';
import {DeliveryDocumentType, DeliveryDocumentTypeFormData} from '@/types/delivery';
import {deliveryDocumentTypeService} from "@/services/api/delivery-document-type-service";
import {showNotification} from "@/lib/notification";


interface UseDeliveryDocumentTypeReturn {
    deliveryDocumentType: DeliveryDocumentType[];
    selectedDeliveryDocumentType: DeliveryDocumentType | null;
    loading: boolean;
    error: Error | null;
    fetchDeliveryDocumentType: () => Promise<void>;
    fetchDeliveryDocumentTypeById: (id: string) => Promise<void>;
    searchDeliveryDocumentTypeByName: (name: string) => Promise<void>;
    createDeliveryDocumentType: (deliveryDocumentType: DeliveryDocumentTypeFormData) => Promise<void>;
    updateDeliveryDocumentType: (id: string, deliveryDocumentType: DeliveryDocumentTypeFormData) => Promise<void>;
    deleteDeliveryDocumentType: (id: string) => Promise<void>;
}

export const useDeliveryDocumentType = (): UseDeliveryDocumentTypeReturn => {
    const [deliveryDocumentType, setDeliveryDocumentTypes] = useState<DeliveryDocumentType[]>([]);
    const [selectedDeliveryDocumentType, setSelectedDeliveryDocumentType] = useState<DeliveryDocumentType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchDeliveryDocumentType = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryDocumentTypeService.getAllDeliveryDocumentTypes();
            setDeliveryDocumentTypes(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDeliveryDocumentTypeById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryDocumentTypeService.getDeliveryDocumentTypeById(id);
            setSelectedDeliveryDocumentType(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchDeliveryDocumentTypeByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryDocumentTypeService.getDeliveryDocumentTypesByName(name);
            setDeliveryDocumentTypes(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDeliveryDocumentType = useCallback(async (deliveryDocumentType: DeliveryDocumentTypeFormData) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryDocumentTypeService.createDeliveryDocumentType(deliveryDocumentType);
            await fetchDeliveryDocumentType();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryDocumentType]);

    const updateDeliveryDocumentType = useCallback(async (id: string, deliveryDocumentType: DeliveryDocumentTypeFormData) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryDocumentTypeService.updateDeliveryDocumentType(id, deliveryDocumentType);
            await fetchDeliveryDocumentType();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryDocumentType]);

    const deleteDeliveryDocumentType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryDocumentTypeService.deleteDeliveryDocumentType(id);
            await fetchDeliveryDocumentType();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryDocumentType]);

    useEffect(() => {
        fetchDeliveryDocumentType();
    }, [fetchDeliveryDocumentType]);

    return {
        deliveryDocumentType,
        selectedDeliveryDocumentType,
        loading,
        error,
        fetchDeliveryDocumentType,
        fetchDeliveryDocumentTypeById,
        searchDeliveryDocumentTypeByName,
        createDeliveryDocumentType,
        updateDeliveryDocumentType,
        deleteDeliveryDocumentType
    };
};