'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {OfferText, OfferTextFormData, OfferTextFormErrors} from "@/types/order";
import {EStatus} from "@/types/enumeration";
import {Textarea} from "@/components/ui/textarea";
import {useAuthContext} from "@/contexts/auth-context";
import {Alert, AlertDescription} from "@/components/ui/alert";

interface OfferTextFormProps {
    onSubmit: (arg0: OfferTextFormData, arg1?: null) => void;
    offerText?: OfferText | null
}

const CreateOfferTextForm: React.FC<OfferTextFormProps> = ({
                                                               onSubmit,
                                                               offerText
                                                           }) => {
    const {activeBrand} = useAuthContext();
    const [formData, setFormData] = useState<OfferTextFormData>({
        text: '',
        title: '',
        description: '',
        explain: '',
        contract: '',
        status: EStatus.NEW,
        id: '',
        brandId: activeBrand?.id || ''

    });

    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        if (offerText) {
            setFormData({
                text: offerText.text,
                title: offerText.title,
                description: offerText.description,
                explain: offerText.explain,
                contract: offerText.contract,
                status: offerText.status,
                id: offerText.id,
                brandId: offerText.brand.id
            })
        }
    }, [offerText]);


    const validateForm = () => {
        const newErrors: OfferTextFormErrors = {};


        if (!formData.text) {
            newErrors.text = 'Zorunlu alan.';
        }

        if (!formData.title) {
            newErrors.title = 'Zorunlu alan.';
        }

        if (!formData.description) {
            newErrors.description = 'Zorunlu alan.';
        }

        if (!formData.explain) {
            newErrors.explain = 'Zorunlu alan.';
        }

        if (!formData.contract) {
            newErrors.contract = 'Zorunlu alan.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData
            });
        }
    };

    const handleChange = <T extends keyof OfferTextFormData>(
        name: T,
        value: OfferTextFormData[T]
    ) => {

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {offerText ? "Metin Güncelle" : "  Metin Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* İlişkili Seçimler */}
                    <div className="grid grid-cols-4 gap-4">


                        <div className="col-span-4 space-y-2">
                            <Label htmlFor="description">Başlık</Label>
                            <Textarea
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="min-h-[100px]"
                                placeholder="Detaylı teslimat adresi giriniz..."
                            />
                            {errors.title && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.title}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="col-span-4 space-y-2">
                            <Label htmlFor="text">Giriş bölümü</Label>
                            <Textarea
                                value={formData.text}
                                onChange={(e) => handleChange('text', e.target.value)}
                                className="min-h-[100px]"
                                placeholder="Teklif hakkında açıklama giriniz..."
                            />
                            {errors.text && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.text}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="col-span-4 space-y-2">
                            <Label htmlFor="description">İletişim Bilgileri</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="min-h-[100px]"
                                placeholder="Teklif hakkında açıklama giriniz..."
                            />
                            {errors.description && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.description}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="col-span-4 space-y-2">
                            <Label htmlFor="explain">Açıklama</Label>
                            <Textarea
                                value={formData.explain}
                                onChange={(e) => handleChange('explain', e.target.value)}
                                className="min-h-[100px]"
                                placeholder="Teklif hakkında açıklama giriniz..."
                            />
                            {errors.explain && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.explain}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="col-span-4 space-y-2">
                            <Label htmlFor="contract">Sözleşme Maddeleri</Label>
                            <Textarea
                                value={formData.contract}
                                onChange={(e) => handleChange('contract', e.target.value)}
                                className="min-h-[100px]"
                                placeholder="Teklif hakkında açıklama giriniz..."
                            />
                            {errors.contract && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.contract}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            {offerText ? "Sözleşme Metni Güncelle" : " Sözleşme Metni Oluştur"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateOfferTextForm;