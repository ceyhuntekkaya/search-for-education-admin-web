import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {customerAddressService} from "@/services/api/customer-address-service";
import { CustomerAddressFormData, CustomerAddress } from '@/types/customer';
import {showNotification} from "@/lib/notification";


interface UseCustomerAddressReturn {
    customerAddress: CustomerAddress[];
    selectedCustomerAddress: CustomerAddress | null;
    loading: boolean;
    error: Error | null;
    fetchCustomerAddress: (shouldRedirect?: boolean) => Promise<void>;
    fetchCustomerAddressById: (id: string) => Promise<void>;
    fetchCustomerAddressByCustomerId: (customerAddressId: string) => Promise<void>;
    createCustomerAddress: (customerAddress: CustomerAddressFormData) => Promise<void>;
    updateCustomerAddress: (customerAddress: CustomerAddressFormData) => Promise<void>;
    deleteCustomerAddress: (id: string) => Promise<void>;
}

export const useCustomerAddress = (): UseCustomerAddressReturn => {
    const [customerAddress, setCustomerAddress] = useState<CustomerAddress[]>([]);
    const [selectedCustomerAddress, setSelectedCustomerAddress] = useState<CustomerAddress | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchCustomerAddress = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerAddressService.getAllCustomerAddress();
            setCustomerAddress(data);

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

    const fetchCustomerAddressById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerAddressService.getCustomerAddressById(id);
            setSelectedCustomerAddress(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCustomerAddressByCustomerId = useCallback(async (customerId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerAddressService.getCustomerAddressByCustomerId(customerId);
            setCustomerAddress(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCustomerAddress = useCallback(async (customer: CustomerAddressFormData) => {
        try {
            setLoading(true);
            setError(null);
            await customerAddressService.createCustomerAddress(customer);
            await fetchCustomerAddress();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomerAddress]);

    const updateCustomerAddress = useCallback(async (customerAddress: CustomerAddressFormData) => {
        try {
            setLoading(true);
            setError(null);
            await customerAddressService.updateCustomerAddress(customerAddress?.id || '', customerAddress);
            await fetchCustomerAddress();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomerAddress]);

    const deleteCustomerAddress = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await customerAddressService.deleteCustomerAddress(id);
            await fetchCustomerAddress();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomerAddress]);


    return {
        customerAddress,
        selectedCustomerAddress,
        fetchCustomerAddress,
        fetchCustomerAddressById,
        fetchCustomerAddressByCustomerId,
        createCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        loading,
        error,
    };
};