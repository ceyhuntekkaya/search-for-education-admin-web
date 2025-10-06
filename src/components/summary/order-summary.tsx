'use client';

import React, {useEffect, useMemo} from "react";
import {formatCurrency} from "@/utils/date-formater";
import SummaryBox from "@/components/summary/summary-box";
import {useOrderAllData} from "@/hooks/use-order-all-data";


const OrderSummary = ({}) => {


    const {allOrderDataAll, getAllOrderDataAll} = useOrderAllData();


    useEffect(() => {
        getAllOrderDataAll();
    }, []);


    const summary = useMemo(() => {
        /*
                const newOrders= orderDtoList
                    .filter(order => order.checkType !== 'GIVEN' && !check.cashingAmount)
                    .reduce((sum, order) => sum + order.amount, 0);

         */
        if (allOrderDataAll) {
            const newOrders = allOrderDataAll
                .filter(order => !order.offer && !order.delivery).length;

            const shipments = allOrderDataAll
                .filter(order => order.delivery).length;

            const totalDeliveriesAmounts = allOrderDataAll
                .filter(order => order.delivery && order.offer)
                .reduce((sum, order) => sum + (order.offer ? order.offer.totalAmount : 0), 0);


            const totalDeliveriesLiter = allOrderDataAll
                .filter(order => order.delivery)
                .reduce((sum, order) => sum + order.order.totalLiter, 0);


            const totalOffersAmounts = allOrderDataAll
                .filter(order => !order.delivery && order.offer && order.offerApprovals && order.offerApprovals.filter(appr => appr.offerStatus !== "APPROVED").length !== 0)
                .reduce((sum, order) => sum + (order.offer ? order.offer.totalAmount : 0), 0);


            const totalOffersLiter = allOrderDataAll
                .filter(order => !order.delivery && order.offer && order.offerApprovals && order.offerApprovals.filter(appr => appr.offerStatus !== "APPROVED").length !== 0)
                .reduce((sum, order) => sum + order.order.totalLiter, 0);


            const preparedOffers = allOrderDataAll
                .filter(order => !order.delivery && order.offer && order.offerApprovals && order.offerApprovals.filter(appr => appr.offerStatus !== "APPROVED").length !== 0).length;


            const waitingOffers = allOrderDataAll
                .filter(order => !order.delivery && order.offer && order.offerApprovals && order.offerApprovals.filter(appr => appr.offerStatus !== "APPROVED").length === 0).length;


            const offersAwaitingCustomerApproval = allOrderDataAll
                .filter(order => !order.delivery && order.offer && order.offerApprovals && order.offerApprovals.filter(appr => appr.offerStatus !== "APPROVED").length === 0)
                .reduce((sum, order) => sum + (order.offer ? order.offer.totalAmount : 0), 0);


            const offersAwaitingCustomerLiter = allOrderDataAll
                .filter(order => !order.delivery && order.offer && order.offerApprovals && order.offerApprovals.filter(appr => appr.offerStatus !== "APPROVED").length === 0)
                .reduce((sum, order) => sum + order.order.totalLiter, 0);


            const totalOrders = allOrderDataAll.filter(order => !order.offer && !order.delivery).length;

            const totalOrdersLiter = allOrderDataAll
                .filter(order => !order.delivery && !order.offer)
                .reduce((sum, order) => sum + order.order.totalLiter, 0);

            return {
                newOrders,
                preparedOffers,
                offersAwaitingCustomerApproval,
                shipments,
                totalOrders,
                totalOffersAmounts,
                totalDeliveriesAmounts,
                waitingOffers,
                totalOrdersLiter,
                totalOffersLiter,
                totalDeliveriesLiter,
                offersAwaitingCustomerLiter
            };
        } else {
            return {
                newOrders: 0,
                preparedOffers: 0,
                offersAwaitingCustomerApproval: 0,
                shipments: 0,
                totalOrders: 0,
                totalOffers: 0,
                totalDeliveries: 0,
                totalOrdersAmounts: 0,
                totalOffersAmounts: 0,
                totalDeliveriesAmounts: 0,
                waitingOffers: 0,
                totalOrdersLiter: 0,
                totalOffersLiter: 0,
                totalDeliveriesLiter: 0,
                offersAwaitingCustomerLiter: 0
            };
        }


    }, [allOrderDataAll]);


    return (
        <div className=" bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Aktif Sipariş ve Sevkiyat Sayıları</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    allOrderDataAll && <>
                        <SummaryBox title="Toplam Yeni Siparişler" footer={`${summary.totalOrders} yeni sipariş`}
                                    content={` ${summary.totalOrdersLiter} Litre`}
                                    color="blue"/>


                        <SummaryBox title="Teklif Hazırlanan Siparişler" footer={`${summary.preparedOffers} sipariş`}
                                    content={`${formatCurrency(summary.totalOffersAmounts)} - ${summary.totalOffersLiter} Litre`}
                                    color="blue"/>

                        <SummaryBox title="Müşteriye Sunulan Teklifler" footer={`${summary.waitingOffers} teklif`}
                                    content={`${formatCurrency(summary.offersAwaitingCustomerApproval)} - ${summary.offersAwaitingCustomerLiter} Litre`}
                                    color="blue"/>

                        <SummaryBox title="Sevkiyatlar" footer={`${summary.shipments} sevkiyat`}
                                    content={`${formatCurrency(summary.totalDeliveriesAmounts)} -  ${summary.totalDeliveriesLiter} Litre`}
                                    color="blue"/>
                    </>
                }


            </div>
        </div>

    );
}

export default OrderSummary;