import { useState, useCallback, useEffect } from 'react';
import {PaymentMethod, PaymentMethodFormData} from '@/types/offer';
import {paymentMethodService} from "@/services/api/payment-methods-service";
import {showNotification} from "@/lib/notification";
import {useRouter} from 'next/navigation';

interface UsePaymentMethodReturn {
    paymentMethods: PaymentMethod[];
    selectedPaymentMethod: PaymentMethod | null;
    loading: boolean;
    error: Error | null;
    fetchPaymentMethods: () => Promise<void>;
    fetchPaymentMethodById: (id: string) => Promise<void>;
    createPaymentMethod: (paymentMethod: PaymentMethodFormData) => Promise<void>;
    updatePaymentMethod: (paymentMethod: PaymentMethodFormData) => Promise<void>;
    deletePaymentMethod: (id: string) => Promise<void>;
}

export const usePaymentMethods = (): UsePaymentMethodReturn => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();


    const fetchPaymentMethods = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentMethodService.getAllPaymentMethods();
            setPaymentMethods(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPaymentMethodById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentMethodService.getPaymentMethodById(id);
            setSelectedPaymentMethod(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);



    const createPaymentMethod = useCallback(async (paymentMethod: PaymentMethodFormData) => {
        try {
            setLoading(true);
            setError(null);
            await paymentMethodService.createPaymentMethod(paymentMethod);
            await fetchPaymentMethods();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/paymentMethods`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchPaymentMethods, router]);

    const updatePaymentMethod = useCallback(async (paymentMethod: PaymentMethodFormData) => {
        try {
            setLoading(true);
            setError(null);
            await paymentMethodService.updatePaymentMethod(paymentMethod.id || '', paymentMethod);
            await fetchPaymentMethods();
            await fetchPaymentMethods();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/paymentMethods`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchPaymentMethods, router]);

    const deletePaymentMethod = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await paymentMethodService.deletePaymentMethod(id);
            await fetchPaymentMethods();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/paymentMethods`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchPaymentMethods, router]);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    return {
        paymentMethods,
        selectedPaymentMethod,
        loading,
        error,
        fetchPaymentMethods,
        fetchPaymentMethodById,
        createPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
    };
};
