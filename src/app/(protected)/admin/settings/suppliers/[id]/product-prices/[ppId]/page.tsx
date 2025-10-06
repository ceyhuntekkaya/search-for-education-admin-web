'use client';

import {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';

import {useProductPriceTracking} from "@/hooks/use-product-price-tracking";
import ProductPriceTrackingDetailPage from "@/components/detail/product-price-tracking-detail";

export default function ProductPriceDetail() {
    const params = useParams();
    const router = useRouter();
    const supplierId = params.id as string;
    const productPriceId = params.ppId as string;

    const {
        selectedProductPriceTracking,
        fetchProductPriceTrackingById,
        loading,
        deleteProductPriceTracking
    } = useProductPriceTracking();


    useEffect(() => {
        const loadProductPriceTracking = async () => {
            try {
                await fetchProductPriceTrackingById(productPriceId);
            } catch (error) {
                console.error('Yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (productPriceId) {
            loadProductPriceTracking();
        }
    }, [productPriceId, fetchProductPriceTrackingById]);

    const handleEdit = () => {
        router.push(`/admin/settings/suppliers/${supplierId}/edit/${productPriceId}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteProductPriceTracking(productPriceId);
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

    if (!selectedProductPriceTracking) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Fiyatlandırma Bulunamadı</h2>
               - {
                    productPriceId
               }-
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
            <ProductPriceTrackingDetailPage
                productPriceTracking={selectedProductPriceTracking}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}

            /></div>
    );
}