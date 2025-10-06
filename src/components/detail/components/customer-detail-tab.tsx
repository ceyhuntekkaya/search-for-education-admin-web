'use client';

import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Customer} from "@/types/customer";

interface CustomerDetailTabProps {
    customer: Customer;
}

const CustomerDetailTabPage: React.FC<CustomerDetailTabProps> = ({
                                                                     customer,
                                                                 }) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Müşteri Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <p className="font-medium text-lg">{customer.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">Müşteri Kodları</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Kod 1</p>
                                <p className="font-medium">{customer.code || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Kod 2</p>
                                <p className="font-medium">{customer.code2 || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-2">Müşteri Adresi</p>
                        <div className="flex items-start space-x-2">
                            <p className="text-gray-700">{customer.address || 'Belirtilmemiş'}</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-2">Vergi Bilgileri</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Vergi Numarası</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{customer.taxNumber || 'Belirtilmemiş'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Vergi Dairesi</p>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{customer.taxOffice || 'Belirtilmemiş'}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="border-t pt-4">
Link Buraya
                    </div>

                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>İletişim Detayları</CardTitle>
                    <CardDescription>Müşteri ve yetkili iletişim bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Firma İletişim Bilgileri</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div>
                                        <p className="font-medium">Firma Adı</p>
                                        <p className="text-gray-700">{customer.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div>
                                        <p className="font-medium">Adres</p>
                                        <p className="text-gray-700">{customer.address || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div>
                                        <p className="font-medium">Telefon</p>
                                        <p className="text-gray-700">{customer.phone || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div>
                                        <p className="font-medium">E-posta</p>
                                        <p className="text-gray-700">{customer.email || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">Yetkili Kişi Bilgileri</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div>
                                        <p className="font-medium">İsim</p>
                                        <p className="text-gray-700">{customer.contactPerson || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div>
                                        <p className="font-medium">Pozisyon</p>
                                        <p className="text-gray-700">{customer.contactPersonPosition || 'Belirtilmemiş'}</p>
                                        <p className="text-sm text-gray-500">Departman: {customer.contactPersonDepartment || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div>
                                        <p className="font-medium">Telefon</p>
                                        <p className="text-gray-700">{customer.contactPersonPhone || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div>
                                        <p className="font-medium">E-posta</p>
                                        <p className="text-gray-700">{customer.contactPersonEmail || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

    );
};

export default CustomerDetailTabPage;