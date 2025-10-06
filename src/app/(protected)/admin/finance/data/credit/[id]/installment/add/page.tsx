'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import CreditInstallmentForm from "@/components/finance/credit-installment-form";
import {useCreditInstallments} from "@/hooks/finance/use-credit-installment";
import {useParams} from "next/navigation";


const CreateCreditInstallment = () => {
    const {createCreditInstallment} = useCreditInstallments();
    const params = useParams();
    const creditId = params.id as string;


    return (
        <div className="space-y-6">
            <PageHeader/>
            <CreditInstallmentForm onSubmit={createCreditInstallment} creditId={creditId} />
        </div>
    );
};

export default CreateCreditInstallment;