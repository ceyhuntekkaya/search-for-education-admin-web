'use client';
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useAuth} from "@/hooks/use-auth";
import {Role} from "@/types/auth";
import CreditSummary from "@/components/summary/credit-summary";
import UserApprovals from "@/components/summary/user-approval";
import CreditCardSummary from "@/components/summary/credit-card-summary";
import LetterSummary from "@/components/summary/letter-summary";
import CheckSummary from "@/components/summary/check-summary";
import AdditionalAccountSummary from "@/components/summary/additional-account-summary";
import BankSummary from "@/components/summary/bank-summary";
import OrderSummary from "@/components/summary/order-summary";


export default function AdminPage() {

    const {hasRole, hasAnyDepartment} = useAuth();

    /*
     const {hasAnyPermission} = useAuth();
        const chaekPermission = (permissons: Permission[]) => {
            return hasAnyPermission(permissons);
        }

     */

    const chaekRole = (role: Role) => {
        return hasRole(role);
    }

    return (
        <div className="space-y-6 pt-0">
            <div className="space-y-6">
                <PageHeader/>
                <div className="p-6 pt-0">

                    {
                        ((hasAnyDepartment("FINANCE") || hasAnyDepartment("MANAGEMENT")) && chaekRole('ADMIN')) &&
                        <CreditSummary/>
                    }

                    {
                        ((hasAnyDepartment("FINANCE") || hasAnyDepartment("MANAGEMENT")) && chaekRole('ADMIN')) &&
                        <CreditCardSummary/>
                    }


                    {
                        ((hasAnyDepartment("FINANCE") || hasAnyDepartment("MANAGEMENT")) && chaekRole('ADMIN')) &&
                        <LetterSummary/>
                    }

                    {
                        ((hasAnyDepartment("FINANCE") || hasAnyDepartment("MANAGEMENT")) && chaekRole('ADMIN')) &&
                        <CheckSummary/>
                    }
                    {
                        ((hasAnyDepartment("FINANCE") || hasAnyDepartment("MANAGEMENT")) && chaekRole('ADMIN')) &&
                        <AdditionalAccountSummary/>
                    }

                    {
                        ((hasAnyDepartment("FINANCE") || hasAnyDepartment("MANAGEMENT")) && chaekRole('ADMIN')) &&
                        <BankSummary/>
                    }

                    {
                        ((hasAnyDepartment("SALES") || hasAnyDepartment("MANAGEMENT")) && chaekRole('ADMIN')) &&
                        <OrderSummary/>
                    }


                    {
                        ((hasAnyDepartment("ACCOUNTING") || hasAnyDepartment("SALES") || hasAnyDepartment("FINANCE") || hasAnyDepartment("MANAGEMENT")) && chaekRole('ADMIN')) &&
                        <UserApprovals/>
                    }


                </div>
            </div>

        </div>
    );
}






