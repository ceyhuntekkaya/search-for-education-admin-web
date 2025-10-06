'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useParams} from "next/navigation";
import AdditionalAccountForm from "@/components/finance/additional-account-form";
import {useAdditionalAccounts} from "@/hooks/finance/use-additional-account";


const EditBank = () => {
    const {updateAdditionalAccount, selectedAdditionalAccount, fetchAdditionalAccountById} = useAdditionalAccounts();

    const params = useParams();
    const id = params.id as string;
    if (!id) {
        throw new Error("Credit ID is required");
    }

    useEffect(() => {
        fetchAdditionalAccountById(id);
    }, []);


    return (
        <div className="space-y-6">
            <PageHeader/>
            <AdditionalAccountForm onSubmit={updateAdditionalAccount} selectedAdditionalAccount={selectedAdditionalAccount} />
        </div>
    );
};

export default EditBank;