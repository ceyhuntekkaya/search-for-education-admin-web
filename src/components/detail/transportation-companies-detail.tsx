'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from 'next/navigation';
import {
    AtSign,
    Briefcase,
    Building,
    FileText,
    MapPin,
    Phone,
    Plus,
    Receipt,
    Truck,
    User as UserIcon,
    Users
} from 'lucide-react';
import {ECity, EVehicleType} from "@/types/enumeration";
import {TransportationCompany} from "@/types/transportation-company";
import {Vehicle, VehicleDriver} from "@/types/vehicle";
import {Offer} from "@/types/offer";
import {Delivery} from "@/types/delivery";
import {formatDate} from "@/utils/date-formater";
import LoadingComp from "@/components/ui/loading-comp";

interface TransportationCompanyDetailProps {
    transportationCompany: TransportationCompany;
    vehicles?: Vehicle[];
    drivers?: VehicleDriver[];
    offers?: Offer[];
    deliveries?: Delivery[];
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onCreateVehicle?: () => void;
    onCreateDriver?: () => void;
}

const TransportationCompanyDetailPage: React.FC<TransportationCompanyDetailProps> = ({
                                                                                         transportationCompany,
                                                                                         vehicles = [],
                                                                                         drivers = [],
                                                                                         offers = [],
                                                                                         deliveries = [],
                                                                                         isLoading = false,
                                                                                         onEdit,
                                                                                         onDelete,
                                                                                         onCreateVehicle,
                                                                                         onCreateDriver,
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

    const getVehicleTypeName = (type: EVehicleType | string | undefined) => {
        if (type === undefined) return 'Belirtilmemiş';
        if (typeof type === 'string') return type;
        return EVehicleType[type] || 'Belirtilmemiş';
    };

    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nakliye Şirketi Detayı</h1>
                    <p className="text-gray-500">
                        <span className={`mr-2 inline-flex rounded-full px-2 text-xs font-semibold ${
                            transportationCompany.isMainCompany
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {transportationCompany.isMainCompany ? 'Ana Şirket' : 'Alt Şirket'}
                        </span>
                        {transportationCompany.companyName || transportationCompany.name}
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
                        Şirket Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("vehicles")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "vehicles"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Araçlar
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
                        onClick={() => setActiveTab("activities")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "activities"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Teklifler ve Teslimatlar
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Şirket Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Şirket Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-4 w-4 text-gray-500"/>
                                        <p className="font-medium text-lg">{transportationCompany.name}</p>
                                    </div>
                                    {transportationCompany.companyName && transportationCompany.companyName !== transportationCompany.name && (
                                        <p className="text-sm text-gray-500">Resmi Şirket
                                            Adı: {transportationCompany.companyName}</p>
                                    )}
                                    <Badge className={transportationCompany.isMainCompany
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'}>
                                        {transportationCompany.isMainCompany ? 'Ana Şirket' : 'Alt Şirket'}
                                    </Badge>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500 mb-2">Şirket Adresi</p>
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-500 mt-1"/>
                                        <div>
                                            <p className="text-gray-700">{transportationCompany.address || 'Belirtilmemiş'}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Şehir: {getCityName(transportationCompany.city)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500 mb-2">İletişim Bilgileri</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Telefon</p>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4 text-gray-500"/>
                                                <p className="font-medium">{transportationCompany.phone || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">E-posta</p>
                                            <div className="flex items-center space-x-2">
                                                <AtSign className="h-4 w-4 text-gray-500"/>
                                                <p className="font-medium">{transportationCompany.email || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500 mb-2">Vergi Bilgileri</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Vergi Numarası</p>
                                            <div className="flex items-center space-x-2">
                                                <Receipt className="h-4 w-4 text-gray-500"/>
                                                <p className="font-medium">{transportationCompany.taxNumber || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Vergi Dairesi</p>
                                            <div className="flex items-center space-x-2">
                                                <Building className="h-4 w-4 text-gray-500"/>
                                                <p className="font-medium">{transportationCompany.taxOffice || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {transportationCompany.description && (
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-gray-500 mb-2">Açıklama</p>
                                        <p className="text-gray-700">{transportationCompany.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>İletişim Kişisi Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <UserIcon className="h-4 w-4 text-gray-500"/>
                                        <p className="font-medium">{transportationCompany.contactPerson || 'Belirtilmemiş'}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-gray-500">Pozisyon</p>
                                            <div className="flex items-center space-x-2">
                                                <Briefcase className="h-3 w-3 text-gray-500"/>
                                                <p>{transportationCompany.contactPersonPosition || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-500">Departman</p>
                                            <div className="flex items-center space-x-2">
                                                <Building className="h-3 w-3 text-gray-500"/>
                                                <p>{transportationCompany.contactPersonDepartment || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-500">Telefon</p>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-3 w-3 text-gray-500"/>
                                                <p>{transportationCompany.contactPersonPhone || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-500">E-posta</p>
                                            <div className="flex items-center space-x-2">
                                                <AtSign className="h-3 w-3 text-gray-500"/>
                                                <p>{transportationCompany.contactPersonEmail || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border p-3 rounded-md text-center">
                                        <p className="text-lg font-medium">{vehicles.length}</p>
                                        <p className="text-sm text-gray-500">Kayıtlı Araç</p>
                                    </div>
                                    <div className="border p-3 rounded-md text-center">
                                        <p className="text-lg font-medium">{drivers.length}</p>
                                        <p className="text-sm text-gray-500">Kayıtlı Sürücü</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border p-3 rounded-md text-center">
                                        <p className="text-lg font-medium">{offers.length}</p>
                                        <p className="text-sm text-gray-500">Teklif</p>
                                    </div>
                                    <div className="border p-3 rounded-md text-center">
                                        <p className="text-lg font-medium">{deliveries.length}</p>
                                        <p className="text-sm text-gray-500">Teslimat</p>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 mt-4">
                                    {onCreateVehicle && (
                                        <Button variant="outline" onClick={onCreateVehicle}>
                                            <Plus className="h-4 w-4 mr-2"/>
                                            Yeni Araç Ekle
                                        </Button>
                                    )}
                                    {onCreateDriver && (
                                        <Button variant="outline" onClick={onCreateDriver}>
                                            <Plus className="h-4 w-4 mr-2"/>
                                            Yeni Sürücü Ekle
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Araçlar Sekmesi */}
                {activeTab === "vehicles" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Araçlar</CardTitle>
                                <CardDescription>Bu nakliye şirketine ait araçlar</CardDescription>
                            </div>
                            {onCreateVehicle && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateVehicle}>
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Yeni Araç
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {vehicles && vehicles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {vehicles.map((vehicle) => (
                                        <Card key={vehicle.id} className="overflow-hidden">
                                            <CardContent className="p-0">
                                                <div className="p-4 bg-gray-50">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Truck className="h-5 w-5 text-gray-700"/>
                                                            <div>
                                                                <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                                                                <p className="text-sm text-gray-500">{getVehicleTypeName(vehicle.type)}</p>
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-blue-100 text-blue-800">
                                                            {vehicle.capacity} ton
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                <p className="text-xs text-gray-500">Ana Plaka</p>
                                                                <p className="text-sm font-medium">{vehicle.mainLicensePlate}</p>
                                                            </div>
                                                            {vehicle.trailerLicensePlate && (
                                                                <div className="space-y-1">
                                                                    <p className="text-xs text-gray-500">Römork
                                                                        Plaka</p>
                                                                    <p className="text-sm font-medium">{vehicle.trailerLicensePlate}</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {vehicle.description && (
                                                            <div className="space-y-1">
                                                                <p className="text-xs text-gray-500">Açıklama</p>
                                                                <p className="text-sm line-clamp-2">{vehicle.description}</p>
                                                            </div>
                                                        )}

                                                        {vehicle.capacities && vehicle.capacities.length > 0 && (
                                                            <div className="space-y-1">
                                                                <p className="text-xs text-gray-500">Kapasiteler</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {vehicle.capacities.map((cap, index) => (
                                                                        <Badge key={index} variant="outline"
                                                                               className="text-xs">
                                                                            {cap.capacity} {cap.unit}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full mt-2"
                                                            onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                                                        >
                                                            Detay
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <Truck className="mx-auto h-12 w-12 text-gray-400"/>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Araç Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu nakliye şirketine ait araç
                                        bulunmamaktadır.</p>
                                    {onCreateVehicle && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={onCreateVehicle}>
                                                <Plus className="h-4 w-4 mr-2"/>
                                                Yeni Araç Ekle
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Sürücüler Sekmesi */}
                {activeTab === "drivers" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Sürücüler</CardTitle>
                                <CardDescription>Bu nakliye şirketine ait sürücüler</CardDescription>
                            </div>
                            {onCreateDriver && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateDriver}>
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Yeni Sürücü
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
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Araç</th>
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
                                                            <UserIcon className="h-4 w-4 text-gray-500"/>
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
                                                    {driver.vehicle ? (
                                                        <div>
                                                            <p>{driver.vehicle.brand} {driver.vehicle.model}</p>
                                                            <p className="text-xs text-gray-500">{driver.vehicle.mainLicensePlate}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500">Araç atanmamış</p>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 max-w-xs truncate">
                                                    {driver.description || 'Açıklama yok'}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="outline" size="sm"
                                                            onClick={() => router.push(`/vehicle-drivers/${driver.id}`)}>
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
                                    <Users className="mx-auto h-12 w-12 text-gray-400"/>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Sürücü Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-gray-500">Bu nakliye şirketine ait sürücü
                                        bulunmamaktadır.</p>
                                    {onCreateDriver && (
                                        <div className="mt-6">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={onCreateDriver}>
                                                <Plus className="h-4 w-4 mr-2"/>
                                                Yeni Sürücü Ekle
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                Tabii, teklifler ve teslimatlar sekmesi bölümünü yazayım:

                ```typescript
                {/* Teklifler ve Teslimatlar Sekmesi */}
                {activeTab === "activities" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Teklifler</CardTitle>
                                <CardDescription>Bu nakliye şirketine ait teklifler</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {offers && offers.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Teklif
                                                    Kodu
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Müşteri</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Tutar</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Durum</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Son
                                                    Güncelleme
                                                </th>
                                                <th className="text-right py-3 px-4 font-medium text-gray-500">İşlemler</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {offers.map((offer) => (
                                                <tr key={offer.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">{offer.code || 'N/A'}</td>
                                                    <td className="py-3 px-4">
                                                        {offer.order && offer.order.customer
                                                            ? offer.order.customer.name
                                                            : 'Belirtilmemiş'
                                                        }
                                                    </td>
                                                    <td className="py-3 px-4 font-medium">
                                                        {new Intl.NumberFormat('tr-TR', {
                                                            style: 'currency',
                                                            currency: 'TRY'
                                                        }).format(offer.totalAmount)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge className="bg-blue-500">{offer.offerStatus}</Badge>
                                                    </td>
                                                    <td className="py-3 px-4">{formatDate(offer.lastUpdate)}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Button variant="outline" size="sm"
                                                                onClick={() => router.push(`/offers/${offer.id}`)}>
                                                            Detay
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <FileText className="mx-auto h-8 w-8 text-gray-400"/>
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Teklif Bulunamadı</h3>
                                        <p className="mt-1 text-sm text-gray-500">Bu nakliye şirketine ait teklif
                                            bulunmamaktadır.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Teslimatlar</CardTitle>
                                <CardDescription>Bu nakliye şirketine ait teslimatlar</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {deliveries && deliveries.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Teslimat
                                                    Kodu
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Teslimat
                                                    Tarihi
                                                </th>
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
                                                        <Badge
                                                            className="bg-green-500">{delivery.deliveryStatus}</Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Button variant="outline" size="sm"
                                                                onClick={() => router.push(`/deliveries/${delivery.id}`)}>
                                                            Detay
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Truck className="mx-auto h-8 w-8 text-gray-400"/>
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Teslimat
                                            Bulunamadı</h3>
                                        <p className="mt-1 text-sm text-gray-500">Bu nakliye şirketine ait teslimat
                                            bulunmamaktadır.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

        </div>
    )
}

export default TransportationCompanyDetailPage;

