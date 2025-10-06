'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from 'next/navigation';
import {
    Building,
    Truck,
    User as UserIcon
} from 'lucide-react';
import {EVehicleType} from "@/types/enumeration";
import {Vehicle, VehicleDriver} from "@/types/vehicle";
import {Delivery} from "@/types/delivery";
import {formatDate} from "@/utils/date-formater";
import LoadingComp from "@/components/ui/loading-comp";

interface VehicleDetailProps {
    vehicle: Vehicle;
    drivers?: VehicleDriver[];
    deliveries?: Delivery[];
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onAssignDriver?: () => void;
    onMaintenance?: () => void;
}

const VehicleDetailPage: React.FC<VehicleDetailProps> = ({
                                                             vehicle,
                                                             drivers = [],
                                                             deliveries = [],
                                                             isLoading = false,
                                                             onEdit,
                                                             onDelete,
                                                             onAssignDriver,
                                                             onMaintenance,
                                                         }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("details");


    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }



    const getVehicleTypeName = (type: EVehicleType | string | undefined) => {
        if (type === undefined) return 'Belirtilmemiş';
        if (typeof type === 'string') return type;
        return EVehicleType[type] || 'Belirtilmemiş';
    };

    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Araç Detayı</h1>
                    <p className="text-gray-500">
                        <span className="mr-2">{vehicle.brand} {vehicle.model}</span>
                        <Badge className="bg-blue-100 text-blue-800">
                            {getVehicleTypeName(vehicle.type)}
                        </Badge>
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
                    {onMaintenance && (
                        <Button variant="outline" onClick={onMaintenance}>
                            Bakım Kaydı
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
                        Araç Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("drivers")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "drivers"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Sürücüler
                    </button>
                    <button
                        onClick={() => setActiveTab("deliveries")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "deliveries"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Teslimatlar
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Araç Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Araç Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Truck className="h-5 w-5 text-gray-500" />
                                        <p className="font-medium text-lg">{vehicle.brand} {vehicle.model}</p>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        {getVehicleTypeName(vehicle.type)}
                                    </Badge>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500 mb-2">Araç Plaka Bilgileri</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Ana Plaka</p>
                                            <p className="font-medium">{vehicle.mainLicensePlate}</p>
                                        </div>
                                        {vehicle.trailerLicensePlate && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Dorse Plaka</p>
                                                <p className="font-medium">{vehicle.trailerLicensePlate}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500 mb-2">Kapasite Bilgileri</p>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Ana Kapasite</p>
                                            <p className="font-medium">{vehicle.capacity} ton</p>
                                        </div>

                                        {vehicle.capacities && vehicle.capacities.length > 0 && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Diğer Kapasiteler</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {vehicle.capacities.map((cap, index) => (
                                                        <Badge key={index} variant="outline">
                                                            {cap.capacity} {cap.unit}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {vehicle.description && (
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-gray-500 mb-2">Açıklama</p>
                                        <p className="text-gray-700">{vehicle.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Nakliye Şirketi Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {vehicle.transportationCompany ? (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Building className="h-4 w-4 text-gray-500" />
                                                <p className="font-medium">{vehicle.transportationCompany.name}</p>
                                            </div>
                                            {vehicle.transportationCompany.isMainCompany !== undefined && (
                                                <Badge className={vehicle.transportationCompany.isMainCompany
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'}>
                                                    {vehicle.transportationCompany.isMainCompany ? 'Ana Şirket' : 'Alt Şirket'}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {vehicle.transportationCompany.address && (
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-500">Adres</p>
                                                    <p className="text-sm">{vehicle.transportationCompany.address}</p>
                                                </div>
                                            )}

                                            {vehicle.transportationCompany.phone && (
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-500">Telefon</p>
                                                    <p className="text-sm">{vehicle.transportationCompany.phone}</p>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => router.push(`/transportation-companies/${vehicle.transportationCompany.id}`)}
                                        >
                                            Şirket Detayına Git
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Building className="mx-auto h-8 w-8 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nakliye Şirketi Bulunamadı</h3>
                                        <p className="mt-1 text-sm text-gray-500">Bu araca ait nakliye şirketi bulunmamaktadır.</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="border p-3 rounded-md text-center">
                                        <p className="text-lg font-medium">{drivers.length}</p>
                                        <p className="text-sm text-gray-500">Sürücü</p>
                                    </div>
                                    <div className="border p-3 rounded-md text-center">
                                        <p className="text-lg font-medium">{deliveries.length}</p>
                                        <p className="text-sm text-gray-500">Teslimat</p>
                                    </div>
                                </div>

                                {onAssignDriver && (
                                    <Button variant="outline" className="w-full mt-4" onClick={onAssignDriver}>
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        Sürücü Ata
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Sürücüler Sekmesi */}
                {activeTab === "drivers" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Sürücüler</CardTitle>
                                <CardDescription>Bu araca atanmış sürücüler</CardDescription>
                            </div>
                            {onAssignDriver && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onAssignDriver}>
                                    <UserIcon className="h-4 w-4 mr-2" />
                                    Sürücü Ata
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {drivers && drivers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Sürücü</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Nakliye Şirketi</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Açıklama</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-500">İşlemler</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {drivers.map((driver) => (
                                            <tr key={driver.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    {driver.user ? (
                                                        <div className="flex items-center space-x-2">
                                                            <UserIcon className="h-4 w-4 text-gray-500" />
                                                            <div>
                                                                <p className="font-medium">{driver.user.name || 'İsimsiz Kullanıcı'}</p>
                                                                <p className="text-xs text-gray-500">{driver.user.email || 'E-posta yok'}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500">Sürücü atanmamış</p>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {driver.transportationCompany ? (
                                                        <p>{driver.transportationCompany.name}</p>
                                                    ) : (
                                                        <p className="text-gray-500">Şirket belirtilmemiş</p>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 max-w-xs truncate">
                                                    {driver.description || 'Açıklama yok'}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="outline" size="sm" onClick={() => router.push(`/vehicle-drivers/${driver.id}`)}>
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
                                    <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Sürücü Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu araca atanmış sürücü bulunmamaktadır.</p>
                                    {onAssignDriver && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onAssignDriver}>
                                                <UserIcon className="h-4 w-4 mr-2" />
                                                Sürücü Ata
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Teslimatlar Sekmesi */}
                {activeTab === "deliveries" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Teslimatlar</CardTitle>
                            <CardDescription>Bu araç ile yapılan teslimatlar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {deliveries && deliveries.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Teslimat Kodu</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Teslimat Tarihi</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Müşteri</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Mesafe/Süre</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Durum</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-500">İşlemler</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {deliveries.map((delivery) => (
                                            <tr key={delivery.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{delivery.code || 'N/A'}</td>
                                                <td className="py-3 px-4">{formatDate(delivery.deliveryDate)}</td>
                                                <td className="py-3 px-4">
                                                    {delivery.order && delivery.order.customer
                                                        ? delivery.order.customer.name
                                                        : 'Belirtilmemiş'
                                                    }
                                                </td>
                                                <td className="py-3 px-4">
                                                    {delivery.distance} km / {delivery.duration} saat
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge className="bg-green-500">{delivery.deliveryStatus}</Badge>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="outline" size="sm" onClick={() => router.push(`/deliveries/${delivery.id}`)}>
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
                                    <Truck className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Teslimat Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu araç ile yapılan teslimat bulunmamaktadır.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default VehicleDetailPage;