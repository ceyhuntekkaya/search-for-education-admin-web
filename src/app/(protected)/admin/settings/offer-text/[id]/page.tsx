'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import OfferTextForm from "@/components/form/offer-text-form";
import {useOrders} from "@/hooks/use-order";
import {useParams} from "next/navigation";

const ContractTextDetailPage = () => {
    const params = useParams();
    const offerTextId = params.id as string;

    const {createOfferText, getOfferTextById, selectedOfferText} = useOrders();


    useEffect(() => {
        const loadOfferText = async () => {
            try {
                await getOfferTextById(offerTextId);
            } catch (error) {
                console.error('Sipariş yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (offerTextId) {
            loadOfferText();
        }
    }, [offerTextId, getOfferTextById]);


    return (
        <div className="space-y-6">
            <PageHeader/>
            <OfferTextForm onSubmit={createOfferText} offerText={selectedOfferText} />
        </div>
    );
};

export default ContractTextDetailPage;