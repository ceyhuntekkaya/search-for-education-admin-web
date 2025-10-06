'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React, {useCallback, useEffect, useState} from "react";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useSql} from "@/hooks/use-sql";
import {SqlRequest} from "@/types/sql-type";
import {formatCurrency} from "@/utils/date-formater";
import BankSummary from "@/components/summary/bank-summary";
import {BankAccount} from "@/types/finance";


export default function BankPage() {
    const {
        bankAccountList,
        fetchBankList
    } = useSql();

    useEffect(() => {

        const sqlRequest: SqlRequest = {
            database: "2025",
            code: "120",
            startAt: "2025-01-01",
            endAt: "2025-12-01"
        };
        fetchBankList(sqlRequest);
    }, []);

    const [filteredData, setFilteredData] = useState<BankAccount[]>([]);


    useEffect(() => {
        setFilteredData(bankAccountList);
    }, [bankAccountList])

    const handleFilteredDataChange = useCallback(<T,>(filtered: T[]) => {
        setFilteredData(filtered as BankAccount[]);
    }, []);


    const columns: Column<RecordType>[] = [
        {
            key: 'accountDescription',
            header: 'Adı',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
              //      onClick={() => router.push(`/admin/finance/data/bank/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'accountCode',
            header: 'Kod',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
              //      onClick={() => router.push(`/admin/finance/data/bank/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        }

        ,
        {
            key: 'totalDebit',
            header: 'Toplam Borç',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
              //      onClick={() => router.push(`/admin/finance/data/bank/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,
        {
            key: 'totalCredit',
            header: 'Toplam Alacak',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                  //  onClick={() => router.push(`/admin/finance/data/bank/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }


        ,
        {
            key: 'creditBalance',
            header: 'Alacak Bakiye',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                //    onClick={() => router.push(`/admin/finance/data/bank/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,
        {
            key: 'debitBalance',
            header: 'Borç Bakiye',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                 //   onClick={() => router.push(`/admin/finance/data/bank/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
    ];


/*
    const handleAdd = () => {
        router.push('/admin/finance/data/bank/add');
    };

 */


    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons


                />
            }/>

            {
                bankAccountList.length > 0 && (
                    <div className="p-6 pt-0">
                        <BankSummary data={filteredData} />
                        <DynamicTable columns={columns} data={bankAccountList} pageSize={100} onFilteredDataChange={handleFilteredDataChange}/>
                    </div>
                )
            }

        </div>
    );
}
