'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";
import VehicleDriverForm from "@/components/form/vehicle-driver-form";


const AddVehicleDriver = () => {
    const {createVehicleDriver} = useVehicleDrivers();


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="bg-white rounded-lg shadow">
                <VehicleDriverForm onSubmit={createVehicleDriver} />
            </div>
        </div>
    );
};

export default AddVehicleDriver;