'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from 'next/navigation';
import {
    Building,
    Factory,
    FileText,
    Package,
    Plus,
    Tag,
    TrendingUp,
    Truck
} from 'lucide-react';
import {FillingFacility, Product, ProductPriceTracking} from "@/types/supplier";
import {EProductType} from "@/types/enumeration";
import {Order} from "@/types/order";
import {formatDate} from "@/utils/date-formater";
import LoadingComp from "@/components/ui/loading-comp";

interface ProductDetailProps {
    product: Product;
    fillingFacilities?: FillingFacility[];
    priceTrackings?: ProductPriceTracking[];
    orders?: Order[];
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onCreateOrder?: () => void;
    onAddToFacility?: () => void;
    onCreatePriceTracking?: () => void;
}

const ProductDetailPage: React.FC<ProductDetailProps> = ({
                                                             product,
                                                             fillingFacilities = [],
                                                             priceTrackings = [],
                                                             orders = [],
                                                             isLoading = false,
                                                             onEdit,
                                                             onDelete,
                                                             onCreateOrder,
                                                             onAddToFacility,
                                                             onCreatePriceTracking,
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

    // Son fiyat kaydını bul
    const getLatestPriceTracking = () => {
        if (priceTrackings.length === 0) return null;

        return priceTrackings.reduce((latest, current) => {
            const latestDate = latest.purchaseDate ? new Date(latest.purchaseDate) : new Date(0);
            const currentDate = current.purchaseDate ? new Date(current.purchaseDate) : new Date(0);
            return currentDate > latestDate ? current : latest;
        }, priceTrackings[0]);
    };

    const latestPriceTracking = getLatestPriceTracking();

    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ürün Detayı</h1>
                    <div className="flex items-center space-x-2">
                        <p className="text-gray-500">Ürün Kodu: {product.code || 'N/A'}</p>
                        <Badge className="bg-blue-100 text-blue-800">
                            {getProductTypeName(product.type)}
                        </Badge>
                    </div>
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
                    {onCreateOrder && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateOrder}>
                            Sipariş Oluştur
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
                        Ürün Bilgileri
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
                    <button
                        onClick={() => setActiveTab("facilities")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "facilities"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Dolum Tesisleri
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
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Ürün Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ürün Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Package className="h-5 w-5 text-gray-500" />
                                        <h2 className="text-xl font-medium">{product.name}</h2>
                                    </div>
                                    <Badge className="self-start bg-blue-100 text-blue-800">
                                        {getProductTypeName(product.type)}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Ürün Kodu</p>
                                        <div className="flex items-center space-x-2">
                                            <Tag className="h-4 w-4 text-gray-500" />
                                            <p className="font-medium">{product.code || 'Belirtilmemiş'}</p>
                                        </div>
                                    </div>
                                </div>

                                {product.description && (
                                    <div className="space-y-3 border-t pt-4">
                                        <p className="text-sm text-gray-500">Açıklama</p>
                                        <p className="text-gray-700">{product.description}</p>
                                    </div>
                                )}

                                {product.supplier && (
                                    <div className="space-y-3 border-t pt-4">
                                        <p className="text-sm text-gray-500">Tedarikçi Bilgisi</p>
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="font-medium">{product.supplier.name}</p>
                                                <p className="text-xs text-gray-500">Kod: {product.supplier.code || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => router.push(`/suppliers/${product.supplier.id}`)}
                                        >
                                            Tedarikçi Detayı
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Özet Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Dolum Tesisi Sayısı</p>
                                        <Badge className="bg-blue-500">{fillingFacilities.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Fiyat Kaydı Sayısı</p>
                                        <Badge className="bg-green-500">{priceTrackings.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Sipariş Sayısı</p>
                                        <Badge className="bg-purple-500">{orders.length}</Badge>
                                    </div>
                                </div>

                                {latestPriceTracking && (
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-gray-500 mb-3">Son Fiyat Bilgisi</p>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="font-medium">Ana Fiyat</p>
                                                <p className="font-bold text-lg">{formatCurrency(latestPriceTracking.price)}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Pompa Fiyatı</p>
                                                    <p>{formatCurrency(latestPriceTracking.pumpPrice)}</p>
                                                    <p className="text-xs text-gray-500">
                                                        İndirim: %{(latestPriceTracking.pumpDiscountRate * 100).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Dağıtıcı Fiyatı</p>
                                                    <p>{formatCurrency(latestPriceTracking.distributorPrice)}</p>
                                                    <p className="text-xs text-gray-500">
                                                        İndirim: %{(latestPriceTracking.distributorDiscountRate * 100).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t text-sm">
                                                <p className="text-gray-500">Tarih: {formatDate(latestPriceTracking.purchaseDate || '')}</p>
                                                <p className="text-gray-500">Kaynak: {latestPriceTracking.priceSource || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col space-y-2">
                                    {onCreateOrder && (
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateOrder}>
                                            <Truck className="h-4 w-4 mr-2" />
                                            Sipariş Oluştur
                                        </Button>
                                    )}
                                    {onAddToFacility && (
                                        <Button variant="outline" onClick={onAddToFacility}>
                                            <Factory className="h-4 w-4 mr-2" />
                                            Dolum Tesisine Ekle
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Fiyat Takibi Sekmesi */}
                {activeTab === "prices" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Fiyat Takibi</CardTitle>
                                <CardDescription>Bu ürüne ait fiyat takibi kayıtları</CardDescription>
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
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Tarih</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Fiyat</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Pompa Fiyatı</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Dağıtıcı Fiyatı</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Dolum Tesisi</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Kaynak</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Vade</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {priceTrackings.map((tracking) => (
                                            <tr key={tracking.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div>{tracking.purchaseDate ? formatDate(tracking.purchaseDate) : 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Duyuru: {tracking.announcementDate ? formatDate(tracking.announcementDate) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-medium">{formatCurrency(tracking.price)}</td>
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
                                                    {tracking.fillingFacility ? tracking.fillingFacility.name : 'Belirtilmemiş'}
                                                </td>
                                                <td className="py-3 px-4">{tracking.priceSource || 'Belirtilmemiş'}</td>
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
                                    <p className="mt-1 text-sm text-gray-500">Bu ürüne ait fiyat kaydı bulunmamaktadır.</p>
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

                {/* Dolum Tesisleri Sekmesi */}
                {activeTab === "facilities" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Dolum Tesisleri</CardTitle>
                                <CardDescription>Bu ürünün bulunduğu dolum tesisleri</CardDescription>
                            </div>
                            {onAddToFacility && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onAddToFacility}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tesise Ekle
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {fillingFacilities && fillingFacilities.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {fillingFacilities.map((facility) => (
                                        <Card key={facility.id} className="overflow-hidden">
                                            <div className={`h-2 ${facility.isOperational ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="font-medium">{facility.name}</h3>
                                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                                            <Building className="h-3 w-3 mr-1" />
                                                            {facility.supplier ? facility.supplier.name : 'Belirtilmemiş'}
                                                        </div>
                                                    </div>
                                                    <Badge className={facility.isOperational ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                        {facility.isOperational ? 'Aktif' : 'İnaktif'}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">Kapasite:</span>
                                                        <span className="font-medium">{facility.capacity} ton</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">Ürün Sayısı:</span>
                                                        <span className="font-medium">{facility.products ? facility.products.size : 0}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <Button variant="outline" size="sm" className="w-full" onClick={() => router.push(`/filling-facilities/${facility.id}`)}>
                                                        Detay
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <Factory className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Dolum Tesisi Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu ürün henüz hiçbir dolum tesisine eklenmemiştir.</p>
                                    {onAddToFacility && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onAddToFacility}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tesise Ekle
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Siparişler Sekmesi */}
                {activeTab === "orders" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Siparişler</CardTitle>
                                <CardDescription>Bu ürüne ait siparişler</CardDescription>
                            </div>
                            {onCreateOrder && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateOrder}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Sipariş Oluştur
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {orders && orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Sipariş Kodu</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Tarih</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Müşteri</th>
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
                                                <td className="py-3 px-4">
                                                    {order.customer ? order.customer.name : 'Belirtilmemiş'}
                                                </td>
                                                <td className="py-3 px-4">{order.orderQuantity} ton</td>
                                                <td className="py-3 px-4">
                                                    <Badge className="bg-blue-500">{order.status || 'NEW'}</Badge>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${order.id}`)}>
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
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Sipariş Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu ürüne ait sipariş bulunmamaktadır.</p>
                                    {onCreateOrder && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateOrder}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Sipariş Oluştur
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

export default ProductDetailPage;