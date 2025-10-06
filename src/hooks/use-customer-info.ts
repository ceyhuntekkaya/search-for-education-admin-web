import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {customerInfoService} from "@/services/api/customer-info-service";
import { CustomerInfoFormData, CustomerInfo } from '@/types/customer';
import {showNotification} from "@/lib/notification";


interface UseCustomerInfoReturn {
    customerInfos: CustomerInfo[];
    selectedCustomerInfo: CustomerInfo | null;
    loading: boolean;
    error: Error | null;
    fetchCustomerInfos: (shouldRedirect?: boolean) => Promise<void>;
    fetchCustomerInfoById: (id: string) => Promise<void>;
    fetchCustomerInfoByCustomerId: (customerInfoId: string) => Promise<void>;
    createCustomerInfo: (customerInfo: CustomerInfoFormData) => Promise<void>;
    updateCustomerInfo: (id: string, customerInfo: CustomerInfoFormData) => Promise<void>;
    deleteCustomerInfo: (id: string) => Promise<void>;
}

export const useCustomerInfos = (): UseCustomerInfoReturn => {
    const [customerInfos, setCustomerInfos] = useState<CustomerInfo[]>([]);
    const [selectedCustomerInfo, setSelectedCustomerInfo] = useState<CustomerInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchCustomerInfos = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerInfoService.getAllCustomerInfos();
            setCustomerInfos(data);

            if (shouldRedirect) {
                router.push('/admin/customers');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCustomerInfoById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerInfoService.getCustomerInfoById(id);
            setSelectedCustomerInfo(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCustomerInfoByCustomerId = useCallback(async (customerId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerInfoService.getCustomerInfoByCustomerId(customerId);
            setCustomerInfos(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCustomerInfo = useCallback(async (customer: CustomerInfoFormData) => {
        try {
            setLoading(true);
            setError(null);
            await customerInfoService.createCustomerInfo(customer);
            await fetchCustomerInfos();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomerInfos]);

    const updateCustomerInfo = useCallback(async (id: string, customerInfo: CustomerInfoFormData) => {
        try {
            setLoading(true);
            setError(null);
            await customerInfoService.updateCustomerInfo(id, customerInfo);
            await fetchCustomerInfos();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomerInfos]);

    const deleteCustomerInfo = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await customerInfoService.deleteCustomerInfo(id);
            await fetchCustomerInfos();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomerInfos]);


    useEffect(() => {
        fetchCustomerInfos();
    }, [fetchCustomerInfos]);

    return {
        customerInfos,
        selectedCustomerInfo,
        fetchCustomerInfos,
        fetchCustomerInfoById,
        fetchCustomerInfoByCustomerId,
        createCustomerInfo,
        updateCustomerInfo,
        deleteCustomerInfo,
        loading,
        error,
    };
};