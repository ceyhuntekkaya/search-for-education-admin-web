'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Bank, BankFormData, BankFormErrors} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useBanks} from "@/hooks/finance/use-bank";
import DeleteComponent from "@/components/ui/DeleteComponent";
import {useRouter} from "next/navigation";

interface BankFormProps {
    onSubmit: (arg0: BankFormData) => void;
    selectedBank?: Bank | null;
}

const BankForm: React.FC<BankFormProps> = ({
                                               onSubmit,
                                               selectedBank
                                           }) => {
    const {activeBrand} = useAuthContext();
    const router = useRouter();
    const [formData, setFormData] = useState<BankFormData>({
        id: null,
        name: '',
        swiftCode: '',
        accountingCode: '',
        status: EStatus.NEW,
        brandId: activeBrand?.id || null
    });

    const {
        banks,
        fetchBanks,
        deleteBank
    } = useBanks();

    useEffect(() => {
        fetchBanks();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    useEffect(() => {
        const loadBank = async () => {
            if (selectedBank) {
                setFormData({
                    id: selectedBank.id,
                    name: selectedBank.name,
                    swiftCode: selectedBank.swiftCode,
                    accountingCode: selectedBank.accountingCode,
                    status: selectedBank.status,
                    brandId: selectedBank.brand.id
                })
            }
        };

        if (selectedBank) {
            loadBank();
        }
    }, [selectedBank]);

    const validateForm = () => {
        const newErrors: BankFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Banka adı zorunludur';
        }

        if (!formData.swiftCode.trim()) {
            newErrors.swiftCode = 'Swift kodu zorunludur';
        } else if (formData.swiftCode.length < 2 || formData.swiftCode.length > 11) {
            newErrors.swiftCode = 'Swift kodu 2-11 karakter arasında olmalıdır';
        }

        if (!selectedBank) {
            if (banks.some(b => b.name.toLowerCase() === formData.name.toLowerCase())) {
                newErrors.name = 'Bu banka adı zaten kullanımda';
            } else if (banks.some(b => b.swiftCode.toLowerCase() === formData.swiftCode.toLowerCase())) {
                newErrors.swiftCode = 'Bu swift kodu zaten kullanımda';
            } else if (banks.some(b => b.accountingCode.toLowerCase() === formData.accountingCode.toLowerCase())) {
                newErrors.accountingCode = 'Bu muhasebe kodu zaten kullanımda';
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

    const handleChange = <T extends keyof BankFormData>(
        name: T,
        value: BankFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleDelete = () => {
        deleteBank(selectedBank?.id || '').then(() => {
            router.back()
        });
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedBank ? 'Banka Güncelle' : 'Yeni Banka'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Banka Adı *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Banka adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="swiftCode">Swift Kodu *</Label>
                            <Input
                                id="swiftCode"
                                name="swiftCode"
                                value={formData.swiftCode}
                                onChange={(e) => handleChange('swiftCode', e.target.value.toUpperCase())}
                                className={errors.swiftCode ? 'border-red-500' : ''}
                                placeholder="Örn: TGBATRIS"
                                maxLength={11}
                            />
                            {errors.swiftCode && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.swiftCode}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="accountingCode">Muhasebe Kodu *</Label>
                            <Input
                                id="accountingCode"
                                name="accountingCode"
                                value={formData.accountingCode}
                                onChange={(e) => handleChange('accountingCode', e.target.value)}
                                className={errors.accountingCode ? 'border-red-500' : ''}
                                placeholder="Örn: 100.01"
                            />
                            {errors.accountingCode && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.accountingCode}</AlertDescription>
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
                        <div className="col-span-4 flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {selectedBank ? 'Banka Güncelle ' : 'Banka Oluştur'}
                            </Button>
                        </div>
                    </div>
                </form>

                {selectedBank ?
                    <div className="col-span-4 flex justify-end space-x-4 pt-4">
                        <DeleteComponent
                            itemName="Banka Hesabı"
                            onDelete={handleDelete}
                        />
                    </div>
                    : null}
            </CardContent>
        </Card>
    );
};

export default BankForm;