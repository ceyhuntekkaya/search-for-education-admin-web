'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";
import VehicleDriverForm from "@/components/form/vehicle-driver-form";
import {useParams} from "next/navigation";


const EditVehicleDriver = () => {
    const params = useParams();
    const selectedVehicleDriverId = params.id as string;
    const {updateVehicleDriver} = useVehicleDrivers();


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="bg-white rounded-lg shadow">
                <VehicleDriverForm onSubmit={updateVehicleDriver} selectedVehicleDriverId={selectedVehicleDriverId}/>
            </div>
        </div>
    );
};

export default EditVehicleDriver;