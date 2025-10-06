'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {LetterOfGuarantee, LetterOfGuaranteeFormData, LetterOfGuaranteeFormErrors} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useLetterOfGuarantees} from "@/hooks/finance/use-letter-of-guarantee";
import {useBanks} from "@/hooks/finance/use-bank";
import {useRouter} from "next/navigation";
import DeleteComponent from "@/components/ui/DeleteComponent";
import {NumberInput} from "@/components/ui/number-input";

interface LetterOfGuaranteeFormProps {
    onSubmit: (arg0: LetterOfGuaranteeFormData) => void;
    selectedLetterOfGuarantee?: LetterOfGuarantee | null;
}

const LetterOfGuaranteeForm: React.FC<LetterOfGuaranteeFormProps> = ({
                                                                         onSubmit,
                                                                         selectedLetterOfGuarantee
                                                                     }) => {
    const {activeBrand} = useAuthContext();
    const router = useRouter();
    const [formData, setFormData] = useState<LetterOfGuaranteeFormData>({
        id: null,
        brandId: activeBrand?.id || null,
        bankId: null,
        interlocutor: '',
        letterNumber: '',
        letterDate: null,
        duration: null,
        amount: 0,
        status: EStatus.NEW
    });

    const {
        letterOfGuarantees,
        fetchLetterOfGuarantees,
        deleteLetterOfGuarantee
    } = useLetterOfGuarantees();

    const {
        banks,
        fetchBanks
    } = useBanks();

    useEffect(() => {
        fetchLetterOfGuarantees();
        fetchBanks();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    useEffect(() => {
        const loadLetterOfGuarantee = async () => {
            if (selectedLetterOfGuarantee) {
                setFormData({
                    id: selectedLetterOfGuarantee.id,
                    brandId: selectedLetterOfGuarantee.brand.id,
                    bankId: selectedLetterOfGuarantee.bank.id,
                    interlocutor: selectedLetterOfGuarantee.interlocutor,
                    letterNumber: selectedLetterOfGuarantee.letterNumber,
                    letterDate: selectedLetterOfGuarantee.letterDate ? selectedLetterOfGuarantee.letterDate : null,
                    duration: selectedLetterOfGuarantee.duration ? selectedLetterOfGuarantee.duration : null,
                    amount: selectedLetterOfGuarantee.amount,
                    status: selectedLetterOfGuarantee.status
                })
            }
        };

        if (selectedLetterOfGuarantee) {
            loadLetterOfGuarantee();
        }
    }, [selectedLetterOfGuarantee]);

    const validateForm = () => {
        const newErrors: LetterOfGuaranteeFormErrors = {};

        if (!formData.bankId) {
            newErrors.bankId = 'Banka seçimi zorunludur';
        }

        if (!formData.interlocutor.trim()) {
            newErrors.interlocutor = 'Muhatap zorunludur';
        }

        if (!formData.letterNumber.trim()) {
            newErrors.letterNumber = 'Teminat mektubu numarası zorunludur';
        }

        if (!formData.letterDate) {
            newErrors.letterDate = 'Teminat mektubu tarihi zorunludur';
        }
/*
        if (!formData.duration) {
            newErrors.duration = 'Vade tarihi zorunludur';
        } else if (formData.letterDate && new Date(formData.duration) <= new Date(formData.letterDate)) {
            newErrors.duration = 'Vade tarihi, teminat mektubu tarihinden sonra olmalıdır';
        }



    */



        if (formData.amount <= 0) {
            newErrors.amount = 'Tutar sıfırdan büyük olmalıdır';
        }

        if (!selectedLetterOfGuarantee) {
            if (letterOfGuarantees.some(log => log.letterNumber === formData.letterNumber && log.bank.id === formData.bankId)) {
                newErrors.letterNumber = 'Bu teminat mektubu numarası seçilen banka için zaten kullanımda';
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

    const handleChange = <T extends keyof LetterOfGuaranteeFormData>(
        name: T,
        value: LetterOfGuaranteeFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleDelete = () => {
        deleteLetterOfGuarantee(selectedLetterOfGuarantee?.id || '').then(() => {
            router.back()
        });
    };


    // Aktif brand'e ait bankaları filtrele
    const filteredBanks = banks.filter(b => b.brand.id === activeBrand?.id);

    // Süre hesaplama (gün olarak)
    const calculateDuration = () => {
        if (formData.letterDate && formData.duration) {
            const diffTime = new Date(formData.duration).getTime() - new Date(formData.letterDate).getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 0;
        }
        return 0;
    };

    const durationInDays = calculateDuration();

    // Vade durumu kontrolü
    const isExpired = formData.duration ? new Date(formData.duration) < new Date() : false;
    const isExpiringSoon = formData.duration ? (new Date(formData.duration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 30 : false;


    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedLetterOfGuarantee ? 'Teminat Mektubu Güncelle' : 'Yeni Teminat Mektubu'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bankId">Banka *</Label>
                            <Select
                                onValueChange={(value) => handleChange('bankId', value as string | null)}
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
                            <Label htmlFor="interlocutor">Muhatap *</Label>
                            <Input
                                id="interlocutor"
                                name="interlocutor"
                                value={formData.interlocutor}
                                onChange={(e) => handleChange('interlocutor', e.target.value)}
                                className={errors.interlocutor ? 'border-red-500' : ''}
                                placeholder="Teminat mektubunun verildiği kurum/kişi"
                            />
                            {errors.interlocutor && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.interlocutor}</AlertDescription>
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
                            <Label htmlFor="letterNumber">Teminat Mektubu Numarası *</Label>
                            <Input
                                id="letterNumber"
                                name="letterNumber"
                                value={formData.letterNumber}
                                onChange={(e) => handleChange('letterNumber', e.target.value)}
                                className={errors.letterNumber ? 'border-red-500' : ''}
                                placeholder="Örn: TM2024001"
                            />
                            {errors.letterNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.letterNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="letterDate">Teminat Mektubu Tarihi *</Label>
                            <Input
                                id="letterDate"
                                name="letterDate"
                                type="date"
                                value={formData.letterDate || ''}
                                onChange={(e) => handleChange('letterDate', e.target.value)}
                                className={errors.letterDate ? 'border-red-500' : ''}
                            />
                            {errors.letterDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.letterDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Vade Tarihi *</Label>
                            <Input
                                id="duration"
                                name="duration"
                                type="date"
                                value={formData.duration || ''}
                                onChange={(e) => handleChange('duration', e.target.value)}
                                className={errors.duration ? 'border-red-500' : ''}
                            />
                            {errors.duration && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.duration}</AlertDescription>
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
                            <Label>Süre (Gün)</Label>
                            <NumberInput
                                inputType="distance"
                                id="distance"
                                name="distance"
                                value={durationInDays}
                                unit="gün"
                                readOnly
                                className="bg-gray-100"
                            />
                        </div>

                        {(isExpired || isExpiringSoon) && (
                            <div className="col-span-4">
                                <Alert variant={isExpired ? "destructive" : "default"}
                                       className={isExpired ? "" : "border-yellow-500 bg-yellow-50"}>
                                    <AlertDescription>
                                        {isExpired
                                            ? "⚠️ Bu teminat mektubu süresi dolmuştur!"
                                            : "⚠️ Bu teminat mektubunun süresi 30 gün içinde dolacaktır!"
                                        }
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        <div className="col-span-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Teminat Mektubu Bilgileri</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <strong>Tutar:</strong> {formData.amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                    </div>
                                    <div>
                                        <strong>Süre:</strong> {durationInDays} gün
                                    </div>
                                    {formData.letterDate && (
                                        <div>
                                            <strong>Başlangıç:</strong> {new Date(formData.letterDate).toLocaleDateString('tr-TR')}
                                        </div>
                                    )}
                                    {formData.duration && (
                                        <div>
                                            <strong>Bitiş:</strong> {new Date(formData.duration).toLocaleDateString('tr-TR')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4 flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {selectedLetterOfGuarantee ? 'Teminat Mektubu Güncelle' : 'Teminat Mektubu Oluştur'}
                            </Button>
                        </div>
                    </div>
                </form>

                {selectedLetterOfGuarantee ?
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

export default LetterOfGuaranteeForm;