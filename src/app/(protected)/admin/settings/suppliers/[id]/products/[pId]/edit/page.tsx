'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useParams} from "next/navigation";
import ProductForm from "@/components/form/product-form";
import {useProducts} from "@/hooks/use-products";
import {useSuppliers} from "@/hooks/use-supplier";


const ProductEdit = () => {
    const {updateProduct, fetchProductById, selectedProduct} = useProducts();
    const params = useParams();
    const productId = params.id as string;


    const {
        suppliers,
        fetchSuppliers
    } = useSuppliers();




    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                await fetchProductById(productId);
                await fetchSuppliers();

            } catch (error) {
                console.error('Sipariş yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (productId) {
            loadSuppliers();
        }
    }, [productId, fetchSuppliers]);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <ProductForm onSubmit={updateProduct} suppliers={suppliers} selectedProduct={selectedProduct}/>
        </div>
    );
};

export default ProductEdit;