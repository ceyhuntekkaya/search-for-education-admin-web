'use client';
import {Column, RecordType} from "@/types/table";
import {useTransportationCompanies} from "@/hooks/use-transportation-company";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";

export default function TransportationCompaniesPage() {
    const router = useRouter();
    const {
        transportationCompanies,
        loading,
        fetchTransportationCompanies
    } = useTransportationCompanies();


    useEffect(() => {
        fetchTransportationCompanies();
    }, []);


    const columns: Column<RecordType>[] = [
        {
            key: 'name',
            header: 'Nakliye Firması',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/transportation-companies/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'taxNumber',
            header: 'Vergi Numarası',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/transportation-companies/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/settings/transportation-companies/add');
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
                    onAdd={handleAdd}

                />
            }
            />

            <div className="p-6">
                <DynamicTable columns={columns} data={transportationCompanies}/>
            </div>
        </div>
    );
}