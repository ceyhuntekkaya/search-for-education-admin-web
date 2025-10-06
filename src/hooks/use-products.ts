import { useState, useCallback, useEffect } from 'react';
import {Product, ProductFormData} from '@/types/supplier';
import {productService} from "@/services/api/product-service";
import {showNotification} from "@/lib/notification";
import {useAuthContext} from "@/contexts/auth-context";



interface UseProductReturn {
    products: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: Error | null;
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    searchProductsBySupplier: (name: string) => Promise<void>;
    createProduct: (product: ProductFormData) => Promise<void>;
    updateProduct: (product: ProductFormData) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProducts = (): UseProductReturn => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { activeBrand } = useAuthContext();

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProductById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getProductById(id);
            setSelectedProduct(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchProductsBySupplier = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.findBySupplierId(id);
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProduct = useCallback(async (product: ProductFormData) => {
        try {
            setLoading(true);
            setError(null);
            product.brandId = activeBrand?.id || '';
            await productService.createProduct(product);
            await fetchProducts();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    const updateProduct = useCallback(async (product: ProductFormData) => {
        try {
            setLoading(true);
            setError(null);
            await productService.updateProduct(product.id || '', product);
            await fetchProducts();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    const deleteProduct = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await productService.deleteProduct(id);
            await fetchProducts();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        selectedProduct,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        searchProductsBySupplier,
        createProduct,
        updateProduct,
        deleteProduct
    };
};