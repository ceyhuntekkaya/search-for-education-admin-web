'use client';

import React, {useEffect, useState} from "react";
import {useBankChecks} from "@/hooks/finance/use-bank-check";
import {formatCurrency} from "@/utils/date-formater";
import {BankCheck} from "@/types/finance";
import SummaryBox from "@/components/summary/summary-box";


interface CreditSummaryProps {
    data?: BankCheck[];
}


const CheckSummary: React.FC<CreditSummaryProps> = ({
                                                        data
                                                    }) => {
    const {
        bankChecks,
        fetchBankChecks
    } = useBankChecks();

    useEffect(() => {
        if (!data) {
            fetchBankChecks();
        } else {
            bankChecks.push(...data);
        }
    }, []);


    const isCheckExpired = (dueDate: string): boolean => {
        const today = new Date();
        const checkDate = new Date(dueDate);
        return checkDate < today;
    };


    const[summary, setSummary] = useState({
        receivedTotal:0,
        givenTotal:0,
        usedTotal:0,
        netAmount:0
    });

    useEffect(() => {
        if (data) {
            bankChecks.length = 0;
            bankChecks.splice(0);
            bankChecks.push(...data);
        }

        const validChecks = bankChecks.filter(check => !isCheckExpired(check.dueDate.toString()) || check.cashingAmount);

        const netAmount = bankChecks
            .reduce((sum, check) => sum + check.amount, 0);


        const receivedTotal = validChecks
            .filter(check => check.checkType !== 'GIVEN' && !check.cashingAmount)
            .reduce((sum, check) => sum + check.amount, 0);

        const givenTotal = validChecks
            .filter(check => check.checkType === 'GIVEN' && !check.cashingAmount)
            .reduce((sum, check) => sum + check.amount, 0);

        const usedTotal = validChecks
            .filter(check => check.cashingAmount)
            .reduce((sum, check) => sum + check.amount, 0);

        setSummary({
            receivedTotal,
            givenTotal,
            usedTotal,
            netAmount
        });
    }, [bankChecks, data]);



    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Çek Özeti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryBox title="Aktif Alınan Çekler Toplamı" footer=""
                            content={formatCurrency(summary.receivedTotal)} color="green"/>
                <SummaryBox title="Aktif Verilen Çekler Toplamı" footer=""
                            content={formatCurrency(summary.givenTotal)} color="red"/>
                <SummaryBox title="Toplam Tutar" footer=""
                            content={formatCurrency(summary.netAmount)} color={`${
                    summary.netAmount >= 0 ? 'green' : 'red'
                }`}/>
                <SummaryBox title="İşlemi Tamamlanan Tutar" footer=""
                            content={formatCurrency(summary.usedTotal)} color={`${
                    summary.netAmount >= 0 ? 'green' : 'red'
                }`}/>

            </div>
        </div>

    );
}
export default CheckSummary;