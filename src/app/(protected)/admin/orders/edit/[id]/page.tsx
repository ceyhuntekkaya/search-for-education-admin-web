'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import OrderForm from "@/components/form/order-form";
import {useOrders} from "@/hooks/use-order";
import {useCustomers} from "@/hooks/use-customer";
import {useSuppliers} from "@/hooks/use-supplier";
import {useProducts} from "@/hooks/use-products";
import {useFillingFacilities} from "@/hooks/use-filling-facilities";
import {useParams} from "next/navigation";


const EditOrder = () => {
    const {updateOrder} = useOrders();
    const {customers} = useCustomers();
    const {suppliers} = useSuppliers();
    const {products} = useProducts();
    const {fillingFacilities} = useFillingFacilities();
    const params = useParams();
    const orderId = params.id as string;
    const {
        fetchOrderById,
        selectedOrder
    } = useOrders();

    useEffect(() => {
        const loadOrder = async () => {
            try {
                await fetchOrderById(orderId);
            } catch (error) {
                console.error('Sipariş yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (orderId) {
            loadOrder();
        }
    }, [orderId, fetchOrderById]);

    return (


        <div className="space-y-6">
            <PageHeader/>
            <OrderForm onSubmit={updateOrder} customers={customers} suppliers={suppliers} products={products}
                       fillingFacilities={fillingFacilities} order={selectedOrder}/>

        </div>

    );
};

export default EditOrder;