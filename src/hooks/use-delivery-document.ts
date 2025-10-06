import { useState, useCallback, useEffect } from 'react';
import {DeliveryDocument, DeliveryDocumentFormData} from '@/types/delivery';
import {deliveryDocumentService} from "@/services/api/delivery-document-service";
import {showNotification} from "@/lib/notification";


interface UseDeliveryDocumentReturn {
    deliveryDocument: DeliveryDocument[];
    selectedDeliveryDocument: DeliveryDocument | null;
    loading: boolean;
    error: Error | null;
    fetchDeliveryDocument: () => Promise<void>;
    fetchDeliveryDocumentById: (id: string) => Promise<void>;
    searchDeliveryDocumentByDeliver: (id: string) => Promise<void>;
    createDeliveryDocument: (deliveryDocument: FormData) => Promise<void>;
    updateDeliveryDocument: (id: string, deliveryDocument: DeliveryDocumentFormData) => Promise<void>;
    deleteDeliveryDocument: (id: string) => Promise<void>;
}

export const useDeliveryDocument = (): UseDeliveryDocumentReturn => {
    const [deliveryDocument, setDeliveryDocuments] = useState<DeliveryDocument[]>([]);
    const [selectedDeliveryDocument, setSelectedDeliveryDocument] = useState<DeliveryDocument | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchDeliveryDocument = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryDocumentService.getAllDeliveryDocuments();
            setDeliveryDocuments(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDeliveryDocumentById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryDocumentService.getDeliveryDocumentById(id);
            setSelectedDeliveryDocument(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchDeliveryDocumentByDeliver = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await deliveryDocumentService.getDeliveryDocumentByDeliveryId(id);
            setDeliveryDocuments(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDeliveryDocument = useCallback(async (deliveryDocument: FormData) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryDocumentService.createDeliveryDocument(deliveryDocument);
            await fetchDeliveryDocument();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryDocument]);

    const updateDeliveryDocument = useCallback(async (id: string, deliveryDocument: DeliveryDocumentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryDocumentService.updateDeliveryDocument(id, deliveryDocument);
            await fetchDeliveryDocument();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryDocument]);

    const deleteDeliveryDocument = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await deliveryDocumentService.deleteDeliveryDocument(id);
            await fetchDeliveryDocument();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDeliveryDocument]);

    useEffect(() => {
        fetchDeliveryDocument();
    }, [fetchDeliveryDocument]);

    return {
        deliveryDocument,
        selectedDeliveryDocument,
        loading,
        error,
        fetchDeliveryDocument,
        fetchDeliveryDocumentById,
        searchDeliveryDocumentByDeliver,
        createDeliveryDocument,
        updateDeliveryDocument,
        deleteDeliveryDocument
    };
};