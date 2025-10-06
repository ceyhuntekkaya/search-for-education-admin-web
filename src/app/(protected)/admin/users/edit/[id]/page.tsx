'use client';

import React, {useEffect} from 'react';
import PageHeader from "@/components/layout/page-header";
import {useUsers} from "@/hooks/use-user";
import {useDataContext} from "@/contexts/data-context";
import UserForm from "@/components/form/user-form";
import {useParams} from "next/navigation";

const CreateUser = () => {
    const {updateUser} = useUsers();
    const {transportationCompanies} = useDataContext();
    const params = useParams();
    const userId = params.id as string;

    const {
        selectedUser,
        fetchUserById,
    } = useUsers();

    useEffect(() => {
        const loadUser = async () => {
            try {
                await fetchUserById(userId);
            } catch (err) {
                console.error('Error loading user:', err);
            }
        };

        if (userId) {
            loadUser();
        }
    }, [userId, fetchUserById]);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="bg-white rounded-lg shadow">
                {
                    selectedUser &&
                    <UserForm onSubmit={updateUser} transportationCompanies={transportationCompanies || []}
                              selectedUser={selectedUser}/>
                }

            </div>
        </div>
    );
};

export default CreateUser;