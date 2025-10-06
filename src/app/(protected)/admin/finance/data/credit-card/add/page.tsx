'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import {useCreditCards} from "@/hooks/finance/use-credit-card";
import CreditCardForm from "@/components/finance/credit-card-form";


const CreateCreditCard = () => {
    const {createCreditCard} = useCreditCards();
    return (
        <div className="space-y-6">
            <PageHeader/>
            <CreditCardForm onSubmit={createCreditCard} />
        </div>
    );
};

export default CreateCreditCard;