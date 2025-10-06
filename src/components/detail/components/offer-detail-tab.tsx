'use client';

import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Offer} from "@/types/offer";
import {formatCurrency, formatDate} from "@/utils/date-formater";
import {getStatusBadge} from "@/utils/enum-formatter";

interface OfferDetailProps {
    offer: Offer;
}

const OfferDetailTab: React.FC<OfferDetailProps> = ({
                                                        offer,
                                                    }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Card>
                <CardHeader>
                    <CardTitle>Teklif Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Teklif Kodu</p>
                            <p className="font-medium">{offer.code || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Son Güncelleme</p>
                            <div className="flex items-center space-x-2">
                                <p className="font-medium">{formatDate(offer.lastUpdate)}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Durum</p>
                            <div>{getStatusBadge(offer.offerStatus || 'NEW')}</div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-2">Fiyat Bilgileri</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Birim Fiyat</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{formatCurrency(offer.unitPrice)}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Nakliye Dahil Birim Fiyat</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{formatCurrency(offer.unitPriceIncludingShipping)}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Nakliye Fiyatı</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{formatCurrency(offer.shippingPrice)}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Litre Başı Nakliye Fiyatı</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{formatCurrency(offer.literShippingPrice)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Toplam Tutar</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{formatCurrency(offer.totalAmount)}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {offer.description && (
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-500 mb-2">Açıklama</p>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <p className="text-gray-700">{offer.description}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pompa ve Ana Bayii Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Pompa Fiyatı</p>
                            <div className="flex items-center space-x-2">
                                <p className="font-medium">{formatCurrency(offer.pumpPrice)}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Pompa İndirim Oranı</p>
                            <div className="flex items-center space-x-2">
                                <p className="font-medium">%{(offer.pumpDiscountRate ).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Ana Dağıtıcı Fiyatı</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{formatCurrency(offer.mainDistributorPrice)}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Ana Dağıtıcı Oranı</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">%{(offer.mainDistributorRate).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </CardContent>
            </Card>


        </div>
    );
};

export default OfferDetailTab;