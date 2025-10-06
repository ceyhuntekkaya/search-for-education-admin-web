'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    TransportationCompany,
    TransportationCompanyFormData,
    TransportationCompanyFormErrors
} from "@/types/transportation-company";
import {User} from "@/types/auth";
import {ECity, EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useTransportationCompanies} from "@/hooks/use-transportation-company";


interface TransportationCompanyFormProps {
    onSubmit: (arg0: TransportationCompanyFormData) => void;
    existingCompanies?: TransportationCompany[];
    users: User[];
    selectedTransportationCompanyId?:string
}

const CreateTransportationCompanyForm: React.FC<TransportationCompanyFormProps> = ({
                                                                                       onSubmit,
                                                                                       existingCompanies = [],
                                                                                       users = [],
                                                                                       selectedTransportationCompanyId
                                                                                   }) => {
    const {activeBrand} = useAuthContext();
    const [formData, setFormData] = useState<TransportationCompanyFormData>({
        name: '',
        companyName: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: '',
        contactPersonPhone: '',
        contactPersonEmail: '',
        contactPersonPosition: '',
        contactPersonDepartment: '',
        taxNumber: '',
        taxOffice: '',
        isMainCompany: false,
        city: null,
        description: '',
        userId: '',
        id: null,
        status: EStatus.NEW,
        brandId: activeBrand?.id || ''
    });


    const {
        selectedTransportationCompany,
        fetchTransportationCompanyById,
    } = useTransportationCompanies();

    useEffect(() => {
        if(selectedTransportationCompanyId){
            fetchTransportationCompanyById(selectedTransportationCompanyId);
        }

    }, []);

    useEffect(() => {
        if(selectedTransportationCompany){
            setFormData(
                {
                    name: selectedTransportationCompany.name,
                    companyName: selectedTransportationCompany.companyName,
                    address: selectedTransportationCompany.address,
                    phone: selectedTransportationCompany.phone,
                    email: selectedTransportationCompany.email,
                    contactPerson: selectedTransportationCompany.contactPerson,
                    contactPersonPhone: selectedTransportationCompany.contactPersonPhone,
                    contactPersonEmail: selectedTransportationCompany.contactPersonEmail,
                    contactPersonPosition: selectedTransportationCompany.contactPersonPosition,
                    contactPersonDepartment: selectedTransportationCompany.contactPersonDepartment,
                    taxNumber: selectedTransportationCompany.taxNumber,
                    taxOffice: selectedTransportationCompany.taxOffice,
                    isMainCompany: selectedTransportationCompany.isMainCompany,
                    city: selectedTransportationCompany.city,
                    description: selectedTransportationCompany.description,
                    userId: selectedTransportationCompany.user?.id || '',
                    id: selectedTransportationCompany.id,
                    status: selectedTransportationCompany.status,
                    brandId: selectedTransportationCompany.brand.id
                }
            )
        }

    }, [selectedTransportationCompany]);



    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();
    const validateForm = () => {
        const newErrors: TransportationCompanyFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Firma adı zorunludur';
        } else if (existingCompanies.some(c => c.name.toLowerCase() === formData.name.toLowerCase())) {
            newErrors.name = 'Bu firma adı zaten kullanımda';
        }

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Resmi firma adı zorunludur';
        } else if (existingCompanies.some(c => c.companyName.toLowerCase() === formData.companyName.toLowerCase())) {
            newErrors.companyName = 'Bu resmi firma adı zaten kullanımda';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir email adresi giriniz';
        }

        if (formData.contactPersonEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPersonEmail)) {
            newErrors.contactPersonEmail = 'Geçerli bir email adresi giriniz';
        }

        if (formData.phone && !/^[0-9\s-+()]*$/.test(formData.phone)) {
            newErrors.phone = 'Geçerli bir telefon numarası giriniz';
        }

        if (formData.contactPersonPhone && !/^[0-9\s-+()]*$/.test(formData.contactPersonPhone)) {
            newErrors.contactPersonPhone = 'Geçerli bir telefon numarası giriniz';
        }

        if (formData.taxNumber && !/^[0-9]{10}$/.test(formData.taxNumber)) {
            newErrors.taxNumber = 'Vergi numarası 10 haneli olmalıdır';
        }

        if (formData.address && formData.address.length > 1000) {
            newErrors.address = 'Adres en fazla 1000 karakter olabilir';
        }

        if (formData.description && formData.description.length > 4000) {
            newErrors.description = 'Açıklama en fazla 4000 karakter olabilir';
        }

        if (!formData.city) {
            newErrors.city = 'Şehir seçimi zorunludur';
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

    const handleChange = <T extends keyof TransportationCompanyFormData>(
        name: T,
        value: TransportationCompanyFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Nakliye Firması</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Temel Bilgiler */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Firma Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Firma Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Firma adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Resmi Firma Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Resmi Firma Adı *</Label>
                            <Input
                                id="companyName"
                                value={formData.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                className={errors.companyName ? 'border-red-500' : ''}
                                placeholder="Resmi firma adını giriniz"
                            />
                            {errors.companyName && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.companyName}</AlertDescription>
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
                                    <SelectValue placeholder="Şehir seçin"/>
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

                        {/* Ana Firma Durumu */}
                        <div className="space-y-2 flex items-center justify-between">
                            <Label htmlFor="isMainCompany">Ana Firma</Label>
                            <Switch
                                id="isMainCompany"
                                checked={formData.isMainCompany}
                                onCheckedChange={(checked) => handleChange('isMainCompany', checked)}
                            />
                        </div>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className={errors.phone ? 'border-red-500' : ''}
                                placeholder="+90 xxx xxx xxxx"
                            />
                            {errors.phone && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.phone}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={errors.email ? 'border-red-500' : ''}
                                placeholder="ornek@firma.com"
                            />
                            {errors.email && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.email}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Vergi Bilgileri */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="taxNumber">Vergi Numarası</Label>
                            <Input
                                id="taxNumber"
                                value={formData.taxNumber}
                                onChange={(e) => handleChange('taxNumber', e.target.value)}
                                className={errors.taxNumber ? 'border-red-500' : ''}
                                maxLength={10}
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
                                value={formData.taxOffice}
                                onChange={(e) => handleChange('taxOffice', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* İletişim Kişisi Bilgileri */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">İletişim Kişisi Bilgileri</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactPerson">İletişim Kişisi</Label>
                                <Input
                                    id="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPersonPhone">Telefon</Label>
                                <Input
                                    id="contactPersonPhone"
                                    value={formData.contactPersonPhone}
                                    onChange={(e) => handleChange('contactPersonPhone', e.target.value)}
                                    className={errors.contactPersonPhone ? 'border-red-500' : ''}
                                />
                                {errors.contactPersonPhone && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.contactPersonPhone}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPersonEmail">E-posta</Label>
                                <Input
                                    id="contactPersonEmail"
                                    type="email"
                                    value={formData.contactPersonEmail}
                                    onChange={(e) => handleChange('contactPersonEmail', e.target.value)}
                                    className={errors.contactPersonEmail ? 'border-red-500' : ''}
                                />
                                {errors.contactPersonEmail && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.contactPersonEmail}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPersonPosition">Pozisyon</Label>
                                <Input
                                    id="contactPersonPosition"
                                    value={formData.contactPersonPosition}
                                    onChange={(e) => handleChange('contactPersonPosition', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPersonDepartment">Departman</Label>
                                <Input
                                    id="contactPersonDepartment"
                                    value={formData.contactPersonDepartment}
                                    onChange={(e) => handleChange('contactPersonDepartment', e.target.value)}
                                />
                            </div>
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


                    </div>

                    {/* Adres ve Açıklama */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Adres</Label>
                            <textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className={`w-full min-h-[80px] p-2 border rounded-md ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Firma adresini giriniz..."
                            />
                            <div className="text-sm text-gray-500">
                                {formData.address.length}/1000 karakter
                            </div>
                            {errors.address && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.address}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className={`w-full min-h-[100px] p-2 border rounded-md ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Firma hakkında açıklama giriniz..."
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
                    </div>

                    {/* Kullanıcı Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="user">Yetkili Kullanıcı</Label>
                        <Select
                            onValueChange={(value) => handleChange('userId', value as string | null)}
                            value={formData.userId ?? ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Kullanıcı seçin"/>
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
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Firma Oluştur
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateTransportationCompanyForm;