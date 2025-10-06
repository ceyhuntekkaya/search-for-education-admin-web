'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useOrderAllData} from "@/hooks/use-order-all-data";
import PageHeader from "@/components/layout/page-header";
import DeliveryUserDetailPage from "@/components/detail/delivery-user-detail";

export default function OrderCompanyDetail() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const[orderKey,  setOrderKey] = useState<string | null>("default");


    const {
        order,
        loading,
        error,
        orderParts,
        getAllOrderData,
    } = useOrderAllData();


    useEffect(() => {
        const loadOrder = async () => {
            try {
                await getAllOrderData(orderId, "order");
                setOrderKey(orderId)
            } catch (error) {
                console.error('Sipariş yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (orderId) {
            loadOrder();
        }
    }, [orderId, getAllOrderData]);




    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!order) {
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

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Veriler çekiliken bir hata oluştu.</h2>
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
            {
                orderKey !== "default" ?
                    orderParts ?
                        <DeliveryUserDetailPage
                            data={orderParts}
                        />
                        : null
                    :null
            }


        </div>
    );
}




