'use client';

import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    Vehicle,
    VehicleDriver,
    VehicleFollowFormData,
    VehicleFollowFormErrors
} from "@/types/vehicle";
import {EStatus} from "@/types/enumeration";
import {useVehicleFollows} from "@/hooks/use-vehicle-follow";
import {NumberInput} from "@/components/ui/number-input";

interface VehicleDriverFormProps {
    onSubmit: (arg0: VehicleFollowFormData) => void;
    vehicles: Vehicle[];
    vehicleDrivers: VehicleDriver[];
    selectedVehicleFollowId?: string;
    deliveryId: string;
}

const VehicleFollowForm: React.FC<VehicleDriverFormProps> = ({
                                                                 onSubmit,
                                                                 selectedVehicleFollowId,
                                                                 vehicles,
                                                                 vehicleDrivers,
                                                                 deliveryId
                                                             }) => {
    const [formData, setFormData] = useState<VehicleFollowFormData>({
        vehicleId: '',
        driverId: '',
        deliveryId: deliveryId,
        startKm: 0,
        endKm: 0,
        oilPrice: 0,
        totalCost: 0,
        startLocation: '',
        endLocation: '',
        status: EStatus.NEW,
        id: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});


    const {
        selectedVehicleFollow,
        fetchVehicleFollowById,
    } = useVehicleFollows();

    useEffect(() => {
        if (selectedVehicleFollowId) {
            fetchVehicleFollowById(selectedVehicleFollowId);
        }

    }, []);

    useEffect(() => {
        if (selectedVehicleFollow) {
            setFormData(
                {
                    vehicleId: selectedVehicleFollow.vehicle?.id || null,
                    driverId: selectedVehicleFollow.driver?.id || null,
                    deliveryId: selectedVehicleFollow.delivery?.id || null,
                    startKm: selectedVehicleFollow.startKm,
                    endKm: selectedVehicleFollow.endKm,
                    oilPrice: selectedVehicleFollow.oilPrice,
                    totalCost: selectedVehicleFollow.totalCost,
                    startLocation: selectedVehicleFollow.startLocation,
                    endLocation: selectedVehicleFollow.endLocation,
                    status: selectedVehicleFollow.status,
                    id: selectedVehicleFollow.id,
                }
            )
        }

    }, [selectedVehicleFollow]);


    const validateForm = () => {
        const newErrors: VehicleFollowFormErrors = {};

        if (!formData.deliveryId) {
            newErrors.deliveryId = 'Sevkiyat zorunludur';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(formData)
            onSubmit(formData);
        }
    };

    const handleChange = <T extends keyof VehicleFollowFormData>(
        name: T,
        value: VehicleFollowFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Araç Maliyet Takip</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="vehicleId">Araç *</Label>
                            <Select
                                onValueChange={(value) => handleChange('vehicleId', value as string | null)}
                                value={formData.vehicleId ?? ""}
                            >
                                <SelectTrigger className={errors.vehicleId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Araç seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {(vehicles || []).map(vehicle => (
                                            <SelectItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.mainLicensePlate}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.vehicleId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.vehicleId}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="driverId">Şoför *</Label>
                            <Select
                                onValueChange={(value) => handleChange('driverId', value as string | null)}
                                value={formData.driverId ?? ""}
                            >
                                <SelectTrigger className={errors.driverId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Şoför seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {(vehicleDrivers || []).map(driver => (
                                            <SelectItem key={driver.id} value={driver.id}>
                                                {driver.user?.name} {driver.user?.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.driverId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.driverId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startKm">Başlangıç KM *</Label>

                            <NumberInput
                                id="startKm"
                                name="startKm"
                                value={formData.startKm}
                                inputType="distance"
                                unit={"KM"}
                                decimalPlaces={0}
                                onChange={(value) => {
                                    handleChange('startKm', value)
                                }}
                                className={errors.startKm ? 'border-red-500' : ''}
                            />

                            {errors.startKm && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.startKm}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endKm">Bitiş KM</Label>

                            <NumberInput
                                id="endKm"
                                name="endKm"
                                value={formData.endKm}
                                inputType="distance"
                                unit={"KM"}
                                decimalPlaces={0}
                                onChange={(value) => {
                                    handleChange('endKm', value)
                                }}
                                className={errors.endKm ? 'border-red-500' : ''}
                            />

                            {errors.endKm && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.endKm}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="oilPrice">Akaryakıt Fiyatı *</Label>

                            <NumberInput
                                id="oilPrice"
                                name="oilPrice"
                                value={formData.oilPrice}
                                min="0"
                                step="0.000001"
                                decimalPlaces={6}
                                onChange={(value) => {
                                    handleChange('oilPrice', value)
                                }}
                                className={errors.oilPrice ? 'border-red-500' : ''}
                            />

                            {errors.oilPrice && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.oilPrice}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalCost">Toplam Maliyet *</Label>

                            <NumberInput
                                id="totalCost"
                                name="totalCost"
                                value={formData.totalCost}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('totalCost', value)
                                }}
                                className={errors.totalCost ? 'border-red-500' : ''}
                            />

                            {errors.totalCost && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.totalCost}</AlertDescription>
                                </Alert>
                            )}
                        </div>

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

export default VehicleFollowForm;