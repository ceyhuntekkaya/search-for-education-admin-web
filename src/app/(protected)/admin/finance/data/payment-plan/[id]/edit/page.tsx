'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import PaymentPlanForm from "@/components/finance/payment-plan-form";
import {usePaymentPlans} from "@/hooks/finance/use-payment-plan";
import {useParams} from "next/navigation";


const PaymentPlanUpdate = () => {

    const params = useParams();
    const id = params.id as string;
    if (!id) {
        throw new Error("Plan ID is required");
    }


    const {updatePaymentPlan, selectedPaymentPlanData, fetchPaymentPlanById, fetchPaymentPlanInstallments, paymentPlanInstallments} = usePaymentPlans();


    useEffect(() => {
        fetchPaymentPlanById(id);
        fetchPaymentPlanInstallments(id);
    }, []);
    //PaymentPlanFormData
    return (
        <div className="space-y-6">
            <PageHeader/>
            <PaymentPlanForm onSubmit={updatePaymentPlan} selectedPaymentPlanData={selectedPaymentPlanData}
                             paymentPlanGroupId={selectedPaymentPlanData?.paymentPlanGroupDto?.id}
                             paymentPlanInstallments={paymentPlanInstallments} paymentPlanType={selectedPaymentPlanData?.paymentPlanGroupDto?.paymentPlanType || null}/>
        </div>
    );
};

export default PaymentPlanUpdate;