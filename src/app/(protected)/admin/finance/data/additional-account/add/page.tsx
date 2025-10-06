'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import AdditionalAccountForm from "@/components/finance/additional-account-form";
import {useAdditionalAccounts} from "@/hooks/finance/use-additional-account";


const AdditionalAccountAdd = () => {
    const {createAdditionalAccount} = useAdditionalAccounts();
    return (
        <div className="space-y-6">
            <PageHeader/>
            <AdditionalAccountForm onSubmit={createAdditionalAccount} />
        </div>
    );
};

export default AdditionalAccountAdd;