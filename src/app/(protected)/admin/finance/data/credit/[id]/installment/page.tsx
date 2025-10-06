'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React, {useEffect} from "react";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useParams, useRouter} from "next/navigation";
import {formatCurrency, formatDate} from "@/utils/date-formater";
import {useCreditInstallments} from "@/hooks/finance/use-credit-installment";


export default function CreditPage() {
    const {
        creditInstallments,
        fetchCreditInstallmentsByCreditId
    } = useCreditInstallments();

    const params = useParams();
    const id = params.id as string;
    if (!id) {
        throw new Error("Credit ID is required");
    }

    useEffect(() => {
        fetchCreditInstallmentsByCreditId(id);
    }, []);

    const router = useRouter();

    const columns: Column<RecordType>[] = [
        {
            key: 'installmentNo',
            header: 'Taksit',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${id}/installment/edit/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'creditInstallmentDate',
            header: 'Tarih',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${id}/installment/edit/${record.id}`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        },

        {
            key: 'principal',
            header: 'Ana Para',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${id}/installment/edit/${record.id}`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'interest',
            header: 'Faiz',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${id}/installment/edit/${record.id}`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'bsmv',
            header: 'bsmv',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${id}/installment/edit/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'paidAmount',
            header: 'Ödenecek',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${id}/installment/edit/${record.id}`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,
        {
            key: 'paid',
            header: 'Ödenen',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${id}/installment/edit/${record.id}`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,
        {
            key: 'remaining',
            header: 'Kalan',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${id}/installment/edit/${record.id}`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }

    ];

    const handleAdd = () => {
        router.push('/admin/finance/data/credit/add');
    };

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                />
            }/>
            <div className="p-6">
                <DynamicTable columns={columns} data={creditInstallments} searchable={false} />
            </div>
        </div>
    );
}