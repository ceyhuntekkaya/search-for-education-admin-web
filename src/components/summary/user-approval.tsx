'use client';
import {useDashboardData} from '@/hooks/use-dashboard';
import DynamicTable from "@/components/ui/dynamic-table";
import React, {useEffect} from "react";
import {Column, RecordType} from "@/types/table";
import {useOfferApprovals} from "@/hooks/use-offer-approval";
import {useRouter} from "next/navigation";
import {formatCurrency, formatDate} from "@/utils/date-formater";
import {Offer, OfferApproval, OfferApprovalGroupDTO} from "@/types/offer";
import {useAuthContext} from "@/contexts/auth-context";
import {useLanguage} from "@/contexts/language-context";


export default function UserApprovals() {

    const {user} = useAuthContext();
    const {t} = useLanguage();

    const {
        refreshData
    } = useDashboardData();


    const router = useRouter();
    const {
        offerNewApprovals,
        fetchOfferApprovals,
    } = useOfferApprovals()


    useEffect(() => {
        fetchOfferApprovals();
        refreshData();

    }, []);


    const columnsApproval: Column<RecordType>[] = [
        {
            key: 'approvalCount',
            header: 'İŞLEMDEKİ TEKLİFLER',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600 border-1 border-blue-500 p-2"
                >
                    <b> {(record as OfferApproval).offer?.order?.customer.name as string} /
                        {(record as OfferApproval).offer?.order?.code as string}</b>
                    <br/>
                    LİTRE: {(record as OfferApproval).offer?.order?.totalLiter as number} LT /
                    TOPLAM TUTAR: {formatCurrency((record as OfferApproval).offer?.totalAmount as number)}


                    {
                        (record as OfferApprovalGroupDTO).approvals.filter(approval =>
                            approval.offerStatus === 'APPROVED'
                        ).length === (record as OfferApprovalGroupDTO).approvals.length ?
                            <div>
                                <b> <span
                                    className={`bg-blue-600 text-white p-1 bg-green-600`}> TÜM ONAYLAR VERİLDİ</span></b>
                            </div> : <>
                                <hr/>
                                {
                                    (record as OfferApprovalGroupDTO).approvals.map(approval => {
                                        return (
                                            <div key={approval.id}>
                                    <span className="text-gray-500">
                                        {
                                            approval.offerStatus as string === "NEW" ? "İSTEK YAPAN: " : "ONAYLAYAN: "
                                        }

                                        {approval.user.name} {approval.user.lastName} - {t(`department.${approval.department as string}`)} - {formatDate(approval.approvalDate)}


                                        {user?.departmentSet.includes(approval.department) ?
                                            approval.offerStatus === 'APPROVED' || approval.offerStatus === 'CANCELLED' ?
                                                <div
                                                    className="font-medium cursor-pointer hover:text-blue-600"
                                                    onClick={() => {
                                                        router.push(`/admin/approval/${approval.id}`)
                                                    }}
                                                >
                                                    <b> TEKRAR İŞLEM YAP - <span
                                                        className={`bg-blue-600 text-white p-1 ${
                                                            approval.offerStatus as string === "APPROVED"
                                                                ? "bg-green-600"
                                                                : approval.offerStatus as string === "CANCELLED"
                                                                    ? "bg-red-600"
                                                                    : "bg-yellow-500 text-black"
                                                        }`}> {t(`status.${approval.offerStatus as string}`)}</span></b>
                                                </div> :
                                                <div
                                                    className="font-medium cursor-pointer hover:text-blue-600"
                                                    onClick={() => {
                                                        router.push(`/admin/approval/${approval.id}`)
                                                    }}
                                                >
                                                    <b> İŞLEM YAP - <span className={`bg-blue-600 text-white p-1 ${
                                                        approval.offerStatus as string === "APPROVED"
                                                            ? "bg-green-600"
                                                            : approval.offerStatus as string === "CANCELLED"
                                                                ? "bg-red-600"
                                                                : "bg-yellow-500 text-black"
                                                    }`}> {t(`status.${approval.offerStatus as string}`)}</span></b>
                                                </div>
                                            :
                                            <div
                                                className="font-medium cursor-pointer hover:text-blue-600"
                                            >
                                                <b>{t(`status.${approval.offerStatus as string}`)}</b>
                                            </div>
                                        }

                                    </span>
                                                <p className="text-xs text-gray-400">AÇIKLAMA: {approval.description}</p>
                                            </div>
                                        )
                                    })
                                }
                            </>
                    }


                </div>
            )
        },
        {
            key: 'offer',
            header: 'Durum',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    <b>  {(value as Offer).order.orderState.name}</b>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
        <DynamicTable columns={columnsApproval}
                      data={offerNewApprovals}
                      searchable={false}/>
        </div>

    );
}