'use client';

import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import {Plus, Trash2} from "lucide-react";
import {Customer} from "@/types/customer";
import {usePaymentMethods} from "@/hooks/use-payment-method";
import {useCustomers} from "@/hooks/use-customer";


interface CustomerPaymentMethodProps {
    setContractType: ((arg0: string) => void) | null;
    selectedCustomer: Customer;
    updateData: () => void;

}

const CustomerPaymentMethod: React.FC<CustomerPaymentMethodProps> = ({
                                                             setContractType,
                                                             selectedCustomer,
                                                             updateData,
                                                         }) => {
    const {
        paymentMethods,
        fetchPaymentMethods
    } = usePaymentMethods();

    const {
        setPaymentMethods
    } = useCustomers();


    const handlePaymentMethodAdd = (id: string) => {
        setPaymentMethods('add', selectedCustomer?.id as string, id).then(() => {
            if (updateData) {
                updateData();
            }
        });
    };

    const handlePaymentMethodRemove = (id: string) => {
        setPaymentMethods('remove', selectedCustomer?.id as string, id).then(() => {
            if (updateData) {
                updateData();
            }
        });
    };

    useEffect(() => {
        const loadPaymentMethods = async () => {
            try {
                await fetchPaymentMethods();
            } catch (error) {
                console.error('Sevkiyat yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        loadPaymentMethods();
    }, [fetchPaymentMethods]);

    const columnsPaymentMethods: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ödeme Yöntemi',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {!selectedCustomer.paymentMethods.some((method) => method.id === record.id) ?
                        <p> {value as string}</p>
                        :
                        <p className={"font-bold"}> {value as string}</p>
                    }
                </div>
            )
        },
        {
            key: 'maturityDifference',
            header: 'İndirim Oranı (%)',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {!selectedCustomer.paymentMethods.some((method) => method.id === record.id) ?
                        <p>% {value as string}</p>
                        :
                        <p className={"font-bold"}>% {value as string}</p>
                    }
                </div>
            )
        },
        {
            key: 'id',
            header: 'İndirim Oranı (%)',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {!selectedCustomer.paymentMethods.some((method) => method.id === value) ?

                        <Button onClick={() => handlePaymentMethodAdd(value as string)}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            <Plus className="h-4 w-4 mr-2"/>
                            Ekle
                        </Button>
                        :
                        <Button onClick={() => handlePaymentMethodRemove(value as string)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Sil
                        </Button>
                    }
                </div>
            )
        }
    ];


    return (
        <>
            {
                setContractType && <>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`contractType-sort`}
                                    checked={selectedCustomer.contractType === "SORT"}
                                    onChange={() => setContractType("SORT")}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label
                                    htmlFor={`contractType-sort`}
                                    className="text-sm text-gray-700"
                                >
                                    KISA TEKLİD METNİ HAZIRLANMALI
                                </Label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`contractType-long`}
                                    checked={selectedCustomer.contractType === "LONG"}
                                    onChange={() => setContractType("LONG")}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label
                                    htmlFor={`contractType-long`}
                                    className="text-sm text-gray-700"
                                >
                                    DETAYLI TEKLİF METNİ HAZIRLANMALI
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr/>
                </>
            }

            <DynamicTable columns={columnsPaymentMethods} data={paymentMethods} searchable={false}
                          pageSize={50}/>
        </>
    );
};

export default CustomerPaymentMethod;