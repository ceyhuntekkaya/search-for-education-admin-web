'use client';

import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/table";
import {useOrders} from "@/hooks/use-order";
import React, {useEffect} from "react";
import LoadingComp from "@/components/ui/loading-comp";
import {OrderDtoFormData} from "@/types/order";
import {formatDate} from "@/utils/date-formater";
import {useAuth} from "@/hooks/use-auth";


export default function OrdersPage() {
    const router = useRouter();
    const {orderRoleList, loading, fetchByRole} = useOrders();
    const {user} = useAuth();


    const columns: Column<RecordType>[] = [
        {
            key: 'customerName',
            header: 'Sipariş',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/company/orders/${record.id}`)}
                >
                    <b>{(record as OrderDtoFormData).code as string}</b>
                </div>
            )
        },
        {
            key: 'orderStateName',
            header: 'Durum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/company/orders/${record.id}`)}
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
                    onClick={() => router.push(`/company/orders/${record.id}`)}
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
                            <span>TEKLİF BEKLENİYOR</span>
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
                            <span>SEVKİYAT BEKLENİYOR</span>
                    }
                </div>
            )
        }
    ];


    useEffect(() => {
        if(user && user.connectionId){
            fetchByRole("COMPANY", user.connectionId);
        }

    }, []);

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    const handleAdd = () => {
        router.push('/company/orders/add');
    };

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                />
            }/>


            <div className="p-6 pt-0">
                <DynamicTable columns={columns} data={orderRoleList}/>
            </div>
        </div>
    );
};