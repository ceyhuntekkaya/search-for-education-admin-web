'use client';

import React, {useEffect, useState} from "react";
import {formatCurrency} from "@/utils/date-formater";
import {BankAccount} from "@/types/finance";
import SummaryBox from "@/components/summary/summary-box";
import {useSql} from "@/hooks/use-sql";
import {SqlRequest} from "@/types/sql-type";

interface BankSummaryProps {
    data?: BankAccount[];
}
const BankSummary: React.FC<BankSummaryProps> = ({
                                                        data
                                                    }) => {
    const {
        bankAccountList,
        fetchBankList
    } = useSql();

    const[summary, setSummary] = useState({creditBalanceTotal:0,
        debitBalance:0,
        accountCount:0});

    useEffect(() => {
        if (!data) {
            const sqlRequest: SqlRequest = {
                database: "2025",
                code: "120",
                startAt: "2025-01-01",
                endAt: "2025-12-01"
            };
            fetchBankList(sqlRequest);
        } else {
            bankAccountList.push(...data);
        }
    }, []);

    useEffect(() => {
        if (bankAccountList) {
            const creditBalanceTotal = bankAccountList
                .reduce((sum, amount) => sum + (amount.creditBalance ? amount.creditBalance : 0), 0);
            const debitBalance = bankAccountList
                .reduce((sum, amount) => sum + (amount.debitBalance ? amount.debitBalance : 0), 0);
            const accountCount =bankAccountList.length;
            setSummary({
                creditBalanceTotal,
                debitBalance,
                accountCount
            })
        }
    }, [bankAccountList]);

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Banka Hesapları Özeti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <SummaryBox title="Toplam Alacak Bakiye" footer=""
                            content={formatCurrency(summary.creditBalanceTotal)} color="green"/>
                <SummaryBox title="Toplam Borç Bakiye" footer=""
                            content={formatCurrency(summary.debitBalance)} color="red"/>
            </div>
        </div>

    );
}
export default BankSummary;