'use client';

import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectValues
} from "@/components/ui/select";
import {FillingFacility, FillingFacilityFormData, FillingFacilityFormErrors, Product, Supplier} from "@/types/supplier";
import {ECity} from "@/types/enumeration";
import { NumberInput } from '../ui/number-input';


interface FillingFacilityFormProps {
    onSubmit: (arg0: FillingFacilityFormData) => void;
    suppliers: Supplier[];
    products: Product[];
    selectedFillingFacility?: FillingFacility | null;
    selectedSupplier?: Supplier | null;
}

const CreateFillingFacilityForm: React.FC<FillingFacilityFormProps> = ({
                                                                           onSubmit,
                                                                           suppliers = [],
                                                                           products = [],
                                                                           selectedFillingFacility,
                                                                           selectedSupplier
                                                                       }) => {
    const [formData, setFormData] = useState<FillingFacilityFormData>({
        name: '',
        location: '',
        city: null,
        capacity: 0,
        isOperational: true,
        supplierId: selectedSupplier?.id || '',
        productIds: null
    });

    const [errors, setErrors] = useState<Record<string, string>>({});



    useEffect(() => {
        const loadFillingFacility = async () => {
            if(selectedFillingFacility){

                const productIds: Set<string> = new Set(
                    Array.from(selectedFillingFacility.products).map(product => product.id)
                );


                setFormData({
                    name: selectedFillingFacility.name,
                    location: selectedFillingFacility.location,
                    city: selectedFillingFacility.city,
                    capacity: selectedFillingFacility.capacity,
                    isOperational: selectedFillingFacility.isOperational,
                    supplierId: selectedFillingFacility.supplier.id,
                    productIds: productIds,
                    id: selectedFillingFacility?.id
                })
            }
        };

        if (loadFillingFacility) {
            loadFillingFacility();
        }
    }, [selectedFillingFacility]);




    const validateForm = () => {
        const newErrors: FillingFacilityFormErrors = {};

        // İsim validasyonu
        if (!formData.name.trim()) {
            newErrors.name = 'Tesis adı zorunludur';
        }

        // Lokasyon validasyonu
        if (!formData.location.trim()) {
            newErrors.location = 'Lokasyon bilgisi zorunludur';
        } else if (formData.location.length > 2000) {
            newErrors.location = 'Lokasyon en fazla 2000 karakter olabilir';
        }

        // Şehir validasyonu
        if (!formData.city) {
            newErrors.city = 'Şehir seçimi zorunludur';
        }

        // Kapasite validasyonu
        if (formData.capacity < 0) {
            newErrors.capacity = 'Kapasite 0\'dan küçük olamaz';
        }

        // Tedarikçi validasyonu
        if (!formData.supplierId) {
            newErrors.supplierId = 'Tedarikçi seçimi zorunludur';
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

    const handleChange = <T extends keyof FillingFacilityFormData>(
        name: T,
        value: FillingFacilityFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Dolum Tesisi</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Temel Bilgiler */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Tesis Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Tesis Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Tesis adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Şehir */}
                        <div className="space-y-2">
                            <Label htmlFor="city">Şehir *</Label>
                            <Select
                                onValueChange={(value) => handleChange('city', value as ECity)}
                                value={formData.city ?? ""}
                            >
                                <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Şehir seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {Object.entries(ECity).map(([key, value]) => (
                                        <SelectItem key={key} value={value}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.city && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.city}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Lokasyon */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="location">Lokasyon *</Label>
                            <Textarea
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                className={`min-h-[80px] ${errors.location ? 'border-red-500' : ''}`}
                                placeholder="Detaylı adres bilgilerini giriniz"
                            />
                            <div className="text-sm text-gray-500">
                                {formData.location.length}/2000 karakter
                            </div>
                            {errors.location && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.location}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Kapasite */}
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Kapasite (ton)</Label>

                            <NumberInput
                                inputType="distance"
                                id="capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={(value) => handleChange('capacity', value)}
                                unit="ton"
                                decimalPlaces={0}
                                className={errors.capacity ? 'border-red-500' : ''}
                            />

                            {errors.capacity && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.capacity}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Operasyonel Durum */}
                        <div className="space-y-2 flex items-center justify-between">
                            <Label htmlFor="isOperational">Operasyonel Durum</Label>
                            <Switch
                                id="isOperational"
                                checked={formData.isOperational}
                                onCheckedChange={(checked) => handleChange('isOperational', checked)}
                            />
                        </div>
                    </div>

                    {/* Tedarikçi ve Ürünler */}
                    <div className="space-y-4">
                        {/* Tedarikçi */}
                        <div className="space-y-2">
                            <Label htmlFor="supplier">Tedarikçi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('supplierId', value as string | null)}
                                value={formData.supplierId ?? ""}
                            >
                                <SelectTrigger className={errors.supplierId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Tedarikçi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {suppliers.map(supplier => (
                                        <SelectItem key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.supplierId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.supplierId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Ürünler */}
                        <div className="space-y-2">
                            <Label htmlFor="products">Ürünler *</Label>
                            <Select
                                multiple
                                onValueChange={(value: SelectValue | SelectValues) => {
                                    if (Array.isArray(value)) {
                                        handleChange('productIds', new Set(value.map(v => String(v))))
                                    }
                                }}
                                value={Array.from(formData.productIds ?? [])}
                            >
                                <SelectTrigger className={errors.productIds ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Ürün seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {products.map(product => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.productIds && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.productIds}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Tesis Oluştur
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateFillingFacilityForm;