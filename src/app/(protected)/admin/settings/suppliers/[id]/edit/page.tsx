'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useParams} from "next/navigation";
import {useSuppliers} from "@/hooks/use-supplier";
import SupplierForm from "@/components/form/supplier-form";


const SuppliersEdit = () => {
    const {updateSupplier, fetchSupplierById, selectedSupplier , fetchSuppliers} = useSuppliers();
    const params = useParams();
    const supplierId = params.id as string;


    useEffect(() => {
        const loadSupplier = async () => {
            try {
                await fetchSupplierById(supplierId);
                await fetchSuppliers();
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (supplierId) {
            loadSupplier();
        }
    }, [supplierId, fetchSupplierById]);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <SupplierForm onSubmit={updateSupplier} selectedSupplier={selectedSupplier}/>
        </div>
    );
};

export default SuppliersEdit;