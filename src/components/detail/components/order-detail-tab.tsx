'use client';

import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {formatDate} from "@/utils/date-formater";
import {getStatusBadge} from "@/utils/enum-formatter";
import {Order} from '@/types/order';
import {Customer} from "@/types/customer";
import {FillingFacility, Product, Supplier} from "@/types/supplier";
import {ECity} from "@/types/enumeration";

interface OfferDetailProps {
    order: Order;
    customer?: Customer | null;
    supplier?: Supplier | null;
    product?: Product | null;
    fillingFacility?: FillingFacility | null;
}

const OrderDetailTab: React.FC<OfferDetailProps> = ({
                                                        order,
                                                        customer,
                                                        supplier,
                                                        product,
                                                        fillingFacility,
                                                    }) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sipariş Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Sipariş Kodu</p>
                            <p className="font-medium">{order.code || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Sipariş Tarihi</p>
                            <div className="flex items-center space-x-2">
                                <p className="font-medium">{formatDate(order.orderDate)}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Durum</p>
                            <div>{getStatusBadge(order.status || 'NEW')}</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Ödeme Vadesi</p>
                            <div className="flex items-center space-x-2">
                                <p className="font-medium">{order.paymentTerm} gün</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-2">Miktar Bilgileri</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Sipariş Miktarı</p>
                                <p className="font-medium">{order.orderQuantity} ton</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Toplam Litre</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{order.totalLiter} lt</p>
                                </div>
                            </div>
                            {order.lastUpdate && (
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Son Güncelleme</p>
                                    <p className="font-medium">{formatDate(order.lastUpdate)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>İlişkili Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">Müşteri</p>
                        <div className="p-3 bg-gray-50 rounded-md">
                            <p className="font-medium">{customer?.name || order.customer?.name}</p>
                            {customer?.contactPerson && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">İletişim: {customer.contactPerson}</p>
                                    <p className="text-sm text-gray-600">Telefon: {customer.contactPersonPhone}</p>
                                    <p className="text-sm text-gray-600">E-posta: {customer.contactPersonEmail}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">Tedarikçi</p>
                        <div className="p-3 bg-gray-50 rounded-md">
                            <p className="font-medium">{supplier?.name || order.supplier?.name}</p>
                            <p className="text-sm text-gray-600">Kod: {supplier?.code || order.supplier?.code}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">Ürün & Dolum Tesisi</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-md">
                                <p className="font-medium">{product?.name || order.product?.name}</p>
                                <p className="text-sm text-gray-600">Kod: {product?.code || order.product?.code}</p>
                                {product?.type && (
                                    <p className="text-sm text-gray-600">Tip: {product.type}</p>
                                )}
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <p className="font-medium">
                                    {fillingFacility?.name || order.fillingFacility?.name}
                                </p>
                                {(fillingFacility?.capacity || order.fillingFacility?.capacity) && (
                                    <p className="text-sm text-gray-600">
                                        Kapasite: {fillingFacility?.capacity || order.fillingFacility?.capacity} ton
                                    </p>
                                )}
                                {fillingFacility?.isOperational !== undefined && (
                                    <p className="text-sm text-gray-600">
                                        Durum: {fillingFacility.isOperational ? 'Aktif' : 'İnaktif'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Teslimat Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start space-x-2">
                        <div>
                            <p className="font-medium">Teslimat Adresi</p>
                            <p className="text-gray-700">{order.location}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Şehir: {typeof order.city === 'string'
                                ? order.city
                                : (order.city ? ECity[order.city] : 'Belirtilmemiş')}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderDetailTab;