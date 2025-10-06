'use client';

import React, {useEffect, useMemo, useState} from "react";
import {formatCurrency} from "@/utils/date-formater";
import SummaryBox from "@/components/summary/summary-box";
import {usePaymentPlans} from "@/hooks/finance/use-payment-plan";
import {PaymentPlanDetail} from "@/types/finance";


interface PaymentPlanSummaryProps {
    data?: PaymentPlanDetail[];
}

const PaymentPlanSummary: React.FC<PaymentPlanSummaryProps> = ({
                                                                   data
                                                               }) => {

    const [paymentData, setPaymentData] = useState<PaymentPlanDetail[]>([]);
    const {
        fetchPaymentPlans,
    } = usePaymentPlans();


    useEffect(() => {
        if (!data) {
            fetchPaymentPlans();
        } else {
            const _paymentData: PaymentPlanDetail[] = [];
            _paymentData.push(...data);
            setPaymentData(_paymentData);
        }
    }, []);

    useEffect(() => {
        if (data) {
            const _paymentData: PaymentPlanDetail[] = [];
            _paymentData.push(...data);
            setPaymentData(_paymentData);
        }
    }, [data]);


    const safeConvertToDate = (dateValue: string): Date  => {
        if (!dateValue) return new Date();
        const converted = new Date(dateValue);
        return isNaN(converted.getTime()) ? new Date() : converted;
    };

    const isMoreThan2MonthsOld = (date: string | null): boolean => {
        if (!date) return false;

        const currentDate = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(currentDate.getMonth() - 1);

        const maturityDate = safeConvertToDate(date);
        return maturityDate < twoMonthsAgo;
    };

    const isLastMonth = (date: string | null): boolean => {
        if (!date) return false;

        const maturityDate = safeConvertToDate(date);

        const currentDate = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(currentDate.getMonth() - 1);

        // Geçen ayın başı ve sonu
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

        return maturityDate >= startOfLastMonth && maturityDate <= endOfLastMonth;
    };


    const isThisMonth = (date: string | null): boolean => {
        if (!date) return false;
        const maturityDate = safeConvertToDate(date);

        const currentDate = new Date();

        // Bu ayın başı ve sonu
        const startOfThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        return maturityDate >= startOfThisMonth && maturityDate <= endOfThisMonth;
    };
// Yardımcı fonksiyon: Tarihin geçmemiş olup olmadığını kontrol et
    const isNotPast = (date: string | null): boolean => {


        if (!date) return true; // Tarihi yoksa geçmemiş sayalım
        const maturityDate = safeConvertToDate(date);

        const currentDate = new Date();

        // Sadece tarih karşılaştırması (saatleri sıfırlayarak)
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        // const maturity = new Date(maturityDate.getFullYear(), maturityDate.getMonth(), maturityDate.getDate());

        return maturityDate >= today;
    };


    const summary = useMemo(() => {

        if (paymentData) {
            const pastMoreThan2 = paymentData
                .filter(payment => payment.remainingAmount > 0)
                .filter(payment => payment.paymentPlanType === 'PAYMENTS')
                .filter(payment => isMoreThan2MonthsOld(payment.maturityDate?.toString() || ''))
                .reduce((sum, payment) => sum + payment.remainingAmount, 0);


            const pastLastMount = paymentData
                .filter(payment => payment.remainingAmount > 0)
                .filter(payment => payment.paymentPlanType === 'PAYMENTS')
                .filter(payment => isLastMonth(payment.maturityDate?.toString() || ''))
                .reduce((sum, payment) => sum + payment.remainingAmount, 0);

            const pastThisMount = paymentData
                .filter(payment => payment.remainingAmount > 0)
                .filter(payment => payment.paymentPlanType === 'PAYMENTS')
                .filter(payment => isThisMonth(payment.maturityDate?.toString() || ''))
                .reduce((sum, payment) => sum + payment.remainingAmount, 0);


            const notPast = paymentData
                .filter(payment => payment.remainingAmount > 0)
                .filter(payment => payment.paymentPlanType === 'PAYMENTS')
                .filter(payment => isNotPast(payment.maturityDate?.toString() || ''))
                .reduce((sum, payment) => sum + payment.remainingAmount, 0);


            const totalAmount = paymentData
                .filter(payment => payment.remainingAmount > 0)
                .filter(payment => payment.paymentPlanType === 'PAYMENTS')
                .reduce((sum, payment) => sum + payment.remainingAmount, 0);

            return {
                pastMoreThan2,
                pastLastMount,
                pastThisMount,
                notPast,
                totalAmount
            };
        } else {
            return {
                pastMoreThan2: 0,
                pastLastMount: 0,
                pastThisMount: 0,
                notPast: 0,
                totalAmount:0

            };
        }

    }, [paymentData]);


    return (
        <div className=" bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Özet</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    paymentData && <>
                        <SummaryBox title="2 ay ve daha fazla gecikenler" footer={` `}
                                    content={` ${formatCurrency(summary.pastMoreThan2)} `}
                                    color="blue"/>


                        <SummaryBox title="Geçen ay geçikenler" footer={` `}
                                    content={`${formatCurrency(summary.pastLastMount)}`}
                                    color="blue"/>

                        <SummaryBox title="Bu ay gecikenler" footer={` `}
                                    content={`${formatCurrency(summary.pastThisMount)}`}
                                    color="blue"/>

                        <SummaryBox title="Tarihi gelmemişler" footer={` `}
                                    content={`${formatCurrency(summary.notPast)}`}
                                    color="blue"/>

                        <SummaryBox title="Genel Toplam" footer={` `}
                                    content={`${formatCurrency(summary.totalAmount)}`}
                                    color="blue"/>
                    </>
                }


            </div>
        </div>

    );
}

export default PaymentPlanSummary;