'use client';

import {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';

import {useProducts} from "@/hooks/use-products";
import ProductDetailPage from "@/components/detail/product-detail";

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const supplierId = params.id as string;
    const productId = params.pId as string;

    const {
        selectedProduct,
        fetchProductById,
        loading,
        deleteProduct
    } = useProducts();


    useEffect(() => {
        const loadProduct = async () => {
            try {
                await fetchProductById(productId);
            } catch (error) {
                console.error('Yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId, fetchProductById]);

    const handleEdit = () => {
        router.push(`/admin/settings/suppliers/${supplierId}/products/${productId}/edit`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteProduct(productId);
                router.push('/admin/settings/suppliers');
            } catch (error) {
                console.error('Sipariş silinirken hata oluştu:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!selectedProduct) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">ürün Bulunamadı</h2>
                <p className="text-gray-600 mb-6">İstenen sipariş bilgisi bulunamadı veya silinmiş olabilir.</p>
                <button
                    onClick={() => router.push('/admin/orders')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Sipariş Listesine Dön
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <ProductDetailPage
                product={selectedProduct}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}

            /></div>
    );
}