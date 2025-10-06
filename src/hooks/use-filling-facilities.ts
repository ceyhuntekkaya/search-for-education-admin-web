import { useState, useCallback, useEffect } from 'react';
import {FillingFacility, FillingFacilityFormData} from '@/types/supplier';
import {fillingFacilityService} from "@/services/api/filling-facility-service";
import {showNotification} from "@/lib/notification";


interface UseFillingFacilityReturn {
    fillingFacilities: FillingFacility[];
    selectedFillingFacility: FillingFacility | null;
    loading: boolean;
    error: Error | null;
    fetchFillingFacilities: () => Promise<void>;
    fetchFillingFacilityById: (id: string) => Promise<void>;
    searchFillingFacilitiesBySupplier: (name: string) => Promise<void>;
    createFillingFacility: (fillingFacility: FillingFacilityFormData) => Promise<void>;
    updateFillingFacility: (fillingFacility: FillingFacilityFormData) => Promise<void>;
    deleteFillingFacility: (id: string) => Promise<void>;
}

export const useFillingFacilities = (): UseFillingFacilityReturn => {
    const [fillingFacilities, setFillingFacilities] = useState<FillingFacility[]>([]);
    const [selectedFillingFacility, setSelectedFillingFacility] = useState<FillingFacility | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchFillingFacilities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fillingFacilityService.getAllFillingFacilities();
            setFillingFacilities(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFillingFacilityById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fillingFacilityService.getFillingFacilityById(id);
            setSelectedFillingFacility(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchFillingFacilitiesBySupplier = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fillingFacilityService.findFillingFacilitiesBySupplierId(id);
            setFillingFacilities(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createFillingFacility = useCallback(async (fillingFacility: FillingFacilityFormData) => {
        try {
            setLoading(true);
            setError(null);
            await fillingFacilityService.createFillingFacility(fillingFacility);
            await fetchFillingFacilities();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchFillingFacilities]);

    const updateFillingFacility = useCallback(async (fillingFacility: FillingFacilityFormData) => {
        try {
            setLoading(true);
            setError(null);
            await fillingFacilityService.updateFillingFacility(fillingFacility.id || '', fillingFacility);
            await fetchFillingFacilities();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchFillingFacilities]);

    const deleteFillingFacility = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await fillingFacilityService.deleteFillingFacility(id);
            await fetchFillingFacilities();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchFillingFacilities]);

    useEffect(() => {
        fetchFillingFacilities();
    }, [fetchFillingFacilities]);

    return {
        fillingFacilities,
        selectedFillingFacility,
        loading,
        error,
        fetchFillingFacilities,
        fetchFillingFacilityById,
        searchFillingFacilitiesBySupplier,
        createFillingFacility,
        updateFillingFacility,
        deleteFillingFacility
    };
};