'use client';

import React, {useEffect, useState} from "react";
import {useCreditCards} from "@/hooks/finance/use-credit-card";
import {formatCurrency} from "@/utils/date-formater";
import {CreditCard} from "@/types/finance";
import SummaryBox from "@/components/summary/summary-box";


interface CreditSummaryProps {
    data?: CreditCard[];
}


const CreditDardSummary: React.FC<CreditSummaryProps> = ({
                                                             data
                                                         }) => {
    const {
        creditCards,
        fetchCreditCards
    } = useCreditCards();

    useEffect(() => {
        if (!data) {
            fetchCreditCards();
        } else {
            creditCards.push(...data);
        }
    }, []);


    const[summary, setSummary] = useState({
        totalLimit:0,
        totalUsed:0,
        totalRemaining:0,
        usagePercentage:0,
        cardCount: 0
    });


    useEffect(() => {
        if (data) {
            creditCards.length = 0;
            creditCards.splice(0);
            creditCards.push(...data);
        }
        const totalLimit = creditCards.reduce((sum, card) => sum + card.limitAmount, 0);
        const totalUsed = creditCards.reduce((sum, card) => sum + card.used, 0);
        const totalRemaining = creditCards.reduce((sum, card) => sum + card.remaining, 0);
        const usagePercentage = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;

        setSummary({
            totalLimit,
            totalUsed,
            totalRemaining,
            usagePercentage,
            cardCount: creditCards.length
        });
    }, [creditCards, data]);


    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Kredi Kartı Özeti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryBox title="Toplam Limit" footer={`${summary.cardCount} kart`}
                            content={formatCurrency(summary.totalLimit)} color="blue"/>
                <SummaryBox title="Kullanılan Limit" footer={`%${summary.usagePercentage.toFixed(1)} kullanım`}
                            content={formatCurrency(summary.totalUsed)} color="red"/>
                <SummaryBox title="Kullanılabilir Limit"
                            footer={`%${(100 - summary.usagePercentage).toFixed(1)} müsait`}
                            content={formatCurrency(summary.totalRemaining)} color="green"/>

                <div className="bg-white p-4 rounded border">
                    <div className="text-sm text-gray-600">Kullanım Oranı</div>
                    <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${
                                    summary.usagePercentage > 80 ? 'bg-red-500' :
                                        summary.usagePercentage > 60 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                }`}
                                style={{width: `${Math.min(summary.usagePercentage, 100)}%`}}
                            ></div>
                        </div>
                    </div>

                    <div className={`text-lg font-bold ${
                        summary.usagePercentage > 80 ? 'text-red-600' :
                            summary.usagePercentage > 60 ? 'text-yellow-600' :
                                'text-green-600'
                    }`}>
                        %{summary.usagePercentage.toFixed(1)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreditDardSummary;