'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';
import {FileText, Upload} from 'lucide-react';
import {EDeliveryStatus} from "@/types/enumeration";
import DeliveryDetailTab from "@/components/detail/components/delivery-detail-tab";
import {getStatusBadge} from "@/utils/enum-formatter";
import OrderDetailTab from "@/components/detail/components/order-detail-tab";
import OfferDetailTab from "@/components/detail/components/offer-detail-tab";
import {OrderParts} from "@/types/order";
import LoadingComp from "@/components/ui/loading-comp";
import SetOrderState from "@/components/form/set-order-state-form";
import DeliveryProgressTable from "@/components/detail/delivery-progress-detail";
import {useDeliveryDocument} from "@/hooks/use-delivery-document";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import {UploadedFile} from "@/types/uploaded-file";
import {User} from "@/types/auth";
import {formatDate} from "@/utils/date-formater";
import Link from "next/link";
import siteConfig from '@/config/config.json';
import {DeliveryDocument} from "@/types/delivery";
import DeliveryVehicleFollowTab from "@/components/detail/components/delivery-follow-tab";


interface DeliveryDetailProps {
    data: OrderParts;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onApprove?: () => void;
    onUploadDocument?: () => void;
    onUpdateProgress?: () => void;
    updateAllData?: () => void;
    tab?: string | ''
}


const DeliveryDetailPage: React.FC<DeliveryDetailProps> = ({
                                                               data,
                                                               onEdit,
                                                               onDelete,
                                                               onApprove,
                                                               onUploadDocument,
                                                               onUpdateProgress,
                                                               updateAllData,
    tab = "details"
                                                           }) => {
        const router = useRouter();
        const [activeTab, setActiveTab] = useState(tab);
        const {
            delivery,
            order,
            offer,
            transportationCompany,
            deliveryProgresses = [],
            deliveryDocuments,
            loading,
            customer,
            supplier,
            product,
            fillingFacility
        } = data;

        const {
            createDeliveryDocument
        } = useDeliveryDocument();

        const [fileUploadStatus, setFileUploadStatus] = useState("");
        const [uploadFile, setUploadFile] = useState<File | null>(null);
        const fileInputRef = useRef(null);

        const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files.length > 0) {
                setUploadFile(event.target.files[0]);
            }
        };

        console.log("onUpdateProgress", onUpdateProgress)
        console.log("fileUploadStatus", fileUploadStatus)


        useEffect(() => {
            if (uploadFile) {
                handleSendSingleFileUpload(uploadFile).then(
                    () => {
                        if (updateAllData)
                            updateAllData()
                    }
                ).catch((error) => {
                        setFileUploadStatus("ERROR");
                        console.error("Dosya yükleme hatası:", error);
                    }
                );
            }
        }, [uploadFile]);


        if (loading) {
            return (
                <LoadingComp/>
            );
        }

        const handleSendSingleFileUpload = async (file: File) => {
            if (delivery) {
                try {
                    setFileUploadStatus("UPLOADING");

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("description", "açıklama yeri");
                    formData.append("deliveryId", delivery.id);

                    await createDeliveryDocument(formData);

                    setFileUploadStatus("UPLOADED");
                } catch (error) {
                    setFileUploadStatus("ERROR");
                    console.error("Dosya yükleme hatası:", error);
                }
            }
        };


        const SITE_URL = siteConfig.api.invokeUrl;
        const columns: Column<RecordType>[] = [
            {
                key: 'file',
                header: 'Doküman',
                render: (value, record) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                    >
                        <Link
                            href={`${SITE_URL}/storage/preview2/document/${(record as DeliveryDocument).delivery.order.code}/${(record as DeliveryDocument).file.id}`}
                            target={"_blank"}> {(value as UploadedFile).fileOriginalName}</Link>
                    </div>
                )
            },
            {
                key: 'description',
                header: 'Açıklama',
                sortable: true,
                render: (value, record) => {

                    if (value && typeof value === 'object' && 'name' in value) {
                        return (
                            <div
                                className="font-medium cursor-pointer hover:text-blue-600"
                            >
                                <Link
                                    href={`${SITE_URL}/storage/preview2/document/${(record as DeliveryDocument).delivery.order.code}/${(record as DeliveryDocument).file.id}`}
                                    target={"_blank"}> {value.name as string}</Link>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                key: 'user',
                header: 'Yükleyen',
                render: (value, record) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                    >
                        <Link
                            href={`${SITE_URL}/storage/preview2/document/${(record as DeliveryDocument).delivery.order.code}/${(record as DeliveryDocument).file.id}`}
                            target={"_blank"}>  {(value as User)?.name} {(value as User)?.lastName}</Link>
                    </div>
                )
            }, {
                key: 'createdAt',
                header: 'Tarih',
                render: (value, record) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                    >
                        <Link
                            href={`${SITE_URL}/storage/preview2/document/${(record as DeliveryDocument).delivery.order.code}/${(record as DeliveryDocument).file.id}`}
                            target={"_blank"}>   {formatDate(value as string)}</Link>
                    </div>
                )
            },
        ];

        return (
            <div className="mx-6 my-3 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Teslimat Detayı</h1>
                        <p className="text-gray-500">Teslimat Kodu: {delivery?.code || delivery?.id?.substring(0, 8)}</p>
                    </div>
                    <div className="flex space-x-3">
                        {getStatusBadge(delivery?.deliveryStatus || 'PLANNED')}
                        <Button variant="outline" onClick={() => router.back()}>
                            Geri
                        </Button>
                        {onEdit && delivery?.deliveryStatus !== EDeliveryStatus.COMPLETED && (
                            <Button variant="outline" onClick={onEdit}>
                                Düzenle
                            </Button>
                        )}
                        {onApprove && delivery?.deliveryStatus === EDeliveryStatus.APPROVED && (
                            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onApprove}>
                                Teslim Onayı
                            </Button>
                        )}
                        {onDelete && delivery?.deliveryStatus !== EDeliveryStatus.COMPLETED && (
                            <Button variant="secondary" onClick={onDelete}>
                                Sil
                            </Button>
                        )}
                        {onUploadDocument && (
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onUploadDocument}>
                                Belge Yükle
                            </Button>
                        )}


                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                    </div>
                    <div className="flex space-x-3">
                        {
                            delivery && delivery.offer && delivery.offer.order && (
                                <SetOrderState orderId={delivery.offer.order.id}
                                               orderStateId={delivery.offer.order.orderState.id}/>
                            )
                        }

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
                            Teslimat Detayları
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
                            onClick={() => setActiveTab("offer")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "offer"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Teklif Bilgileri
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
                            onClick={() => setActiveTab("documents")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "documents"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Belgeler
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

                        <button
                            onClick={() => setActiveTab("follow")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "follow"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Araç Takibi
                        </button>
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === "details" && (
                        <DeliveryDetailTab delivery={delivery} order={order} transportationCompany={transportationCompany}/>
                    )}


                    {activeTab === "order" && order && (
                        <OrderDetailTab order={order} customer={customer} supplier={supplier} product={product}
                                        fillingFacility={fillingFacility}/>
                    )}

                    {activeTab === "offer" && offer && (
                        <OfferDetailTab offer={offer}/>
                    )}

                    {activeTab === "order" && !order && (
                        <Card>
                            <CardContent>
                                <div className="text-center py-10">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400"/>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Sipariş Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu teslimata ait sipariş bilgisi
                                        bulunamadı.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "transportation" && (
                        <DeliveryDetailTab delivery={delivery} transportationCompany={transportationCompany} order={order}/>
                    )}

                    {activeTab === "follow" && (
                        <DeliveryVehicleFollowTab delivery={delivery}/>
                    )}

                    {activeTab === "progress" && (
                        <DeliveryProgressTable deliveryProgress={deliveryProgresses || []}/>
                    )}

                    {/* Belgeler ve İlerleme Sekmesi */}
                    {activeTab === "documents" && (
                        <div className="">


                            <Card>
                                <CardHeader>
                                    <CardTitle>Teslimat Belgeleri</CardTitle>
                                    <CardDescription>Yüklenen dokümanlar</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400"/>


                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple={false}

                                            onChange={handleOnChange}
                                            onClick={(event) => {
                                                (event.target as HTMLInputElement).value = "";
                                            }}
                                        />
                                        <hr/>

                                        {deliveryDocuments && deliveryDocuments.length > 0 ?
                                            <DynamicTable columns={columns} data={deliveryDocuments}/> :
                                            <>
                                                <h3 className="mt-2 text-sm font-semibold text-gray-900">Belge Yok</h3>
                                                <p className="mt-1 text-sm text-gray-500">Henüz teslimat belgesi
                                                    yüklenmemiştir.</p>
                                            </>
                                        }


                                        {deliveryDocuments && (
                                            <div className="mt-6">
                                                <Button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={onUploadDocument}
                                                >
                                                    Belge Yükle
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        );
    }
;

export default DeliveryDetailPage;