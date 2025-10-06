'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useCreditCards} from "@/hooks/finance/use-credit-card";
import CreditCardForm from "@/components/finance/credit-card-form";
import {useParams} from "next/navigation";


const EditCreditCard = () => {
    const {updateCreditCard, fetchCreditCardById, selectedCreditCard} = useCreditCards();

    const params = useParams();
    const id = params.id as string;
    if (!id) {
        throw new Error("Credit ID is required");
    }

    useEffect(() => {
        fetchCreditCardById(id);
    }, []);



    return (
        <div className="space-y-6">
            <PageHeader/>
            <CreditCardForm onSubmit={updateCreditCard} selectedCreditCard={selectedCreditCard} />
        </div>
    );
};

export default EditCreditCard;