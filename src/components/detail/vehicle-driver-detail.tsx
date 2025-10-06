'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from 'next/navigation';
import {
    Building,
    Calendar,
    Mail,
    MapPin,
    Phone,
    Truck,
    User as UserIcon
} from 'lucide-react';
import {VehicleDriver} from "@/types/vehicle";
import {Delivery} from "@/types/delivery";
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface VehicleDriverDetailProps {
    vehicleDriver: VehicleDriver;
    deliveries?: Delivery[];
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onAssignVehicle?: () => void;
}

const VehicleDriverDetailPage: React.FC<VehicleDriverDetailProps> = ({
                                                                         vehicleDriver,
                                                                         deliveries = [],
                                                                         isLoading = false,
                                                                         onEdit,
                                                                         onDelete,
                                                                         onAssignVehicle,
                                                                     }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("details");

    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }


    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sürücü Detayı</h1>
                    <p className="text-gray-500">
                        {vehicleDriver.user ? vehicleDriver.user.name : 'Atanmamış Sürücü'}
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
                        Sürücü Bilgileri
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
                {/* Sürücü Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sürücü Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {vehicleDriver.user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-lg">{vehicleDriver.user.name}</p>
                                                {vehicleDriver.user.email && (
                                                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                        <Mail className="h-3 w-3" />
                                                        <span>{vehicleDriver.user.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Buraya kullanıcı rolü veya diğer bilgiler eklenebilir */}
                                        {vehicleDriver.user.createdAt && (
                                            <div className="border-t pt-4">
                                                <p className="text-sm text-gray-500 mb-2">Kayıt Bilgileri</p>
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                    <p className="text-sm">Kayıt Tarihi: {formatDate(vehicleDriver.user.createdAt)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <UserIcon className="mx-auto h-8 w-8 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Sürücü Atanmamış</h3>
                                        <p className="mt-1 text-sm text-gray-500">Bu kayıt için henüz sürücü atanmamıştır.</p>
                                    </div>
                                )}

                                {vehicleDriver.description && (
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-gray-500 mb-2">Açıklama</p>
                                        <p className="text-gray-700">{vehicleDriver.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Araç Bilgisi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {vehicleDriver.vehicle ? (
                                        <div className="space-y-4">
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Truck className="h-5 w-5 text-gray-700" />
                                                        <div>
                                                            <p className="font-medium">{vehicleDriver.vehicle.brand} {vehicleDriver.vehicle.model}</p>
                                                            <p className="text-sm text-gray-500">Plaka: {vehicleDriver.vehicle.mainLicensePlate}</p>
                                                        </div>
                                                    </div>
                                                    {vehicleDriver.vehicle.capacity && (
                                                        <Badge className="bg-blue-100 text-blue-800">
                                                            {vehicleDriver.vehicle.capacity} ton
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => router.push(`/vehicles/${vehicleDriver.id}`)}
                                            >
                                                Araç Detayına Git
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <Truck className="mx-auto h-8 w-8 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-semibold text-gray-900">Araç Atanmamış</h3>
                                            <p className="mt-1 text-sm text-gray-500">Bu sürücüye henüz araç atanmamıştır.</p>
                                            {onAssignVehicle && (
                                                <div className="mt-4">
                                                    <Button variant="outline" size="sm" onClick={onAssignVehicle}>
                                                        Araç Ata
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Nakliye Şirketi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {vehicleDriver.transportationCompany ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Building className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">{vehicleDriver.transportationCompany.name}</p>
                                                    {vehicleDriver.transportationCompany.isMainCompany !== undefined && (
                                                        <Badge className={vehicleDriver.transportationCompany.isMainCompany
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'}>
                                                            {vehicleDriver.transportationCompany.isMainCompany ? 'Ana Şirket' : 'Alt Şirket'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3 text-sm">
                                                {vehicleDriver.transportationCompany.phone && (
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="h-4 w-4 text-gray-500" />
                                                        <span>{vehicleDriver.transportationCompany.phone}</span>
                                                    </div>
                                                )}
                                                {vehicleDriver.transportationCompany.address && (
                                                    <div className="flex items-start space-x-2">
                                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <span>{vehicleDriver.transportationCompany.address}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => router.push(`/transportation-companies/${vehicleDriver.transportationCompany.id}`)}
                                            >
                                                Şirket Detayına Git
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <Building className="mx-auto h-8 w-8 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-semibold text-gray-900">Şirket Bulunamadı</h3>
                                            <p className="mt-1 text-sm text-gray-500">Nakliye şirketi bilgisi bulunmamaktadır.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Teslimatlar Sekmesi */}
                {activeTab === "deliveries" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Teslimatlar</CardTitle>
                            <CardDescription>Bu sürücünün gerçekleştirdiği teslimatlar</CardDescription>
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
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Araç</th>
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
                                                    {vehicleDriver.vehicle
                                                        ? `${vehicleDriver.vehicle.brand} ${vehicleDriver.vehicle.model}`
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
                                    <p className="mt-1 text-sm text-gray-500">Bu sürücünün gerçekleştirdiği teslimat bulunmamaktadır.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default VehicleDriverDetailPage;