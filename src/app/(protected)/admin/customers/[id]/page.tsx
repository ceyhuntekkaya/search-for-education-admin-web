'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CustomerDetailPage from "@/components/detail/customer-detail";
import PageHeader from "@/components/layout/page-header";

export default function CustomerDetail() {
    const params = useParams();
    const customerId = params.id as string;
    return (
        <div className="bg-white rounded-lg shadow">
            <PageHeader/>
            {
                customerId ?
                    <CustomerDetailPage
                        customerId={customerId}
                    />
                    : null
            }
        </div>
    );
}