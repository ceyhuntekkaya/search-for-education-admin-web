'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import {useBankChecks} from "@/hooks/finance/use-bank-check";
import BankCheckForm from "@/components/finance/bank-check-form";


const CreateCheck = () => {
    const {createBankCheck} = useBankChecks();
    return (
        <div className="space-y-6">
            <PageHeader/>
            <BankCheckForm onSubmit={createBankCheck} />
        </div>
    );
};

export default CreateCheck;