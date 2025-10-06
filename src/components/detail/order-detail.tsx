'use client';

import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {OrderParts} from "@/types/order";
import OrderDetailTab from "@/components/detail/components/order-detail-tab";
import OfferDetailTab from "@/components/detail/components/offer-detail-tab";
import DeliveryDetailTab from "@/components/detail/components/delivery-detail-tab";
import LoadingComp from "@/components/ui/loading-comp";
import SetOrderState from "@/components/form/set-order-state-form";
import DeliveryProgressTable from "@/components/detail/delivery-progress-detail";

interface OrderDetailProps {
    data: OrderParts;
    onEdit?: () => void;
    onDelete?: () => void;
    isCompany?: boolean;
}

const OrderDetailPage: React.FC<OrderDetailProps> = ({
                                                         data,
                                                         onEdit,
                                                         onDelete,
                                                         isCompany = false
                                                     }) => {
    const [activeTab, setActiveTab] = useState("details");

    const {
        delivery,
        order,
        offer,
        transportationCompany,
        loading,
        customer,
        supplier,
        product,
        fillingFacility,
        deliveryProgresses
    } = data;


    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        order ?
            <div className=" mx-6 my-3 py-6 space-y-6 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Sipariş Detayı</h1>
                        <p className="text-gray-500">Sipariş Kodu: {order.code || order.id?.substring(0, 8)}</p>
                    </div>


                    {
                        !isCompany &&
                        <div className="flex space-x-3">


                            {onEdit && (
                                <Button variant="outline" onClick={onEdit}>
                                    Düzenle
                                </Button>
                            )}
                            {onDelete && (
                                <Button variant="secondary" onClick={onDelete}>
                                    Sil
                                </Button>
                            )}
                        </div>

                    }


                </div>


                {
                    !isCompany && <div className="flex items-center justify-between">
                        <div>
                        </div>
                        <div className="flex space-x-3">

                            <SetOrderState orderId={order.id} orderStateId={order.orderState.id}/>
                        </div>
                    </div>

                }


                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px space-x-8">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "details"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Sipariş Detayları
                        </button>
                        <button
                            onClick={() => setActiveTab("offers")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "offers"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Teklifler
                        </button>
                        <button
                            onClick={() => setActiveTab("delivery")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "delivery"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Teslimat
                        </button>
                        <button
                            onClick={() => setActiveTab("progress")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "progress"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            İşlemler
                        </button>
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === "details" && (
                        <OrderDetailTab order={order} customer={customer} supplier={supplier} product={product}
                                        fillingFacility={fillingFacility}/>
                    )}

                    {offer && activeTab === "offers" && (
                        <OfferDetailTab offer={offer}/>
                    )}

                    {activeTab === "delivery" && (
                        <DeliveryDetailTab delivery={delivery} order={order}
                                           transportationCompany={transportationCompany}/>
                    )}
                    {activeTab === "progress" && (
                        <DeliveryProgressTable deliveryProgress={deliveryProgresses || []}/>
                    )}
                </div>
            </div>
            : null
    );
};

export default OrderDetailPage;