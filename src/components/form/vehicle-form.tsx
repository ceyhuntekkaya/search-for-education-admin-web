'use client';

import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Vehicle, VehicleFormData, VehicleFormErrors} from "@/types/vehicle";
import {EVehicleType} from "@/types/enumeration";
import {useDataContext} from "@/contexts/data-context";
import {useVehicles} from "@/hooks/use-vehicle";
import {NumberInput} from "@/components/ui/number-input";



interface VehicleFormProps {
    onSubmit: (arg0: VehicleFormData) => void;
    existingVehicles?: Vehicle[];
    selectedVehicleId?:string
}

const CreateVehicleForm: React.FC<VehicleFormProps> = ({
                                                           onSubmit,
                                                           existingVehicles = [],
                                                           selectedVehicleId
                                                       }) => {
    const [formData, setFormData] = useState<VehicleFormData>({
        transportationCompanyId: null,
        mainLicensePlate: '',
        trailerLicensePlate: '',
        brand: '',
        model: '',
        type: null,
        description: '',
        capacities: [],
        capacity: 0
    });


    const {
        transportationCompanies,

    } = useDataContext();


    const {
        selectedVehicle,
        fetchVehicleById,
    } = useVehicles();

    useEffect(() => {
        if(selectedVehicleId){
            fetchVehicleById(selectedVehicleId);
        }

    }, []);

    useEffect(() => {
        if(selectedVehicle){
            setFormData(
                {
                    transportationCompanyId: selectedVehicle.transportationCompany.id,
                    mainLicensePlate: selectedVehicle.mainLicensePlate,
                    trailerLicensePlate: selectedVehicle.trailerLicensePlate,
                    brand: selectedVehicle.brand,
                    model: selectedVehicle.model,
                    type: selectedVehicle.type,
                    description: selectedVehicle.description,
                    capacities: selectedVehicle.capacities,
                    capacity: selectedVehicle.capacity
                }
            )
        }

    }, [selectedVehicle]);


    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateTurkishLicensePlate = (plate: string) => {
        // Türk plaka formatı kontrolü: 34ABC123, 34AB123 vb.
        const plateRegex = /^[0-9]{2}[A-Z]{1,3}[0-9]{2,4}$/;
        return plateRegex.test(plate.replace(/\s/g, ''));
    };

    const validateForm = () => {
        const newErrors: VehicleFormErrors = {};

        // Ana plaka validasyonu
        if (!formData.mainLicensePlate) {
            newErrors.mainLicensePlate = 'Ana plaka zorunludur';
        } else {
            const formattedPlate = formData.mainLicensePlate.replace(/\s/g, '').toUpperCase();
            if (!validateTurkishLicensePlate(formattedPlate)) {
                newErrors.mainLicensePlate = 'Geçerli bir plaka giriniz';
            } else if (existingVehicles.some(v =>
                v.mainLicensePlate.replace(/\s/g, '').toUpperCase() === formattedPlate
            )) {
                newErrors.mainLicensePlate = 'Bu plaka zaten kullanımda';
            }
        }

        if (formData.trailerLicensePlate &&
            !validateTurkishLicensePlate(formData.trailerLicensePlate.replace(/\s/g, ''))) {
            newErrors.trailerLicensePlate = 'Geçerli bir plaka giriniz';
        }

        if (!formData.type) {
            newErrors.type = 'Araç tipi seçimi zorunludur';
        }

        if (!formData.transportationCompanyId) {
            newErrors.transportationCompanyId = 'Nakliye firması seçimi zorunludur';
        }

        if (formData.capacity < 0) {
            newErrors.capacity = 'Kapasite 0\'dan küçük olamaz';
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
            onSubmit({
                ...formData,
                mainLicensePlate: formData.mainLicensePlate.toUpperCase(),
                trailerLicensePlate: formData.trailerLicensePlate.toUpperCase()
            });
        }
    };

    const handleChange = <T extends keyof VehicleFormData>(
        name: T,
        value: VehicleFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatLicensePlate = (plate: string) => {
        plate = plate.toUpperCase();
        const cleaned = plate.replace(/\s/g, '');
        if (cleaned.length >= 7) {
            // 34ABC123 formatında ayırma
            return cleaned.replace(/^(\d{2})([A-Z]{1,3})(\d{2,4})$/, '$1 $2 $3');
        }
        return plate;
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Araç</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Plaka Bilgileri */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="mainLicensePlate">Ana Plaka *</Label>
                            <Input
                                id="mainLicensePlate"
                                value={formData.mainLicensePlate}
                                onChange={(e) => handleChange('mainLicensePlate', formatLicensePlate(e.target.value))}
                                className={errors.mainLicensePlate ? 'border-red-500' : ''}
                                placeholder="34 ABC 123"
                                maxLength={12}
                            />
                            {errors.mainLicensePlate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.mainLicensePlate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="trailerLicensePlate">Dorse Plaka</Label>
                            <Input
                                id="trailerLicensePlate"
                                value={formData.trailerLicensePlate}
                                onChange={(e) => handleChange('trailerLicensePlate', formatLicensePlate(e.target.value))}
                                className={errors.trailerLicensePlate ? 'border-red-500' : ''}
                                placeholder="34 ABC 123"
                                maxLength={12}
                            />
                            {errors.trailerLicensePlate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.trailerLicensePlate}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Araç Detayları */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">Marka</Label>
                            <Input
                                id="brand"
                                value={formData.brand}
                                onChange={(e) => handleChange('brand', e.target.value)}
                                placeholder="Mercedes, Volvo, vb."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                placeholder="Actros, FH16, vb."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Araç Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('type', value as EVehicleType)}
                                value={formData.type ?? ""}
                            >
                                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Araç tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {Object.entries(EVehicleType).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.type}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Kapasite (Litre)</Label>
                            <NumberInput
                                inputType="distance"
                                value={formData.capacity}
                                onChange={(value) => handleChange('capacity',value)}
                                decimalPlaces={0}
                                minValue={0}
                                maxValue={100}
                                step="1"
                                className={errors.capacity ? 'border-red-500' : ''}
                                unit="Litre"
                            />


                            {errors.capacity && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.capacity}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="transportationCompany">Nakliye Firması*</Label>
                        <Select
                            onValueChange={(value) => handleChange('transportationCompanyId', value as string | null)}
                            value={formData.transportationCompanyId ?? ""}
                        >
                            <SelectTrigger className={errors.transportationCompanyId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Nakliye firması seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {(transportationCompanies || []).map(company => (
                                    <SelectItem key={company.id} value={company.id.toString()}>
                                        {company.name}
                                    </SelectItem>
                                ))}
                                    </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.transportationCompanyId && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.transportationCompanyId}</AlertDescription>
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
                            placeholder="Araç hakkında açıklama giriniz..."
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

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Araç Oluştur
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateVehicleForm;