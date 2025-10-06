'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React, {useCallback, useEffect, useState} from "react";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useBankChecks} from "@/hooks/finance/use-bank-check";
import {Bank, BankCheck} from "@/types/finance";
import {formatCurrency, formatDate} from "@/utils/date-formater";
import CheckSummary from "@/components/summary/check-summary";


export default function CheckPage() {
    const {
        bankChecks,
        fetchBankChecks
    } = useBankChecks();

    useEffect(() => {
        fetchBankChecks();
    }, []);

    const [filteredData, setFilteredData] = useState<BankCheck[]>([]);

    const router = useRouter();

    useEffect(() => {
        setFilteredData(bankChecks);
    }, [bankChecks]);

    const handleFilteredDataChange = useCallback(<T,>(filtered: T[]) => {
        setFilteredData(filtered as BankCheck[]);
    }, []);

    // Çek durumunu kontrol eden fonksiyon
    const isCheckExpired = (dueDate: string): boolean => {
        const today = new Date();
        const checkDate = new Date(dueDate);
        return checkDate < today;
    };



    const columns: Column<RecordType>[] = [
        {
            key: 'serialNumber',
            header: 'Seri No',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'bank',
            header: 'Banka Adı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                >
                    {value ? (value as Bank).name || 'Bilinmiyor' : ''}
                </div>
            )
        },
        {
            key: 'amount',
            header: 'Tutar',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'dueDate',
            header: 'Tarih',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        },
        {
            key: 'issuer',
            header: 'Sahip',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'bankForCollection',
            header: 'TAHSİLAT BANKASI',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'checkType',
            header: 'Türü',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                >
                    {value as string === "GIVEN" ? 'Verilen Çek' : 'Alınan Çek'}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Durum',
            render: (value, record) => {
                const expired = isCheckExpired((record as BankCheck).dueDate.toString());
                return (
                    <div
                        className={`font-medium cursor-pointer hover:text-blue-600 ${
                            expired || (record as BankCheck).cashingAmount ? 'text-red-600' : 'text-green-600'
                        }`}
                        onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                    >
                        {(record as BankCheck).cashingAmount ? 'TAHSİL EDİLMİŞ' : expired ? 'SÜRESİ DOLMUŞ' :
                            'AKTİF'
                        }
                    </div>
                );
            }
        },
        {
            key: 'cashingDate',
            header: 'Tahsilat',
            render: (value, record) => {
                return (
                    <div
                        className={`font-medium cursor-pointer hover:text-blue-600 text-red-600`}
                        onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                    >
                        {
                            (record as BankCheck).cashingAmount && (record as BankCheck).cashingAmount as number > 0 ? <>
                                {formatDate(value as string)} {(record as BankCheck).cashingAmount && formatCurrency((record as BankCheck).cashingAmount as number)}
                            </> : null
                        }
                    </div>
                );
            }
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: (value, record) => {
                return (
                    <div
                        className={`font-medium cursor-pointer hover:text-blue-600 text-red-600' : 'text-green-600'`}
                        onClick={() => router.push(`/admin/finance/data/check/${record.id}/edit`)}
                    >
                        {value as string}
                    </div>
                );
            }
        }
    ];

    const handleAdd = () => {
        router.push('/admin/finance/data/check/add');
    };

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                />
            }/>
            <div className="p-6 pt-0">
                <CheckSummary data={filteredData}/>
                <DynamicTable columns={columns} data={bankChecks} onFilteredDataChange={handleFilteredDataChange}/>
            </div>
        </div>
    );
}