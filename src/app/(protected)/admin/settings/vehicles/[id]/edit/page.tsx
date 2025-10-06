'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import {useVehicles} from "@/hooks/use-vehicle";
import VehicleForm from "@/components/form/vehicle-form";
import {useParams} from "next/navigation";


const EditVehicle = () => {
    const params = useParams();
    const selectedVehicleId = params.id as string;
    const {updateVehicle} = useVehicles();


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="bg-white rounded-lg shadow">
                <VehicleForm onSubmit={updateVehicle} selectedVehicleId={selectedVehicleId}/>
            </div>
        </div>
    );
};

export default EditVehicle;