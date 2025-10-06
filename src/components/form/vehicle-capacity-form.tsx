'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ECapacityUnits} from "@/types/enumeration";
import {VehicleCapacityFormData, VehicleCapacityFormErrors} from "@/types/vehicle";
import {NumberInput} from "@/components/ui/number-input";


interface VehicleCapacityFormProps {
    onSubmit: (formData: {
        capacity: number;
        unit: string;
    }) => void;
}

const CreateVehicleCapacityForm: React.FC<VehicleCapacityFormProps> = ({
                                                                           onSubmit
                                                                       }) => {
    const [formData, setFormData] = useState({
        capacity: 0,
        unit: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: VehicleCapacityFormErrors = {};

        // Kapasite validasyonu
        if (formData.capacity <= 0) {
            newErrors.capacity = 'Kapasite 0\'dan büyük olmalıdır';
        }

        // Birim validasyonu
        if (!formData.unit) {
            newErrors.unit = 'Birim seçimi zorunludur';
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

    const handleChange = <T extends keyof VehicleCapacityFormData>(
        name: T,
        value: VehicleCapacityFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Araç Kapasitesi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Kapasite */}
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Kapasite *</Label>

                        <NumberInput
                            id="capacity"
                            name="capacity"
                            inputType="number"
                            value={formData.capacity}
                            onChange={(value) => handleChange('capacity', value)}
                            className={errors.capacity ? 'border-red-500' : ''}
                            decimalPlaces={0}
                            minValue={1}
                            placeholder="Kapasite değeri giriniz"
                        />

                        {errors.capacity && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.capacity}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Birim */}
                    <div className="space-y-2">
                        <Label htmlFor="unit">Birim *</Label>
                        <Select
                            onValueChange={(value) => handleChange('unit', value as ECapacityUnits)}
                            value={formData.unit}
                        >
                            <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Birim seçin"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {Object.entries(ECapacityUnits).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.unit && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.unit}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Kapasite Ekle
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateVehicleCapacityForm;