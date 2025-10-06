'use client';

import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Order} from "@/types/order";
import {TransportationCompany} from "@/types/transportation-company";
import {Delivery} from "@/types/delivery";
import {getStatusBadge} from "@/utils/enum-formatter";
import {formatCurrency, formatDate} from "@/utils/date-formater";

interface DeliveryDetailTabProps {
    delivery?: Delivery | null;
    order?: Order | null;
    transportationCompany?: TransportationCompany | null;
}

const DeliveryDetailTabPage: React.FC<DeliveryDetailTabProps> = ({
                                                                     delivery,
                                                                     order,
                                                                     transportationCompany,
                                                                 }) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
                delivery ?
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Teslimat Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Teslimat Kodu</p>
                                        <p className="font-medium">{delivery.code || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Durum</p>
                                        <div>{getStatusBadge(delivery.deliveryStatus || 'PLANNED')}</div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500 mb-2">Teslimat Zamanı</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Teslimat Tarihi</p>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-medium">{formatDate(delivery.deliveryDate)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Teslimat Saati</p>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-medium">{delivery.deliveryTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500 mb-2">Nakliye Bilgileri</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Maliyet</p>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-medium">{formatCurrency(delivery.cost)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Mesafe</p>
                                            <p className="font-medium">{delivery.distance} km</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Süre</p>
                                            <p className="font-medium">{delivery.duration} saat</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Nakliye Şirketi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {transportationCompany ? (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="font-medium">{transportationCompany.name}</p>
                                            {transportationCompany.contactPerson && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-600">İletişim: {String(transportationCompany.contactPerson)}</p>
                                                    <p className="text-sm text-gray-600">Telefon: {String(transportationCompany.phone)}</p>
                                                    <p className="text-sm text-gray-600">E-posta: {String(transportationCompany.email)}</p>
                                                </div>
                                            )}
                                        </div>
                                        {transportationCompany.address && (
                                            <div className="border-t pt-4">
                                                <p className="text-sm text-gray-500 mb-2">Adres</p>
                                                <p className="text-gray-700">{String(transportationCompany.address)}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nakliye Şirketi
                                            Seçilmemiş</h3>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {order && (
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Teslimat Adresi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start space-x-2">
                                        <div>
                                            <p className="font-medium">Teslimat Adresi</p>
                                            <p className="text-gray-700">{order.location || 'Belirtilmemiş'}</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Şehir: {typeof order.city === 'string'
                                                ? order.city
                                                : (order.city ? 'Belirtilmemiş' : 'Belirtilmemiş')}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                    : null
            }
        </div>
    );
};

export default DeliveryDetailTabPage;