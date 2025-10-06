'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    BankFormErrors,
    PaymentPlanFormData,
    PaymentPlanInstallmentFormData
} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {NumberInput} from "@/components/ui/number-input";


interface PaymentPlanInstallmentProps {
    onSubmit: (e: React.FormEvent, orderNumber:number) => void;
    selectedPaymentPlanData: PaymentPlanFormData;
    selectedPaymentPlanInstallmentData?: PaymentPlanInstallmentFormData | null;
    handleChangeInstalments: <T extends keyof PaymentPlanInstallmentFormData>(
        name: T,
        value: PaymentPlanInstallmentFormData[T],
        orderIndex: number
    ) => void;
    handleDelete: (orderNumber: number) => void;
    orderNumber: number;
}

const PaymentPlanInstallmentForm: React.FC<PaymentPlanInstallmentProps> = ({
                                                                               onSubmit,
                                                                               selectedPaymentPlanData,
                                                                               selectedPaymentPlanInstallmentData,
                                                                               handleChangeInstalments,
                                                                               handleDelete,
                                                                               orderNumber=0

                                                                           }) => {


    const [formData, setFormData] = useState<PaymentPlanInstallmentFormData>({

        status: EStatus.NEW,
        id: null,
        paymentPlanId: selectedPaymentPlanData.id || '',
        description: '',
        totalAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
        maturityDate: new Date(),
        documentNo: '',


    });


    useEffect(() => {
        if (selectedPaymentPlanInstallmentData) {
            setFormData({
                status: selectedPaymentPlanInstallmentData.status,
                id: selectedPaymentPlanInstallmentData.id,
                paymentPlanId: selectedPaymentPlanData.id || '',
                description: selectedPaymentPlanData.description,
                totalAmount: selectedPaymentPlanInstallmentData.totalAmount,
                paidAmount: selectedPaymentPlanInstallmentData.paidAmount,
                remainingAmount: selectedPaymentPlanInstallmentData.remainingAmount,
                maturityDate: new Date(selectedPaymentPlanInstallmentData.maturityDate || ''),
                documentNo: selectedPaymentPlanData.documentNo,
            })
        }
    }, [selectedPaymentPlanInstallmentData, selectedPaymentPlanData]);





    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();


    const validateForm = () => {
        const newErrors: BankFormErrors = {};


        if (!formData.status) {
            newErrors.status = 'Durum seçimi zorunludur';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(e, orderNumber);
        }
    };



    return (
        <Card>
            <CardHeader>
                <CardTitle>Taksit {orderNumber + 1} :</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Açıklama *</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) => handleChangeInstalments('description', e.target.value,orderNumber)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Açıklama giriniz"
                                disabled={true}
                            />
                            {errors.description && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.description}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="swiftCode">Toplam Tutar *</Label>
                            <NumberInput
                                id="totalAmount"
                                name="totalAmount"
                                value={formData.totalAmount}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChangeInstalments('totalAmount', value, orderNumber)
                                }}
                                className={errors.totalAmount ? 'border-red-500' : ''}
                            />
                            {errors.totalAmount && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.totalAmount}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="swiftCode">Ödenen Tutar *</Label>
                            <NumberInput
                                id="paidAmount"
                                name="paidAmount"
                                value={formData.paidAmount}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChangeInstalments('paidAmount', value, orderNumber)
                                }}
                                className={errors.paidAmount ? 'border-red-500' : ''}
                            />
                            {errors.paidAmount && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.paidAmount}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="swiftCode">Kalan Tutar *</Label>
                            <NumberInput
                                id="remainingAmount"
                                name="remainingAmount"
                                value={formData.remainingAmount}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChangeInstalments('remainingAmount', value, orderNumber)
                                }}
                                className={errors.remainingAmount ? 'border-red-500' : ''}
                            />
                            {errors.remainingAmount && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.remainingAmount}</AlertDescription>
                                </Alert>
                            )}
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="accountingCode">Vade Tarihi *</Label>
                            <Input
                                id="maturityDate"
                                name="maturityDate"
                                type="date"
                                value={formData.maturityDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => {
                                    const dateValue = new Date(e.target.value);
                                    handleChangeInstalments('maturityDate', dateValue, orderNumber);
                                }}
                                className={errors.maturityDate ? 'border-red-500' : ''}
                            />
                            {errors.maturityDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maturityDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Durum *</Label>
                            <Select
                                onValueChange={(value) => handleChangeInstalments('status', value as EStatus,orderNumber)}
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
                            <Label htmlFor="name">Fatura No *</Label>
                            <Input
                                id="documentNo"
                                name="documentNo"
                                value={formData.documentNo || ''}
                                onChange={(e) => handleChangeInstalments('documentNo', e.target.value, orderNumber)}
                                className={errors.documentNo ? 'border-red-500' : ''}
                                disabled={true}
                            />
                            {errors.documentNo && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.documentNo}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="col-span-4 flex justify-end space-x-4 pt-4">
                            {selectedPaymentPlanInstallmentData ?
                                    <button

                                        onClick={()=> handleDelete(orderNumber)}
                                    >TAKSİT SİL</button>
                                : null}
                        </div>
                    </div>
                </form>


            </CardContent>
        </Card>
    );
};

export default PaymentPlanInstallmentForm;