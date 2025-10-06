'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {CustomerFormData, CustomerFormErrors} from "@/types/customer";
import {useAuthContext} from "@/contexts/auth-context";

interface CreateCustomerFormProps {
    onSubmit: (customer: CustomerFormData) => void;
}


const CreateCustomerForm = ({onSubmit}: CreateCustomerFormProps) => {
    const {activeBrand} = useAuthContext();
    const [formData, setFormData] = useState<CustomerFormData>({
        address: "",
        contactPerson: "",
        contactPersonDepartment: "",
        contactPersonEmail: "",
        contactPersonPhone: "",
        contactPersonPosition: "",
        email: "",
        name: "",
        phone: "",
        status: null,
        taxNumber: "",
        taxOffice: "",
        user: null,
        code: "",
        code2: "",
        paymentMethods: [],
        brandId: activeBrand?.id || '',
        contractType: '',
        locked: false,
        offerTextParts: null,
        banned: false,
        link: '',
        maxLimit: -1,


    });


    const [errors, setErrors] = useState<CustomerFormErrors>({});

    const validateForm = () => {
        const newErrors: CustomerFormErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Müşteri adı zorunludur';
        }

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir email adresi giriniz';
        }

        // Phone validation
        if (formData.phone && !/^[0-9\s-+()]*$/.test(formData.phone)) {
            newErrors.phone = 'Geçerli bir telefon numarası giriniz';
        }

        // Contact Person Email validation
        if (formData.contactPersonEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPersonEmail)) {
            newErrors.contactPersonEmail = 'Geçerli bir email adresi giriniz';
        }

        // Tax Number validation
        if (formData.taxNumber && !/^[0-9]{10}$/.test(formData.taxNumber)) {
            newErrors.taxNumber = 'Vergi numarası 10 haneli olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Müşteri Oluştur</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        {/* Temel Bilgiler */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Müşteri Adı *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.email}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                            {errors.phone && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.phone}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Adres</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        {/* İletişim Kişisi Bilgileri */}
                        <div className="space-y-2">
                            <Label htmlFor="contactPerson">İletişim Kişisi</Label>
                            <Input
                                id="contactPerson"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactPersonEmail">İletişim Kişisi E-posta</Label>
                            <Input
                                id="contactPersonEmail"
                                name="contactPersonEmail"
                                type="email"
                                value={formData.contactPersonEmail}
                                onChange={handleChange}
                                className={errors.contactPersonEmail ? 'border-red-500' : ''}
                            />
                            {errors.contactPersonEmail && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.contactPersonEmail}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactPersonPhone">İletişim Kişisi Telefon</Label>
                            <Input
                                id="contactPersonPhone"
                                name="contactPersonPhone"
                                value={formData.contactPersonPhone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactPersonPosition">İletişim Kişisi Pozisyon</Label>
                            <Input
                                id="contactPersonPosition"
                                name="contactPersonPosition"
                                value={formData.contactPersonPosition}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactPersonDepartment">İletişim Kişisi Departman</Label>
                            <Input
                                id="contactPersonDepartment"
                                name="contactPersonDepartment"
                                value={formData.contactPersonDepartment}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Vergi Bilgileri */}
                        <div className="space-y-2">
                            <Label htmlFor="taxNumber">Vergi Numarası</Label>
                            <Input
                                id="taxNumber"
                                name="taxNumber"
                                value={formData.taxNumber}
                                onChange={handleChange}
                                className={errors.taxNumber ? 'border-red-500' : ''}
                            />
                            {errors.taxNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.taxNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxOffice">Vergi Dairesi</Label>
                            <Input
                                id="taxOffice"
                                name="taxOffice"
                                value={formData.taxOffice}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Müşteri Oluştur
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )

};

export default CreateCustomerForm;