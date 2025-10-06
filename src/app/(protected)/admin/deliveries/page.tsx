'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React from "react";
import {useDeliveries} from "@/hooks/use-delivery";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {Order} from "@/types/order";
import {Offer} from "@/types/offer";


export default function DeliveriesPage() {
    const {
        deliveries,
    } = useDeliveries();


    const router = useRouter();

    const columns: Column<RecordType>[] = [
        {
            key: 'deliveryStatus',
            header: 'Durum',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${record.id}`)}
                >
                    {(record as Offer).order.orderState.name}
                </div>
            )
        },
        {
            key: 'code',
            header: 'Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'order',
            header: 'Müşteri',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${record.id}`)}
                >
                    {(value as Order).customer.name}
                </div>
            )
        },
        {
            key: 'deliveryDate',
            header: 'Sevkiyat Tarihi',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${record.id}`)}
                >
                    {value as string} - {record.deliveryTime as string || ''}
                </div>
            )
        }
    ];



    const handleAdd = () => {
        router.push('/admin/deliveries/add');
    };


    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}

                />
            }/>
            <div className="p-6">
                <DynamicTable columns={columns} data={deliveries}/>
            </div>
        </div>
    );
}