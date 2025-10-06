'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React, {useCallback, useEffect, useState} from "react";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useLetterOfGuarantees} from "@/hooks/finance/use-letter-of-guarantee";
import {LetterOfGuarantee, Bank} from "@/types/finance";
import {formatCurrency, formatDate} from "@/utils/date-formater";
import LetterSummary from "@/components/summary/letter-summary";


export default function LetterPage() {
    const {
        letterOfGuarantees,
        fetchLetterOfGuarantees
    } = useLetterOfGuarantees();

    useEffect(() => {
        fetchLetterOfGuarantees();
    }, []);

    const [filteredData, setFilteredData] = useState<LetterOfGuarantee[]>([]);

    const router = useRouter();

    useEffect(() => {
        setFilteredData(letterOfGuarantees);
    }, [letterOfGuarantees]);

    const handleFilteredDataChange = useCallback(<T,>(filtered: T[]) => {
        setFilteredData(filtered as LetterOfGuarantee[]);
    }, []);

    // Teminat mektubunun süresinin dolup dolmadığını kontrol eden fonksiyon
    const isLetterExpired = (duration: string): boolean => {
        const today = new Date();
        const letterExpiry = new Date(duration);
        return letterExpiry < today;
    };


    const columns: Column<RecordType>[] = [
        {
            key: 'bank',
            header: 'Banka',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/letter/${record.id}/edit`)}
                >
                    {(value as Bank).name || 'Bilinmiyor'}
                </div>
            )
        },
        {
            key: 'interlocutor',
            header: 'Muhatap',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/letter/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'letterNumber',
            header: 'Numarası',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/letter/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'letterDate',
            header: 'Tarihi',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/letter/${record.id}/edit`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        },
        {
            key: 'duration',
            header: 'Vade Tarihi',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/letter/${record.id}/edit`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        },
        {
            key: 'amount',
            header: 'Tutar',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/letter/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Durum',
            render: (value, record) => {
                const expired = isLetterExpired((record as LetterOfGuarantee).duration);
                return (
                    <div
                        className={`font-medium cursor-pointer hover:text-blue-600 ${
                            expired && (record as LetterOfGuarantee).duration ? 'text-red-600' : 'text-green-600'
                        }`}
                        onClick={() => router.push(`/admin/finance/data/letter/${record.id}/edit`)}
                    >
                        {
                            !(record as LetterOfGuarantee).duration ? "SÜRESİZ":
                         expired ? 'SÜRESİ DOLMUŞ' : 'AKTİF'}
                    </div>
                );
            }
        }
    ];

    const handleAdd = () => {
        router.push('/admin/finance/data/letter/add');
    };

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                />
            }/>
            <div className="p-6 pt-0">
                <LetterSummary data={filteredData}/>
                <DynamicTable columns={columns} data={letterOfGuarantees} onFilteredDataChange={handleFilteredDataChange}/>
            </div>
        </div>
    );
}