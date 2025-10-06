'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {AdditionalAccount, AdditionalAccountFormData, AdditionalAccountFormErrors} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useAdditionalAccounts} from "@/hooks/finance/use-additional-account";
import {useBankAccounts} from "@/hooks/finance/use-bank-account";
import {MoneyInput, NumberInput} from "@/components/ui/number-input";

interface AdditionalAccountFormProps {
    onSubmit: (arg0: AdditionalAccountFormData) => void;
    selectedAdditionalAccount?: AdditionalAccount | null;
}

const AdditionalAccountForm: React.FC<AdditionalAccountFormProps> = ({
                                                                         onSubmit,
                                                                         selectedAdditionalAccount
                                                                     }) => {
    const {activeBrand} = useAuthContext();


    const [formData, setFormData] = useState<AdditionalAccountFormData>({
        id: null,
        bankAccountId: null,
        amount: 0,
        used: 0,
        remaining: 0,
        status: EStatus.NEW,
    });

    const {
        additionalAccounts,
        fetchAdditionalAccounts
    } = useAdditionalAccounts();

    const {
        bankAccounts,
        fetchBankAccounts
    } = useBankAccounts();

    useEffect(() => {
        fetchAdditionalAccounts();
        fetchBankAccounts();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    useEffect(() => {
        const loadAdditionalAccount = async () => {
            if (selectedAdditionalAccount) {
                setFormData({
                    id: selectedAdditionalAccount.id,
                    bankAccountId: selectedAdditionalAccount.bankAccount.id,
                    amount: selectedAdditionalAccount.amount,
                    used: selectedAdditionalAccount.used,
                    remaining: selectedAdditionalAccount.remaining,
                    status: selectedAdditionalAccount.status,
                })
            }
        };

        if (selectedAdditionalAccount) {
            loadAdditionalAccount();
        }
    }, [selectedAdditionalAccount]);

    // Tutar değiştiğinde kalan tutarı otomatik hesapla
    useEffect(() => {
        const newRemaining = formData.amount - formData.used;
        if (newRemaining !== formData.remaining) {
            setFormData(prev => ({
                ...prev,
                remaining: newRemaining
            }));
        }
    }, [formData.amount, formData.used]);

    const validateForm = () => {
        const newErrors: AdditionalAccountFormErrors = {};

        if (!formData.bankAccountId) {
            newErrors.bankAccountId = 'Banka hesabı seçimi zorunludur';
        }

        if (formData.amount <= 0) {
            newErrors.amount = 'Tutar sıfırdan büyük olmalıdır';
        }

        if (formData.used < 0) {
            newErrors.used = 'Kullanılan tutar negatif olamaz';
        }

        if (formData.used > formData.amount) {
            newErrors.used = 'Kullanılan tutar toplam tutardan büyük olamaz';
        }

        if (!selectedAdditionalAccount) {
            if (additionalAccounts.some(aa => aa.bankAccount.id === formData.bankAccountId)) {
                newErrors.bankAccountId = 'Bu banka hesabı için zaten ek hesap tanımlanmış';
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

    const handleChange = <T extends keyof AdditionalAccountFormData>(
        name: T,
        value: AdditionalAccountFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    // Aktif brand'e ait banka hesaplarını filtrele
    const filteredBankAccounts = bankAccounts.filter(ba => ba.brand.id === activeBrand?.id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedAdditionalAccount ? 'Ek Hesap Güncelle' : 'Yeni Ek Hesap'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="bankAccountId">Banka Hesabı *</Label>
                            <Select
                                onValueChange={(value) => handleChange('bankAccountId', value as string || null)}
                                value={formData.bankAccountId ?? ""}
                            >
                                <SelectTrigger className={errors.bankAccountId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Banka hesabı seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filteredBankAccounts.map((bankAccount) => (
                                            <SelectItem key={bankAccount.id} value={bankAccount.id}>
                                                {`${bankAccount.accountDescription} - ${bankAccount.accountCode}`}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.bankAccountId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.bankAccountId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Tutar *</Label>


                            <MoneyInput
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('amount', value)
                                }}
                                className={errors.amount ? 'border-red-500' : ''}
                            />





                            {errors.amount && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.amount}</AlertDescription>
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

                        <div className="space-y-2">
                            <Label htmlFor="used">Kullanılan Tutar *</Label>


                            <NumberInput
                                id="used"
                                name="used"
                                value={formData.used}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('used', value)
                                }}
                                className={errors.used ? 'border-red-500' : ''}
                            />



                            {errors.used && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.used}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="remaining">Kalan Tutar</Label>

                            <MoneyInput
                                id="remaining"
                                name="remaining"
                                value={formData.remaining}
                                readOnly
                                className="bg-gray-100"
                            />


                        </div>

                        <div className="col-span-4 flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {selectedAdditionalAccount ? 'Ek Hesap Güncelle' : 'Ek Hesap Oluştur'}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default AdditionalAccountForm;