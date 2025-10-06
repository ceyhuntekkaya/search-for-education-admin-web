'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Building,
    User,
    FileText,
    Calendar,
    MessageSquare,
    Users,
    ClipboardList,
    AlertCircle
} from 'lucide-react';
import { CustomerInfo } from "@/types/customer";
import { DepartmentList } from "@/types/auth";
import {formatDate} from "@/utils/date-formater";
import LoadingComp from "@/components/ui/loading-comp";

interface CustomerInfoDetailProps {
    customerInfo: CustomerInfo;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'new':
            return 'bg-blue-100 text-blue-800';
        case 'in_progress':
            return 'bg-yellow-100 text-yellow-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const CustomerInfoDetailPage: React.FC<CustomerInfoDetailProps> = ({
    customerInfo,
    isLoading = false,
    onEdit,
    onDelete,
}) => {
    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }


    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Müşteri Bilgi Talebi Detayı</h1>
                <div className="space-x-2">
                    {onEdit && (
                        <Button onClick={onEdit} variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Düzenle
                        </Button>
                    )}
                    {onDelete && (
                        <Button onClick={onDelete} variant="primary">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Sil
                        </Button>
                    )}
                </div>
            </div>

            {/* Temel Bilgiler */}
            <Card>
                <CardHeader>
                    <CardTitle>Talep Bilgileri</CardTitle>
                    <CardDescription>Müşteri bilgi talebi temel bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span className="font-semibold">Müşteri:</span>
                            <span>{customerInfo.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4" />
                            <span className="font-semibold">Sipariş Kodu:</span>
                            <span>{customerInfo.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-semibold">Oluşturulma Tarihi:</span>
                            <span>{formatDate(customerInfo.createdAt || '')}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-semibold">Durum:</span>
                            <Badge className={getStatusColor(customerInfo.infoStatus)}>
                                {customerInfo.infoStatus}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="font-semibold">Talep Eden Birim:</span>
                            <span>{DepartmentList[customerInfo.requestingUnit]}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Kullanıcı Bilgileri */}
            <Card>
                <CardHeader>
                    <CardTitle>Kullanıcı Bilgileri</CardTitle>
                    <CardDescription>Talep ve yanıt ile ilgili kullanıcı bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-semibold">Talep Eden:</span>
                            <span>{customerInfo.requestingUser.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-semibold">Talep Eden Email:</span>
                            <span>{customerInfo.requestingUser.email}</span>
                        </div>
                    </div>
                    {customerInfo.respondingUser && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-semibold">Yanıtlayan:</span>
                                <span>{customerInfo.respondingUser.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span className="font-semibold">Yanıtlayan Email:</span>
                                <span>{customerInfo.respondingUser.email}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Açıklamalar */}
            <Card>
                <CardHeader>
                    <CardTitle>Açıklamalar</CardTitle>
                    <CardDescription>Talep ve yanıt açıklamaları</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Talep Açıklaması
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                            {customerInfo.requestDescription}
                        </div>
                    </div>

                    {customerInfo.description && (
                        <div className="space-y-2">
                            <div className="font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Genel Açıklama
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                {customerInfo.description}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerInfoDetailPage;