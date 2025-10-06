import { useState, useCallback } from 'react';
import {Customer, CustomerFormData} from '@/types/customer';
import {customerService} from "@/services/api/customer-service";
import {SqlRequest} from "@/types/sql-type";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";

interface UseCustomerReturn {
    customers: Customer[];
    selectedCustomer: Customer | null;
    loading: boolean;
    error: Error | null;
    fetchCustomers: (shouldRedirect?: boolean) => Promise<void>;
    getCustomersFromData: (sqlRequest:SqlRequest) => Promise<void>;
    fetchCustomerById: (id: string) => Promise<void>;
    searchCustomersByName: (name: string) => Promise<void>;
    setPaymentMethods: (type: string, customerId: string, paymentMethodId: string) => Promise<void>;
    createCustomer: (customer: CustomerFormData) => Promise<void>;
    updateCustomer: (id: string, customer: CustomerFormData) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    setCustomerContractType: (customerId: string, contractType: string) => Promise<void>;
    setCustomerOfferTextParts: (id: string, parts: string) => Promise<void>;
    updateCustomerLimit:  (id: string, hasLock: boolean, hasLimit:number) => Promise<void>;
}

export const useCustomers = (): UseCustomerReturn => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();


    const fetchCustomers = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerService.getAllCustomers();
            setCustomers(data);

            if (shouldRedirect) {
                router.push('/admin/customers');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchCustomerById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerService.getCustomerById(id);
            setSelectedCustomer(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCustomersByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerService.getCustomerBySearchByName(name);
            setCustomers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCustomer = useCallback(async (customer: CustomerFormData) => {
        try {
            setLoading(true);
            setError(null);
            await customerService.createCustomer(customer);
            await fetchCustomers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/customers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomers, router]);

    const updateCustomer = useCallback(async (id: string, customer: CustomerFormData) => {
        try {
            setLoading(true);
            setError(null);
            await customerService.updateCustomer(id, customer);
            await fetchCustomers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/customers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomers, router]);

    const deleteCustomer = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await customerService.deleteCustomer(id);
            await fetchCustomers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/customers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCustomers, router]);


    const getCustomersFromData = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerService.getCustomersFromData(sqlRequest);
            setCustomers(data);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);



    const setCustomerContractType = useCallback(async (customerId:string, contractType:string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerService.setCustomerContractType(customerId, contractType);
            setSelectedCustomer(data);
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);





    const setPaymentMethods = useCallback(async (type: string, customerId: string, paymentMethodId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerService.setPaymentMethods(type, customerId, paymentMethodId);
            setSelectedCustomer(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);




    const setCustomerOfferTextParts = useCallback(async (id: string, parts: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerService.setCustomerOfferTextParts(id, parts);
            setSelectedCustomer(data)
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);


    const updateCustomerLimit = useCallback(async (id: string, hasLock:boolean, hasLimit:number) => {
        try {
            setLoading(true);
            setError(null);
            await customerService.updateCustomerLimit(id, hasLock, hasLimit);
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);
/*

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

 */

    return {
        getCustomersFromData,
        customers,
        selectedCustomer,
        loading,
        error,
        fetchCustomers,
        fetchCustomerById,
        searchCustomersByName,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        setPaymentMethods,
        setCustomerContractType,
        setCustomerOfferTextParts,
        updateCustomerLimit,

    };
};