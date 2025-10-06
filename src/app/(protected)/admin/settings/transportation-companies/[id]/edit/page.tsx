'use client';

import {useTransportationCompanies} from "@/hooks/use-transportation-company";
import CreateTransportationCompanyForm from "@/components/form/transfer-company-form";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import {useParams} from "next/navigation";

export default function EditTransportationCompany() {
    const params = useParams();
    const selectedTransportationCompanyId = params.id as string;
    const {updateTransportationCompany} = useTransportationCompanies();

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
            <CreateTransportationCompanyForm onSubmit={updateTransportationCompany} selectedTransportationCompanyId={selectedTransportationCompanyId}
                                             existingCompanies={transportationCompanies} users={[]}/>

        </div>
    );
}