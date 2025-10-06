'use client';

import React from 'react';
import PageHeader from "@/components/layout/page-header";
import { useUsers } from "@/hooks/use-user";
import { useDataContext } from "@/contexts/data-context";
import UserForm from "@/components/form/user-form";

const CreateUser = () => {
    const { createUser } = useUsers();
    const { transportationCompanies } = useDataContext();

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="bg-white rounded-lg shadow">
                <UserForm onSubmit={createUser} transportationCompanies={transportationCompanies || []} />
            </div>
        </div>
    );
};

export default CreateUser;