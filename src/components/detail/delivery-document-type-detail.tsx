'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Trash2 } from 'lucide-react';
import { DeliveryDocumentType } from "@/types/delivery";
import LoadingComp from "@/components/ui/loading-comp";

interface DeliveryDocumentTypeDetailProps {
    documentType: DeliveryDocumentType;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const DeliveryDocumentTypeDetailPage: React.FC<DeliveryDocumentTypeDetailProps> = ({
    documentType,
    isLoading = false,
    onEdit,
    onDelete
}) => {
    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="mx-6 my-3 py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Teslimat Belge Tipi Detayı</h1>
                <div className="space-x-2">
                    {onEdit && (
                        <Button onClick={onEdit} variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Düzenle
                        </Button>
                    )}
                    {onDelete && (
                        <Button onClick={onDelete} variant="primary">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                        </Button>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Belge Tipi Bilgileri</CardTitle>
                    <CardDescription>Teslimat belge tipine ait detaylar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg border">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                                <div className="font-semibold">Belge Tipi Adı</div>
                                <div className="text-gray-600">{documentType.name}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded-lg border">
                            <FileText className="h-5 w-5 text-gray-500 mt-1" />
                            <div>
                                <div className="font-semibold">Açıklama</div>
                                <div className="text-gray-600 whitespace-pre-wrap">
                                    {documentType.description || 'Açıklama bulunmuyor'}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg border">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                                <div className="font-semibold">Belge ID</div>
                                <div className="text-gray-600 font-mono">{documentType.id}</div>
                            </div>
                        </div>

                        {documentType.createdAt && (
                            <div className="flex items-center gap-2 p-3 rounded-lg border">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <div>
                                    <div className="font-semibold">Oluşturulma Tarihi</div>
                                    <div className="text-gray-600">
                                        {new Date(documentType.createdAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeliveryDocumentTypeDetailPage;