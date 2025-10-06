'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Credit, CreditFormData, CreditFormErrors, CreditInstallmentFormData} from "@/types/finance";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";
import {useAuthContext} from "@/contexts/auth-context";
import {useCredits} from "@/hooks/finance/use-credit";
import {useBanks} from "@/hooks/finance/use-bank";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Trash2, RefreshCw} from "lucide-react";
import {useCreditInstallments} from "@/hooks/finance/use-credit-installment";
import {useRouter} from "next/navigation";
import DeleteComponent from "@/components/ui/DeleteComponent";
import {NumberInput} from "@/components/ui/number-input";

interface CreditFormProps {
    onSubmit: (arg0: CreditFormData) => void;
    selectedCredit?: Credit | null;
}



const CreditForm: React.FC<CreditFormProps> = ({
                                                   onSubmit,
                                                   selectedCredit
                                               }) => {
    const {activeBrand} = useAuthContext();
    const router = useRouter();
    const [formData, setFormData] = useState<CreditFormData>({
        id: null,
        brandId: activeBrand?.id || null,
        bankId: null,
        creditDate: null,
        interestRate: 0,
        principal: 0,
        interest: 0,
        paidAmount: 0,
        numberOfInstallments: 0,
        bsmv: 0,
        name: '',
        description: '',
        status: EStatus.NEW,
        installments: []
    });

    const [installments, setInstallments] = useState<CreditInstallmentFormData[]>([]);
    const [activeTab, setActiveTab] = useState("credit");

    const {
        credits,
        fetchCredits,
        deleteCredit,
    } = useCredits();

    const {
        creditInstallments,
        fetchCreditInstallmentsByCreditId,
        deleteCreditInstallment
    } = useCreditInstallments();

    const {
        banks,
        fetchBanks
    } = useBanks();

    useEffect(() => {
        fetchCredits();
        fetchBanks();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {t} = useLanguage();

    useEffect(() => {
        const loadCredit = async () => {
            if (selectedCredit) {
                setFormData({
                    id: selectedCredit.id,
                    brandId: selectedCredit.brand.id,
                    bankId: selectedCredit.bank.id,
                    creditDate: selectedCredit.creditDate ? new Date(selectedCredit.creditDate) : null,
                    interestRate: selectedCredit.interestRate,
                    principal: selectedCredit.principal,
                    interest: selectedCredit.interest,
                    paidAmount: selectedCredit.paidAmount,
                    numberOfInstallments: selectedCredit.numberOfInstallments,
                    bsmv: selectedCredit.bsmv,
                    name: selectedCredit.name,
                    description: selectedCredit.description,
                    status: selectedCredit.status,
                    installments: selectedCredit.installments || []
                });


                fetchCreditInstallmentsByCreditId(selectedCredit.id)

                // Eğer kredi taksitleri varsa, onları installments state'ine yükle
                if (selectedCredit.installments && selectedCredit.installments.length > 0) {
                    const loadedInstallments = selectedCredit.installments.map(inst => ({
                        installmentNo: inst.installmentNo,
                        creditInstallmentDate: inst.creditInstallmentDate ,
                        principal: inst.principal,
                        interest: inst.interest,
                        bsmv: inst.bsmv,
                        paidAmount: inst.paidAmount,
                        paid: inst.paid ? inst.paid : 0,
                        remaining: inst.remaining ? inst.remaining : 0,
                        status: inst.status,
                        creditId:null
                    }));
                    setInstallments(loadedInstallments);
                }
            }
        };

        if (selectedCredit) {
            loadCredit();
        }
    }, [selectedCredit]);



    useEffect(() => {
        if (creditInstallments && Array.isArray(creditInstallments) && creditInstallments.length > 0) {
            const loadedInstallments = creditInstallments.map(inst => ({
                installmentNo: inst.installmentNo,
                creditInstallmentDate: inst.creditInstallmentDate ,
                principal: inst.principal,
                interest: inst.interest,
                bsmv: inst.bsmv,
                paidAmount: inst.paidAmount,
                paid: inst.paid ? inst.paid : 0,
                remaining: inst.remaining ? inst.remaining : 0,
                status: inst.status,
                creditId:null
            }));
            setInstallments(loadedInstallments);
        }
    }, [creditInstallments]);

    // Faiz tutarını otomatik hesapla
    useEffect(() => {
        if (formData.principal > 0 && formData.interestRate > 0 && formData.numberOfInstallments > 0) {
            const monthlyInterestRate = formData.interestRate / 100 / 12;
            const totalInterest = formData.principal * monthlyInterestRate * formData.numberOfInstallments;
            const calculatedInterest = Math.round(totalInterest * 100) / 100;

            if (calculatedInterest !== formData.interest) {
                setFormData(prev => ({
                    ...prev,
                    interest: calculatedInterest
                }));
            }
        }
    }, [formData.principal, formData.interestRate, formData.numberOfInstallments]);

    // BSMV'yi otomatik hesapla (faizin %10'u)
    useEffect(() => {
        const calculatedBsmv = Math.round(formData.interest * 0.1 * 100) / 100;
        if (calculatedBsmv !== formData.bsmv) {
            setFormData(prev => ({
                ...prev,
                bsmv: calculatedBsmv
            }));
        }
    }, [formData.interest]);

    // Taksit sayısı değiştiğinde mevcut taksitleri temizle
    useEffect(() => {
        if (formData.numberOfInstallments !== installments.length) {
            setInstallments([]);
        }
    }, [formData.numberOfInstallments]);

    const generateInstallments = () => {
        if (!formData.creditDate || formData.numberOfInstallments <= 0) {
            alert('Lütfen önce kredi tarihi ve taksit sayısını giriniz.');
            return;
        }

        const monthlyPrincipal = formData.principal / formData.numberOfInstallments;
        const monthlyInterest = formData.interest / formData.numberOfInstallments;
        const monthlyBsmv = formData.bsmv / formData.numberOfInstallments;
        const monthlyTotal = monthlyPrincipal + monthlyInterest + monthlyBsmv;

        const newInstallments: CreditInstallmentFormData[] = [];

        for (let i = 1; i <= formData.numberOfInstallments; i++) {
            const installmentDate = new Date(formData.creditDate);
            installmentDate.setMonth(installmentDate.getMonth() + i);

            newInstallments.push({
                installmentNo: i,
                creditInstallmentDate: installmentDate,
                principal: Math.round(monthlyPrincipal * 100) / 100,
                interest: Math.round(monthlyInterest * 100) / 100,
                bsmv: Math.round(monthlyBsmv * 100) / 100,
                paidAmount: Math.round(monthlyTotal * 100) / 100,
                paid: 0,
                remaining: Math.round(monthlyTotal * 100) / 100,
                status: EStatus.NEW,
                creditId:null
            });
        }

        setInstallments(newInstallments);
        setActiveTab("installments");
    };

    const updateInstallment = <K extends keyof CreditInstallmentFormData>(
        index: number,
        field: K,
        value: CreditInstallmentFormData[K]
    ) => {
        const newInstallments = [...installments];
        newInstallments[index] = {
            ...newInstallments[index],
            [field]: value
        };

        // Eğer principal, interest veya bsmv değiştiyse paidAmount'u güncelle
        if (field === 'principal' || field === 'interest' || field === 'bsmv') {
            const installment = newInstallments[index];
            installment.paidAmount = installment.principal + installment.interest + installment.bsmv;
            installment.remaining = installment.paidAmount - installment.paid;
        }

        // Eğer paid değiştiyse remaining'i güncelle
        if (field === 'paid') {
            const installment = newInstallments[index];
            installment.remaining = installment.paidAmount - installment.paid;
        }

        setInstallments(newInstallments);
    };

    const removeInstallment = (index: number) => {
        const newInstallments = installments.filter((_, i) => i !== index);
        // Taksit numaralarını yeniden düzenle
        newInstallments.forEach((inst, i) => {
            inst.installmentNo = i + 1;
        });
        setInstallments(newInstallments);
        setFormData(prev => ({
            ...prev,
            numberOfInstallments: newInstallments.length
        }));
    };


/*
    const addInstallment = () => {
        const lastInstallment = installments[installments.length - 1];
        const newDate = lastInstallment
            ? lastInstallment.creditInstallmentDate ? new Date(lastInstallment.creditInstallmentDate.getTime() + 30 * 24 * 60 * 60 * 1000) : new Date()
            : formData.creditDate
                ? new Date(formData.creditDate.getTime() + 30 * 24 * 60 * 60 * 1000)
                : new Date();

        const newInstallment: CreditInstallmentFormData = {
            installmentNo: installments.length + 1,
            creditInstallmentDate: newDate,
            principal: 0,
            interest: 0,
            bsmv: 0,
            paidAmount: 0,
            paid: 0,
            remaining: 0,
            status: EStatus.NEW,
            creditId: null,
        };

        setInstallments([...installments, newInstallment]);
        setFormData(prev => ({
            ...prev,
            numberOfInstallments: installments.length + 1
        }));
    };*/

    const validateForm = () => {
        const newErrors: CreditFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Kredi adı zorunludur';
        }

        if (!formData.bankId) {
            newErrors.bankId = 'Banka seçimi zorunludur';
        }

        if (!formData.creditDate) {
            newErrors.creditDate = 'Kredi tarihi zorunludur';
        }

        if (formData.principal <= 0) {
            newErrors.principal = 'Ana para sıfırdan büyük olmalıdır';
        }

        if (formData.interestRate < 0 || formData.interestRate > 100) {
            newErrors.interestRate = 'Faiz oranı 0-100 arasında olmalıdır';
        }

        if (formData.numberOfInstallments <= 0) {
            newErrors.numberOfInstallments = 'Taksit sayısı sıfırdan büyük olmalıdır';
        }

        if (formData.paidAmount < 0) {
            newErrors.paidAmount = 'Ödenen tutar negatif olamaz';
        }

        const totalDebt = formData.principal + formData.interest + formData.bsmv;
        if (formData.paidAmount > totalDebt) {
            newErrors.paidAmount = 'Ödenen tutar toplam borçtan büyük olamaz';
        }

        if (!selectedCredit) {
            if (credits.some(c => c.name.toLowerCase() === formData.name.toLowerCase() && c.bank.id === formData.bankId)) {
                newErrors.name = 'Bu kredi adı seçilen banka için zaten kullanımda';
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
            const submitData = {
                ...formData,
                installments: installments.map(inst => ({
                    id: null,
                    creditId: null,
                    creditInstallmentDate: inst.creditInstallmentDate,
                    installmentNo: inst.installmentNo,
                    principal: inst.principal,
                    interest: inst.interest,
                    bsmv: inst.bsmv,
                    paidAmount: inst.paidAmount,
                    paid: inst.paid,
                    remaining: inst.remaining,
                    status: inst.status
                }))
            };
            onSubmit(submitData);
        }
    };

    const handleDelete = () => {
        deleteCreditInstallment(selectedCredit?.id || '').then(() => {
            deleteCredit(selectedCredit?.id || '').then(() => {
                router.back()
            });
        });
    };

    const handleChange = <T extends keyof CreditFormData>(
        name: T,
        value: CreditFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleDateChange = (value: string) => {
        const dateValue = value ? new Date(value) : null;
        handleChange('creditDate', dateValue);
    };

    const formatDateForInput = (date: Date | null) => {
        if (!date) return '';
        if (typeof date === 'string') {
            // Eğer zaten YYYY-MM-DD formatında string geldiyse, doğrudan döndür
            return date;
        }

        return date.toISOString().split('T')[0];
    };


    const filteredBanks = banks.filter(b => b.brand.id === activeBrand?.id);

    const totalDebt = formData.principal + formData.interest + formData.bsmv;
    const remainingDebt = totalDebt - formData.paidAmount;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{selectedCredit ? 'Kredi Güncelle' : 'Yeni Kredi'}</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue={activeTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="credit">Kredi Bilgileri</TabsTrigger>
                        <TabsTrigger value="installments">Taksitler ({installments.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="credit">
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="name">Kredi Adı *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        placeholder="Kredi adını giriniz"
                                    />
                                    {errors.name && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.name}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

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

                                <div className="space-y-2">
                                    <Label htmlFor="creditDate">Kredi Tarihi *</Label>
                                    <Input
                                        id="creditDate"
                                        name="creditDate"
                                        type="date"
                                        value={formatDateForInput(formData.creditDate || null) || ''}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        className={errors.creditDate ? 'border-red-500' : ''}
                                    />
                                    {errors.creditDate && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.creditDate}</AlertDescription>
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
                                    <Label htmlFor="interestRate">Faiz Oranı (%) *</Label>

                                    <NumberInput
                                        inputType="percent"
                                        value={formData.interestRate}
                                        onChange={(value) => handleChange('interestRate',value)}
                                        decimalPlaces={0.01}
                                        minValue={0}
                                        maxValue={100}
                                        step="0.01"
                                        className={errors.interestRate ? 'border-red-500' : ''}
                                        placeholder="0.00"
                                    />
                                    {errors.interestRate && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.interestRate}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numberOfInstallments">Taksit Sayısı *</Label>



                                    <NumberInput
                                        id="numberOfInstallments"
                                        name="numberOfInstallments"
                                        inputType="number"
                                        value={formData.numberOfInstallments}
                                        onChange={(value) => handleChange('numberOfInstallments', value)}
                                        className={errors.numberOfInstallments ? 'border-red-500' : ''}
                                        decimalPlaces={0}
                                        minValue={1}
                                        step={1}
                                    />



                                    {errors.numberOfInstallments && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.numberOfInstallments}</AlertDescription>
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
                                    <Label htmlFor="interest">Faiz Tutarı</Label>

                                    <NumberInput
                                        id="interest"
                                        name="interest"
                                        value={formData.interest}
                                        onChange={(value) => {
                                            handleChange('interest', value)
                                        }}
                                    />

                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bsmv">BSMV</Label>


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

                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paidAmount">Ödenen Tutar *</Label>


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
                                    <Label>Toplam Borç</Label>
                                    <NumberInput
                                        id="totalDebt"
                                        name="totalDebt"
                                        value={totalDebt}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>

                                <div className="space-y-2 col-span-4">
                                    <Label htmlFor="description">Açıklama</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Kredi açıklaması"
                                    />
                                </div>

                                <div className="col-span-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <strong>Toplam Borç:</strong> {totalDebt.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                            </div>
                                            <div>
                                                <strong>Kalan Borç:</strong> {remainingDebt.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-4 flex justify-between pt-4">
                                    <Button
                                        type="button"
                                        onClick={generateInstallments}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={!formData.creditDate || formData.numberOfInstallments <= 0}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Taksitleri Otomatik Oluştur
                                    </Button>

                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        {selectedCredit ? 'Kredi Güncelle' : 'Kredi Oluştur'}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {selectedCredit ?
                            <div className="col-span-4 flex justify-end space-x-4 pt-4">
                                <DeleteComponent
                                    itemName="Kredi"
                                    onDelete={handleDelete}
                                />
                            </div>
                            : null}
                    </TabsContent>

                    <TabsContent value="installments">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Kredi Taksitleri</h3>

                            </div>

                            {installments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Henüz taksit eklenmemiş. Taksitleri Otomatik Oluştur butonunu kullanarak taksitleri otomatik oluşturabilir veya manuel olarak ekleyebilirsiniz.
                                </div>
                            ) : (
                                <div className="space-y-4">


                                    {installments && Array.isArray(installments) && installments.length>0 &&  installments.map((installment, index) => (


                                        <Card key={index} className="p-4">
                                            <div className="grid grid-cols-6 gap-4 items-end">
                                                <div>
                                                    <Label>Taksit No</Label>
                                                    <NumberInput
                                                        inputType="number"
                                                        value={installment.installmentNo}
                                                        onChange={(value) => updateInstallment(index, 'installmentNo', value)}
                                                        min="1"
                                                        decimalPlaces={0}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Taksit Tarihi</Label>
                                                    <Input
                                                        type="date"
                                                        value={formatDateForInput(installment.creditInstallmentDate)}
                                                        onChange={(e) => updateInstallment(index, 'creditInstallmentDate', new Date(e.target.value))}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Ana Para</Label>


                                                    <NumberInput
                                                        id="principal"
                                                        name="principal"
                                                        value={installment.principal}
                                                        min="0"
                                                        step="0.01"
                                                        onChange={(value) => {
                                                            updateInstallment(index, 'principal',value)}
                                                        }
                                                        className={errors.principal ? 'border-red-500' : ''}
                                                    />

                                                </div>

                                                <div>
                                                    <Label>Faiz</Label>

                                                    <NumberInput
                                                        id="interest"
                                                        name="interest"
                                                        value={installment.interest}
                                                        min="0"
                                                        step="0.01"
                                                        onChange={(value) => {
                                                            updateInstallment(index, 'interest',value)}
                                                        }
                                                        className={errors.interest ? 'border-red-500' : ''}
                                                    />

                                                </div>

                                                <div>
                                                    <Label>BSMV</Label>

                                                    <NumberInput
                                                        id="bsmv"
                                                        name="bsmv"
                                                        value={installment.bsmv}
                                                        min="0"
                                                        step="0.01"
                                                        onChange={(value) => {
                                                            updateInstallment(index, 'bsmv',value)}
                                                        }
                                                        className={errors.bsmv ? 'border-red-500' : ''}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>İşlemler</Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeInstallment(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-6 gap-4 mt-4">
                                                <div>
                                                    <Label>Taksit Tutarı</Label>
                                                    <NumberInput
                                                        id="paidAmount"
                                                        name="paidAmount"
                                                        value={installment.paidAmount}
                                                        readOnly
                                                        className="bg-gray-100"
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Ödenen</Label>

                                                    <NumberInput
                                                        id="paid"
                                                        name="paid"
                                                        value={installment.paid}
                                                        min="0"
                                                        step="0.01"
                                                        onChange={(value) => {
                                                            updateInstallment(index, 'paid',value)}
                                                        }
                                                        className={errors.paid ? 'border-red-500' : ''}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Kalan</Label>

                                                    <NumberInput
                                                        id="remaining"
                                                        name="remaining"
                                                        value={installment.remaining}
                                                        readOnly
                                                        className="bg-gray-100"
                                                    />

                                                </div>

                                                <div>
                                                    <Label>Durum</Label>
                                                    <Select
                                                        onValueChange={(value) => updateInstallment(index, 'status', value as EStatus)}
                                                        value={installment.status || EStatus.NEW}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
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
                                                </div>

                                                <div className="col-span-2">
                                                    <div className="bg-gray-50 p-2 rounded text-sm">
                                                        <strong>Özet:</strong> {installment.paidAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                                        (Ödenen: {installment.paid.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL,
                                                        Kalan: {installment.remaining.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL)
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}

                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold mb-2">Taksit Özeti</h4>
                                        <div className="grid grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <strong>Toplam Ana Para:</strong> {installments.reduce((sum, inst) => sum + inst.principal, 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                            </div>
                                            <div>
                                                <strong>Toplam Faiz:</strong> {installments.reduce((sum, inst) => sum + inst.interest, 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                            </div>
                                            <div>
                                                <strong>Toplam BSMV:</strong> {installments.reduce((sum, inst) => sum + inst.bsmv, 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                            </div>
                                            <div>
                                                <strong>Toplam Tutar:</strong> {installments.reduce((sum, inst) => sum + inst.paidAmount, 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                            </div>
                                            <div>
                                                <strong>Toplam Ödenen:</strong> {installments.reduce((sum, inst) => sum + inst.paid, 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                            </div>
                                            <div>
                                                <strong>Toplam Kalan:</strong> {installments.reduce((sum, inst) => sum + inst.remaining, 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                            </div>
                                            <div>
                                                <strong>Ödenen Taksit Sayısı:</strong> {installments.filter(inst => inst.remaining === 0).length}
                                            </div>
                                            <div>
                                                <strong>Kalan Taksit Sayısı:</strong> {installments.filter(inst => inst.remaining > 0).length}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {selectedCredit ? 'Kredi ve Taksitleri Güncelle' : 'Kredi ve Taksitleri Oluştur'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default CreditForm;