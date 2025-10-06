'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {BankCheck, BankCheckFormData, BankCheckFormErrors} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useBankChecks} from "@/hooks/finance/use-bank-check";
import {useBanks} from "@/hooks/finance/use-bank";
import DeleteComponent from "@/components/ui/DeleteComponent";
import {useRouter} from "next/navigation";
import {NumberInput} from "@/components/ui/number-input";

interface BankCheckFormProps {
    onSubmit: (arg0: BankCheckFormData) => void;
    selectedBankCheck?: BankCheck | null;
}

const BankCheckForm: React.FC<BankCheckFormProps> = ({
                                                         onSubmit,
                                                         selectedBankCheck
                                                     }) => {
    const {activeBrand} = useAuthContext();
    const router = useRouter();
    const [formData, setFormData] = useState<BankCheckFormData>({
        id: null,
        serialNumber: '',
        bankName: '',
        amount: 0,
        dueDate: '',
        issuer: '',
        bankForCollection: '',
        checkType: '',
        status: EStatus.NEW,
        brandId: activeBrand?.id || null,
        bankId: null,
        useDate: null,
        description: '',
        cashingDate: null,
        cashingAmount: 0,


    });

    const {
        bankChecks,
        fetchBankChecks,
        deleteBankCheck
    } = useBankChecks();

    useEffect(() => {
        fetchBankChecks();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();


    const {
        banks,
        fetchBanks
    } = useBanks();

    useEffect(() => {
        fetchBanks();
    }, []);


    useEffect(() => {
        const loadBankCheck = async () => {
            if (selectedBankCheck) {
                setFormData({
                    id: selectedBankCheck.id,
                    serialNumber: selectedBankCheck.serialNumber,
                    bankName: selectedBankCheck.bankName,
                    amount: selectedBankCheck.amount,
                    dueDate: selectedBankCheck.dueDate,
                    issuer: selectedBankCheck.issuer,
                    bankForCollection: selectedBankCheck.bankForCollection,
                    checkType: selectedBankCheck.checkType,
                    status: selectedBankCheck.status,
                    brandId: selectedBankCheck.brand.id,
                    bankId: selectedBankCheck.bank?.id || null,
                    useDate: selectedBankCheck.useDate,
                    description: selectedBankCheck.description,
                    cashingDate: selectedBankCheck.cashingDate,
                    cashingAmount: selectedBankCheck.cashingAmount
                })
            }
        };

        if (selectedBankCheck) {
            loadBankCheck();
        }
    }, [selectedBankCheck]);

    const checkTypes = [
        {value: 'GIVEN', label: 'Verilen Çek'},
        {value: 'RECEIVED', label: 'Alınan Çek'}
    ];

    const validateForm = () => {
        const newErrors: BankCheckFormErrors = {};

        if (!formData.serialNumber.trim()) {
            newErrors.serialNumber = 'Seri numarası zorunludur';
        }




        if (formData.amount <= 0 || isNaN(formData.amount)) {
            newErrors.amount = 'Tutar zorunludur';
        } else {
            const numericAmount = formData.amount;
            if (isNaN(numericAmount) || numericAmount <= 0) {
                newErrors.amount = 'Geçerli bir tutar giriniz';
            }
        }

        if (!formData.dueDate.trim()) {
            newErrors.dueDate = 'Vade tarihi zorunludur';
        } else {
            const selectedDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.dueDate = 'Vade tarihi bugünden önce olamaz';
            }
        }

        if (!formData.issuer.trim()) {
            newErrors.issuer = 'Düzenleyen zorunludur';
        }
        /*
                if (!formData.bankForCollection.trim()) {
                    newErrors.bankForCollection = 'Tahsil bankası zorunludur';
                }


         */
        if (!formData.checkType.trim()) {
            newErrors.checkType = 'Çek türü seçimi zorunludur';
        }

        if (!selectedBankCheck) {
            if (bankChecks.some(bc => bc.serialNumber === formData.serialNumber && bc.bankName.toLowerCase() === formData.bankName.toLowerCase())) {
                newErrors.serialNumber = 'Bu seri numarası ve banka kombinasyonu zaten kullanımda';
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

    const handleDelete = () => {
        deleteBankCheck(selectedBankCheck?.id || '').then(() => {
            router.back()
        });
    };


    const handleChange = <T extends keyof BankCheckFormData>(
        name: T,
        value: BankCheckFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const filteredBanks = banks.filter(b => b.brand.id === activeBrand?.id);
    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedBankCheck ? 'Banka Çeki Güncelle' : 'Yeni Banka Çeki'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="serialNumber">Seri Numarası *</Label>
                            <Input
                                id="serialNumber"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={(e) => handleChange('serialNumber', e.target.value)}
                                className={errors.serialNumber ? 'border-red-500' : ''}
                                placeholder="Örn: 1234567"
                            />
                            {errors.serialNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.serialNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bankName">Banka Adı *</Label>


                            <Select
                                onValueChange={(value) => handleChange('bankId', value as string)}
                                value={formData.bankId ?? ""}
                                searchable={true}
                            >
                                <SelectTrigger className={errors.bankId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Banka seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filteredBanks.map((bank) => (
                                            <SelectItem key={bank.id} value={bank.id}>
                                                {bank.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>


                            {errors.bankName && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.bankName}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Tutar *</Label>

                            <NumberInput
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
                            <Label htmlFor="dueDate">Vade Tarihi *</Label>
                            <Input
                                id="dueDate"
                                name="dueDate"
                                type="date"
                                value={formData.dueDate.toString() || ''}
                                onChange={(e) => {
                                    handleChange('dueDate', e.target.value);
                                }}


                                className={errors.dueDate ? 'border-red-500' : ''}
                            />
                            {errors.dueDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.dueDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="issuer">Düzenleyen *</Label>
                            <Input
                                id="issuer"
                                name="issuer"
                                value={formData.issuer}
                                onChange={(e) => handleChange('issuer', e.target.value)}
                                className={errors.issuer ? 'border-red-500' : ''}
                                placeholder="Çeki düzenleyen kişi/kurum"
                            />
                            {errors.issuer && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.issuer}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="checkType">Çek Türü *</Label>
                            <Select
                                onValueChange={(value) => handleChange('checkType', value as string)}
                                value={formData.checkType}
                            >
                                <SelectTrigger className={errors.checkType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Çek türü seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {checkTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.checkType && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.checkType}</AlertDescription>
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
                            <Label htmlFor="bankForCollection">Tahsil Bankası *</Label>
                            <Input
                                id="bankForCollection"
                                name="bankForCollection"
                                value={formData.bankForCollection}
                                onChange={(e) => handleChange('bankForCollection', e.target.value)}
                                className={errors.bankForCollection ? 'border-red-500' : ''}
                                placeholder="Çekin tahsil edileceği banka"
                            />
                            {errors.bankForCollection && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.bankForCollection}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="useDate">Kullanım Tarihi *</Label>
                            <Input
                                id="useDate"
                                name="useDate"
                                type="date"
                                value={formData.useDate ? formData.useDate.toString() : ''}
                                onChange={(e) => {
                                    handleChange('useDate', e.target.value);
                                }}


                                className={errors.useDate ? 'border-red-500' : ''}
                            />
                            {errors.useDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.useDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cashingDate">Bozdurma Tarihi *</Label>
                            <Input
                                id="cashingDate"
                                name="cashingDate"
                                type="date"
                                value={formData.cashingDate ? formData.cashingDate.toString() : ''}
                                onChange={(e) => {
                                    handleChange('cashingDate', e.target.value);
                                }}


                                className={errors.cashingDate ? 'border-red-500' : ''}
                            />
                            {errors.cashingDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.cashingDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="cashingAmount">Bozdurma tutarı *</Label>
                            <Input
                                id="cashingAmount"
                                name="cashingAmount"
                                value={formData.cashingAmount || ''}
                                onChange={(e) => handleChange('cashingAmount', Number(e.target.value))}
                                className={errors.cashingAmount ? 'border-red-500' : ''}
                                placeholder="0,00"
                            />
                            {errors.cashingAmount && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.cashingAmount}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        <div className="space-y-2 col-span-4">
                            <Label htmlFor="bankForCollection">Açıklama *</Label>
                            <Input
                                id="bankForCollection"
                                name="bankForCollection"
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className={errors.description ? 'border-red-500' : ''}
                                placeholder="Çekin tahsil edileceği banka"
                            />
                            {errors.description && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.description}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        <div className="col-span-4 flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {selectedBankCheck ? 'Banka Çeki Güncelle' : 'Banka Çeki Oluştur'}
                            </Button>
                        </div>
                    </div>
                </form>

                {selectedBankCheck ?
                    <div className="col-span-4 flex justify-end space-x-4 pt-4">
                        <DeleteComponent
                            itemName="Banka Çeki"
                            onDelete={handleDelete}
                        />
                    </div>
                    : null}

            </CardContent>
        </Card>
    );
};

export default BankCheckForm;