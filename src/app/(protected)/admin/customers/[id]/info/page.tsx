'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import {useParams} from "next/navigation";
import CustomerInfoForm from "@/components/form/customer-info-form";
import {useCustomerInfos} from "@/hooks/use-customer-info";


const CreateCustomerInfo = () => {
    const {createCustomerInfo} = useCustomerInfos();
    const params = useParams();
    const customerId = params.id as string;



    return (
        <div className="space-y-6">
            <PageHeader/>
            <CustomerInfoForm onSubmit={createCustomerInfo} customerId={customerId}/>
        </div>
    );
};

export default CreateCustomerInfo;