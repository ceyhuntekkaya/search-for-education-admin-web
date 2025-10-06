'use client';

import React, {useEffect, useState} from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useOrders} from "@/hooks/use-order";


interface SetOrderStateFormData {
    orderId: string;
    orderStateId: string;
}

interface SetOrderStateFormProps {
    orderId: string;
    orderStateId: string;
}
type SetOrderStateFormErrors = Partial<Record<keyof SetOrderStateFormData, string>>;



const SetOrderState: React.FC<SetOrderStateFormProps> = ({
                                                             orderId,
                                                             orderStateId
                                                       }) => {
    const [formData, setFormData] = useState<SetOrderStateFormProps>({
        orderId: orderId,
        orderStateId: orderStateId
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const {updateOrderStates, fetchOrderStates, orderStates} = useOrders();

    useEffect(() => {
        fetchOrderStates();
    }, []);

    const validateForm = () => {
        const newErrors: SetOrderStateFormErrors = {};

        if (!formData.orderId) {
            newErrors.orderId = 'Tedarikçi seçimi zorunludur';
        }
        if (!formData.orderStateId) {
            newErrors.orderStateId = 'Durum seçimi zorunludur';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            updateOrderStates(formData.orderId, formData.orderStateId);
        }
    };

    const handleChange = <T extends keyof SetOrderStateFormData>(
        name: T,
        value: SetOrderStateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    return (


    <form onSubmit={handleSubmit} className="space-y-4">
    <div className="flex items-center justify-between">
            <div className="space-y-2 mr-2">

                <Select
                    onValueChange={(value) => handleChange('orderStateId', value as string)}
                    value={formData.orderStateId ?? ""}
                >
                    <SelectTrigger className={errors.orderStateId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        {orderStates.map(orderState => (
                            <SelectItem key={orderState.id} value={orderState.id}>
                                {orderState.name}
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
            <div className="flex justify-end space-x-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Durum Değiştir
                </Button>
            </div>
        </div>
    </form>
    );
};

export default SetOrderState;