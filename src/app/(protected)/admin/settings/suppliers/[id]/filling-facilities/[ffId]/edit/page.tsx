'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useParams} from "next/navigation";
import {useSuppliers} from "@/hooks/use-supplier";
import FillingFacilityForm from "@/components/form/filling-facility-form";
import {useFillingFacilities} from "@/hooks/use-filling-facilities";
import {useProducts} from "@/hooks/use-products";


const FillingFacilityEdit = () => {
    const {updateFillingFacility, fetchFillingFacilityById, selectedFillingFacility} = useFillingFacilities();
    const params = useParams();
    const fillingFacilitytId = params.id as string;


    const {
        suppliers,
        fetchSuppliers
    } = useSuppliers();

    const {
        products,
        fetchProducts
    } = useProducts();




    useEffect(() => {
        const loadFillingFacility = async () => {
            try {
                await fetchFillingFacilityById(fillingFacilitytId);
                await fetchSuppliers();
                await fetchProducts();
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (fillingFacilitytId) {
            loadFillingFacility();
        }
    }, [fillingFacilitytId, fetchSuppliers, fetchFillingFacilityById, fetchProducts]);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <FillingFacilityForm onSubmit={updateFillingFacility} suppliers={suppliers} products={products} selectedFillingFacility={selectedFillingFacility}/>
        </div>
    );
};

export default FillingFacilityEdit;