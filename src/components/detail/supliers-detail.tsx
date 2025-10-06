'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from 'next/navigation';
import {
    Building,
    Droplet,
    Factory,
    Info,
    MapPin,
    Package,
    Plus,
    Settings,
    Tag,
} from 'lucide-react';
import {FillingFacility, Product, Supplier} from "@/types/supplier";
import {ECity, EProductType} from "@/types/enumeration";
import {formatDate} from "@/utils/date-formater";
import LoadingComp from "@/components/ui/loading-comp";

interface SupplierDetailProps {
    supplier: Supplier;
    products?: Product[];
    fillingFacilities?: FillingFacility[];
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onCreateProduct?: () => void;
    onCreateFillingFacility?: () => void;
}

const SupplierDetailPage: React.FC<SupplierDetailProps> = ({
                                                               supplier,
                                                               products = [],
                                                               fillingFacilities = [],
                                                               isLoading = false,
                                                               onEdit,
                                                               onDelete,
                                                               onCreateProduct,
                                                               onCreateFillingFacility,
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

    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tedarikçi Detayı</h1>
                    <p className="text-gray-500">Tedarikçi Kodu: {supplier.code || 'N/A'}</p>
                </div>
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
                        Tedarikçi Bilgileri
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
                        onClick={() => setActiveTab("facilities")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "facilities"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Dolum Tesisleri
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Tedarikçi Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tedarikçi Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Building className="h-8 w-8 text-blue-500" />
                                        <h2 className="text-xl font-semibold">{supplier.name}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Tag className="h-4 w-4 text-gray-500" />
                                                <p className="text-sm text-gray-500">Tedarikçi Kodu</p>
                                            </div>
                                            <p className="font-medium">{supplier.code || 'Belirtilmemiş'}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Info className="h-4 w-4 text-gray-500" />
                                                <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                                            </div>
                                            <p className="font-medium">{supplier.createdAt ? formatDate(supplier.createdAt) : 'Belirtilmemiş'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-3">Ürün Bilgileri</h3>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Package className="h-5 w-5 text-gray-600" />
                                                    <p className="font-medium">Toplam Ürün Sayısı</p>
                                                </div>
                                                <Badge className="bg-blue-500">{products.length}</Badge>
                                            </div>
                                            {products.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    <p className="text-sm text-gray-500">Son Eklenen Ürünler:</p>
                                                    <ul className="space-y-1">
                                                        {products.slice(0, 3).map((product) => (
                                                            <li key={product.id} className="text-sm">
                                                                <span className="font-medium">{product.name}</span> - {product.code}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {onCreateProduct && (
                                                <div className="mt-4">
                                                    <Button variant="outline" size="sm" className="w-full" onClick={onCreateProduct}>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Yeni Ürün Ekle
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-3">Dolum Tesisi Bilgileri</h3>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Factory className="h-5 w-5 text-gray-600" />
                                                    <p className="font-medium">Toplam Tesis Sayısı</p>
                                                </div>
                                                <Badge className="bg-blue-500">{fillingFacilities.length}</Badge>
                                            </div>
                                            {fillingFacilities.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    <p className="text-sm text-gray-500">Tesisler:</p>
                                                    <ul className="space-y-1">
                                                        {fillingFacilities.slice(0, 3).map((facility) => (
                                                            <li key={facility.id} className="text-sm">
                                                                <span className="font-medium">{facility.name}</span> - {getCityName(facility.city)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {onCreateFillingFacility && (
                                                <div className="mt-4">
                                                    <Button variant="outline" size="sm" className="w-full" onClick={onCreateFillingFacility}>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Yeni Tesis Ekle
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                                <CardDescription>Bu tedarikçiye ait ürünler</CardDescription>
                            </div>
                            {onCreateProduct && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateProduct}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Yeni Ürün
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
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Açıklama</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-500">İşlemler</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{product.code || 'N/A'}</td>
                                                <td className="py-3 px-4">{product.name}</td>
                                                <td className="py-3 px-4">{getProductTypeName(product.type)}</td>
                                                <td className="py-3 px-4 max-w-xs truncate">
                                                    {product.description || 'Açıklama yok'}
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
                                    <p className="mt-1 text-sm text-gray-500">Bu tedarikçiye ait ürün bulunmamaktadır.</p>
                                    {onCreateProduct && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateProduct}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Yeni Ürün Ekle
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
                                <CardDescription>Bu tedarikçiye ait dolum tesisleri</CardDescription>
                            </div>
                            {onCreateFillingFacility && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateFillingFacility}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Yeni Tesis
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
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            {getCityName(facility.city)}
                                                        </div>
                                                    </div>
                                                    <Badge className={facility.isOperational ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                        {facility.isOperational ? 'Aktif' : 'İnaktif'}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center space-x-1">
                                                            <Settings className="h-3 w-3 text-gray-500" />
                                                            <span className="text-gray-500">Kapasite:</span>
                                                        </div>
                                                        <span className="font-medium">{facility.capacity} ton</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center space-x-1">
                                                            <Droplet className="h-3 w-3 text-gray-500" />
                                                            <span className="text-gray-500">Ürün Sayısı:</span>
                                                        </div>
                                                        <span className="font-medium">{facility.products ? facility.products.size : 0}</span>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-gray-500 border-t pt-3">
                                                    {facility.location || 'Adres bilgisi bulunmamaktadır.'}
                                                </p>

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
                                    <p className="mt-1 text-sm text-gray-500">Bu tedarikçiye ait dolum tesisi bulunmamaktadır.</p>
                                    {onCreateFillingFacility && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateFillingFacility}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Yeni Dolum Tesisi Ekle
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

export default SupplierDetailPage;