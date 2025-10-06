'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import {useCustomerAddress} from "@/hooks/use-customer-address";
import {useParams} from "next/navigation";
import CustomerAddressForm from "@/components/form/customer-address-form";


const CreateCustomerAddress = () => {
    const {createCustomerAddress} = useCustomerAddress();
    const params = useParams();
    const customerId = params.id as string;



    return (
        <div className="space-y-6">
            <PageHeader/>
            <CustomerAddressForm onSubmit={createCustomerAddress} customerId={customerId}/>
        </div>
    );
};

export default CreateCustomerAddress;