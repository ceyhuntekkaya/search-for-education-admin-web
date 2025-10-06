'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useOffers} from "@/hooks/use-offer";
import {useTransportationCompanies} from "@/hooks/use-transportation-company";
import {useVehicles} from "@/hooks/use-vehicle";
import OfferForm from "@/components/form/offer-form";
import {useParams} from "next/navigation";
import {useProductPriceTracking} from "@/hooks/use-product-price-tracking";


const EditOffer = () => {
    const {updateOffer} = useOffers();
    const {transportationCompanies} = useTransportationCompanies();
    const {vehicles} = useVehicles();
    const params = useParams();
    const offerId = params.id as string;


    const {
        fetchOfferById,
        selectedOffer
    } = useOffers();

    const {
        fetchProductPriceTracking,
        productPriceTracking
    } = useProductPriceTracking();


    useEffect(() => {
        const loadOffer = async () => {
            try {
                await fetchOfferById(offerId);
                await fetchProductPriceTracking();
            } catch (error) {
                console.error('Sipariş yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (offerId) {
            loadOffer();
        }
    }, [offerId, fetchOfferById, fetchProductPriceTracking]);

    return (
        <div className="space-y-6">
            <PageHeader/>
            {
                selectedOffer &&

                <OfferForm productPriceTrackingList={productPriceTracking} onSubmit={updateOffer}
                           orders={[selectedOffer.order]} transportationCompanies={transportationCompanies}
                           vehicles={vehicles} offer={selectedOffer}/>
            }
        </div>
    );
};

export default EditOffer;