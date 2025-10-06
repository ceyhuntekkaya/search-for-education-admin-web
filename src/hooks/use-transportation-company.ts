import { useState, useCallback, useEffect } from 'react';
import {TransportationCompany, TransportationCompanyFormData} from '@/types/transportation-company';
import {transportationCompanyService} from "@/services/api/transportation-company-service";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";
import {useAuthContext} from "@/contexts/auth-context";


interface UseTransportationCompanyReturn {
    transportationCompanies: TransportationCompany[];
    selectedTransportationCompany: TransportationCompany | null;
    loading: boolean;
    error: Error | null;
    fetchTransportationCompanies: () => Promise<void>;
    fetchTransportationCompanyById: (id: string) => Promise<void>;
    searchTransportationCompaniesByName: (name: string) => Promise<void>;
    createTransportationCompany: (transportationCompany: TransportationCompanyFormData) => Promise<void>;
    updateTransportationCompany: (transportationCompany: TransportationCompanyFormData) => Promise<void>;
    deleteTransportationCompany: (id: string) => Promise<void>;
}

export const useTransportationCompanies = (): UseTransportationCompanyReturn => {
    const [transportationCompanies, setTransportationCompanies] = useState<TransportationCompany[]>([]);
    const [selectedTransportationCompany, setSelectedTransportationCompany] = useState<TransportationCompany | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();
    const { activeBrand } = useAuthContext();

    const fetchTransportationCompanies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await transportationCompanyService.getAllTransportationCompanies();
            setTransportationCompanies(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTransportationCompanyById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await transportationCompanyService.getTransportationCompanyById(id);
            setSelectedTransportationCompany(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchTransportationCompaniesByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await transportationCompanyService.getTransportationCompaniesByName(name);
            setTransportationCompanies(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTransportationCompany = useCallback(async (transportationCompany: TransportationCompanyFormData) => {
        try {
            setLoading(true);
            setError(null);
            transportationCompany.brandId = activeBrand?.id || '';
            await transportationCompanyService.createTransportationCompany(transportationCompany);
            await fetchTransportationCompanies();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/transportation-companies`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [activeBrand?.id, fetchTransportationCompanies, router]);

    const updateTransportationCompany = useCallback(async (transportationCompany: TransportationCompanyFormData) => {
        try {
            setLoading(true);
            setError(null);
            await transportationCompanyService.updateTransportationCompany(transportationCompany.id || '', transportationCompany);
            await fetchTransportationCompanies();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/transportation-companies`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchTransportationCompanies, router]);

    const deleteTransportationCompany = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await transportationCompanyService.deleteTransportationCompany(id);
            await fetchTransportationCompanies();
            router.push(`/admin/settings/transportation-companies`)

        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchTransportationCompanies, router]);

    useEffect(() => {
        fetchTransportationCompanies();
    }, [fetchTransportationCompanies]);

    return {
        transportationCompanies,
        selectedTransportationCompany,
        loading,
        error,
        fetchTransportationCompanies,
        fetchTransportationCompanyById,
        searchTransportationCompaniesByName,
        createTransportationCompany,
        updateTransportationCompany,
        deleteTransportationCompany
    };
};