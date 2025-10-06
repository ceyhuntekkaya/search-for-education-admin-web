import { useState, useCallback, useEffect } from 'react';
import {Brand, BrandFormData} from '@/types/brand';
import {brandService} from "@/services/api/brand-service";
import {SqlRequest} from "@/types/sql-type";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";

interface UseBrandReturn {
    brands: Brand[];
    selectedBrand: Brand | null;
    loading: boolean;
    error: Error | null;
    fetchBrands: (shouldRedirect?: boolean) => Promise<void>;
    getBrandsFromData: (sqlRequest:SqlRequest) => Promise<void>;
    fetchBrandById: (id: string) => Promise<void>;
    searchBrandsByName: (name: string) => Promise<void>;
    createBrand: (brand: BrandFormData) => Promise<void>;
    updateBrand: (id: string, brand: BrandFormData) => Promise<void>;
    deleteBrand: (id: string) => Promise<void>;
}

export const useBrands = (): UseBrandReturn => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();


    const fetchBrands = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await brandService.getAllBrands();
            setBrands(data);

            if (shouldRedirect) {
                router.push('/admin/brands');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchBrandById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await brandService.getBrandById(id);
            setSelectedBrand(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchBrandsByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await brandService.getBrandBySearchByName(name);
            setBrands(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createBrand = useCallback(async (brand: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);
            await brandService.createBrand(brand);
            await fetchBrands();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/brands`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBrands, router]);

    const updateBrand = useCallback(async (id: string, brand: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);
            await brandService.updateBrand(id, brand);
            await fetchBrands();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/brands`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBrands, router]);

    const deleteBrand = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await brandService.deleteBrand(id);
            await fetchBrands();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/brands`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBrands, router]);


    const getBrandsFromData = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await brandService.getBrandsFromData(sqlRequest);
            setBrands(data);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);





    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    return {
        getBrandsFromData,
        brands,
        selectedBrand,
        loading,
        error,
        fetchBrands,
        fetchBrandById,
        searchBrandsByName,
        createBrand,
        updateBrand,
        deleteBrand,
    };
};