'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Vehicle, VehicleDriverFormData } from "@/types/vehicle";
import {useDataContext} from "@/contexts/data-context";
import {useVehicles} from "@/hooks/use-vehicle";
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";

interface VehicleDriverFormProps {
    onSubmit: (arg0: VehicleDriverFormData) => void;
    selectedVehicleDriverId?:string
}

const CreateVehicleDriverForm: React.FC<VehicleDriverFormProps> = ({
                                                                       onSubmit,
                                                                       selectedVehicleDriverId
                                                                   }) => {
    const [formData, setFormData] = useState<VehicleDriverFormData>({
        userId: null,
        transportationCompanyId: null,
        vehicleId: null,
        description: ''
    });

    const {
        transportationCompanies,
        users,
    } = useDataContext();
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const {
        vehicles,
        fetchVehicles
    } = useVehicles();


    const {
        selectedVehicleDriver,
        fetchVehicleDriverById,
    } = useVehicleDrivers();

    useEffect(() => {
        if(selectedVehicleDriverId){
            fetchVehicleDriverById(selectedVehicleDriverId);
        }

    }, []);

    useEffect(() => {
        if(selectedVehicleDriver){
            setFormData(
                {
                    userId: selectedVehicleDriver.user?.id || '',
                    transportationCompanyId: selectedVehicleDriver.transportationCompany.id,
                    vehicleId: selectedVehicleDriver.vehicle?.id || '',
                    description: selectedVehicleDriver.description
                }
            )
        }

    }, [selectedVehicleDriver]);


    useEffect(() => {
        fetchVehicles()
    }, []);

    useEffect(() => {
        if (formData.transportationCompanyId  && vehicles) {
            const filtered = vehicles.filter(vehicle => {
                return vehicle.transportationCompany.id === formData.transportationCompanyId;
            });

            setFilteredVehicles(filtered);
            if (formData.vehicleId && !filtered.some(v => v.id === formData.vehicleId)) {
                setFormData(prev => ({ ...prev, vehicleId: null }));
            }
        } else {
            setFilteredVehicles([]);
        }
    }, [formData.transportationCompanyId]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.transportationCompanyId) {
            newErrors.transportationCompanyId = 'Nakliye firması seçimi zorunludur';
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
        }
    };

    const handleChange = <T extends keyof VehicleDriverFormData>(
        name: T,
        value: VehicleDriverFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Araç Sürücüsü Ata</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nakliye Firması */}
                    <div className="space-y-2">
                        <Label htmlFor="transportationCompany">Nakliye Firması *</Label>
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
                                    <SelectItem key={company.id} value={company.id}>
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

                    {/* Sürücü (User) */}
                    <div className="space-y-2">
                        <Label htmlFor="user">Sürücü</Label>
                        <Select
                            onValueChange={(value) => handleChange('userId', value as string | null)}
                            value={formData.userId ?? ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sürücü seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {(users || []).map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name} {user.lastName}
                                    </SelectItem>
                                ))}
                                    </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Araç */}
                    <div className="space-y-2">
                        <Label htmlFor="vehicle">Araç</Label>
                        <Select
                            onValueChange={(value) => handleChange('vehicleId', value as string | null)}
                            value={formData.vehicleId ?? ""}
                            disabled={!formData.transportationCompanyId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={
                                    formData.transportationCompanyId
                                        ? "Araç seçin"
                                        : "Önce nakliye firması seçin"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {filteredVehicles.map(vehicle => {
                                    return (
                                        <SelectItem key={vehicle.id} value={vehicle.id}>
                                            {vehicle.mainLicensePlate}
                                            {vehicle.brand && vehicle.model && ` - ${vehicle.brand} ${vehicle.model}`}
                                        </SelectItem>
                                    );
                                })}
                                    </SelectGroup>
                            </SelectContent>
                        </Select>
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
                            placeholder="Sürücü hakkında açıklama giriniz..."
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
                            Sürücü Ata
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateVehicleDriverForm;