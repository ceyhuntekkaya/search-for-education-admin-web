'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useOffers} from "@/hooks/use-offer";
import {useOrders} from "@/hooks/use-order";
import {useTransportationCompanies} from "@/hooks/use-transportation-company";
import {useVehicles} from "@/hooks/use-vehicle";
import OfferForm from "@/components/form/offer-form";
import {useProductPriceTracking} from "@/hooks/use-product-price-tracking";


const CreateOffer = () => {
   const {createOffer} = useOffers();
    const {orders, fetchBaseOrders} = useOrders();
    const {offers, fetchOffers} = useOffers();
    const {transportationCompanies} = useTransportationCompanies();
    const {vehicles} = useVehicles();

    const {
        fetchProductPriceTracking,
        productPriceTracking
    } = useProductPriceTracking();


    useEffect(() => {
        const loadProductPriceTracking = async () => {
            try {
                await fetchProductPriceTracking();
                await fetchOffers();
                await fetchBaseOrders();
            } catch (error) {
                console.error('Sipariş yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        loadProductPriceTracking();
    }, [fetchBaseOrders, fetchOffers, fetchProductPriceTracking]);

    return (
        <div className="space-y-6">
            <PageHeader/>

                <OfferForm productPriceTrackingList={productPriceTracking} onSubmit={createOffer} orders={orders} transportationCompanies={transportationCompanies} vehicles={vehicles} offers={offers}/>
        </div>
    );
};

export default CreateOffer;