'use client';

import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import React, {JSX, useCallback, useEffect, useState} from "react";
import {Column, RecordType} from "@/types/table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {PaymentPlanDataDto, PaymentPlanDetail} from "@/types/finance";
import {usePaymentPlans} from "@/hooks/finance/use-payment-plan";
import PaymentPlanSummary from "@/components/summary/payment-plan-summary";
import {formatCurrency, formatDate} from "@/utils/date-formater";
import {useRouter} from "next/navigation";


export default function PaymentPlanPaymentPage() {
    const {
        fetchCreditPlans,
        paymentPlanDataList
    } = usePaymentPlans();

    useEffect(() => {

        fetchCreditPlans();
    }, []);

    const router = useRouter();
    const [filteredData, setFilteredData] = useState<PaymentPlanDetail[]>([]);
    const [paymentData, setPaymentData] = useState<PaymentPlanDetail[]>([]);


    const convertAndFilterPaymentPlansFunctional = (
        paymentPlanData: PaymentPlanDataDto[]
    ): PaymentPlanDetail[] => {
        return paymentPlanData
            // Önce PAYMENTS tipinde olanları filtrele
            .filter((planData) => planData.paymentPlanGroupDto?.paymentPlanType === 'PAYMENTS')
            // Sonra her plan için installmentları flat map ile genişlet
            .flatMap((planData) => {
                const {paymentPlanDto, paymentPlanGroupDto, paymentPlanInstallmentDtos} = planData;

                return paymentPlanInstallmentDtos
                    .filter((installment) => installment.remainingAmount > 0)
                    .map((installment) => ({
                        // paymentPlanInstallmentDtos'tan gelen veriler
                        status: installment.status || null,
                        id: installment.id || null,
                        mainId: paymentPlanDto.id || null,
                        paymentPlanId: installment.paymentPlanId,
                        description: installment.description,
                        totalAmount: installment.totalAmount,
                        paidAmount: installment.paidAmount,
                        remainingAmount: installment.remainingAmount,
                        maturityDate: installment.maturityDate || new Date(),
                        documentNo: installment.documentNo || null,

                        // PaymentPlanFormData'dan gelen veriler
                        customerId: paymentPlanDto.customerId || null,
                        invoiceDate: paymentPlanDto.invoiceDate || new Date(),
                        nonCustomerName: paymentPlanDto.nonCustomerName || null,
                        brandId: paymentPlanDto.brandId,
                        paymentPlanGroupId: paymentPlanDto.paymentPlanGroupId ,

                        // paymentPlanGroupDto'dan gelen veriler
                        paymentGroupId: paymentPlanGroupDto?.id || null,
                        paymentGroupName: paymentPlanGroupDto?.name || null,
                        paymentPlanType: paymentPlanGroupDto?.paymentPlanType || null,


                    }));
            });
    };


    useEffect(() => {
        setPaymentData(convertAndFilterPaymentPlansFunctional(paymentPlanDataList) as PaymentPlanDetail[]);
    }, [paymentPlanDataList])

    useEffect(() => {
        setFilteredData(paymentData);
    }, [paymentData])

    const handleFilteredDataChange = useCallback(<T, >(filtered: T[]) => {
        setFilteredData(filtered as PaymentPlanDetail[]);
    }, []);

    const safeConvertToDate = (dateValue: string): Date  => {
        if (!dateValue) return new Date();
        const converted = new Date(dateValue);
        return isNaN(converted.getTime()) ? new Date() : converted;
    };

    const setPaymentStatus = (paymentPlanDetail: PaymentPlanDetail): JSX.Element => {
        if (!paymentPlanDetail) return <div>-</div>;
        const currentDate = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(currentDate.getMonth() - 1);
        const maturityDate = safeConvertToDate(paymentPlanDetail.maturityDate?.toString() || '');
        const lastMonth = new Date();
        lastMonth.setMonth(currentDate.getMonth() - 1);
        const startOfThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        return  maturityDate < twoMonthsAgo ? <div className={`font-medium cursor-pointer hover:text-blue-600 text-red-600`} > GECİKME: 2 Aydan Fazla  </div> :
            maturityDate >= startOfLastMonth && maturityDate <= endOfLastMonth ? <div className={`font-medium cursor-pointer hover:text-blue-600 text-blue-600`} > GECİKME: Geçen Ay  </div> :
                maturityDate >= startOfThisMonth && maturityDate <= endOfThisMonth ? <div className={`font-medium cursor-pointer hover:text-blue-600 text-yellow-600`} > GECİKME: Bu Ay  </div> :
                    maturityDate >= today ? <div className={`font-medium cursor-pointer hover:text-blue-600 text-green-600`} > Vadesi Gelmemiş  </div>
                        : <div className={`font-medium cursor-pointer hover:text-blue-600 text-black-600`} > Belirsiz  </div>;
    };

    console.log(paymentData)


    const columns: Column<RecordType>[] = [

        {
            key: 'nonCustomerName',
            header: 'Firma',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/payment-plan/${record.mainId}/edit`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'invoiceDate',
            header: 'Fatura Tarihi',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/payment-plan/${record.mainId}/edit`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        }
        ,

        {
            key: 'totalAmount',
            header: 'Kesilen Fatura',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/payment-plan/${record.mainId}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,
        {
            key: 'paidAmount',
            header: 'Gelen Ödeme',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/payment-plan/${record.mainId}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,
        {
            key: 'remainingAmount',
            header: 'Kalan Ödeme',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/payment-plan/${record.mainId}/edit`)}
                >
                    {formatCurrency(value as number)}
                </div>
            )
        }
        ,
        {
            key: 'maturityDate',
            header: 'Vade',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/payment-plan/${record.mainId}/edit`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        },

        {
            key: 'maturityDate',
            header: 'Vade',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/payment-plan/${record.mainId}/edit`)}
                >
                    {setPaymentStatus(record as PaymentPlanDetail) }
                </div>
            )
        },
        {
            key: 'description',
            header: 'Açıklama',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/finance/data/payment-plan/${record.mainId}/edit`)}
                >
                    {value as string}
                </div>
            )
        }
    ];


    const handleAdd = () => {
        router.push('/admin/finance/data/payment-plan/credit/add');
    };


    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}

                />
            }/>

            {
                paymentData.length > 0 && (
                    <div className="p-6 pt-0">
                        <PaymentPlanSummary data={filteredData}/>

                        <div
                            className="overflow-x-auto"
                            style={{ maxWidth: 'calc(100vw - var(--sidebar-width, 410px))' }}
                        >
                            <DynamicTable columns={columns} data={paymentData} pageSize={100}
                                          onFilteredDataChange={handleFilteredDataChange}/>
                        </div>



                    </div>
                )
            }

        </div>
    );
}
