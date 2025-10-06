'use client';

import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";
import React, {useEffect} from "react";
import {Column, RecordType} from "@/types/table";
import DynamicTable from "@/components/ui/dynamic-table";
import {User} from "@/types/auth";
import {TransportationCompany} from "@/types/transportation-company";
import LoadingComp from "@/components/ui/loading-comp";


export default function VehicleDriverPage() {
    const router = useRouter();
    const {vehicleDrivers, fetchVehicleDrivers, loading} = useVehicleDrivers();

    const columns: Column<RecordType>[] = [
        {
            key: 'user',
            header: 'Personel',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/vehicle-drivers/${record.id}`)}
                >
                    {(value as User).name} {(value as User).lastName}
                </div>
            )
        },
        {
            key: 'transportationCompany',
            header: 'Firma',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/vehicle-drivers/${record.id}`)}
                >
                    {(value as TransportationCompany).name}
                </div>

            )
        }
    ];


    const handleAdd = () => {
        router.push('/admin/settings/vehicle-drivers/add');
    };



    useEffect(() => {
        fetchVehicleDrivers();
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
                    <DynamicTable columns={columns} data={vehicleDrivers}/>
                </div>
            </div>


        </div>
    );
}