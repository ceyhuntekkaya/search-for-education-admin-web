'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {CreditInstallment, CreditInstallmentFormData, CreditInstallmentFormErrors} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useCreditInstallments} from "@/hooks/finance/use-credit-installment";
import {useCredits} from "@/hooks/finance/use-credit";
import {NumberInput} from "@/components/ui/number-input";

interface CreditInstallmentFormProps {
    onSubmit: (arg0: CreditInstallmentFormData) => void;
    selectedCreditInstallment?: CreditInstallment | null;
    creditId: string ;
}

const CreditInstallmentForm: React.FC<CreditInstallmentFormProps> = ({
                                                                         onSubmit,
                                                                         selectedCreditInstallment,
                                                                         creditId
                                                                     }) => {
    const {activeBrand} = useAuthContext();
    const [formData, setFormData] = useState<CreditInstallmentFormData>({
        id: null,
        creditId: null,
        creditInstallmentDate: null,
        installmentNo: 0,
        principal: 0,
        interest: 0,
        bsmv: 0,
        paidAmount: 0,
        paid: 0,
        remaining: 0,
        status: EStatus.NEW
    });

    const {
        creditInstallments,
        fetchCreditInstallmentsByCreditId
    } = useCreditInstallments();

    const {
        credits,
        fetchCredits
    } = useCredits();

    useEffect(() => {
        fetchCreditInstallmentsByCreditId(creditId);
        fetchCredits();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    useEffect(() => {
        const loadCreditInstallment = async () => {
            if (selectedCreditInstallment) {
                setFormData({
                    id: selectedCreditInstallment.id,
                    creditId: selectedCreditInstallment.credit.id,
                    creditInstallmentDate: selectedCreditInstallment.creditInstallmentDate ? new Date(selectedCreditInstallment.creditInstallmentDate) : null,
                    installmentNo: selectedCreditInstallment.installmentNo,
                    principal: selectedCreditInstallment.principal,
                    interest: selectedCreditInstallment.interest,
                    bsmv: selectedCreditInstallment.bsmv,
                    paidAmount: selectedCreditInstallment.paidAmount,
                    paid: selectedCreditInstallment.paid,
                    remaining: selectedCreditInstallment.remaining,
                    status: selectedCreditInstallment.status
                })
            }
        };

        if (selectedCreditInstallment) {
            loadCreditInstallment();
        }
    }, [selectedCreditInstallment]);

    // Taksit tutarını otomatik hesapla
    useEffect(() => {
        const calculatedPaidAmount = formData.principal + formData.interest + formData.bsmv;
        if (calculatedPaidAmount !== formData.paidAmount) {
            setFormData(prev => ({
                ...prev,
                paidAmount: calculatedPaidAmount
            }));
        }
    }, [formData.principal, formData.interest, formData.bsmv]);

    // Kalan tutarı otomatik hesapla
    useEffect(() => {
        const calculatedRemaining = formData.paidAmount - formData.paid;
        if (calculatedRemaining !== formData.remaining) {
            setFormData(prev => ({
                ...prev,
                remaining: calculatedRemaining
            }));
        }
    }, [formData.paidAmount, formData.paid]);

    const validateForm = () => {
        const newErrors: CreditInstallmentFormErrors = {};

        if (!formData.creditId) {
            newErrors.creditId = 'Kredi seçimi zorunludur';
        }

        if (!formData.creditInstallmentDate) {
            newErrors.creditInstallmentDate = 'Taksit tarihi zorunludur';
        }

        if (formData.installmentNo <= 0) {
            newErrors.installmentNo = 'Taksit numarası sıfırdan büyük olmalıdır';
        }

        if (formData.principal < 0) {
            newErrors.principal = 'Ana para negatif olamaz';
        }

        if (formData.interest < 0) {
            newErrors.interest = 'Faiz tutarı negatif olamaz';
        }

        if (formData.bsmv < 0) {
            newErrors.bsmv = 'BSMV negatif olamaz';
        }

        if (formData.paid < 0) {
            newErrors.paid = 'Ödenen tutar negatif olamaz';
        }

        if (formData.paid > formData.paidAmount) {
            newErrors.paid = 'Ödenen tutar taksit tutarından büyük olamaz';
        }

        if (!selectedCreditInstallment) {
            if (creditInstallments.some(ci => ci.credit.id === formData.creditId && ci.installmentNo === formData.installmentNo)) {
                newErrors.installmentNo = 'Bu kredi için bu taksit numarası zaten kullanımda';
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

    const handleChange = <T extends keyof CreditInstallmentFormData>(
        name: T,
        value: CreditInstallmentFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleDateChange = (value: string) => {
        const dateValue = value ? new Date(value) : null;
        handleChange('creditInstallmentDate', dateValue);
    };

    const formatDateForInput = (date: Date | null) => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    // Aktif brand'e ait kredileri filtrele
    const filteredCredits = credits.filter(c => c.brand.id === activeBrand?.id);

    // Seçilen kredinin bilgilerini al
    const selectedCredit = formData.creditId ? credits.find(c => c.id === formData.creditId) : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedCreditInstallment ? 'Kredi Taksiti Güncelle' : 'Yeni Kredi Taksiti'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="creditId">Kredi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('creditId', value as string | null)}
                                value={formData.creditId ?? ""}
                            >
                                <SelectTrigger className={errors.creditId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Kredi seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {filteredCredits.map((credit) => (
                                        <SelectItem key={credit.id} value={credit.id}>
                                            {`${credit.name} - ${credit.bank.name}`}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.creditId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.creditId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="installmentNo">Taksit No *</Label>


                            <NumberInput
                                inputType="number"
                                value={formData.installmentNo}
                                onChange={(value) => handleChange('installmentNo', value)}
                                decimalPlaces={0}
                                minValue={1}
                                className={errors.installmentNo ? 'border-red-500' : ''}
                            />

                            {errors.installmentNo && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.installmentNo}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="creditInstallmentDate">Taksit Tarihi *</Label>
                            <Input
                                id="creditInstallmentDate"
                                name="creditInstallmentDate"
                                type="date"
                                value={formatDateForInput(formData.creditInstallmentDate)}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className={errors.creditInstallmentDate ? 'border-red-500' : ''}
                            />
                            {errors.creditInstallmentDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.creditInstallmentDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="principal">Ana Para *</Label>


                            <NumberInput
                                id="principal"
                                name="principal"
                                value={formData.principal}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('principal', value)
                                }}
                                className={errors.principal ? 'border-red-500' : ''}
                            />



                            {errors.principal && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.principal}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interest">Faiz Tutarı *</Label>

                            <NumberInput
                                id="interest"
                                name="interest"
                                value={formData.interest}
                                minValue={0}
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('interest', value)
                                }}
                                className={errors.interest ? 'border-red-500' : ''}
                            />



                            {errors.interest && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.interest}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bsmv">BSMV *</Label>

                            <NumberInput
                                id="bsmv"
                                name="bsmv"
                                value={formData.bsmv}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('bsmv', value)
                                }}
                                className={errors.bsmv ? 'border-red-500' : ''}
                            />
                            {errors.bsmv && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.bsmv}</AlertDescription>
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
                            <Label htmlFor="paidAmount">Taksit Tutarı</Label>

                            <NumberInput
                                id="paidAmount"
                                name="paidAmount"
                                value={formData.paidAmount}
                                readOnly
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paid">Ödenen Tutar *</Label>


                            <NumberInput
                                id="paid"
                                name="paid"
                                value={formData.paid}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('paid', value)
                                }}
                                className={errors.paid ? 'border-red-500' : ''}
                            />


                            {errors.paid && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.paid}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="remaining">Kalan Tutar</Label>

                            <NumberInput
                                id="remaining"
                                name="remaining"
                                value={formData.remaining}
                                readOnly
                                className="bg-gray-100"
                            />
                        </div>

                        {selectedCredit && (
                            <div className="col-span-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Seçilen Kredi Bilgileri</h4>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <strong>Kredi Adı:</strong> {selectedCredit.name}
                                        </div>
                                        <div>
                                            <strong>Banka:</strong> {selectedCredit.bank.name}
                                        </div>
                                        <div>
                                            <strong>Toplam Taksit:</strong> {selectedCredit.numberOfInstallments}
                                        </div>
                                        <div>
                                            <strong>Ana Para:</strong> {selectedCredit.principal.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                        </div>
                                        <div>
                                            <strong>Faiz Oranı:</strong> %{selectedCredit.interestRate}
                                        </div>
                                        <div>
                                            <strong>Ödenen:</strong> {selectedCredit.paidAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="col-span-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <strong>Taksit Tutarı:</strong> {formData.paidAmount && formData.paidAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                    </div>
                                    <div>
                                        <strong>Ödenen:</strong> {formData.paid && formData.paid.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                    </div>
                                    <div>
                                        <strong>Kalan:</strong> {formData.remaining && formData.remaining.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4 flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {selectedCreditInstallment ? 'Kredi Taksiti Güncelle' : 'Kredi Taksiti Oluştur'}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreditInstallmentForm;