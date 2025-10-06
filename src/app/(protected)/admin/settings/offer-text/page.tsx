'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useOrders} from "@/hooks/use-order";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useRouter} from "next/navigation";
import {OfferText} from "@/types/order";

const ContractTextPage = () => {
    const router = useRouter();
    const {getAllOfferTexts, offerTexts} = useOrders();

    useEffect(() => {
        getAllOfferTexts();
    }, []);

    const columns: Column<RecordType>[] = [
        {
            key: 'brans',
            header: 'Firma',
            sortable: true,
            render: (_, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/offer-text/${record.id}`)}
                >
                    {(record as OfferText).brand.name as string || '-'}
                </div>
            )
        },
        {
            key: 'title',
            header: 'Başlık',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/offer-text/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];


    const handleAdd = () => {
        router.push('/admin/settings/offer-text/add');
    };



    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}

                />
            }/>


            <div className="p-6">
                <DynamicTable columns={columns} data={offerTexts}/>
            </div>
        </div>
    );
}

export default ContractTextPage;