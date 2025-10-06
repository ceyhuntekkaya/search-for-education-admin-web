'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import BankForm from "@/components/finance/bank-form";
import {useBanks} from "@/hooks/finance/use-bank";


const CreateBank = () => {
    const {createBank} = useBanks();
    return (
        <div className="space-y-6">
            <PageHeader/>
            <BankForm onSubmit={createBank} />
        </div>
    );
};

export default CreateBank;