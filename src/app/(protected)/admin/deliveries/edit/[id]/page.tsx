'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import DeliveryForm from "@/components/form/delivery-form";
import {useDeliveries} from "@/hooks/use-delivery";
import {useOffers} from "@/hooks/use-offer";
import LoadingComp from "@/components/ui/loading-comp";
import {useParams} from "next/navigation";
import {useVehicles} from "@/hooks/use-vehicle";
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";


const EditDelivery = () => {
    const {updateDelivery} = useDeliveries();
    const {fetchOffers, loading} = useOffers();

    const {vehicles, fetchVehicles} = useVehicles();
    const {vehicleDrivers, fetchVehicleDrivers} = useVehicleDrivers();


    const params = useParams();
    const deliveryId = params.id as string;

    useEffect(() => {
        fetchOffers();
        fetchVehicles();
        fetchVehicleDrivers();
    }, []);

    const {
        fetchDeliveryById,
        selectedDelivery
    } = useDeliveries();


    useEffect(() => {
        const loadOrder = async () => {
            try {
                await fetchDeliveryById(deliveryId);
            } catch (error) {
                console.error('Sevkiyat yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (deliveryId) {
            loadOrder();
        }
    }, [deliveryId, fetchDeliveryById]);


    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            {
                selectedDelivery &&  <DeliveryForm delivery={selectedDelivery} onSubmit={updateDelivery} offers={[selectedDelivery.offer]} vehicles={vehicles} vehicleDrivers={vehicleDrivers}/>
            }


        </div>
    );
};

export default EditDelivery;