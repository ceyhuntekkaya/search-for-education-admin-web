'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {OfferApproval, OfferApprovalFormData, OfferApprovalFormErrors} from "@/types/offer";
import {useAuth} from "@/hooks/use-auth";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EOfferStatus} from "@/types/enumeration";
import {useLanguage} from "@/contexts/language-context";

interface OfferApprovalUpdateProps {
    onSubmit: (arg0: OfferApprovalFormData) => void;
    offerApproval: OfferApproval;
    handleCancel?: () => void;
}

const OfferApprovalDetailPage: React.FC<OfferApprovalUpdateProps> = ({
                                                                         offerApproval,
                                                                         onSubmit,
                                                                         handleCancel
                                                                     }) => {


    const {user} = useAuth();
    const {t} = useLanguage();
    const [formData, setFormData] = useState<OfferApprovalFormData>({
        offerStatus: offerApproval.offerStatus,
        approvalDate: new Date(),
        department: offerApproval.department,
        description: offerApproval.description,
        userId: user?.id,
        offerId: offerApproval.offer.id,
        id: offerApproval.id,
        status: offerApproval.status,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});


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
            onSubmit(formData);
            if (handleCancel) {
                handleCancel();
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
            <Card>
                <CardHeader>
                    <CardTitle>Teklif Onayı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="offerStatus">Durum *</Label>
                            <Select
                                onValueChange={(value) => handleChange('offerStatus', value as EOfferStatus)}
                                value={formData.offerStatus ?? ""}
                            >
                                <SelectTrigger className={errors.offerStatus ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Durum seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.entries(EOfferStatus).map(([key, value]) => (
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

                        <div className="flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Onayı Kaydet
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>


        </>
    );
};

export default OfferApprovalDetailPage;