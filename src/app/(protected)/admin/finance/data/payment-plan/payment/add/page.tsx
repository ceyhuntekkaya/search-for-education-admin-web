'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import PaymentPlanForm from "@/components/finance/payment-plan-form";
import {usePaymentPlans} from "@/hooks/finance/use-payment-plan";


const CreateCheck = () => {
    const {createPaymentPlan} = usePaymentPlans();
    return (
        <div className="space-y-6">
            <PageHeader/>
            <PaymentPlanForm onSubmit={createPaymentPlan} paymentPlanType={"PAYMENTS"} />
        </div>
    );
};

export default CreateCheck;