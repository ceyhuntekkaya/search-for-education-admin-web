'use client';

import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useVehicles} from "@/hooks/use-vehicle";
import React, {useEffect} from "react";
import {Column, RecordType} from "@/types/table";
import DynamicTable from "@/components/ui/dynamic-table";
import LoadingComp from "@/components/ui/loading-comp";


export default function VehiclePage() {
    const router = useRouter();
    const {vehicles, fetchVehicles, loading} = useVehicles();

    const columns: Column<RecordType>[] = [
        {
            key: 'mainLicensePlate',
            header: 'Plaka',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/vehicles/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'model',
            header: 'Model',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/vehicles/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];


    const handleAdd = () => {
        router.push('/admin/settings/vehicles/add');
    };



    useEffect(() => {
        fetchVehicles();
    }, []);

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
            }/>

            <div>
                <div className="p-6">
                    <DynamicTable columns={columns} data={vehicles}/>
                </div>
            </div>


        </div>
    );
}