'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
    PaymentPlanDataDto,
    PaymentPlanFormData, PaymentPlanFormErrors,
    PaymentPlanGroupFormData,
    PaymentPlanInstallmentFormData
} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import DeleteComponent from "@/components/ui/DeleteComponent";
import {useRouter} from "next/navigation";
import {useCustomers} from "@/hooks/use-customer";
import {usePaymentPlans} from "@/hooks/finance/use-payment-plan";
import {NumberInput} from "@/components/ui/number-input";
import PaymentPlanFormInstallment from "@/components/finance/payment-plan-form-installment";


interface PaymentPlanProps {
    onSubmit: (arg0: PaymentPlanDataDto) => void;
    selectedPaymentPlanData?: PaymentPlanDataDto | null;
    paymentPlanGroupId?: string | null;
    paymentPlanInstallments?: PaymentPlanInstallmentFormData[];
    paymentPlanType: string | null;
}

const PaymentPlanForm: React.FC<PaymentPlanProps> = ({
                                                         onSubmit,
                                                         selectedPaymentPlanData,
                                                         paymentPlanGroupId = 'main_payment_group',
                                                         paymentPlanInstallments,
                                                         paymentPlanType

                                                     }) => {

    const selectedPaymentPlan = selectedPaymentPlanData?.paymentPlanDto || null;
    const {activeBrand} = useAuthContext();
    const router = useRouter();
//'main_payment_group'
    const [selectedPaymentGroupPlanData, setSelectedPaymentPlanData] = useState<PaymentPlanGroupFormData | null>(selectedPaymentPlanData?.paymentPlanGroupDto || null);

    const [formData, setFormData] = useState<PaymentPlanFormData>({
        id: null,
        status: EStatus.NEW,
        brandId: activeBrand?.id || null,
        customerId: '',
        invoiceDate: new Date(),
        description: '',
        totalAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
        maturityDate: new Date(),
        documentNo: '',
        nonCustomerName: '',
        paymentPlanGroupId: paymentPlanGroupId
    });


    const [formDataInstallments, setFormDataInstallments] = useState<PaymentPlanInstallmentFormData[]>([]);

    const {
        customers,
        fetchCustomers,


    } = useCustomers();

    const {
        deletePaymentPlan,
        fetchPaymentPlanGroups,
        paymentPlanGroups,
        createPaymentPlanInstallment,
        updatePaymentPlanInstallment,
        deletePaymentPlanInstallment,
    } = usePaymentPlans();


    useEffect(() => {
        fetchCustomers();
        fetchPaymentPlanGroups();
    }, []);

    useEffect(() => {
        if (paymentPlanGroups) {
            setSelectedPaymentPlanData(paymentPlanGroups.find(group => group.id === 'main_payment_group') || null);
        }
    }, [paymentPlanGroups]);


    const createEmptyInstallment = () => {


        const emptyInstallment: PaymentPlanInstallmentFormData = {

            status: EStatus.NEW,
            id: '',
            paymentPlanId: formData.id || '',
            description: '',
            totalAmount: 0,
            paidAmount: 0,
            remainingAmount: 0,
            maturityDate: new Date(),
            documentNo: '',
        }
        formDataInstallments.push(emptyInstallment);
        setFormDataInstallments(prev => [...prev, emptyInstallment]);
    }


    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    useEffect(() => {
        const loadPaymentPlan = async () => {
            if (selectedPaymentPlan) {
                setFormData({
                    id: selectedPaymentPlan.id,
                    status: selectedPaymentPlan.status,
                    brandId: selectedPaymentPlan.id || null,
                    customerId: selectedPaymentPlan.customerId || null,
                    invoiceDate: new Date(selectedPaymentPlan?.invoiceDate || '') || new Date(),
                    description: selectedPaymentPlan.description || '',
                    totalAmount: selectedPaymentPlan.totalAmount || 0,
                    paidAmount: selectedPaymentPlan.paidAmount || 0,
                    remainingAmount: selectedPaymentPlan.remainingAmount || 0,
                    maturityDate: new Date(selectedPaymentPlan.maturityDate) || new Date(),
                    documentNo: selectedPaymentPlan.documentNo || null,
                    nonCustomerName: selectedPaymentPlan.nonCustomerName || null,
                    paymentPlanGroupId: selectedPaymentPlan.paymentPlanGroupId || null,
                })
                if (paymentPlanInstallments) {
                    setFormDataInstallments(paymentPlanInstallments);
                }
            }
        };

        if (selectedPaymentPlan) {
            loadPaymentPlan();
        } else {
            createEmptyInstallment();

        }
    }, [selectedPaymentPlan]);

    const validateForm = () => {
        const newErrors: PaymentPlanFormErrors = {};

        // Ana form validasyonları
        if (!formData.status) {
            newErrors.status = 'Durum seçimi zorunludur';
        }

        if (!formData.description || formData.description.trim() === '') {
            newErrors.description = 'Açıklama zorunludur';
        }

        if (!formData.totalAmount || formData.totalAmount <= 0) {
            newErrors.totalAmount = 'Toplam tutar 0\'dan büyük olmalıdır';
        }

        if (formData.paidAmount < 0) {
            newErrors.paidAmount = 'Ödenen tutar negatif olamaz';
        }

        if (!formData.invoiceDate) {
            newErrors.invoiceDate = 'Fatura tarihi zorunludur';
        }

        if (!formData.maturityDate) {
            newErrors.maturityDate = 'Vade tarihi zorunludur';
        }


        // Taksit validasyonları
        if (formDataInstallments.length > 0) {
            // Taksitlerin toplam tutarlarını hesapla
            const installmentsTotalAmount = formDataInstallments.reduce((sum, installment) => {
                return sum + (installment.totalAmount || 0);
            }, 0);

            const installmentsPaidAmount = formDataInstallments.reduce((sum, installment) => {
                return sum + (installment.paidAmount || 0);
            }, 0);

            const installmentsRemainingAmount = formDataInstallments.reduce((sum, installment) => {
                return sum + (installment.remainingAmount || 0);
            }, 0);

            // Ana plan ile taksitlerin tutarlarını karşılaştır
            const tolerance = 1; // Küsurat farkları için tolerans

            if (Math.abs((formData.totalAmount || 0) - installmentsTotalAmount) > tolerance) {
                newErrors.totalAmount = `Ana plandaki toplam tutar (${formData.totalAmount}) ile taksitlerin toplam tutarı (${installmentsTotalAmount}) eşleşmiyor`;
            }

            if (Math.abs((formData.paidAmount || 0) - installmentsPaidAmount) > tolerance) {
                newErrors.paidAmount = `Ana plandaki ödenen tutar (${formData.paidAmount}) ile taksitlerin ödenen tutarı (${installmentsPaidAmount}) eşleşmiyor`;
            }

            if (Math.abs((formData.remainingAmount || 0) - installmentsRemainingAmount) > tolerance) {
                newErrors.remainingAmount = `Ana plandaki kalan tutar (${formData.remainingAmount}) ile taksitlerin kalan tutarı (${installmentsRemainingAmount}) eşleşmiyor`;
            }

            // Her taksit için ayrı validasyon
            formDataInstallments.forEach((installment, index) => {

                /*
                if (!installment.description || installment.description.trim() === '') {
                    newErrors[`installment_${index}_description`] = `${index + 1}. taksitin açıklaması zorunludur`;
                }

                 */

                if (!installment.totalAmount || installment.totalAmount <= 0) {
                    newErrors.totalAmount = `${index + 1}. taksitin toplam tutarı 0'dan büyük olmalıdır`;
                }

                if (installment.paidAmount < 0) {
                    newErrors.paidAmount = `${index + 1}. taksitin ödenen tutarı negatif olamaz`;
                }

                if (!installment.maturityDate) {
                    newErrors.maturityDate = `${index + 1}. taksitin vade tarihi zorunludur`;
                }

                // Taksit içindeki tutar tutarlılığı kontrolü
                const expectedRemaining = (installment.totalAmount || 0) - (installment.paidAmount || 0);
                if (Math.abs((installment.remainingAmount || 0) - expectedRemaining) > tolerance) {
                    newErrors.remainingAmount = `${index + 1}. taksitin kalan tutarı hesaplaması yanlış`;
                }
            });
        } else {
            // Taksit yoksa uyarı ver
            newErrors.installments = 'En az bir taksit eklemeniz gerekmektedir';
        }

        // Ana plandaki tutar tutarlılığı kontrolü
        const expectedMainRemaining = (formData.totalAmount || 0) - (formData.paidAmount || 0);
        if (Math.abs((formData.remainingAmount || 0) - expectedMainRemaining) > 1) {
            newErrors.remainingAmount = 'Ana plandaki kalan tutar hesaplaması yanlış';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                paymentPlanDto: formData,
                paymentPlanGroupDto: selectedPaymentGroupPlanData,
                paymentPlanInstallmentDtos: formDataInstallments
            });
        }
    };


    const handleInstallmentSubmit = (e: React.FormEvent, orderNumber: number) => {
        e.preventDefault();
        const updatedInstallment = formDataInstallments.find((_, index) => index === orderNumber);
        if (updatedInstallment) {
            if (updatedInstallment.id && updatedInstallment.id !== '') {
                updatePaymentPlanInstallment(updatedInstallment);
            } else {
                createPaymentPlanInstallment(updatedInstallment);
            }
            const newList = formDataInstallments.filter((_, index) => index !== orderNumber);
            setFormDataInstallments(newList);
        }
    };

    const handleChange = <T extends keyof PaymentPlanFormData>(
        name: T,
        value: PaymentPlanFormData[T]
    ) => {

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'totalAmount' || name === 'paidAmount') {
            setFormData(prev => ({
                ...prev,
                remainingAmount: (prev.totalAmount || 0) - (prev.paidAmount || 0)
            }));
        }
    };

    const handleChangeInstallment = <T extends keyof PaymentPlanInstallmentFormData>(
        name: T,
        value: PaymentPlanInstallmentFormData[T],
        orderIndex: number = 0
    ) => {
        setFormDataInstallments(prev =>
            prev.map((item, index) =>
                index === orderIndex ? {...item, [name]: value} : item
            )
        );
        if (name === 'totalAmount' || name === 'paidAmount') {
            setFormDataInstallments(prev =>
                prev.map((item, index) =>
                    index === orderIndex ? {
                        ...item,
                        remainingAmount: (item.totalAmount || 0) - (item.paidAmount || 0)
                    } : item
                )
            );
        }
    };


    const handleDeleteInstallment = (orderNumber: number) => {
        const updatedInstallment = formDataInstallments.find((_, index) => index === orderNumber);
        if (updatedInstallment) {
            if (updatedInstallment.id && updatedInstallment.id !== '') {
                deletePaymentPlanInstallment(updatedInstallment.id);
            }
            const newList = formDataInstallments.filter((_, index) => index !== orderNumber);
            setFormDataInstallments(newList);
        }
    };


    const handleDelete = () => {
        deletePaymentPlan(selectedPaymentPlan?.id || '').then(() => {
            router.back()
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedPaymentPlan ? 'Ödeme Planı Güncelle' : 'Yeni Ödeme Planı'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">

                        <div className="space-y-2">
                            <Label htmlFor="paymentPlanGroupId">Grup *</Label>
                            <Select
                                onValueChange={(value) => {
                                    handleChange('paymentPlanGroupId', value as string | null)
                                }}
                                searchable={false}
                                sortable={false}
                                value={formData.paymentPlanGroupId ?? ""}
                            >
                                <SelectTrigger className={errors.paymentPlanGroupId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Grup seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {paymentPlanGroups.map(group => (

                                            group.paymentPlanType === paymentPlanType &&
                                            <SelectItem key={group.id} value={group.id || ''}>
                                                {group.name}
                                            </SelectItem>

                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.paymentPlanGroupId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.paymentPlanGroupId}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="name">Açıklama *</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Açıklama giriniz"
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
                                    handleChange('totalAmount', value)
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
                                    handleChange('paidAmount', value)
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
                                    handleChange('remainingAmount', value)
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
                            <Label htmlFor="invoiceDate">Fatura Tarihi *</Label>
                            <Input
                                id="invoiceDate"
                                name="invoiceDate"
                                type="date"
                                value={formData.invoiceDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => {
                                    const dateValue = new Date(e.target.value);
                                    handleChange('invoiceDate', dateValue);
                                }}
                                className={errors.invoiceDate ? 'border-red-500' : ''}
                            />
                            {errors.invoiceDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.invoiceDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maturityDate">Vade Tarihi *</Label>
                            <Input
                                id="maturityDate"
                                name="maturityDate"
                                type="date"
                                value={formData.maturityDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => {
                                    const dateValue = new Date(e.target.value);
                                    handleChange('maturityDate', dateValue);
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
                            <Label htmlFor="customer">Müşteri *</Label>
                            <Select
                                onValueChange={(value) => {
                                    handleChange('customerId', value as string | null)
                                }}
                                searchable={true}
                                value={formData.customerId ?? ""}
                            >
                                <SelectTrigger className={errors.customerId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Müşteri seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {customers.map(customer => (
                                            <SelectItem key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.customerId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.customerId}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="name">Fatura No *</Label>
                            <Input
                                id="documentNo"
                                name="documentNo"
                                value={formData.documentNo || ''}
                                onChange={(e) => handleChange('documentNo', e.target.value)}
                                className={errors.documentNo ? 'border-red-500' : ''}
                            />
                            {errors.documentNo && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.documentNo}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Müşteri *</Label>
                            <Input
                                id="nonCustomerName"
                                name="nonCustomerName"
                                value={formData.nonCustomerName || ''}
                                onChange={(e) => handleChange('nonCustomerName', e.target.value)}
                                className={errors.nonCustomerName ? 'border-red-500' : ''}
                            />
                            {errors.nonCustomerName && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.nonCustomerName}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>


                    <div className="col-span-4 flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            {selectedPaymentPlan ? 'Ödeme Planı Güncelle' : 'Yeni Ödeme Planı'}
                        </Button>


                    </div>

                </form>


                <div className="col-span-4 flex justify-end space-x-4 pt-4">

                    <Button onClick={createEmptyInstallment} className="bg-yellow-600 hover:bg-blue-700 text-white">
                        Yeni Taksit Ekle
                    </Button>
                </div>

                {selectedPaymentPlan ?
                    <div className="col-span-4 flex justify-end space-x-4 pt-4">
                        <DeleteComponent
                            itemName="Banka Hesabı"
                            onDelete={handleDelete}
                        />
                    </div>
                    : null}
                {
                    formDataInstallments.map((installment, key) => (
                            <PaymentPlanFormInstallment key={key} onSubmit={handleInstallmentSubmit}
                                                        selectedPaymentPlanData={formData}
                                                        handleChangeInstalments={handleChangeInstallment}
                                                        handleDelete={handleDeleteInstallment} orderNumber={key}
                                                        selectedPaymentPlanInstallmentData={installment}/>
                        )
                    )
                }


            </CardContent>
        </Card>
    );
};

export default PaymentPlanForm;