'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import CreditInstallmentForm from "@/components/finance/credit-installment-form";
import {useCreditInstallments} from "@/hooks/finance/use-credit-installment";
import {useParams} from "next/navigation";


const EditCreditInstallment = () => {
    const {updateCreditInstallment, fetchCreditInstallmentById, selectedCreditInstallment} = useCreditInstallments();

    const params = useParams();
    const creditId = params.id as string;
    const id = params.installmentId as string;
    if (!id) {
        throw new Error("Credit ID is required");
    }

    useEffect(() => {
        fetchCreditInstallmentById(id);
    }, []);






    return (
        <div className="space-y-6">
            <PageHeader/>
            <CreditInstallmentForm onSubmit={updateCreditInstallment} creditId={creditId} selectedCreditInstallment={selectedCreditInstallment} />
        </div>
    );
};

export default EditCreditInstallment;