import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {districtService} from "@/services/api/district-service";
import { DistrictFormData, District } from '@/types/district';
import {showNotification} from "@/lib/notification";


interface UseDistrictReturn {
    districts: District[];
    cityDistricts: District[];
    selectedDistrict: District | null;
    loading: boolean;
    error: Error | null;
    fetchDistrict: (shouldRedirect?: boolean) => Promise<void>;
    fetchDistrictById: (id: string) => Promise<void>;
    filterCityDistrict: (city: string) => Promise<void>;
    fetchDistrictByCustomerId: (customerId: string) => Promise<void>;
    createDistrict: (district: DistrictFormData) => Promise<void>;
    updateDistrict: (id: string, district: DistrictFormData) => Promise<void>;
    deleteDistrict: (id: string) => Promise<void>;
}

export const useDistrict = (): UseDistrictReturn => {
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [cityDistricts, setCityDistricts] = useState<District[]>([]);
    const router = useRouter();

    const fetchDistrict = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await districtService.getAllDistricts();
            setDistricts(data);

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

    const fetchDistrictById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await districtService.getDistrictById(id);
            setSelectedDistrict(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDistrictByCustomerId = useCallback(async (customerId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await districtService.getDistrictByCustomerId(customerId);
            setDistricts(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDistrict = useCallback(async (customer: DistrictFormData) => {
        try {
            setLoading(true);
            setError(null);
            await districtService.createDistrict(customer);
            await fetchDistrict();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDistrict]);

    const updateDistrict = useCallback(async (id: string, district: DistrictFormData) => {
        try {
            setLoading(true);
            setError(null);
            await districtService.updateDistrict(id, district);
            await fetchDistrict();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDistrict]);

    const deleteDistrict = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await districtService.deleteDistrict(id);
            await fetchDistrict();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchDistrict]);



    function turkishToEnglish(text: string): string {
        const turkishChars: Record<string, string> = {
            'ç': 'c',
            'Ç': 'C',
            'ğ': 'g',
            'Ğ': 'G',
            'ı': 'i',
            'İ': 'I',
            'ö': 'o',
            'Ö': 'O',
            'ş': 's',
            'Ş': 'S',
            'ü': 'u',
            'Ü': 'U'
        };

        return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, match => turkishChars[match] || match);
    }

    const filterCityDistrict = useCallback(async (city: string) => {
        try {
            fetchDistrict();
            setLoading(true);
            setError(null);
            const districtList = districts.filter(district => turkishToEnglish(district.cityName) === city);
            setCityDistricts(districtList);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [districts, fetchDistrict]);


    useEffect(() => {
        fetchDistrict();
    }, [fetchDistrict]);

    return {
        districts,
        cityDistricts,
        filterCityDistrict,
        selectedDistrict,
        fetchDistrict,
        fetchDistrictById,
        fetchDistrictByCustomerId,
        createDistrict,
        updateDistrict,
        deleteDistrict,
        loading,
        error,
    };
};