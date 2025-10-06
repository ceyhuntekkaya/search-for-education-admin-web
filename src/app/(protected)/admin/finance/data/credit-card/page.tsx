'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React, {useCallback, useEffect, useState} from "react";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useCreditCards} from "@/hooks/finance/use-credit-card";
import {CreditCard} from "@/types/finance";
import {formatCurrency} from "@/utils/date-formater";
import CreditCardSummary from "@/components/summary/credit-card-summary";


export default function CreditCardPage() {
    const {
        creditCards,
        fetchCreditCards
    } = useCreditCards();

    useEffect(() => {
        fetchCreditCards();
    }, []);

    const [filteredData, setFilteredData] = useState<CreditCard[]>([]);

    const router = useRouter();

    useEffect(() => {
        setFilteredData(creditCards);
    }, [creditCards]);

    const handleFilteredDataChange = useCallback(<T,>(filtered: T[]) => {
        setFilteredData(filtered as CreditCard[]);
    }, []);


    const columns: Column<RecordType>[] = [
        {
            key: 'bank',
            header: 'Banka',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {(record as CreditCard).bank.name || 'Bilinmiyor'}
                </div>
            )
        },
        {
            key: 'owner',
            header: 'Sahip',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'cardNumber',
            header: 'Kart Numarası',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'expirationDate',
            header: 'Son Kullanma Tarihi',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'cvv',
            header: 'CVV',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'limitAmount',
            header: 'Limit',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'accountCutOffDate',
            header: 'Hesap Kesim Günü',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'paymentDate',
            header: 'Ödeme Günü',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'used',
            header: 'Kullanılan Limit',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'remaining',
            header: 'Kalan Limit',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit-card/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/finance/data/credit-card/add');
    };

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                />
            }/>
            <div className="p-6 pt-0">
                <CreditCardSummary data={filteredData}/>
                <DynamicTable columns={columns} data={creditCards} onFilteredDataChange={handleFilteredDataChange}/>
            </div>
        </div>
    );
}