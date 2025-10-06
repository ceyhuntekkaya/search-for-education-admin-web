'use client';

import React, {useEffect, useState} from "react";
import {useLetterOfGuarantees} from "@/hooks/finance/use-letter-of-guarantee";
import {formatCurrency} from "@/utils/date-formater";
import {LetterOfGuarantee} from "@/types/finance";
import SummaryBox from "@/components/summary/summary-box";


interface LetterSummaryProps {
    data?: LetterOfGuarantee[];
}


const LetterSummary: React.FC<LetterSummaryProps> = ({
                                                         data
                                                     }) => {
    const {
        letterOfGuarantees,
        fetchLetterOfGuarantees
    } = useLetterOfGuarantees();


    useEffect(() => {
        if (!data) {
            fetchLetterOfGuarantees();
        } else {
            letterOfGuarantees.push(...data);
        }
    }, []);


    const isLetterExpired = (duration: string): boolean => {
        const today = new Date();
        const letterExpiry = new Date(duration);
        return letterExpiry < today;
    };



    const[summary, setSummary] = useState({
        totalAmount:0,
        totalCount:0,
        validTotalAmount:0,
        validCount:0,
        expiredCount:0,
        expiredAmount:0
    });



    useEffect(() => {
        if (data) {
            letterOfGuarantees.length = 0;
            letterOfGuarantees.splice(0);
            letterOfGuarantees.push(...data);
        }
        // Süresi dolmamış teminat mektupları
        const validLetters = letterOfGuarantees.filter(letter => !isLetterExpired(letter.duration));

        // Tüm teminat mektupları
        const totalAmount = letterOfGuarantees.reduce((sum, letter) => sum + letter.amount, 0);
        const totalCount = letterOfGuarantees.length;

        // Süresi dolmamış teminat mektupları
        const validTotalAmount = validLetters.reduce((sum, letter) => sum + letter.amount, 0);
        const validCount = validLetters.length;
        const expiredCount = totalCount - validCount;
        const expiredAmount = totalAmount - validTotalAmount;

        setSummary({
            totalAmount,
            totalCount,
            validTotalAmount,
            validCount,
            expiredCount,
            expiredAmount
        });
    }, [letterOfGuarantees, data]);


    return (
        <div className=" bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Teminat Mektubu Özeti</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryBox title="Toplam Tutar" footer={`${summary.totalCount} mektup`}
                            content={formatCurrency(summary.totalAmount)} color="blue"/>

                <SummaryBox title="Aktif Teminat Mektupları" footer={`${summary.validCount} aktif mektup`}
                            content={formatCurrency(summary.validTotalAmount)} color="green"/>

                <SummaryBox title="Süresi Dolmuş" footer={`${summary.expiredCount} süresi dolmuş`}
                            content={formatCurrency(summary.expiredAmount)} color="red"/>

                <div className="bg-white p-4 rounded border">
                    <div className="text-sm text-gray-600">Aktiflik Oranı</div>
                    <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="h-2 rounded-full bg-green-500"
                                style={{
                                    width: `${summary.totalCount > 0 ? (summary.validCount / summary.totalCount) * 100 : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                        {summary.totalCount > 0 ? ((summary.validCount / summary.totalCount) * 100).toFixed(1) : 0}%
                    </div>
                </div>
            </div>
        </div>

    );
}

export default LetterSummary;