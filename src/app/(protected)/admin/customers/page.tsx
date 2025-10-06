'use client';
import {Column, RecordType} from "@/types/table";
import {useCustomers} from "@/hooks/use-customer";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {SqlRequest} from "@/types/sql-type";
import LoadingComp from "@/components/ui/loading-comp";

export default function CustomerPage() {
    const router = useRouter();
    const {
        customers,
        loading,
        fetchCustomers,
        getCustomersFromData
    } = useCustomers();

    useEffect(() => {
        fetchCustomers(true);
    }, []);

    const columns: Column<RecordType>[] = [
        {
            key: 'name',
            header: 'Müşteri',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/customers/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'taxNumber',
            header: 'Muhasebe Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/customers/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];

    const handleExport = () => {
        const sqlRequest: SqlRequest = {
            database: "2025",
            code: "120",
            startAt: "2025-01-01",
            endAt: "2025-12-01"
        };
        getCustomersFromData(sqlRequest)
    };

    if (loading) {
        return (
            <LoadingComp/>
        );
    }
    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleExport}
                    addButtonText="Müşteri Bilgierini Çek"
                />
            }/>
            <div className="p-6">
                <DynamicTable columns={columns} data={customers}/>
            </div>
        </div>
    );
}