'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useBankChecks} from "@/hooks/finance/use-bank-check";
import BankCheckForm from "@/components/finance/bank-check-form";
import {useParams} from "next/navigation";


const EditCheck = () => {
    const {updateBankCheck, selectedBankCheck, fetchBankCheckById} = useBankChecks();

    const params = useParams();
    const id = params.id as string;
    if (!id) {
        throw new Error("Credit ID is required");
    }

    useEffect(() => {
        fetchBankCheckById(id);
    }, []);


    return (
        <div className="space-y-6">
            <PageHeader/>
            <BankCheckForm onSubmit={updateBankCheck} selectedBankCheck={selectedBankCheck} />
        </div>
    );
};

export default EditCheck;