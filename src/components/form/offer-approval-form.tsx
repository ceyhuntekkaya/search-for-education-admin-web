'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Offer, OfferApproval, OfferApprovalFormData, OfferApprovalFormErrors} from "@/types/offer";
import {Department, DepartmentList} from "@/types/auth";
import {formatDate} from "@/utils/date-formater";
import {EOfferApprovalStatus, EOfferStatus} from "@/types/enumeration";
import {useAuth} from "@/hooks/use-auth";
import {useLanguage} from "@/contexts/language-context";


interface OfferApprovalFormProps {
    onSubmit: (arg0: OfferApprovalFormData) => void;
    offers: Offer[];
    offer: Offer;
    onCreate: (e: React.FormEvent) => void;
    offerApproval?: OfferApproval;
}

const CreateOfferApprovalForm: React.FC<OfferApprovalFormProps> = ({
                                                                       onSubmit,
                                                                       offers = [],
                                                                       offer,
                                                                       onCreate,
                                                                       offerApproval
                                                                   }) => {
    const {user} = useAuth();
    const {t} = useLanguage();

    const [formData, setFormData] = useState<OfferApprovalFormData>({
        offerStatus: EOfferStatus.NEW,
        approvalDate: new Date(),
        department: null,
        description: "",
        userId: user?.id,
        offerId: offer.id

    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [showRequest, setShowRequest] = useState(false);


    useEffect(() => {
        if (offerApproval) {
            setFormData({
                id: offerApproval.id,
                offerStatus: offerApproval.offerStatus,
                approvalDate: offerApproval.approvalDate,
                department: offerApproval.department,
                description: offerApproval.description,
                userId: offerApproval.user.id,
                offerId: offerApproval.offer.id
            })
            setShowRequest(true);
        }
    }, [offerApproval]);

    const validateForm = () => {
        const newErrors: OfferApprovalFormErrors = {};

        if (!formData.offerId) {
            newErrors.offerId = 'Teklif seçimi zorunludur';
        }

        if (!formData.department) {
            newErrors.department = 'Departman seçimi zorunludur';
        }

        if (formData.description && formData.description.length > 4000) {
            newErrors.description = 'Açıklama en fazla 4000 karakter olabilir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {

            if (!offerApproval) {
                onSubmit(formData);
                onCreate(e);
            } else {
                onSubmit(formData);
            }
        }
    };

    const handleChange = <T extends keyof OfferApprovalFormData>(
        name: T,
        value: OfferApprovalFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (

        <>
            <hr/>
            {
                !showRequest && (
                    <button
                        onClick={() => setShowRequest(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Onay İsteği Gönder
                    </button>
                )
            }
            {
                showRequest && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Teklif Onayı</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Teklif Seçimi */}
                                <div className="space-y-2">
                                    <Label htmlFor="offer">Teklif *</Label>
                                    <Select
                                        onValueChange={(value) => handleChange('offerId', value as string | null)}
                                        value={formData.offerId ?? ""} disabled={true}
                                    >
                                        <SelectTrigger className={errors.offerId ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Teklif seçin"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            {offers.map(offer => (
                                                <SelectItem key={offer.id} value={offer.id}>
                                                    {formatDate(offer.order.orderDate)} - {offer.order.customer.name}
                                                    ({new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'TRY'})
                                                    .format(offer.totalAmount || 0)})
                                                </SelectItem>
                                            ))}
                                                </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.offerId && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.offerId}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>


                                {/* Onay Tarihi
                                <div className="space-y-2">
                                    <Label htmlFor="approvalDate">Onay Tarihi</Label>
                                    <Input
                                        type="date"
                                        id="approvalDate"
                                        value={formData.approvalDate.toISOString().split('T')[0]}
                                        onChange={(e) => {
                                            const dateValue = new Date(e.target.value);
                                            handleChange('approvalDate', dateValue);
                                        }}
                                    />
                                </div>
                                */}
                                {/* Departman Seçimi */}
                                <div className="space-y-2">
                                    <Label htmlFor="department">Departman *</Label>
                                    <Select
                                        onValueChange={(value) => handleChange('department', value as Department)}
                                        value={formData.department ?? ""} disabled={!!offerApproval}
                                    >
                                        <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Departman seçin"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            {Object.entries(DepartmentList).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {t(`department.${value}`)}
                                                </SelectItem>
                                            ))}
                                                </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.department && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.department}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Açıklama */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Açıklama</Label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        className={`w-full min-h-[100px] p-2 border rounded-md ${
                                            errors.description ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Onay açıklaması giriniz..."
                                    />
                                    <div className="text-sm text-gray-500">
                                        {formData.description.length}/4000 karakter
                                    </div>
                                    {errors.description && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.description}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2 mr-2">

                                    <Select
                                        onValueChange={(value) => handleChange('offerStatus', value as EOfferStatus)}
                                        value={formData.offerStatus ?? ""}
                                    >
                                        <SelectTrigger className={errors.offerStatus ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Durum seçin"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            {Object.entries(EOfferApprovalStatus).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {t(`status.${value}`)}
                                                </SelectItem>
                                            ))}
                                                </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.orderStateId && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.orderStateId}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Onayı Kaydet
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )
            }

        </>
    );
};

export default CreateOfferApprovalForm;