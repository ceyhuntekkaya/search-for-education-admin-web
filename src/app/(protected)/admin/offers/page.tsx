'use client';

import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useOffers} from "@/hooks/use-offer";
import React, {useEffect} from "react";
import {Column, RecordType} from "@/types/table";
import DynamicTable from "@/components/ui/dynamic-table";
import LoadingComp from "@/components/ui/loading-comp";
import {formatDate} from "@/utils/date-formater";
import Link from "next/link";
import siteConfig from '@/config/config.json';
import {Offer} from "@/types/offer";



export default function OffersPage() {
    const router = useRouter();
    const {offers, fetchOffers, loading} = useOffers();

    const columns: Column<RecordType>[] = [
        {
            key: 'code',
            header: 'Sipariş Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/offers/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'customerName',
            header: 'Müşteri',
            render: (_, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/offers/${record.id}`)}
                >
                    {(record as Offer).order.customer.name}
                </div>
            )
        },
        {
            key: 'orderState',
            header: 'Durum',
            render: (_, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/offers/${record.id}`)}
                >
                    {(record as Offer).order.orderState.name}
                </div>
            )
        },
        {
            key: 'createdAt',
            header: 'Tarih',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/offers/${record.id}`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        },
        {
            key: 'id',
            header: '',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600" key={value as string}
                >
                   <Link href={`${siteConfig.api.invokeUrl}/storage/preview2/offer/${record.code as string}`} target="_blank">TEKLİF</Link>
                </div>
            )
        }
    ];


    const handleAdd = () => {
        router.push('/admin/offers/add');
    };



    useEffect(() => {
        fetchOffers();
    }, []);

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}

                />
            }/>

            <div>
                <div className="p-6">
                    <DynamicTable columns={columns} data={offers}/>
                </div>
            </div>


        </div>
    );
}