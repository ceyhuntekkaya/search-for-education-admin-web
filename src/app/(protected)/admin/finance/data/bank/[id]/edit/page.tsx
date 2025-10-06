'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import BankForm from "@/components/finance/bank-form";
import {useBanks} from "@/hooks/finance/use-bank";
import {useParams} from "next/navigation";


const EditBank = () => {
    const {updateBank, selectedBank, fetchBankById} = useBanks();

    const params = useParams();
    const id = params.id as string;
    if (!id) {
        throw new Error("Credit ID is required");
    }

    useEffect(() => {
        fetchBankById(id);
    }, []);


    return (
        <div className="space-y-6">
            <PageHeader/>
            <BankForm onSubmit={updateBank} selectedBank={selectedBank} />
        </div>
    );
};

export default EditBank;