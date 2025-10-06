'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React, {useEffect, useState, useCallback} from "react";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useCredits} from "@/hooks/finance/use-credit";
import {CreditFormData} from "@/types/finance";
import {formatCurrency, formatDate} from "@/utils/date-formater";
import CreditSummary from "@/components/summary/credit-summary";

export default function CreditPage() {
    const {
        creditsWithInstallments,
        fetchCredits,
    } = useCredits();

    // Filtrelenmiş veri için state
    const [filteredData, setFilteredData] = useState<CreditFormData[]>([]);



    useEffect(() => {
        fetchCredits();
    }, []);

    // İlk yüklemede filtrelenmiş veriyi tüm veri olarak set et
    useEffect(() => {
        setFilteredData(creditsWithInstallments);
    }, [creditsWithInstallments]);



    const router = useRouter();

    const getPaidInstallmentsTotal = (credit: CreditFormData): number => {
        if (!credit.installments) return 0;
        return credit.installments
            .filter(installment => installment.paid > 0)
            .reduce((sum, installment) => sum + installment.paid, 0);
    };

    const getRemainingInstallmentsTotal = (credit: CreditFormData): number => {
        if (!credit.installments) return 0;
        return credit.installments
            .reduce((sum, installment) => sum + installment.remaining, 0);
    };

    const hasOverduePayments = (credit: CreditFormData): boolean => {
        if (!credit.installments) return false;
        const today = new Date();
        return credit.installments.some(installment => {
            if (!installment.creditInstallmentDate) return false;
            const installmentDate = new Date(installment.creditInstallmentDate);
            return installmentDate < today && installment.remaining > 0;
        });
    };

    const isCreditClosed = (credit: CreditFormData): boolean => {
        if (!credit.installments || credit.installments.length === 0) return false;
        return credit.installments.every(installment =>
            installment.remaining === 0 || installment.remaining === null
        );
    };

    const getInstallmentProgress = (credit: CreditFormData): string => {
        if (!credit.installments || credit.installments.length === 0) return "0/0";

        const paidCount = credit.installments.filter(installment =>
            installment.remaining === 0 || installment.remaining === null
        ).length;
        const totalCount = credit.installments.length;

        return `${paidCount}/${totalCount}`;
    };

    // Filtrelenmiş veri değiştiğinde çalışacak callback fonksiyonu



    const handleFilteredDataChange = useCallback(<T,>(filtered: T[]) => {
        setFilteredData(filtered as CreditFormData[]);
    }, []);



    const columns: Column<RecordType>[] = [
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'bankName',
            header: 'Banka',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'id',
            header: 'Taksitler',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600 text-white btn btn-success"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/installment`)}
                >
                    TAKSİTLER
                </div>
            )
        },
        {
            key: 'creditDate',
            header: 'Tarih',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        },
        {
            key: 'interestRate',
            header: 'Faiz Oranı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    %{value as string}
                </div>
            )
        },
        {
            key: 'principal',
            header: 'Ana Para',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
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
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'paidAmount',
            header: 'Ödenecek Tutar',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'numberOfInstallments',
            header: 'Taksit Sayısı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'bsmv',
            header: 'BSMV',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        },
        {
            key: 'paidInstallmentsTotal',
            header: 'Ödenen Toplam',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {formatCurrency(getPaidInstallmentsTotal(record as CreditFormData))}
                </div>
            )
        },
        {
            key: 'remainingInstallmentsTotal',
            header: 'Kalan Toplam',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                >
                    {formatCurrency(getRemainingInstallmentsTotal(record as CreditFormData))}
                </div>
            )
        },
        {
            key: 'installmentProgress',
            header: 'Taksit İlerlemesi',
            render: (value, record) => {
                const progress = getInstallmentProgress(record as CreditFormData);
                const [paid, total] = progress.split('/').map(Number);
                const percentage = total > 0 ? (paid / total) * 100 : 0;

                return (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => router.push(`/admin/finance/data/credit/${record.id}/edit`)}
                    >
                        <div className="flex items-center space-x-2">
                            <span className={`${
                                percentage === 100 ? 'text-green-600' :
                                    percentage >= 50 ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                                {progress}
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${
                                        percentage === 100 ? 'bg-green-500' :
                                            percentage >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'overdueStatus',
            header: 'Gecikme Durumu',
            render: (value, record) => {
                const hasOverdue = hasOverduePayments(record as CreditFormData);
                return (
                    <div
                        className={`font-medium cursor-pointer hover:text-blue-600 ${
                            hasOverdue ? 'text-red-600' : 'text-green-600'
                        }`}
                        onClick={() => router.push(`/admin/finance/data/credit/${record.id}/installment`)}
                    >
                        {hasOverdue ? 'VADESİ GEÇMİŞ' : 'GÜNCEL'}
                    </div>
                );
            }
        },
        {
            key: 'creditStatus',
            header: 'Kredi Durumu',
            render: (value, record) => {
                const closed = isCreditClosed(record as CreditFormData);
                return (
                    <div
                        className={`font-medium cursor-pointer hover:text-blue-600 ${
                            closed ? 'text-blue-600' : 'text-orange-600'
                        }`}
                        onClick={() => router.push(`/admin/finance/data/credit/${record.id}/installment`)}
                    >
                        {closed ? 'KAPALI KREDİ' : 'AÇIK KREDİ'}
                    </div>
                );
            }
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
            <div className="p-6 pt-0">
                {/* Özet bilgiler artık filtrelenmiş veriyi kullanıyor */}
                <CreditSummary data={filteredData}/>

                <div
                    className="overflow-x-auto"
                    style={{ maxWidth: 'calc(100vw - var(--sidebar-width, 410px))' }}
                >
                    <DynamicTable
                        columns={columns}
                        data={creditsWithInstallments}
                        onFilteredDataChange={handleFilteredDataChange}
                    />
                </div>
            </div>
        </div>
    );
}