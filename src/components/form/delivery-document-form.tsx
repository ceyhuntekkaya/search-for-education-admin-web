'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    Delivery,
    DeliveryDocumentFormData,
    DeliveryDocumentFormErrors,
    DeliveryDocumentType,
    DeliveryProgress
} from "@/types/delivery";
import {EMediaType} from "@/types/enumeration";


interface DeliveryDocumentFormProps {
    onSubmit: (arg0: DeliveryDocumentFormData) => void;
    deliveries: Delivery[];
    deliveryProgress:DeliveryProgress;
    deliveryDocumentTypes: DeliveryDocumentType[];
}

const CreateDeliveryDocumentForm: React.FC<DeliveryDocumentFormProps> = ({
                                                                             onSubmit,
                                                                             deliveries = [],
                                                                             deliveryDocumentTypes = [],
                                                                             deliveryProgress,
                                                                         }) => {
    const [formData, setFormData] = useState<DeliveryDocumentFormData>({
        deliveryId: '',
        deliveryProgressId: deliveryProgress.id,
        userId: '',
        description: "",
        documentPath: "",
        documentTypeId: "",
        file: null,
        mediaType: null
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: DeliveryDocumentFormErrors = {};

        if (!formData.deliveryId) {
            newErrors.deliveryId = 'Teslimat seçimi zorunludur';
        }

        if (!formData.documentTypeId) {
            newErrors.documentTypeId = 'Doküman tipi seçimi zorunludur';
        }

        if (!formData.mediaType) {
            newErrors.mediaType = 'Medya tipi seçimi zorunludur';
        }

        if (!formData.file) {
            newErrors.file = 'Dosya yükleme zorunludur';
        }

        if (formData.description && formData.description.length > 4000) {
            newErrors.description = 'Açıklama en fazla 4000 karakter olabilir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };




    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };



    const handleChange = <T extends keyof DeliveryDocumentFormData>(
        name: T,
        value: DeliveryDocumentFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            /*
            setFormData(prev => ({
                ...prev,
                file: e.target.files![0]
            }));

             */
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Teslimat Dokümanı</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Teslimat Seçimi */}
                        <div className="space-y-2">
                            <Label htmlFor="delivery">Teslimat *</Label>
                            <Select
                                onValueChange={(value) => handleChange('deliveryId', value as string | null)}
                                value={formData.deliveryId ?? ""}
                            >
                                <SelectTrigger className={errors.deliveryId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Teslimat seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {deliveries.map(delivery => (
                                        <SelectItem key={delivery.id} value={delivery.id}>
                                            {delivery.code}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.deliveryId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.deliveryId}</AlertDescription>
                                </Alert>
                            )}
                        </div>



                        {/* Doküman Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="documentType">Doküman Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('documentTypeId', value as string | null)}
                                value={formData.documentTypeId ?? ""}
                                searchable={true}
                            >
                                <SelectTrigger className={errors.documentTypeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Doküman tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {deliveryDocumentTypes.map(docType => (
                                        <SelectItem key={docType.id} value={docType.id.toString()}>
                                            {docType.name}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.documentType && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.documentTypeId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Medya Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="mediaType">Medya Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('mediaType', value as EMediaType)}
                                value={formData.mediaType ?? ""}
                                searchable={true}
                            >
                                <SelectTrigger className={errors.mediaType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Medya tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {Object.entries(EMediaType).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.mediaType && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.mediaType}</AlertDescription>
                                </Alert>
                            )}
                        </div>



                        {/* Dosya Yükleme */}
                        <div className="space-y-2">
                            <Label htmlFor="file">Dosya *</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                className={errors.file ? 'border-red-500' : ''}
                            />
                            {errors.file && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.file}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="Doküman hakkında açıklama giriniz..."
                        />
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Doküman Oluştur
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateDeliveryDocumentForm;