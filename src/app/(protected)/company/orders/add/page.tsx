'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import OrderForm from "@/components/form/order-form";
import {useOrders} from "@/hooks/use-order";
import {useCustomers} from "@/hooks/use-customer";
import {useSuppliers} from "@/hooks/use-supplier";
import {useProducts} from "@/hooks/use-products";
import {useFillingFacilities} from "@/hooks/use-filling-facilities";
import {useAuth} from "@/hooks/use-auth";


const CreateOrder = () => {
    const {createOrder} = useOrders();
    const {customers} = useCustomers();
    const {suppliers} = useSuppliers();
    const {products} = useProducts();
    const {fillingFacilities} = useFillingFacilities();
    const {user} = useAuth();


    return (


        <div className="space-y-6">
            <PageHeader/>
            <OrderForm onSubmit={createOrder} customerId={user?.connectionId} customers={customers}
                       suppliers={suppliers} products={products}
                       fillingFacilities={fillingFacilities}/>

        </div>

    );
};

export default CreateOrder;