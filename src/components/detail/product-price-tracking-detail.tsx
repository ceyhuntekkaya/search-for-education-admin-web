'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from 'next/navigation';
import {
    Building,
    Calendar,
    Clock,
    DollarSign,
    Factory,
    Info,
    MapPin,
    Package,
    Percent,
    Plus,
    Tag,
    Layers
} from 'lucide-react';
import {ECity, EProductType} from "@/types/enumeration";
import {ProductPriceTracking} from "@/types/supplier";
import {formatDate} from "@/utils/date-formater";
import LoadingComp from "@/components/ui/loading-comp";

interface ProductPriceTrackingDetailProps {
    productPriceTracking: ProductPriceTracking;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onCreateNewTracking?: () => void;
}

const ProductPriceTrackingDetailPage: React.FC<ProductPriceTrackingDetailProps> = ({
                                                                                       productPriceTracking,
                                                                                       isLoading = false,
                                                                                       onEdit,
                                                                                       onDelete,
                                                                                       onCreateNewTracking,
                                                                                   }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("details");

    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }



    const getProductTypeName = (type: EProductType | string | undefined) => {
        if (type === undefined) return 'Belirtilmemiş';
        if (typeof type === 'string') return type;
        return EProductType[type] || 'Belirtilmemiş';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount);
    };

    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fiyat Kaydı Detayı</h1>
                    <p className="text-gray-500">
                        {productPriceTracking.product?.name || 'Belirtilmemiş'} -
                        {productPriceTracking.purchaseDate
                            ? ` {formatDate(productPriceTracking.purchaseDate)}`
                            : ' Tarih Belirtilmemiş'}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => router.back()}>
                        Geri
                    </Button>
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
                    {onCreateNewTracking && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateNewTracking}>
                            <Plus className="h-4 w-4 mr-2" />
                            Yeni Fiyat Kaydı
                        </Button>
                    )}
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
                        Fiyat Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("product")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "product"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Ürün Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("facility")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "facility"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Dolum Tesisi
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Fiyat Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ana Fiyat Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <DollarSign className="h-6 w-6 text-blue-500" />
                                        <h3 className="text-xl font-semibold">{formatCurrency(productPriceTracking.price)}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Ana fiyat</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm text-gray-500">Satın Alma Tarihi</p>
                                        </div>
                                        <p className="font-medium">{formatDate(productPriceTracking.purchaseDate || '')}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm text-gray-500">Duyuru Tarihi</p>
                                        </div>
                                        <p className="font-medium">{formatDate(productPriceTracking.announcementDate || '')}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Info className="h-4 w-4 text-gray-500" />
                                        <p className="text-sm text-gray-500">Fiyat Kaynağı</p>
                                    </div>
                                    <p className="font-medium">{productPriceTracking.priceSource || 'Belirtilmemiş'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm text-gray-500">Vade</p>
                                        </div>
                                        <p className="font-medium">{productPriceTracking.maturity || 'Belirtilmemiş'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Percent className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm text-gray-500">Vergi Oranı</p>
                                        </div>
                                        <p className="font-medium">%{productPriceTracking.taxRate}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>İndirim ve Dağıtım Fiyatları</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="shadow-none border">
                                        <CardHeader className="py-3">
                                            <CardTitle className="text-base">Pompa Fiyatı</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500">Fiyat</p>
                                                <p className="font-medium">{formatCurrency(productPriceTracking.pumpPrice)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500">İndirim Oranı</p>
                                                <div className="flex items-center space-x-1">
                                                    <Percent className="h-3 w-3 text-gray-500" />
                                                    <p className="font-medium">{(productPriceTracking.pumpDiscountRate * 100).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-none border">
                                        <CardHeader className="py-3">
                                            <CardTitle className="text-base">Dağıtıcı Fiyatı</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500">Fiyat</p>
                                                <p className="font-medium">{formatCurrency(productPriceTracking.distributorPrice)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500">İndirim Oranı</p>
                                                <div className="flex items-center space-x-1">
                                                    <Percent className="h-3 w-3 text-gray-500" />
                                                    <p className="font-medium">{(productPriceTracking.distributorDiscountRate * 100).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium mb-3">Fiyat Karşılaştırması</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500">Ana Fiyat - Pompa Farkı</p>
                                            <p className="font-medium">{formatCurrency(productPriceTracking.pumpPrice - productPriceTracking.price)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500">Ana Fiyat - Dağıtıcı Farkı</p>
                                            <p className="font-medium">{formatCurrency(productPriceTracking.distributorPrice - productPriceTracking.price)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500">Pompa - Dağıtıcı Farkı</p>
                                            <p className="font-medium">{formatCurrency(productPriceTracking.pumpPrice - productPriceTracking.distributorPrice)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Ürün Bilgileri Sekmesi */}
                {activeTab === "product" && productPriceTracking.product && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ürün Bilgileri</CardTitle>
                            <CardDescription>Bu fiyat kaydına ait ürün detayları</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <Package className="h-6 w-6 text-blue-500" />
                                <h3 className="text-xl font-semibold">{productPriceTracking.product.name}</h3>
                                <Badge className="bg-blue-100 text-blue-800">
                                    {getProductTypeName(productPriceTracking.product.type)}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Ürün Kodu</p>
                                        <div className="flex items-center space-x-2">
                                            <Tag className="h-4 w-4 text-gray-500" />
                                            <p className="font-medium">{productPriceTracking.product.code || 'Belirtilmemiş'}</p>
                                        </div>
                                    </div>

                                    {productPriceTracking.product.description && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Açıklama</p>
                                            <p className="text-gray-700">{productPriceTracking.product.description}</p>
                                        </div>
                                    )}
                                </div>

                                {productPriceTracking.product.supplier && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-500">Tedarikçi Bilgisi</p>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <Building className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">{productPriceTracking.product.supplier.name}</p>
                                                    <p className="text-xs text-gray-500">Kod: {productPriceTracking.product.supplier.code || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/products/${productPriceTracking.product.id}`)}
                                        >
                                            Ürün Detayına Git
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "product" && !productPriceTracking.product && (
                    <Card>
                        <CardContent>
                            <div className="text-center py-10">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">Ürün Bulunamadı</h3>
                                <p className="mt-1 text-sm text-gray-500">Bu fiyat kaydına ait ürün bilgisi bulunamadı.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Dolum Tesisi Sekmesi */}
                {activeTab === "facility" && productPriceTracking.fillingFacility && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Dolum Tesisi Bilgileri</CardTitle>
                            <CardDescription>Bu fiyat kaydına ait dolum tesisi detayları</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <Factory className="h-6 w-6 text-blue-500" />
                                <h3 className="text-xl font-semibold">{productPriceTracking.fillingFacility.name}</h3>
                                <Badge className={productPriceTracking.fillingFacility.isOperational ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    {productPriceTracking.fillingFacility.isOperational ? 'Aktif' : 'İnaktif'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Kapasite</p>
                                        <div className="flex items-center space-x-2">
                                            <Layers className="h-4 w-4 text-gray-500" />
                                            <p className="font-medium">{productPriceTracking.fillingFacility.capacity} ton</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Konum</p>
                                        <div className="flex items-start space-x-2">
                                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium">
                                                    {typeof productPriceTracking.fillingFacility.city === 'string'
                                                        ? productPriceTracking.fillingFacility.city
                                                        : (productPriceTracking.fillingFacility.city !== undefined
                                                            ? ECity[productPriceTracking.fillingFacility.city]
                                                            : 'Belirtilmemiş')}
                                                </p>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {productPriceTracking.fillingFacility.location || 'Tam adres belirtilmemiş'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {productPriceTracking.fillingFacility.supplier && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-500">Tedarikçi Bilgisi</p>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <Building className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">{productPriceTracking.fillingFacility.supplier.name}</p>
                                                    <p className="text-xs text-gray-500">Kod: {productPriceTracking.fillingFacility.supplier.code || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/filling-facilities/${productPriceTracking.fillingFacility.id}`)}
                                        >
                                            Tesis Detayına Git
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "facility" && !productPriceTracking.fillingFacility && (
                    <Card>
                        <CardContent>
                            <div className="text-center py-10">
                                <Factory className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">Dolum Tesisi Bulunamadı</h3>
                                <p className="mt-1 text-sm text-gray-500">Bu fiyat kaydına ait dolum tesisi bilgisi bulunamadı.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProductPriceTrackingDetailPage;