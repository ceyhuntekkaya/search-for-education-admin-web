'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {BankAccount, BankAccountFormData, BankAccountFormErrors} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useBankAccounts} from "@/hooks/finance/use-bank-account";

interface BankAccountFormProps {
    onSubmit: (arg0: BankAccountFormData) => void;
    selectedBankAccount?: BankAccount | null;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({
                                                             onSubmit,
                                                             selectedBankAccount
                                                         }) => {
    const {activeBrand} = useAuthContext();
    const [formData, setFormData] = useState<BankAccountFormData>({
        id: null,
        branchName: '',
        branchCode: '',
        iban: '',
        accountNumber: '',
        status: EStatus.NEW,
        brandId: activeBrand?.id || null
    });

    const {
        bankAccounts,
        fetchBankAccounts
    } = useBankAccounts();

    useEffect(() => {
        fetchBankAccounts();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    useEffect(() => {
        const loadBankAccount = async () => {
            if (selectedBankAccount) {
                setFormData({
                    id: selectedBankAccount.id,
                    branchName: selectedBankAccount.branchName,
                    branchCode: selectedBankAccount.branchCode,
                    iban: selectedBankAccount.iban,
                    accountNumber: selectedBankAccount.accountNumber,
                    status: selectedBankAccount.status,
                    brandId: selectedBankAccount.brand.id
                })
            }
        };

        if (selectedBankAccount) {
            loadBankAccount();
        }
    }, [selectedBankAccount]);

    const validateIban = (iban: string) => {
        // TR IBAN formatı: TR + 2 kontrol rakamı + 5 banka kodu + 1 kontrol + 16 hesap numarası = 26 karakter
        const ibanRegex = /^TR\d{24}$/;
        return ibanRegex.test(iban);
    };

    const validateForm = () => {
        const newErrors: BankAccountFormErrors = {};

        if (!formData.branchName.trim()) {
            newErrors.branchName = 'Şube adı zorunludur';
        }

        if (!formData.branchCode.trim()) {
            newErrors.branchCode = 'Şube kodu zorunludur';
        }

        if (!formData.iban.trim()) {
            newErrors.iban = 'IBAN zorunludur';
        } else if (!validateIban(formData.iban)) {
            newErrors.iban = 'Geçerli bir TR IBAN giriniz (26 karakter)';
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = 'Hesap numarası zorunludur';
        }

        if (!selectedBankAccount) {
            if (bankAccounts.some(ba => ba.iban === formData.iban)) {
                newErrors.iban = 'Bu IBAN zaten kullanımda';
            }
            else if (bankAccounts.some(ba => ba.accountNumber === formData.accountNumber)) {
                newErrors.accountNumber = 'Bu hesap numarası zaten kullanımda';
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

    const handleChange = <T extends keyof BankAccountFormData>(
        name: T,
        value: BankAccountFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIbanChange = (value: string) => {
        // IBAN'ı büyük harfe çevir ve boşlukları kaldır
        const cleanValue = value.toUpperCase().replace(/\s/g, '');
        handleChange('iban', cleanValue);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedBankAccount ? 'Banka Hesabı Güncelle' : 'Yeni Banka Hesabı'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="branchName">Şube Adı *</Label>
                            <Input
                                id="branchName"
                                name="branchName"
                                value={formData.branchName}
                                onChange={(e) => handleChange('branchName', e.target.value)}
                                className={errors.branchName ? 'border-red-500' : ''}
                                placeholder="Şube adını giriniz"
                            />
                            {errors.branchName && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.branchName}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="branchCode">Şube Kodu *</Label>
                            <Input
                                id="branchCode"
                                name="branchCode"
                                value={formData.branchCode}
                                onChange={(e) => handleChange('branchCode', e.target.value)}
                                className={errors.branchCode ? 'border-red-500' : ''}
                                placeholder="Örn: 1234"
                            />
                            {errors.branchCode && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.branchCode}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="iban">IBAN *</Label>
                            <Input
                                id="iban"
                                name="iban"
                                value={formData.iban}
                                onChange={(e) => handleIbanChange(e.target.value)}
                                className={errors.iban ? 'border-red-500' : ''}
                                placeholder="TR00 0000 0000 0000 0000 0000 00"
                                maxLength={26}
                            />
                            {errors.iban && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.iban}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="accountNumber">Hesap Numarası *</Label>
                            <Input
                                id="accountNumber"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={(e) => handleChange('accountNumber', e.target.value)}
                                className={errors.accountNumber ? 'border-red-500' : ''}
                                placeholder="Hesap numarasını giriniz"
                            />
                            {errors.accountNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.accountNumber}</AlertDescription>
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
                                {selectedBankAccount ? 'Banka Hesabı Güncelle' : 'Banka Hesabı Oluştur'}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default BankAccountForm;