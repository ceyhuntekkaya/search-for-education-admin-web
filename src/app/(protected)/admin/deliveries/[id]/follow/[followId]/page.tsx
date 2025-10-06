'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useVehicles} from "@/hooks/use-vehicle";
import {useVehicleFollows} from "@/hooks/use-vehicle-follow";
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";
import VehicleFollowForm from "@/components/form/vehicle-follow-form";
import {useParams} from "next/navigation";


const UpdateVehicleFollow = () => {
    const {createVehicleFollow} = useVehicleFollows();
    const {vehicles, fetchVehicles} = useVehicles();
    const {vehicleDrivers, fetchVehicleDrivers} = useVehicleDrivers();

    const params = useParams();
    const deliveryId = params.id as string;
    const followId = params.followId as string;



    useEffect(() => {
        const loadVehicleFollow = async () => {
            try {
                await fetchVehicles();
                await fetchVehicleDrivers();
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        loadVehicleFollow();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <VehicleFollowForm selectedVehicleFollowId={followId} deliveryId={deliveryId} onSubmit={createVehicleFollow} vehicles={vehicles} vehicleDrivers={vehicleDrivers}/>
        </div>
    );
};

export default UpdateVehicleFollow;