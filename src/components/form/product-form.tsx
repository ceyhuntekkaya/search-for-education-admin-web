'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Product, ProductFormData, ProductFormErrors, Supplier} from "@/types/supplier";
import {EProductType} from "@/types/enumeration";
import {useAuthContext} from "@/contexts/auth-context";


interface ProductFormProps {
    onSubmit: (arg0: ProductFormData) => void;
    suppliers: Supplier[];
    selectedProduct?: Product | null;
    selectedSupplier?: Supplier | null;
}

const CreateProductForm: React.FC<ProductFormProps> = ({
                                                           onSubmit,
                                                           suppliers = [],
                                                           selectedProduct,
                                                           selectedSupplier
                                                       }) => {
    const {activeBrand} = useAuthContext();
    const [formData, setFormData] = useState<ProductFormData>({
        supplierId: selectedSupplier?.id || '',
        name: '',
        type: null,
        description: '',
        brandId: activeBrand?.id || ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadProduct = async () => {
            if(selectedProduct){
                setFormData({
                    supplierId: selectedProduct?.supplier.id,
                    name: selectedProduct?.name,
                    type: selectedProduct?.type,
                    description: selectedProduct?.description,
                    brandId: selectedProduct?.brand.id,
                    id: selectedProduct?.id
                })
            }
        };

        if (selectedProduct) {
            loadProduct();
        }
    }, [selectedProduct]);




    const validateForm = () => {
        const newErrors: ProductFormErrors = {};

        // Tedarikçi kontrolü
        if (!formData.supplierId) {
            newErrors.supplierId = 'Tedarikçi seçimi zorunludur';
        }

        // İsim kontrolü
        if (!formData.name.trim()) {
            newErrors.name = 'Ürün adı zorunludur';
        }

        // Tip kontrolü
        if (!formData.type) {
            newErrors.type = 'Ürün tipi seçimi zorunludur';
        }

        // Açıklama uzunluğu kontrolü
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

    const handleChange = <T extends keyof ProductFormData>(
        name: T,
        value: ProductFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Ürün</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tedarikçi Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="supplier">Tedarikçi *</Label>
                        <Select
                            onValueChange={(value) => handleChange('supplierId', value as string | null)}
                            value={formData.supplierId ?? ""}
                        >
                            <SelectTrigger className={errors.supplierId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Tedarikçi seçin"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {suppliers.map(supplier => (
                                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
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

                    {/* Ürün Adı */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Ürün Adı *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                            placeholder="Ürün adını giriniz"
                        />
                        {errors.name && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.name}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Ürün Tipi */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Ürün Tipi *</Label>
                        <Select
                            onValueChange={(value) => handleChange('type', value as EProductType)}
                            value={formData.type ?? ""}
                        >
                            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Ürün tipi seçin"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {Object.entries(EProductType).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value}
                                    </SelectItem>
                                ))}
                                    </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.type}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={`w-full min-h-[100px] p-2 border rounded-md ${
                                errors.description ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Ürün açıklaması giriniz..."
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
                            Ürün Oluştur
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateProductForm;