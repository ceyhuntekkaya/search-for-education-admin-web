'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {CreditCard, CreditCardFormData, CreditCardFormErrors} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useCreditCards} from "@/hooks/finance/use-credit-card";
import {useBanks} from "@/hooks/finance/use-bank";
import DeleteComponent from "@/components/ui/DeleteComponent";
import {useRouter} from "next/navigation";
import {MoneyInput, NumberInput} from "@/components/ui/number-input";

interface CreditCardFormProps {
    onSubmit: (arg0: CreditCardFormData) => void;
    selectedCreditCard?: CreditCard | null;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
                                                           onSubmit,
                                                           selectedCreditCard
                                                       }) => {
    const {activeBrand} = useAuthContext();
    const router = useRouter();
    const [formData, setCreditCardFormData] = useState<CreditCardFormData>({
        id: null,
        brandId: activeBrand?.id || null,
        bankId: null,
        owner: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        limitAmount: 0,
        accountCutOffDate: '',
        paymentDate: '',
        used: 0,
        remaining: 0,
        status: EStatus.NEW
    });

    const {
        creditCards,
        deleteCreditCard,
        fetchCreditCards
    } = useCreditCards();

    const {
        banks,
        fetchBanks
    } = useBanks();

    useEffect(() => {
        fetchCreditCards();
        fetchBanks();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    useEffect(() => {
        const loadCreditCard = async () => {
            if (selectedCreditCard) {
                setCreditCardFormData({
                    id: selectedCreditCard.id,
                    brandId: selectedCreditCard.brand.id,
                    bankId: selectedCreditCard.bank.id,
                    owner: selectedCreditCard.owner,
                    cardNumber: selectedCreditCard.cardNumber,
                    expirationDate: selectedCreditCard.expirationDate,
                    cvv: selectedCreditCard.cvv,
                    limitAmount: selectedCreditCard.limitAmount,
                    accountCutOffDate: selectedCreditCard.accountCutOffDate,
                    paymentDate: selectedCreditCard.paymentDate,
                    used: selectedCreditCard.used,
                    remaining: selectedCreditCard.remaining,
                    status: selectedCreditCard.status
                })
            }
        };

        if (selectedCreditCard) {
            loadCreditCard();
        }
    }, [selectedCreditCard]);

    // Kalan limitı otomatik hesapla
    useEffect(() => {
        const calculatedRemaining = formData.limitAmount - formData.used;
        if (calculatedRemaining !== formData.remaining) {
            setCreditCardFormData(prev => ({
                ...prev,
                remaining: calculatedRemaining
            }));
        }
    }, [formData.limitAmount, formData.used]);

    const validateCardNumber = (cardNumber: string) => {
        // Sadece rakamları kontrol et (16 haneli kart numarası)
        const cleanNumber = cardNumber.replace(/\D/g, '');
        return cleanNumber.length === 16;
    };
/*
    const validateExpirationDate = (expDate: string) => {
        // MM/YY formatını kontrol et
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(expDate)) return false;

        const [month, year] = expDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const cardYear = parseInt(year);
        const cardMonth = parseInt(month);

        if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
            return false;
        }

        return true;
    };

 */

    const validateCVV = (cvv: string) => {
        // 3 veya 4 haneli CVV
        const cleanCVV = cvv.replace(/\D/g, '');
        return cleanCVV.length === 3 || cleanCVV.length === 4;
    };

    const validateForm = () => {
        const newErrors: CreditCardFormErrors = {};

        if (!formData.bankId) {
            newErrors.bankId = 'Banka seçimi zorunludur';
        }

        if (!formData.owner.trim()) {
            newErrors.owner = 'Kart sahibi zorunludur';
        }

        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = 'Kart numarası zorunludur';
        } else if (!validateCardNumber(formData.cardNumber)) {
            newErrors.cardNumber = 'Geçerli bir 16 haneli kart numarası giriniz';
        }

        if (!formData.expirationDate.trim()) {
            newErrors.expirationDate = 'Son kullanma tarihi zorunludur';
        }

        if (!formData.cvv.trim()) {
            newErrors.cvv = 'CVV zorunludur';
        } else if (!validateCVV(formData.cvv)) {
            newErrors.cvv = 'Geçerli bir CVV giriniz (3-4 hane)';
        }

        if (formData.limitAmount <= 0) {
            newErrors.limitAmount = 'Limit tutarı sıfırdan büyük olmalıdır';
        }

        if (!formData.accountCutOffDate.trim()) {
            newErrors.accountCutOffDate = 'Hesap kesim tarihi zorunludur';
        }

        if (!formData.paymentDate.trim()) {
            newErrors.paymentDate = 'Ödeme tarihi zorunludur';
        }

        if (formData.used < 0) {
            newErrors.used = 'Kullanılan tutar negatif olamaz';
        }

        if (formData.used > formData.limitAmount) {
            newErrors.used = 'Kullanılan tutar limitten büyük olamaz';
        }

        if (!selectedCreditCard) {
            if (creditCards.some(cc => cc.cardNumber === formData.cardNumber)) {
                newErrors.cardNumber = 'Bu kart numarası zaten kullanımda';
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

    const handleChange = <T extends keyof CreditCardFormData>(
        name: T,
        value: CreditCardFormData[T]
    ) => {
        setCreditCardFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const formatCardNumber = (value: string) => {
        // Sadece rakamları kabul et, 16 haneyle sınırla
        const cleanValue = value.replace(/\D/g, '').slice(0, 16);
        // 4'erli gruplar halinde formatla
        return cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpirationDate = (value: string) => {
        // Sadece rakamları kabul et
        const cleanValue = value.replace(/\D/g, '');
        // MM/YY formatına çevir
        if (cleanValue.length >= 2) {
            return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
        }
        return cleanValue;
    };

    const formatCVV = (value: string) => {
        // Sadece rakamları kabul et, 4 haneyle sınırla
        return value.replace(/\D/g, '').slice(0, 4);
    };


    const handleDelete = () => {
        deleteCreditCard(selectedCreditCard?.id || '').then(() => {
            router.back()
        });
    };

    // Aktif brand'e ait bankaları filtrele
    const filteredBanks = banks.filter(b => b.brand.id === activeBrand?.id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedCreditCard ? 'Kredi Kartı Güncelle' : 'Yeni Kredi Kartı'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bankId">Banka *</Label>
                            <Select
                                onValueChange={(value) => handleChange('bankId', value as string || null)}
                                value={formData.bankId ?? ""}
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
                            {errors.bankId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.bankId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="owner">Kart Sahibi *</Label>
                            <Input
                                id="owner"
                                name="owner"
                                value={formData.owner}
                                onChange={(e) => handleChange('owner', e.target.value.toUpperCase())}
                                className={errors.owner ? 'border-red-500' : ''}
                                placeholder="KART SAHİBİ ADI SOYADI"
                            />
                            {errors.owner && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.owner}</AlertDescription>
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

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="cardNumber">Kart Numarası *</Label>
                            <Input
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={(e) => handleChange('cardNumber', formatCardNumber(e.target.value))}
                                className={errors.cardNumber ? 'border-red-500' : ''}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />
                            {errors.cardNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.cardNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expirationDate">Son Kullanma *</Label>
                            <Input
                                id="expirationDate"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={(e) => handleChange('expirationDate', formatExpirationDate(e.target.value))}
                                className={errors.expirationDate ? 'border-red-500' : ''}
                                placeholder="MM/YY"
                                maxLength={5}
                            />
                            {errors.expirationDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.expirationDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                                id="cvv"
                                name="cvv"
                                type="password"
                                value={formData.cvv}
                                onChange={(e) => handleChange('cvv', formatCVV(e.target.value))}
                                className={errors.cvv ? 'border-red-500' : ''}
                                placeholder="123"
                                maxLength={4}
                            />
                            {errors.cvv && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.cvv}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="limitAmount">Limit Tutarı *</Label>

                            <MoneyInput
                                id="limitAmount"
                                name="limitAmount"
                                value={formData.limitAmount}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('limitAmount', value)
                                }}
                                className={errors.limitAmount ? 'border-red-500' : ''}
                            />




                            {errors.limitAmount && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.limitAmount}</AlertDescription>
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
                            <Label htmlFor="remaining">Kalan Limit</Label>
                            <MoneyInput
                                id="remaining"
                                name="remaining"
                                value={formData.remaining}
                                readOnly
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="accountCutOffDate">Hesap Kesim Tarihi *</Label>
                            <Input
                                id="accountCutOffDate"
                                name="accountCutOffDate"
                                value={formData.accountCutOffDate}
                                onChange={(e) => handleChange('accountCutOffDate', e.target.value)}
                                className={errors.accountCutOffDate ? 'border-red-500' : ''}
                                placeholder="Her ayın kaçında (örn: 15)"
                            />
                            {errors.accountCutOffDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.accountCutOffDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentDate">Ödeme Tarihi *</Label>
                            <Input
                                id="paymentDate"
                                name="paymentDate"
                                value={formData.paymentDate}
                                onChange={(e) => handleChange('paymentDate', e.target.value)}
                                className={errors.paymentDate ? 'border-red-500' : ''}
                                placeholder="Her ayın kaçında (örn: 25)"
                            />
                            {errors.paymentDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.paymentDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="col-span-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <strong>Toplam Limit:</strong> {formData.limitAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                    </div>
                                    <div>
                                        <strong>Kullanılan:</strong> {formData.used.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                    </div>
                                    <div>
                                        <strong>Kalan Limit:</strong> {formData.remaining.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4 flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {selectedCreditCard ? 'Kredi Kartı Güncelle' : 'Kredi Kartı Oluştur'}
                            </Button>
                        </div>
                    </div>
                </form>

                {selectedCreditCard ?
                    <div className="col-span-4 flex justify-end space-x-4 pt-4">
                        <DeleteComponent
                            itemName="Kredi Kartı"
                            onDelete={handleDelete}
                        />
                    </div>
                    : null}
            </CardContent>
        </Card>
    );
};

export default CreditCardForm;