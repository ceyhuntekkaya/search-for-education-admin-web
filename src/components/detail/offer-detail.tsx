'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {OrderParts} from "@/types/order";
import {useRouter} from 'next/navigation';
import {FileText} from 'lucide-react';
import {EOfferStatus} from "@/types/enumeration";
import OfferDetailTab from "@/components/detail/components/offer-detail-tab";
import {getStatusBadge} from '@/utils/enum-formatter';
import OrderDetailTab from "@/components/detail/components/order-detail-tab";
import DeliveryDetailTab from "@/components/detail/components/delivery-detail-tab";
import LoadingComp from "@/components/ui/loading-comp";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import OfferApprovalForm from "@/components/form/offer-approval-form";
import CustomerInfoForm from "@/components/form/customer-info-form";
import {useOffers} from "@/hooks/use-offer";
import {useOfferApprovals} from "@/hooks/use-offer-approval";
import {useCustomerInfos} from "@/hooks/use-customer-info";
import {User} from "@/types/auth";
import {useLanguage} from "@/contexts/language-context";
import OfferApprovalDetail from "@/components/detail/offer-approval-detail";
import {OfferApproval} from "@/types/offer";
import SetOrderState from "@/components/form/set-order-state-form";
import DeliveryProgressTable from "@/components/detail/delivery-progress-detail";

interface OfferDetailProps {
    data: OrderParts;
    onEdit?: () => void;
    onDelete?: () => void;
    onApprove?: () => void;
    onReject?: () => void;
    handleRefresh: (e: React.FormEvent) => void;
}

const OfferDetailPage: React.FC<OfferDetailProps> = ({
                                                         data,
                                                         onEdit,
                                                         onDelete,
                                                         onApprove,
                                                         onReject,
                                                         handleRefresh
                                                     }) => {
    const router = useRouter();
    const {t} = useLanguage();
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
        fillingFacility, customerInfos, offerApprovals, deliveryProgresses
    } = data;



    const {offers, fetchOffers} = useOffers();


    const [offerApprovalDetailShow, setOfferApprovalDetailShow] = useState(false);
    const [selectedOfferApproval, setSelectedOfferApproval] = useState<OfferApproval | null>(null);

    const {createOfferApproval, updateOfferApproval} = useOfferApprovals();
    const {createCustomerInfo} = useCustomerInfos();

    useEffect(() => {
        fetchOffers();
    }, []);


    if (loading) {
        return (
            <LoadingComp/>
        );
    }


    const handleCancel = () => {
        setOfferApprovalDetailShow(false);
    };


    const columnsApproval: Column<RecordType>[] = [
        {
            key: 'offerStatus',
            header: 'Durum',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => {
                        setSelectedOfferApproval(record as OfferApproval);
                        setOfferApprovalDetailShow(true);
                    }}
                >
                    {t(`status.${value as string}`)}
                </div>
            )
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'user',
            header: 'Kullanıcı',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(value as User).name} {(value as User).lastName}
                </div>
            )
        },
        {
            key: 'department',
            header: 'Birim',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'approvalDate',
            header: 'Onay Tarihi',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        }
    ];

    const columnsCustomerInfo: Column<RecordType>[] = [
        {
            key: 'requestDescription',
            header: 'İstek',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        }
    ];

    return (

        offer ?
            <div className="mx-6 my-3 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Teklif Detayı</h1>
                        <p className="text-gray-500">Teklif Kodu: {offer.code || offer.id?.substring(0, 8)}</p>
                    </div>
                    <div className="flex space-x-3">
                        {getStatusBadge(offer.offerStatus || 'NEW')}
                        <Button variant="outline" onClick={() => router.back()}>
                            Geri
                        </Button>
                        {onEdit && offer.offerStatus === EOfferStatus.NEW && (
                            <Button variant="outline" onClick={onEdit}>
                                Düzenle
                            </Button>
                        )}
                        {onApprove && offer.offerStatus === EOfferStatus.APPROVED && (
                            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onApprove}>
                                Onayla
                            </Button>
                        )}
                        {onReject && offer.offerStatus === EOfferStatus.APPROVED && (
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={onReject}>
                                Reddet
                            </Button>
                        )}
                        {onDelete && offer.offerStatus === EOfferStatus.NEW && (
                            <Button variant="secondary" onClick={onDelete}>
                                Sil
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                    </div>
                    <div className="flex space-x-3">

                        <SetOrderState orderId={offer.order.id} orderStateId={offer.order.orderState.id}/>
                    </div>
                </div>

                {/* Basit Sekme Navigasyonu */}
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
                            Teklif Detayları
                        </button>
                        <button
                            onClick={() => setActiveTab("order")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "order"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Sipariş Bilgileri
                        </button>
                        <button
                            onClick={() => setActiveTab("transportation")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "transportation"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Nakliye Bilgileri
                        </button>


                        <button
                            onClick={() => setActiveTab("approvals")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "approvals"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Onaylar
                        </button>
                        <button
                            onClick={() => setActiveTab("customerInfos")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "customerInfos"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Müşteri Verileri
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
                        <OfferDetailTab offer={offer}/>
                    )}

                    {activeTab === "order" && order && (
                        <OrderDetailTab order={order} customer={customer} supplier={supplier} product={product}
                                        fillingFacility={fillingFacility}/>
                    )}

                    {activeTab === "offer" && !offer && (
                        <Card>
                            <CardContent>
                                <div className="text-center py-10">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400"/>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{activeTab} - Sipariş
                                        Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu teklife ait sipariş bilgisi
                                        bulunamadı.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "transportation" && (
                        <DeliveryDetailTab delivery={delivery} transportationCompany={transportationCompany}
                                           order={order}/>
                    )}


                    {activeTab === "approvals" && (

                        <>
                            {
                                selectedOfferApproval && offerApprovalDetailShow ?
                                    <OfferApprovalDetail offerApproval={selectedOfferApproval}
                                                         onSubmit={updateOfferApproval} handleCancel={handleCancel}/>
                                    :
                                    <DynamicTable columns={columnsApproval} data={offerApprovals}/>
                            }


                        </>
                    )}
                    {activeTab === "customerInfos" && (
                        <DynamicTable columns={columnsCustomerInfo} data={customerInfos} pageSize={50}
                                      searchable={true}/>
                    )}


                    {activeTab === "approvals" && (
                        <OfferApprovalForm offers={offers} onSubmit={createOfferApproval} offer={offer}
                                           onCreate={handleRefresh}/>
                    )}
                    {activeTab === "customerInfos" && (
                        <CustomerInfoForm onSubmit={createCustomerInfo} customerId={offer.order.customer.id}/>
                    )}
                    {activeTab === "progress" && (
                        <DeliveryProgressTable deliveryProgress={deliveryProgresses || []}/>
                    )}

                </div>
            </div>

            : null

    );
};

export default OfferDetailPage;