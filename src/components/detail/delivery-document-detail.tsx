'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Truck,
    Calendar,
    User,
    Package,
    Building,
    CheckCircle,
    MapPin
} from 'lucide-react';
import { DeliveryDocument } from "@/types/delivery";
import LoadingComp from "@/components/ui/loading-comp";


interface DeliveryDocumentDetailProps {
    deliveryDocument: DeliveryDocument;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onPrint?: () => void;
}

const DeliveryDocumentDetailPage: React.FC<DeliveryDocumentDetailProps> = ({
    deliveryDocument,
    isLoading = false,
    onEdit,
    onDelete,
    onPrint,
}) => {
    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Teslimat Belgesi Detayı</h1>
                <div className="space-x-2">
                    {onPrint && (
                        <Button onClick={onPrint} variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Yazdır
                        </Button>
                    )}
                    {onEdit && (
                        <Button onClick={onEdit} variant="outline">
                            Düzenle
                        </Button>
                    )}
                    {onDelete && (
                        <Button onClick={onDelete} variant="outline">
                            Sil
                        </Button>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Belge Bilgileri</CardTitle>
                    <CardDescription>Teslimat belgesine ait temel bilgiler</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-semibold">Belge No:</span>
                            <span>{deliveryDocument.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-semibold">Oluşturulma Tarihi:</span>
                            <span>{deliveryDocument.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-semibold">Durum:</span>
                            <Badge>{deliveryDocument.status}</Badge>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span className="font-semibold">Belge Tipi:</span>
                            <span>{deliveryDocument.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span className="font-semibold">Firma:</span>
                            <span>{deliveryDocument.id}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Teslimat Bilgileri</CardTitle>
                    <CardDescription>Teslimat detayları ve taşıma bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span className="font-semibold">Araç Plakası:</span>
                            <span>{deliveryDocument.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-semibold">Sürücü:</span>
                            <span>{deliveryDocument.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-semibold">Teslimat Adresi:</span>
                            <span>{deliveryDocument.id}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span className="font-semibold">Ürün:</span>
                            <span>{deliveryDocument.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span className="font-semibold">Miktar:</span>
                            <span>{deliveryDocument.id} ton</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {typeof deliveryDocument.notes === 'string' && deliveryDocument.notes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notlar</CardTitle>
                        <CardDescription>Teslimat belgesi ile ilgili notlar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{deliveryDocument.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default DeliveryDocumentDetailPage;