'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Customer, OfferTextPartList} from "@/types/customer";


interface CustomerInfoFormProps {
    onSubmit: (arg0: string, arg1: string) => void;
    customer: Customer;
}

const CustomerOfferTextPertsForm: React.FC<CustomerInfoFormProps> = ({
                                                               onSubmit,
                                                               customer
                                                           }) => {

    const [formData, setFormData] = useState({
        customer: customer,
        partSet: customer.offerTextParts
            ? customer.offerTextParts.split(',').map(part => part.trim())
            : []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = formData.partSet.join(', ');
        onSubmit(customer.id, result);

    };


    const togglePart = (part: string) => {
        setFormData(prev => ({
            ...prev,
            partSet: prev.partSet.includes(part)
                ? prev.partSet.filter(p => p !== part) // Varsa çıkar
                : [...prev.partSet, part] // Yoksa ekle
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Teklif içerisinde yer alacak bölümler</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Müşteri Seçimi */}
                    <div className="space-y-2">
                        <Label>Bölümler *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {OfferTextPartList.map(part => (
                                <div key={part} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`part-${part}`}
                                        checked={formData.partSet.includes(part)}
                                        onChange={() => togglePart(part)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label
                                        htmlFor={`role-${part}`}
                                        className="text-sm text-gray-700"
                                    >
                                       {part}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Kaydet
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CustomerOfferTextPertsForm;