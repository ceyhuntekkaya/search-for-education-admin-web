'use client';

import React, {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useOffers} from "@/hooks/use-offer";
import OfferDetailPage from "@/components/detail/offer-detail";
import {useOrderAllData} from "@/hooks/use-order-all-data";
import PageHeader from "@/components/layout/page-header";

export default function OfferDetail() {
    const params = useParams();
    const router = useRouter();
    const offerId = params.id as string;

    const {
        deleteOffer
    } = useOffers();

    const {
        orderParts,
        loading,
        getAllOrderData,
        offer,
    } = useOrderAllData();



    useEffect(() => {
        const loadOffer = async () => {
            try {
                await getAllOrderData(offerId, "offer");
            } catch (error) {
                console.error('Sipariş yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (offerId) {
            loadOffer();
        }
    }, [offerId, getAllOrderData]);


    const handleRefresh = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            //await getAllOrderData(offerId, "offer");
        } catch (error) {
            console.error('Sipariş yüklenirken hata oluştu:', error);
        } finally {
        }
    };



    const handleEdit = () => {
        router.push(`/admin/offers/edit/${offerId}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteOffer(offerId);
                router.push('/admin/orders');
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

    if (!offer) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Sipariş Bulunamadı</h2>
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
            <PageHeader/>
            {orderParts && offer ?
                <OfferDetailPage
                    data={orderParts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    handleRefresh={handleRefresh}

                />
                : null}
        </div>
    );
}





