'use client';

import {useTransportationCompanies} from "@/hooks/use-transportation-company";
import CreateTransportationCompanyForm from "@/components/form/transfer-company-form";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";

export default function AddTransportationCompany() {
    const {createTransportationCompany} = useTransportationCompanies();

    const {
        transportationCompanies,
        fetchTransportationCompanies
    } = useTransportationCompanies();


    useEffect(() => {
        fetchTransportationCompanies();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <CreateTransportationCompanyForm onSubmit={createTransportationCompany}
                                             existingCompanies={transportationCompanies} users={[]}/>

        </div>
    );
}