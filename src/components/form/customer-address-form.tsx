'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {CustomerAddress, CustomerAddressFormData, CustomerAddressFormErrors} from "@/types/customer";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ECity, EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useDistrict} from "@/hooks/use-district";

interface CustomerAddressFormProps {
    onSubmit: (arg0: CustomerAddressFormData) => void;
    customerId?: string;
    customerAddress?:CustomerAddress | null;
}

const CreateCustomerAddressForm: React.FC<CustomerAddressFormProps> = ({
                                                                           onSubmit,
                                                                           customerId,
                                                                           customerAddress
                                                                       }) => {
    const [formData, setFormData] = useState<CustomerAddressFormData>({
        id: '',
        city: null,
        district: '',
        name: '',
        status: EStatus.NEW,
        customerId: customerId || '',
        address: ''
    });
    const {filterCityDistrict, cityDistricts} = useDistrict();

    useEffect(() => {
        const loadCustomerAddress = async () => {

            if(customerAddress){

                filterCityDistrict(customerAddress.city + '').then(()=>{
                    setFormData({
                        id: customerAddress.id,
                        city: customerAddress.city || null,
                        name: customerAddress.name || '',
                        status: customerAddress.status,
                        customerId: customerAddress.customer.id || '',
                        address: customerAddress.address || '',
                        district: customerAddress.district +'' || ''
                    })
                });
            }
        };

        if (customerAddress !==null) {
            loadCustomerAddress();
        }
    }, [customerAddress]);


    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    const validateForm = () => {
        const newErrors: CustomerAddressFormErrors = {};
        if (!formData.city) {
            newErrors.city = 'Şehir zorunludur';
        }
        if (formData.district.length < 2) {
            newErrors.district = 'İlçe zorunludur';
        }

        if (formData.name.length < 2) {
            newErrors.name = 'İsim zorunludur';
        }

        if (formData.address.length < 2) {
            newErrors.address = 'Adres zorunludur';
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



    const handleChange = <T extends keyof CustomerAddressFormData>(
        name: T,
        value: CustomerAddressFormData[T]
    ) => {

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };




    return (
        <Card>
            <CardHeader>
                <CardTitle>{
                    customerAddress ? "Adres Güncelle":
                    "Yeni Adres"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        {/* Şehir  */}
                        <div className="space-y-2">
                            <Label htmlFor="city">Şehir *</Label>
                            <Select

                                onValueChange={(value) => {
                                    setFormData({...formData,
                                        district: '',
                                        city: value as ECity
                                    })
                                    filterCityDistrict(value as string);
                                }}
                                value={formData.city ?? ""}
                            >
                                <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Şehir seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {Object.entries(ECity).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
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



                        {/* İlçe  */}
                        <div className="space-y-2">
                            <Label htmlFor="district">İlçe *</Label>
                            <Select
                                onValueChange={(value) => {
                                    handleChange('district', value as string);
                                }}
                                value={formData.district ?? ""}
                            >
                                <SelectTrigger className={errors.district ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="İlçe Seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {cityDistricts.map(district => (
                                        <SelectItem key={district.name} value={district.name}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.district && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.district}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Adres Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Adres Adı *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Adres için bir ad giriniz..."
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

                        <div className="col-span-4 space-y-2">
                            <Label htmlFor="address">Adres *</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className={errors.address ? 'border-red-500' : ''}
                                placeholder="Adresi giriniz"
                            />
                            {errors.address && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.address}</AlertDescription>
                                </Alert>
                            )}
                        </div>




                        <div className="flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {
                                    customerAddress ? "Adres Güncelle":
                                        "Yeni Adres Ekle"}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateCustomerAddressForm;