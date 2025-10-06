import { useState, useEffect } from 'react';
import { dashboardService} from '@/services/api/dashboard-service';
import {Order} from "@/types/order";
import {Offer} from "@/types/offer";
import {Delivery} from "@/types/delivery";



export function useDashboardData() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [deliveries, setDeliveries] = useState<Delivery[] | null>(null);
    const [financeData, setFinanceData] = useState<[] | null>(null);



    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrderData();
        fetchOfferData();
        fetchDeliveryData();
        fetchFinanceData();
    }, []);

    const fetchOrderData = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.fetchOrderData();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    const fetchOfferData = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.fetchOfferData();
            setOffers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    const fetchDeliveryData = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.fetchDeliveryData();
            setDeliveries(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    const fetchFinanceData = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.fetchFinanceData();
            setFinanceData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };



    const refreshData = () => {
        fetchOrderData();
        fetchOfferData();
        fetchDeliveryData();
        fetchFinanceData();
    };

    return {
        orders,
        offers,
        deliveries,
        financeData,
        loading,
        error,
        refreshData,
        fetchDeliveryData,
        fetchFinanceData,
        fetchOfferData,
        fetchOrderData
    };
}