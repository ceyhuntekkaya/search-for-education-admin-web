'use client';

import {useCustomers} from "@/hooks/use-customer";
import CustomerForm from "@/components/form/customer-form";

export default function CustomerPage() {
    const {createCustomer} = useCustomers();

    return (
        <div className="space-y-6">
            <CustomerForm onSubmit={createCustomer}/>
        </div>
    );
}