'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Supplier, SupplierFormData, SupplierFormErrors} from "@/types/supplier";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useSuppliers} from "@/hooks/use-supplier";

interface SupplierFormProps {
    onSubmit: (arg0: SupplierFormData) => void;
    selectedSupplier?: Supplier | null;
}

const CreateSupplierForm: React.FC<SupplierFormProps> = ({
                                                             onSubmit,
                                                             selectedSupplier
                                                         }) => {
    const {activeBrand} = useAuthContext();
    const [formData, setFormData] = useState<SupplierFormData>({
        id: null,
        code: '',
        name: '',
        status: EStatus.NEW,
        brandId: activeBrand?.id || ''
    });

    const {
        suppliers,
        fetchSuppliers
    } = useSuppliers();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();


    useEffect(() => {
        const loadSupplier = async () => {
            if (selectedSupplier) {
                setFormData({
                    id: selectedSupplier.id,
                    code: selectedSupplier.code,
                    name: selectedSupplier.name,
                    status: selectedSupplier.status,
                    brandId: selectedSupplier.brand.id
                })
            }
        };

        if (selectedSupplier) {
            loadSupplier();
        }
    }, [selectedSupplier]);


    const validateForm = () => {
        const newErrors: SupplierFormErrors = {};

        if (!formData.code.trim()) {
            newErrors.code = 'Tedarikçi kodu zorunludur';
        } else if (formData.code.length < 2) {
            newErrors.code = 'Tedarikçi kodu en az 2 karakter olmalıdır';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Tedarikçi adı zorunludur';
        }

        if (!selectedSupplier ) {
            if (suppliers.some(s => s.name.toLowerCase() === formData.name.toLowerCase())) {
                newErrors.name = 'Bu tedarikçi adı zaten kullanımda';
            }
            else if (suppliers.some(s => s.code.toLowerCase() === formData.code.toLowerCase())) {
                newErrors.code = 'Bu tedarikçi kodu zaten kullanımda';
            }
        }

        if (!formData.status) {
            newErrors.status = 'Durum seçimi zorunludur';
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


    const handleChange = <T extends keyof SupplierFormData>(
        name: T,
        value: SupplierFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Tedarikçi</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Tedarikçi Kodu *</Label>
                            <Input
                                id="code"
                                name="code"
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value)}
                                className={errors.code ? 'border-red-500' : ''}
                                placeholder="Örn: SUP001"
                                maxLength={10}
                            />
                            {errors.code && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.code}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Tedarikçi Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Tedarikçi Adı *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Tedarikçi adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Durum *</Label>
                            <Select
                                onValueChange={(value) => handleChange('status', value as EStatus)}
                                value={formData.status ?? ""}
                            >
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Durum seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {Object.entries(EStatus).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {t(`status.${value}`)}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.status}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {
                                    selectedSupplier ? 'Tedarikçi Güncelle' : 'Tedarikçi Oluştur'
                                }
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateSupplierForm;