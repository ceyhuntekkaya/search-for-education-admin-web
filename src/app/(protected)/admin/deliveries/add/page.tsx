'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import DeliveryForm from "@/components/form/delivery-form";
import {useDeliveries} from "@/hooks/use-delivery";
import {useOffers} from "@/hooks/use-offer";
import LoadingComp from "@/components/ui/loading-comp";
import {useVehicles} from "@/hooks/use-vehicle";
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";


const CreateDelivery = () => {
    const {createDelivery} = useDeliveries();
    const {offers, fetchOffers, loading} = useOffers();
    const {deliveries} = useDeliveries();
    const {vehicles, fetchVehicles} = useVehicles();
    const {vehicleDrivers, fetchVehicleDrivers} = useVehicleDrivers();

    useEffect(() => {
        fetchOffers();
        fetchVehicles();
        fetchVehicleDrivers();
    }, []);


    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            <DeliveryForm onSubmit={createDelivery} offers={offers} vehicles={vehicles} vehicleDrivers={vehicleDrivers} deliveries={deliveries} />

        </div>
    );
};

export default CreateDelivery;