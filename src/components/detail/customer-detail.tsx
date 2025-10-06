'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from 'next/navigation';
import CustomerDetailTabPage from "@/components/detail/components/customer-detail-tab";
import {getStatusBadge} from '@/utils/enum-formatter';
import {formatDate} from "@/utils/date-formater";
import LoadingComp from "@/components/ui/loading-comp";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import Link from "next/link";
import {useCustomers} from "@/hooks/use-customer";
import {useCustomerInfos} from "@/hooks/use-customer-info";
import {useCustomerAddress} from "@/hooks/use-customer-address";
import {useOrders} from "@/hooks/use-order";
import {usePaymentMethods} from "@/hooks/use-payment-method";
import CustomerPaymentMethod from "@/components/customer/customer-payment-method";
import CustomerAddress from "@/components/customer/customer-addres";
import CustomerOfferTextPertsForm from "@/components/form/customer-offer-text-parts-form";
import {User} from "@/types/auth";
import {Label} from "@/components/ui/label";
import {MoneyInput} from "@/components/ui/number-input";

interface CustomerDetailProps {
    customerId: string;
}

const CustomerDetailPage: React.FC<CustomerDetailProps> = ({
                                                               customerId,

                                                           }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("details");
    const [contractType, setContractType] = useState("");


    const [hasLock, setHasLock] = useState(false);
    const [hasLimit, setHasLimit] = useState(-1);

    const {
        selectedCustomer,
        setCustomerContractType,
        fetchCustomerById,
        loading,
        deleteCustomer,
        setCustomerOfferTextParts,
        updateCustomerLimit
    } = useCustomers();

    const {
        customerInfos,
        fetchCustomerInfoByCustomerId
    } = useCustomerInfos();

    const {
        fetchCustomerAddressByCustomerId
    } = useCustomerAddress();

    const {
        orders,
        searchOrdersByCustomer,
    } = useOrders();

    const {
        fetchPaymentMethods
    } = usePaymentMethods();


    useEffect(() => {
        if (!selectedCustomer || !selectedCustomer.contractType || contractType !== selectedCustomer?.contractType) {
            if (selectedCustomer) {
                if (contractType !== "" && selectedCustomer.contractType !== contractType) {
                    selectedCustomer.contractType = contractType;
                    setCustomerContractType(selectedCustomer.id, contractType);
                }
            }
        }

    }, [contractType, selectedCustomer, setCustomerContractType]);


    useEffect(() => {
        if (selectedCustomer) {
             setHasLock(selectedCustomer.banned || false);
             setHasLimit(selectedCustomer.maxLimit || -1);
        }

    }, [contractType, selectedCustomer, setCustomerContractType]);





    useEffect(() => {
        const loadCustomer = async () => {
            try {
                await fetchCustomerById(customerId);
                await fetchCustomerInfoByCustomerId(customerId);
                await searchOrdersByCustomer(customerId);
                await fetchPaymentMethods();
            } catch (error) {
                console.error('Sevkiyat yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (customerId) {
            loadCustomer();
        }
    }, [customerId, fetchCustomerAddressByCustomerId, fetchCustomerById, fetchCustomerInfoByCustomerId, fetchPaymentMethods, searchOrdersByCustomer]);


    useEffect(() => {

        if (selectedCustomer && selectedCustomer.id) {
            setContractType(selectedCustomer.contractType || "SORT");
        }
    }, [customerId, selectedCustomer]);


    const updateData = () => {
        const loadCustomer = async () => {
            try {
                await fetchCustomerById(customerId);
                await fetchCustomerInfoByCustomerId(customerId);
                await searchOrdersByCustomer(customerId);
                await fetchPaymentMethods();
            } catch (error) {
                console.error('Müşteri Bilgileri yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        loadCustomer();
    };


    const handleAddOrder = () => {
        router.push(`/admin/orders/add`);
    };


    const handleEdit = () => {
        router.push(`/admin/customers/edit/${customerId}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteCustomer(customerId);
                router.push('/admin/customers');
            } catch (error) {
                console.error('Sipariş silinirken hata oluştu:', error);
            }
        }
    };


    const isLoading = loading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!selectedCustomer) {
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


    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }


    const columnsCustomerInfo: Column<RecordType>[] = [

        {
            key: 'requestingUser',
            header: 'İstek',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(value as User).name as string} {(value as User).lastName as string}
                </div>
            )
        },
        {
            key: 'createdAt',
            header: 'Tarih',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {formatDate(value as string, "dateTime")}
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


    const handleLimitSubmit = () => {
        updateCustomerLimit(selectedCustomer.id, hasLock, hasLimit)
    }

    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Müşteri Detayı</h1>
                    <p className="text-gray-500">Müşteri Kodu: {selectedCustomer.code || 'N/A'}</p>
                </div>
                <div className="flex space-x-3">
                    {selectedCustomer.status && getStatusBadge(selectedCustomer.status.toString())}
                    <Button variant="outline" onClick={() => router.back()}>
                        Geri
                    </Button>
                    <Button variant="outline" onClick={handleEdit}>
                        Düzenle
                    </Button>

                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddOrder}>
                        Sipariş Oluştur
                    </Button>

                    <Button variant="secondary" onClick={handleDelete}>
                        Sil
                    </Button>
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
                        Müşteri Bilgileri
                    </button>

                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "orders"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Siparişler
                    </button>
                    <button
                        onClick={() => setActiveTab("address")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "address"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Adresler
                    </button>
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "info"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        İstihbarat
                    </button>
                    <button
                        onClick={() => setActiveTab("paymentMethods")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "paymentMethods"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Ödeme Yöntemleri
                    </button>
                    <button
                        onClick={() => setActiveTab("offerDetail")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "offerDetail"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Teklif Detayı
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Müşteri Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <CustomerDetailTabPage customer={selectedCustomer}/>
                )}

                {/* Siparişler Sekmesi */}
                {activeTab === "orders" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Siparişler</CardTitle>
                            <CardDescription>Bu müşteriye ait siparişler</CardDescription>
                        </CardHeader>
                        <CardContent>


                            {orders && orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Sipariş Kodu
                                            </th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Tarih</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Miktar</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Durum</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-500">İşlemler</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{order.code || 'N/A'}</td>
                                                <td className="py-3 px-4">{formatDate(order.orderDate)}</td>
                                                <td className="py-3 px-4">{order.orderQuantity} ton</td>
                                                <td className="py-3 px-4">
                                                    {order.status &&
                                                        <Badge className="bg-blue-500">{order.status}</Badge>}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="outline" size="sm"
                                                            onClick={() => router.push(`/admin/orders/${order.id}`)}>
                                                        Detay
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Sipariş Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu müşteriye ait sipariş
                                        bulunmamaktadır.</p>
                                    <div className="mt-6">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={handleAddOrder}>
                                            Sipariş Oluştur
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}


                {activeTab === "address" && (
                    <CustomerAddress customerId={customerId} selectedCustomer={selectedCustomer}/>
                )}

                {activeTab === "info" && (
                    <>
                        <div className="flex items-center justify-between">


                            <form onSubmit={handleLimitSubmit} className="space-y-6">
                                {/* Temel Bilgiler */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Sipariş Seçimi */}
                                    <div className="col-span-4 space-y-2">
                                        <Label htmlFor="order">YASAKLI MÜŞTERİ - SATIŞ YAPILAMAZ...</Label>
                                        <input
                                            type="checkbox"
                                            checked={hasLock || false}
                                            onChange={() =>  setHasLock(!hasLock)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>


                                    <div className="space-y-2">
                                        <Label>Sipariş limiti</Label>
                                        <MoneyInput
                                            id="limitAmount"
                                            name="limitAmount"
                                            value={hasLimit}
                                            min="0"
                                            step="0.01"
                                            onChange={(value) => {
                                                setHasLimit(value as number)
                                            }}
                                            className={'border-red-500'}
                                        />
                                    </div>

                                    {/* Açıklama */}

                                    <div className="space-y-2 col-span-4">
                                        <div className="flex space-x-4">
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                                KAYDET
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="flex space-x-3">

                                <Link href={`/admin/customers/${customerId}/info`}>
                                    YENİ İSTİHBARAT EKLE
                                </Link>
                            </div>
                        </div>
                        <hr/>
                        <DynamicTable columns={columnsCustomerInfo} data={customerInfos} pageSize={50}/>
                    </>


                )}

                {activeTab === "paymentMethods" && (
                    <CustomerPaymentMethod setContractType={setContractType} selectedCustomer={selectedCustomer}
                                           updateData={updateData}/>
                )}


                {activeTab === "offerDetail" && (
                    <CustomerOfferTextPertsForm onSubmit={setCustomerOfferTextParts} customer={selectedCustomer}/>
                )}

            </div>
        </div>
    );
};

export default CustomerDetailPage;