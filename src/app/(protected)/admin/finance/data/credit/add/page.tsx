'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import CreditForm from "@/components/finance/credit-form";
import {useCredits} from "@/hooks/finance/use-credit";


const CreateCheck = () => {
    const {createCredit} = useCredits();
    return (
        <div className="space-y-6">
            <PageHeader/>
            <CreditForm onSubmit={createCredit} />
        </div>
    );
};

export default CreateCheck;