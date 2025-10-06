'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import {useVehicles} from "@/hooks/use-vehicle";
import VehicleForm from "@/components/form/vehicle-form";


const CreateVehicle = () => {
    const {createVehicle} = useVehicles();


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="bg-white rounded-lg shadow">
                <VehicleForm onSubmit={createVehicle} />
            </div>
        </div>
    );
};

export default CreateVehicle;