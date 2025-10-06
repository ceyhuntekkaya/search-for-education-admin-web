'use client';

import React, {useEffect, useState} from "react";
import {formatCurrency} from "@/utils/date-formater";
import {AdditionalAccount} from "@/types/finance";
import SummaryBox from "@/components/summary/summary-box";
import {useAdditionalAccounts} from "@/hooks/finance/use-additional-account";


interface AdditionalAccountProps {
    data?: AdditionalAccount[];
}


const AdditionalAccountSummary: React.FC<AdditionalAccountProps> = ({
                                                         data
                                                     }) => {
    const {
        additionalAccounts,
        fetchAdditionalAccounts
    } = useAdditionalAccounts();



    const[summary, setSummary] = useState({
        totalAmount:0,
        totalCount:0,
        usedAmount:0,
        availableAmount:0,
    });



    useEffect(() => {
        if (!data) {
            fetchAdditionalAccounts();
        } else {
            additionalAccounts.push(...data);
        }
    }, []);


    useEffect(() => {
        if (data) {
            additionalAccounts.length = 0;
            additionalAccounts.splice(0);
            additionalAccounts.push(...data);
        }

        const totalAmount = additionalAccounts.reduce((sum, account) => sum + account.amount, 0);
        const usedAmount =  additionalAccounts.reduce((sum, account) => sum + account.used, 0);
        const availableAmount =  additionalAccounts.reduce((sum, account) => sum + account.remaining, 0);
        const totalCount = additionalAccounts.length;



        setSummary({
            totalAmount,
            totalCount,
            usedAmount,
            availableAmount,
        });
    }, [additionalAccounts, data]);


    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">KMH Özeti</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryBox title="Toplam Limt" footer={`${summary.totalCount} hesap`}
                            content={formatCurrency(summary.totalAmount)} color="blue"/>

                <SummaryBox title="Kullanılan Limit" footer={`${summary.totalCount} hesap`}
                            content={formatCurrency(summary.usedAmount)} color="green"/>

                <SummaryBox title="Açık Limit" footer={`${summary.totalCount} hesap`}
                            content={formatCurrency(summary.availableAmount)} color="red"/>

                <div className="bg-white p-4 rounded border">
                    <div className="text-sm text-gray-600">Aktiflik Oranı</div>
                    <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="h-2 rounded-full bg-green-500"
                                style={{
                                    width: `${summary.totalCount > 0 ? (summary.availableAmount / summary.totalAmount) * 100 : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                        {summary.totalCount > 0 ? ((summary.availableAmount / summary.totalAmount) * 100).toFixed(1) : 0}%
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AdditionalAccountSummary;