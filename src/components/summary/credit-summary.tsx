'use client';

import React, {useEffect, useState} from 'react';
import SummaryBox from "@/components/summary/summary-box";
import {formatCurrency} from "@/utils/date-formater";
import {useCredits} from "@/hooks/finance/use-credit";
import {CreditFormData} from "@/types/finance";


interface CreditSummaryProps {
    data?: CreditFormData[];
}


const CreditSummary: React.FC<CreditSummaryProps> = ({
                                                    data
                                                }) => {


    const[summary, setSummary] = useState({
        openCreditsCount:0,
        totalRemainingAmount:0,
        thisMonthPayable:0,
        totalCreditDrawn:0,
        totalPaidAmount:0,
        overdueCreditsCount:0,
        averageInterestRate:0,
        totalCreditsCount: 0,
        odenenAnaPara:0,
        kalanAnaPara:0,
        odenenFaiz:0,
        kalanFaiz:0,
        toplamKullanilanBSMV:0,
        gecikmeTutari:0
    });

    const {
        creditsWithInstallments,
        fetchCredits
    } = useCredits();

    useEffect(() => {
        if (!data) {
              fetchCredits();
        } else {
            creditsWithInstallments.push(...data);
        }
    }, []);



    const getPaidInstallmentsTotal = (credit: CreditFormData): number => {
        if (!credit.installments) return 0;
        return credit.installments
            .filter(installment => installment.paid > 0)
            .reduce((sum, installment) => sum + installment.paid, 0);
    };

    const getRemainingInstallmentsTotal = (credit: CreditFormData): number => {
        if (!credit.installments) return 0;
        return credit.installments
            .reduce((sum, installment) => sum + installment.remaining, 0);
    };

    const hasOverduePayments = (credit: CreditFormData): boolean => {
        if (!credit.installments) return false;
        const today = new Date();
        return credit.installments.some(installment => {
            if (!installment.creditInstallmentDate) return false;
            const installmentDate = new Date(installment.creditInstallmentDate);
            return installmentDate < today && installment.remaining > 0;
        });
    };

    const isCreditClosed = (credit: CreditFormData): boolean => {
        if (!credit.installments || credit.installments.length === 0) return false;
        return credit.installments.every(installment =>
            installment.remaining === 0 || installment.remaining === null
        );
    };

    const getThisMonthPayments = (credits: CreditFormData[]): number => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let thisMonthTotal = 0;

        credits.forEach(credit => {
            if (!credit.installments) return;

            credit.installments.forEach(installment => {
                if (!installment.creditInstallmentDate || installment.remaining === 0) return;

                const installmentDate = new Date(installment.creditInstallmentDate);
                if (installmentDate.getMonth() === currentMonth &&
                    installmentDate.getFullYear() === currentYear) {
                    thisMonthTotal += installment.remaining;
                }
            });
        });

        return thisMonthTotal;
    };


    useEffect(() => {
        if (data) {
            creditsWithInstallments.length = 0;
            creditsWithInstallments.splice(0);
            creditsWithInstallments.push(...data);
        }
        const openCredits = creditsWithInstallments.filter(credit => !isCreditClosed(credit));
        const openCreditsCount = openCredits.length;

        const totalRemainingAmount = creditsWithInstallments.reduce((sum, credit) =>
            sum + getRemainingInstallmentsTotal(credit), 0);

        const thisMonthPayable = getThisMonthPayments(creditsWithInstallments);

        const totalCreditDrawn = creditsWithInstallments.reduce((sum, credit) =>
            sum + (credit.principal || 0), 0);

        const totalPaidAmount = creditsWithInstallments.reduce((sum, credit) =>
            sum + getPaidInstallmentsTotal(credit), 0);

        const overdueCreditsCount = creditsWithInstallments.filter(credit =>
            hasOverduePayments(credit)).length;

        const averageInterestRate = creditsWithInstallments.length > 0 ?
            creditsWithInstallments.reduce((sum, credit) => sum + (credit.interestRate || 0), 0) / creditsWithInstallments.length : 0;





        const odenenAnaPara = creditsWithInstallments.reduce((sum, credit) =>
            sum + (credit.installments
                ?.filter((instr=> instr.paid > 0))
                .reduce((insSum, inst) =>
                insSum + (inst.principal || 0), 0) || 0), 0);



        const kalanAnaPara = creditsWithInstallments.reduce((sum, credit) =>
            sum + (credit.installments
                ?.filter((instr=> instr.paid < 1))
                .reduce((insSum, inst) =>
                    insSum + (inst.principal || 0), 0) || 0), 0);





        const odenenFaiz = creditsWithInstallments.reduce((sum, credit) =>
            sum + (credit.installments
                ?.filter((instr=> instr.paid > 0))
                .reduce((insSum, inst) =>
                    insSum + (inst.interest || 0), 0) || 0), 0);



        const kalanFaiz = creditsWithInstallments.reduce((sum, credit) =>
            sum + (credit.installments
                ?.filter((instr=> instr.paid < 1))
                .reduce((insSum, inst) =>
                    insSum + (inst.interest || 0), 0) || 0), 0);







        const gecikmeTutari = creditsWithInstallments
            .filter((credit)=> hasOverduePayments(credit))
            .reduce((sum, credit) =>
            sum + (credit.installments
                ?.filter((instr=> instr.paid < 1))
                .reduce((insSum, inst) =>
                    insSum + (inst.remaining || 0), 0) || 0), 0);






        const toplamKullanilanBSMV = creditsWithInstallments.reduce((sum, credit) =>
            sum + (credit.bsmv || 0), 0);








        setSummary({
            openCreditsCount,
            totalRemainingAmount,
            thisMonthPayable,
            totalCreditDrawn,
            totalPaidAmount,
            overdueCreditsCount,
            averageInterestRate,
            totalCreditsCount: creditsWithInstallments.length,
            odenenAnaPara,
            kalanAnaPara,
            odenenFaiz,
            kalanFaiz,
            toplamKullanilanBSMV,
            gecikmeTutari
        });
    }, [creditsWithInstallments, data]);


    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Kredi Özeti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryBox title="Toplam Açık Kredi Sayısı" footer={` ${summary.totalCreditsCount} toplam kredi`}
                            content={summary.openCreditsCount.toString()} color="orange"/>
                <SummaryBox title="Toplam Ödenmemiş Tutar" footer="kalan borç tutarı"
                            content={formatCurrency(summary.totalRemainingAmount)} color="red"/>
                <SummaryBox title="Bu Ay Ödenecek Tutar" footer="bu ay vadesi gelen"
                            content={formatCurrency(summary.thisMonthPayable)} color="yellow"/>
                <SummaryBox title="Çekilen Toplam Kredi" footer="ana para toplamı"
                            content={formatCurrency(summary.totalCreditDrawn)} color="blue"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <SummaryBox title="Şimdiye Kadar Ödenen" footer="toplam ödeme"
                            content={formatCurrency(summary.totalPaidAmount)}/>
                <SummaryBox title="Vadesi Geçmiş Kredi" footer="acil takip gerekli"
                            content={summary.overdueCreditsCount.toString()} color="red"/>
                <SummaryBox title="Ortalama Faiz Oranı" footer="tüm krediler ortalaması"
                            content={` %${summary.averageInterestRate.toFixed(2)}`} color="purple"/>
            </div>




<hr/>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                <SummaryBox title="Ödenen Ana Para" footer="tüm kredilerde"
                            content={formatCurrency(summary.odenenAnaPara)}/>
                <SummaryBox title="Kalan Ana Para" footer="tüm kredilerde"
                            content={formatCurrency(summary.kalanAnaPara)} color="red"/>
                <SummaryBox title="Ödenen Faiz" footer="tüm kredilerde"
                            content={formatCurrency(summary.odenenFaiz)} color="purple"/>
                <SummaryBox title="Kalan Faiz" footer="tüm kredilerde"
                            content={formatCurrency(summary.kalanFaiz)}/>
                <SummaryBox title="Toplam Ödenen" footer="tüm kredilerde"
                            content={formatCurrency(summary.totalPaidAmount)} color="red"/>
                <SummaryBox title="Toplam Kalan" footer="tüm kredilerde"
                            content={formatCurrency(summary.totalRemainingAmount)} color="purple"/>
                <SummaryBox title="Gecikmedekiler" footer="acil takip gerekli"
                            content={formatCurrency(summary.gecikmeTutari)}/>
                <SummaryBox title="Toplam Kullanılan Ana Para" footer="tüm kredilerde"
                            content={formatCurrency(summary.totalCreditDrawn)} color="red"/>
                <SummaryBox title="Toplam BSMV" footer="tüm kredilerde"
                            content={formatCurrency(summary.toplamKullanilanBSMV)} color="purple"/>
            </div>



        </div>









    );
};

export default CreditSummary;