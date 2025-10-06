import { useState, useCallback, useEffect } from 'react';
import {Supplier, SupplierFormData} from '@/types/supplier';
import {supplierService} from "@/services/api/supplier-service";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";
import {useAuthContext} from "@/contexts/auth-context";


interface UseSupplierReturn {
    suppliers: Supplier[];
    selectedSupplier: Supplier | null;
    loading: boolean;
    error: Error | null;
    fetchSuppliers: () => Promise<void>;
    fetchSupplierById: (id: string) => Promise<void>;
    searchSuppliersByName: (name: string) => Promise<void>;
    createSupplier: (supplier: SupplierFormData) => Promise<void>;
    updateSupplier: (supplier: SupplierFormData) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;
}

export const useSuppliers = (): UseSupplierReturn => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();
    const { activeBrand } = useAuthContext();

    const fetchSuppliers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await supplierService.getAllSuppliers();
            setSuppliers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSupplierById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await supplierService.getSupplierById(id);
            setSelectedSupplier(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchSuppliersByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await supplierService.getSuppliersByName(name);
            setSuppliers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createSupplier = useCallback(async (supplier: SupplierFormData) => {
        try {
            setLoading(true);
            setError(null);
            supplier.brandId = activeBrand?.id || '';
            await supplierService.createSupplier(supplier);
            await fetchSuppliers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/suppliers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchSuppliers, router]);

    const updateSupplier = useCallback(async (supplier: SupplierFormData) => {
        try {
            setLoading(true);
            setError(null);
            await supplierService.updateSupplier(supplier.id || '', supplier);
            await fetchSuppliers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/suppliers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchSuppliers, router]);

    const deleteSupplier = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await supplierService.deleteSupplier(id);
            await fetchSuppliers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/suppliers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchSuppliers, router]);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    return {
        suppliers,
        selectedSupplier,
        loading,
        error,
        fetchSuppliers,
        fetchSupplierById,
        searchSuppliersByName,
        createSupplier,
        updateSupplier,
        deleteSupplier
    };
};