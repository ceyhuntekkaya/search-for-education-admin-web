'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {CustomerInfoFormData} from "@/types/customer";
import {EInfoStatus} from "@/types/enumeration";
import {useAuthContext} from "@/contexts/auth-context";

interface CustomerInfoFormProps {
    onSubmit: (arg0: CustomerInfoFormData) => void;
    customerId: string;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
                                                               onSubmit,
                                                               customerId
                                                           }) => {

    const {user} = useAuthContext();

    const [formData, setFormData] = useState<CustomerInfoFormData>({
        customerId: customerId,
        orderId: '',
        infoStatus: EInfoStatus.PENDING,
        requestingUserId: user?.id || '',
        requestingUnit: user?.departmentSet[0] || null,
        respondingUserId: user?.id || '',
        requestDescription: '-',
        description: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfoFormData, string>>>({});

    const validateForm = () => {
        const newErrors: Partial<Record<keyof CustomerInfoFormData, string>> = {};

        if (!formData.description) {
            newErrors.description = 'Bilgi girişi zorunludur';
        }
/*
        if (!formData.customerId) {
            newErrors.customerId = 'Müşteri seçimi zorunludur';
        }

        if (!formData.orderId) {
            newErrors.orderId = 'Sipariş seçimi zorunludur';
        }

        if (!formData.requestingUserId) {
            newErrors.requestingUserId = 'Talep eden kullanıcı seçimi zorunludur';
        }

        if (!formData.requestingUnit) {
            newErrors.requestingUnit = 'Talep eden birim seçimi zorunludur';
        }

        if (!formData.requestDescription) {
            newErrors.requestDescription = 'Talep açıklaması zorunludur';
        }

 */

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
           onSubmit(formData);
        }
    };

    const handleChange = <T extends keyof CustomerInfoFormData>(
        name: T,
        value: CustomerInfoFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /*
     <div className="space-y-2">
                        <Label htmlFor="customer">Müşteri *</Label>
                        <Select
                            onValueChange={(value) => handleChange('customerId', value as string)}
                            value={formData.customerId}
                        >
                            <SelectTrigger className={errors.customerId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Müşteri seçin"/>
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map(customer => (
                                    <SelectItem key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.customerId && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.customerId}</AlertDescription>
                            </Alert>
                        )}
                    </div>

<div className="space-y-2">
    <Label htmlFor="order">Sipariş *</Label>
    <Select
        onValueChange={(value) => handleChange('orderId', value as string)}
        value={formData.orderId}
    >
        <SelectTrigger className={errors.orderId ? 'border-red-500' : ''}>
            <SelectValue placeholder="Sipariş seçin"/>
        </SelectTrigger>
        <SelectContent>
            {orders.map(order => (
                <SelectItem key={order.id} value={order.id}>
                    {order.code}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
    {errors.orderId && (
        <Alert variant="destructive">
            <AlertDescription>{errors.orderId}</AlertDescription>
        </Alert>
    )}
</div>

<div className="space-y-2">
    <Label htmlFor="requestingUnit">Talep Eden Birim *</Label>
    <Select
        onValueChange={(value) => handleChange('requestingUnit', value as Department)}
        value={formData.requestingUnit ?? ''}
    >
        <SelectTrigger className={errors.requestingUnit ? 'border-red-500' : ''}>
            <SelectValue placeholder="Birim seçin"/>
        </SelectTrigger>
        <SelectContent>
            {Object.entries(DepartmentList).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                    {value}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
    {errors.requestingUnit && (
        <Alert variant="destructive">
            <AlertDescription>{errors.requestingUnit}</AlertDescription>
        </Alert>
    )}
</div>

<div className="space-y-2">
    <Label htmlFor="requestingUser">Talep Eden Kullanıcı *</Label>
    <Select
        onValueChange={(value) => handleChange('requestingUserId', value as string)}
        value={formData.requestingUserId}
    >
        <SelectTrigger className={errors.requestingUserId ? 'border-red-500' : ''}>
            <SelectValue placeholder="Kullanıcı seçin"/>
        </SelectTrigger>
        <SelectContent>
            {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                    {user.name}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
    {errors.requestingUserId && (
        <Alert variant="destructive">
            <AlertDescription>{errors.requestingUserId}</AlertDescription>
        </Alert>
    )}
</div>

<div className="space-y-2">
    <Label htmlFor="respondingUser">Yanıtlayan Kullanıcı</Label>
    <Select
        onValueChange={(value) => handleChange('respondingUserId', value as string)}
        value={formData.respondingUserId}
    >
        <SelectTrigger>
            <SelectValue placeholder="Kullanıcı seçin"/>
        </SelectTrigger>
        <SelectContent>
            {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                    {user.name}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
</div>

<div className="space-y-2">
    <Label htmlFor="requestDescription">Talep Açıklaması *</Label>
    <textarea
        id="requestDescription"
        value={formData.requestDescription}
        onChange={(e) => handleChange('requestDescription', e.target.value)}
        className={`w-full min-h-[100px] p-2 border rounded-md ${
            errors.requestDescription ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder="Talep açıklamasını giriniz..."
    />
    {errors.requestDescription && (
        <Alert variant="destructive">
            <AlertDescription>{errors.requestDescription}</AlertDescription>
        </Alert>
    )}
</div>
     */

    return (
        <Card>
            <CardHeader>
                <CardTitle>Müşteri Bilgi Formu</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Müşteri Seçimi */}


                    {/* Genel Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Müşteri ile ilgili açıklama</Label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full min-h-[100px] p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Genel açıklama giriniz..."
                        />
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Kaydet
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CustomerInfoForm;