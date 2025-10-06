'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import CreditForm from "@/components/finance/credit-form";
import {useCredits} from "@/hooks/finance/use-credit";
import {useParams} from "next/navigation";


const EditCheck = () => {
    const {updateCredit, selectedCredit, fetchCreditById} = useCredits();

    const params = useParams();
    const id = params.id as string;
    if (!id) {
        throw new Error("Credit ID is required");
    }

    useEffect(() => {
        fetchCreditById(id);
    }, []);



    return (
        <div className="space-y-6">
            <PageHeader/>
            <CreditForm onSubmit={updateCredit} selectedCredit={selectedCredit} />
        </div>
    );
};

export default EditCheck;