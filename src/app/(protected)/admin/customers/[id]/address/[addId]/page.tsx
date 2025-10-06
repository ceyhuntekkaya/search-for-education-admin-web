'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useCustomerAddress} from "@/hooks/use-customer-address";
import {useParams} from "next/navigation";
import CustomerAddressForm from "@/components/form/customer-address-form";


const EditCustomerAddress = () => {
    const {updateCustomerAddress} = useCustomerAddress();
    const params = useParams();
    const customerId = params.id as string;
    const addressIdId = params.addId as string;



    const {
        selectedCustomerAddress,
        fetchCustomerAddressById
    } = useCustomerAddress();


    useEffect(() => {
        const loadCustomerAddress = async () => {
            try {
                await fetchCustomerAddressById(addressIdId);
            } catch (error) {
                console.error('Sevkiyat yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (addressIdId) {
            loadCustomerAddress();
        }
    }, [addressIdId, customerId, fetchCustomerAddressById]);



    return (
        <div className="space-y-6">
            <PageHeader/>
            <CustomerAddressForm onSubmit={updateCustomerAddress} customerId={customerId} customerAddress={selectedCustomerAddress}/>
        </div>
    );
};

export default EditCustomerAddress;