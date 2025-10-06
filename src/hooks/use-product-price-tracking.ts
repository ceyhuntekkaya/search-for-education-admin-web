import {ProductPriceTracking, ProductPriceTrackingFormData} from "@/types/supplier";
import {useCallback, useEffect, useState} from "react";
import {productPriceTrackingService} from "@/services/api/product-price-tracking-service";
import {showNotification} from "@/lib/notification";


interface UseProductPriceTrackingReturn {
    productPriceTracking: ProductPriceTracking[];
    selectedProductPriceTracking: ProductPriceTracking | null;
    loading: boolean;
    error: Error | null;
    fetchProductPriceTrackingById: (id: string) => Promise<void>;
    fetchProductPriceTracking: () => Promise<void>;
    createProductPriceTracking: (product: ProductPriceTrackingFormData) => Promise<void>;
    updateProductPriceTracking: (id: string, product: ProductPriceTrackingFormData) => Promise<void>;
    deleteProductPriceTracking: (id: string) => Promise<void>;
}

export const useProductPriceTracking = (): UseProductPriceTrackingReturn => {
    const [productPriceTracking, setProductPriceTracking] = useState<ProductPriceTracking[]>([]);
    const [selectedProductPriceTracking, setSelectedProductPriceTracking] = useState<ProductPriceTracking | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProductPriceTracking = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productPriceTrackingService.getAllProductPriceTracking();
            setProductPriceTracking(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProductPriceTrackingById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productPriceTrackingService.getProductPriceTrackingById(id);
            setSelectedProductPriceTracking(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);



    const createProductPriceTracking = useCallback(async (productPriceTracking: ProductPriceTrackingFormData) => {
        try {
            setLoading(true);
            setError(null);
            await productPriceTrackingService.createProductPriceTracking(productPriceTracking);
            await fetchProductPriceTracking();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchProductPriceTracking]);

    const updateProductPriceTracking = useCallback(async (id: string, productPriceTracking: ProductPriceTrackingFormData) => {
        try {
            setLoading(true);
            setError(null);
            await productPriceTrackingService.updateProductPriceTracking(id, productPriceTracking);
            await fetchProductPriceTracking();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchProductPriceTracking]);

    const deleteProductPriceTracking = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await productPriceTrackingService.deleteProductPriceTracking(id);
            await fetchProductPriceTracking();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchProductPriceTracking]);


    useEffect(() => {
        fetchProductPriceTracking();
    }, [fetchProductPriceTracking]);

    return {
        productPriceTracking,
        selectedProductPriceTracking,
        loading,
        error,
        fetchProductPriceTracking,
        createProductPriceTracking,
        updateProductPriceTracking,
        deleteProductPriceTracking,
        fetchProductPriceTrackingById,
    };
};