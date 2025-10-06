'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React, {useCallback, useEffect, useState} from "react";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useAdditionalAccounts} from "@/hooks/finance/use-additional-account";
import {AdditionalAccount, BankAccount} from "@/types/finance";
import {useSql} from "@/hooks/use-sql";
import {formatCurrency} from "@/utils/date-formater";
import AdditionalAccountSummary from "@/components/summary/additional-account-summary";


export default function AdditionalAccountPage() {
    const {
        additionalAccounts,
        fetchAdditionalAccounts
    } = useAdditionalAccounts();

    const {
        fetchBankList
    } = useSql();

    const [filteredData, setFilteredData] = useState<AdditionalAccount[]>([]);

    useEffect(() => {
        setFilteredData(additionalAccounts);
    }, [additionalAccounts]);

    const handleFilteredDataChange = useCallback(<T,>(filtered: T[]) => {
        setFilteredData(filtered as AdditionalAccount[]);
    }, []);

    useEffect(() => {
        const param = {
            database: "2025",
            code: "120",
            startAt: "",
            endAt: ""
        }
        fetchBankList(param);
        fetchAdditionalAccounts();
    }, []);





    const router = useRouter();


    const columns: Column<RecordType>[] = [

        {
            key: 'bankAccount',
            header: 'Banka Adı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/additional-account/${record.id}/edit`)}
                >
                    {(value as BankAccount).accountDescription || 'Bilinmiyor' } -
                </div>
            )
        },

        {
            key: 'amount',
            header: 'Limit',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/additional-account/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,

        {
            key: 'used',
            header: 'Kullanılan',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/additional-account/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,

        {
            key: 'remaining',
            header: 'Kullanılabilir',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/additional-account/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
    ];



    const handleAdd = () => {
        router.push('/admin/finance/data/additional-account/add');
    };


    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}

                />
            }/>
            <div className="p-6 pt-0">
                <AdditionalAccountSummary data={filteredData} />
                <DynamicTable columns={columns} data={additionalAccounts} pageSize={100}  onFilteredDataChange={handleFilteredDataChange}/>
            </div>
        </div>
    );
}