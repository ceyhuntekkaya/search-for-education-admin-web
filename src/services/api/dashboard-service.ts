import api from './base-api';
import {Order} from "@/types/order";
import {Offer} from "@/types/offer";
import {Delivery} from "@/types/delivery";



class DashboardService {
    async fetchOrderData(): Promise<Order[]> {
        const response = await api.get('/dashboard/order');
        return response.data;
    }

    async fetchOfferData(): Promise<Offer[]> {
        const response = await api.get('/dashboard/offer');
        return response.data;
    }

    async fetchDeliveryData(): Promise<Delivery[]> {
        const response = await api.get(`/dashboard/delivery`);
        return response.data;
    }
    async fetchFinanceData(): Promise<[]> {
        const response = await api.get(`/dashboard/finance`);
        return response.data;
    }





}

export const dashboardService = new DashboardService();