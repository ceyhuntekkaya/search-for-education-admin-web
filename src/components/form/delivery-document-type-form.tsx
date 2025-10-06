'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {DeliveryDocumentTypeFormData, DeliveryDocumentTypeFormErrors} from "@/types/delivery";

interface DeliveryDocumentTypeFormProps {
    onSubmit: (arg0: DeliveryDocumentTypeFormData) => void;
}

const CreateDeliveryDocumentTypeForm: React.FC<DeliveryDocumentTypeFormProps> = ({
                                                                                     onSubmit
                                                                                 }) => {
    const [formData, setFormData] = useState<DeliveryDocumentTypeFormData>({
        name: '',
        description: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors:DeliveryDocumentTypeFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Doküman tipi adı zorunludur';
        }

        if (formData.description.length > 2000) {
            newErrors.description = 'Açıklama en fazla 2000 karakter olabilir';
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Doküman Tipi</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* İsim */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Doküman Tipi Adı *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'border-red-500' : ''}
                            placeholder="Doküman tipi adını giriniz"
                        />
                        {errors.name && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.name}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="Doküman tipi hakkında açıklama giriniz..."
                        />
                        <div className="text-sm text-gray-500">
                            {formData.description.length}/2000 karakter
                        </div>
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Doküman Tipi Oluştur
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateDeliveryDocumentTypeForm;