'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from 'next/navigation';
import {
    Building,
    Factory,
    MapPin,
    Package,
    Plus,
    TrendingUp,
    Layers
} from 'lucide-react';
import {FillingFacility, Product} from "@/types/supplier";
import {ECity, EProductType} from "@/types/enumeration";
import {ProductPriceTracking} from "@/types/supplier";
import {formatDate} from "@/utils/date-formater";
import LoadingComp from "@/components/ui/loading-comp";

interface FillingFacilityDetailProps {
    fillingFacility: FillingFacility;
    products?: Product[];
    priceTrackings?: ProductPriceTracking[];
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onAddProduct?: () => void;
    onCreatePriceTracking?: () => void;
}

const FillingFacilityDetailPage: React.FC<FillingFacilityDetailProps> = ({
                                                                             fillingFacility,
                                                                             products = [],
                                                                             priceTrackings = [],
                                                                             isLoading = false,
                                                                             onEdit,
                                                                             onDelete,
                                                                             onAddProduct,
                                                                             onCreatePriceTracking,
                                                                         }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("details");

    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }



    const getCityName = (city: ECity | string | undefined) => {
        if (city === undefined) return 'Belirtilmemiş';
        if (typeof city === 'string') return city;
        return ECity[city] || 'Belirtilmemiş';
    };

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
                    <h1 className="text-3xl font-bold tracking-tight">Dolum Tesisi Detayı</h1>
                    <p className="text-gray-500">
                        <span className={`mr-2 inline-flex rounded-full px-2 text-xs font-semibold ${
                            fillingFacility.isOperational
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {fillingFacility.isOperational ? 'Aktif' : 'İnaktif'}
                        </span>
                        {fillingFacility.supplier?.name || 'Tedarikçi Belirtilmemiş'}
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
                        Tesis Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "products"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Ürünler
                    </button>
                    <button
                        onClick={() => setActiveTab("prices")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "prices"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Fiyat Takibi
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Tesis Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tesis Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Factory className="h-5 w-5 text-gray-500" />
                                        <h2 className="text-xl font-medium">{fillingFacility.name}</h2>
                                    </div>
                                    <Badge className={`self-start ${
                                        fillingFacility.isOperational
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {fillingFacility.isOperational ? 'Aktif' : 'İnaktif'}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Kapasite</p>
                                        <div className="flex items-center space-x-2">
                                            <Layers className="h-4 w-4 text-gray-500" />
                                            <p className="font-medium">{fillingFacility.capacity} ton</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t pt-4">
                                    <p className="text-sm text-gray-500">Konum Bilgisi</p>
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium">{getCityName(fillingFacility.city)}</p>
                                            <p className="text-gray-700 mt-1">{fillingFacility.location || 'Tam adres belirtilmemiş'}</p>
                                        </div>
                                    </div>
                                </div>

                                {fillingFacility.supplier && (
                                    <div className="space-y-3 border-t pt-4">
                                        <p className="text-sm text-gray-500">Tedarikçi Bilgisi</p>
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="font-medium">{fillingFacility.supplier.name}</p>
                                                <p className="text-xs text-gray-500">Kod: {fillingFacility.supplier.code || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => router.push(`/suppliers/${fillingFacility.supplier.id}`)}
                                        >
                                            Tedarikçi Detayı
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ürün Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-gray-500">Toplam Ürün Sayısı</p>
                                    <Badge className="bg-blue-500">
                                        {fillingFacility.products ? fillingFacility.products.size : 0}
                                    </Badge>
                                </div>

                                {fillingFacility.products && fillingFacility.products.size > 0 ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500">Ürünler</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {Array.from(fillingFacility.products).map((product) => (
                                                <div key={product.id} className="p-3 bg-gray-50 rounded-md">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Package className="h-4 w-4 text-gray-500" />
                                                            <p className="font-medium">{product.name}</p>
                                                        </div>
                                                        <Badge className="bg-gray-200 text-gray-800">
                                                            {getProductTypeName(product.type)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Kod: {product.code || 'N/A'}</p>
                                                    {product.description && (
                                                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Package className="mx-auto h-8 w-8 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Ürün Bulunamadı</h3>
                                        <p className="mt-1 text-sm text-gray-500">Bu tesiste henüz ürün bulunmamaktadır.</p>
                                    </div>
                                )}

                                {onAddProduct && (
                                    <div className="mt-4">
                                        <Button variant="outline" className="w-full" onClick={onAddProduct}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Ürün Ekle
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Ürünler Sekmesi */}
                {activeTab === "products" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Ürünler</CardTitle>
                                <CardDescription>Bu tesisteki ürünler</CardDescription>
                            </div>
                            {onAddProduct && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onAddProduct}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ürün Ekle
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {products && products.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Ürün Kodu</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Ürün Adı</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Tip</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Tedarikçi</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-500">İşlemler</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{product.code || 'N/A'}</td>
                                                <td className="py-3 px-4">{product.name}</td>
                                                <td className="py-3 px-4">{getProductTypeName(product.type)}</td>
                                                <td className="py-3 px-4">
                                                    {product.supplier ? product.supplier.name : 'Belirtilmemiş'}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="outline" size="sm" onClick={() => router.push(`/products/${product.id}`)}>
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
                                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Ürün Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu tesise ait ürün bulunmamaktadır.</p>
                                    {onAddProduct && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onAddProduct}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Ürün Ekle
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Fiyat Takibi Sekmesi */}
                {activeTab === "prices" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Fiyat Takibi</CardTitle>
                                <CardDescription>Bu tesisteki ürünlere ait fiyat takibi</CardDescription>
                            </div>
                            {onCreatePriceTracking && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreatePriceTracking}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Fiyat Kaydı Ekle
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {priceTrackings && priceTrackings.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Ürün</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Fiyat</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Pompa Fiyatı</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Dağıtıcı Fiyatı</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Tarih</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Vade</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {priceTrackings.map((tracking) => (
                                            <tr key={tracking.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    {tracking.product ? tracking.product.name : 'Belirtilmemiş'}
                                                </td>
                                                <td className="py-3 px-4 font-medium">
                                                    {formatCurrency(tracking.price)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {formatCurrency(tracking.pumpPrice)}
                                                    <div className="text-xs text-gray-500">
                                                        İndirim: %{(tracking.pumpDiscountRate * 100).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {formatCurrency(tracking.distributorPrice)}
                                                    <div className="text-xs text-gray-500">
                                                        İndirim: %{(tracking.distributorDiscountRate * 100).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div>Alım: {tracking.purchaseDate ? formatDate(tracking.purchaseDate) : 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Duyuru: {tracking.announcementDate ? formatDate(tracking.announcementDate) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {tracking.maturity || 'Belirtilmemiş'}
                                                    <div className="text-xs text-gray-500">
                                                        Vergi: %{tracking.taxRate}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Fiyat Kaydı Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu tesise ait fiyat kaydı bulunmamaktadır.</p>
                                    {onCreatePriceTracking && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreatePriceTracking}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Fiyat Kaydı Ekle
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default FillingFacilityDetailPage;