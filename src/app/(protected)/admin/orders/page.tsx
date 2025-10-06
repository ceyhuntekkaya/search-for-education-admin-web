'use client';

import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/table";
import {useOrders} from "@/hooks/use-order";
import React, {useEffect, useState} from "react";
import LoadingComp from "@/components/ui/loading-comp";
import {OrderDtoFormData, OrderSearchFormData} from "@/types/order";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {formatDate} from "@/utils/date-formater";
import Link from "next/link";
import OrderSummary from "@/components/summary/order-summary";


export default function OrdersPage() {
    const router = useRouter();
    const {orderDtoList, fetchOrders, loading, fetchSearchOrder} = useOrders();


    const [formData, setFormData] = useState<OrderSearchFormData>({
        beginAt: new Date(),
        endAt: new Date(),
    });


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSearchOrder({
            ...formData,
        });
    };

    const handleChange = <T extends keyof OrderSearchFormData>(
        name: T,
        value: OrderSearchFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const columns: Column<RecordType>[] = [
        {
            key: 'customerName',
            header: 'Sipariş',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/orders/${record.id}`)}
                >
                    <b>{(record as OrderDtoFormData).code as string}</b> -
                    {value as string}
                </div>
            )
        },
        {
            key: 'orderStateName',
            header: 'Durum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/orders/${record.id}`)}
                >

                    {value as string}
                </div>
            )
        },
        {
            key: 'orderDate',
            header: 'Sipariş',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/orders/${record.id}`)}
                >

                    {formatDate(value as string)}
                </div>
            )
        },
        {
            key: 'offerDate',
            header: 'Teklif',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"

                >
                    {
                        value ? formatDate(value as string) :
                            <Link className={"text-blue-700"} href={`/admin/offers/add`}>{value as string}
                                TEKLİF HAZIRLA
                            </Link>
                    }
                </div>
            )
        },
        {
            key: 'deliveryDate',
            header: 'Sevkiyat',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {
                        value ? formatDate(value as string) :
                            (record as OrderDtoFormData).offerDate &&
                            <Link className={"text-blue-700"} href={`/admin/deliveries/add`}>{value as string}
                                SEVKİYAT PLANLA
                            </Link>
                    }
                </div>
            )
        }
    ];


    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    const handleAdd = () => {
        router.push('/admin/orders/add');
    };

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                />
            }/>
            <OrderSummary/>


            <form onSubmit={handleSubmit} className="space-y-4 pl-20">
                <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="beginAt">Başlangıç Tarihi *</Label>
                        <Input
                            id="beginAt"
                            name="beginAt"
                            type="date"
                            value={formData.beginAt ? formData.beginAt.toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                if (!isNaN(date.getTime())) {
                                    handleChange('beginAt', date);
                                }
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endAt">Bitiş Tarihi *</Label>
                        <Input
                            id="endAt"
                            name="endAt"
                            type="date"
                            value={formData.endAt ? formData.endAt.toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                if (!isNaN(date.getTime())) {
                                    handleChange('endAt', date);
                                }
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                            Sipariş Ara
                        </Button>
                    </div>
                </div>
            </form>

            <div className="p-6 pt-0">
                <DynamicTable columns={columns} data={orderDtoList}/>
            </div>
        </div>
    );
};