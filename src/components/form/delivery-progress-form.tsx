'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Delivery, DeliveryProgressFormData, DeliveryProgressFormErrors} from "@/types/delivery";
import {User} from "@/types/auth";
import {EDeliveryStatus, EStatus} from "@/types/enumeration";


interface DeliveryProgressFormProps {
    onSubmit: (arg0: DeliveryProgressFormData) => void;
    deliveries: Delivery[];
    users: User[];
}

const CreateDeliveryProgressForm: React.FC<DeliveryProgressFormProps> = ({
                                                                             onSubmit,
                                                                             deliveries = [],
                                                                             users = []
                                                                         }) => {
    const [formData, setFormData] = useState<DeliveryProgressFormData>({
        deliveryId: '',
        userId: '',
        description: '',
        deliveryStatus: EDeliveryStatus.NEW,
        orderId: '',
        offerId: '',
        status: EStatus.NEW,
        id: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: DeliveryProgressFormErrors = {};

        if (!formData.deliveryId) {
            newErrors.deliveryId = 'Teslimat seçimi zorunludur';
        }

        if (!formData.userId) {
            newErrors.userId = 'Kullanıcı seçimi zorunludur';
        }

        if (!formData.deliveryStatus) {
            newErrors.deliveryStatus = 'Teslimat durumu seçimi zorunludur';
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

    const handleChange = <T extends keyof DeliveryProgressFormData>(
        name: T,
        value: DeliveryProgressFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Teslimat İlerlemesi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Teslimat Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="delivery">Teslimat *</Label>
                        <Select
                            onValueChange={(value) => handleChange('deliveryId', value as string | null)}
                            value={formData.deliveryId ?? ""}
                            searchable={true}
                        >
                            <SelectTrigger className={errors.deliveryId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Teslimat seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {deliveries.map(delivery => (
                                    <SelectItem
                                        key={delivery.id}
                                        value={delivery.id}
                                    >
                                        {delivery.code} - {delivery.offer.order.customer.name} ({delivery.deliveryStatus})
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

                    {/* Kullanıcı Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="user">Kullanıcı *</Label>
                        <Select
                            onValueChange={(value) => handleChange('userId', value as string | null)}
                            value={formData.userId ?? ""}
                        >
                            <SelectTrigger className={errors.userId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Kullanıcı seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                                    </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.userId && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.userId}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Teslimat Durumu */}
                    <div className="space-y-2">
                        <Label htmlFor="deliveryStatus">Teslimat Durumu *</Label>
                        <Select
                            onValueChange={(value) => handleChange('deliveryStatus', value as EDeliveryStatus)}
                            value={formData.deliveryStatus ??  ""}
                        >
                            <SelectTrigger className={errors.deliveryStatus ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {Object.entries(EDeliveryStatus).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value}
                                    </SelectItem>
                                ))}
                                    </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.deliveryStatus && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.deliveryStatus}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="İlerleme hakkında açıklama giriniz..."
                        />
                        <div className="text-sm text-gray-500">
                            {formData.description.length}/4000 karakter
                        </div>
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            İlerleme Kaydet
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateDeliveryProgressForm;