'use client';

import React, {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import PageHeader from "@/components/layout/page-header";
import {useOfferApprovals} from "@/hooks/use-offer-approval";
import OfferApprovalForm from "@/components/form/offer-approval-form";
import {useOffers} from "@/hooks/use-offer";


export default function OfferApprovalDetail() {
    const params = useParams();
    const router = useRouter();
    const offerApprovalIs = params.id as string;

    const {
        selectedOfferApproval,
        fetchOfferApprovalById,
        updateOfferApproval,
    } = useOfferApprovals();
    const {offers, fetchOffers} = useOffers();

    useEffect(() => {
        const loadOffer = async () => {
            try {
                await fetchOfferApprovalById(offerApprovalIs);
                await fetchOffers();
            } catch (error) {
                console.error('Sipariş yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (offerApprovalIs) {
            loadOffer();
        }
    }, [offerApprovalIs, fetchOfferApprovalById, fetchOffers]);



    return (
        <div className="bg-white rounded-lg shadow">
            <PageHeader/>
            {
                selectedOfferApproval ?
                    <OfferApprovalForm
                        offers={offers}
                        offerApproval={selectedOfferApproval}
                        onSubmit={updateOfferApproval}
                        offer={selectedOfferApproval.offer}
                        onCreate={()=> router.push('/admin/offer-approvals')}
                    />
                    : null
            }

        </div>
    );
}
