import api from './base-api';
import {
    AllOrderDataRequest, OfferText, OfferTextFormData,
    Order,
    OrderDtoFormData,
    OrderFormData,
    OrderSearchFormData,
    OrderState
} from "@/types/order";
import {DeliveryProgress} from "@/types/delivery";
import {Role} from "@/types/auth";



class OrderService {
    private readonly baseUrl = '/order';

    async createOrder(order: OrderFormData): Promise<Order> {
        const response = await api.post<Order>(`${this.baseUrl}/`, order);
        return response.data;
    }

    async getAllOrders(): Promise<OrderDtoFormData[]> {
        const response = await api.get<OrderDtoFormData[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getAllBaseOrders(): Promise<Order[]> {
        const response = await api.get<Order[]>(`${this.baseUrl}/base`);
        return response.data;
    }

    async getAllOrderStates(): Promise<OrderState[]> {
        const response = await api.get<OrderState[]>(`${this.baseUrl}/order-state`);
        return response.data;
    }
    async setOrderStates(orderId: string, orderStateId: string): Promise<Order> {
        const response = await api.get<Order>(`${this.baseUrl}/order-state/${orderId}/${orderStateId}`);
        return response.data;
    }

    async getOrderById(orderId: string): Promise<Order> {
        const response = await api.get<Order>(`${this.baseUrl}/${orderId}`);
        return response.data;
    }

    async findByCustomerId(customerId: string): Promise<Order[]> {
        const response = await api.get<Order[]>(`${this.baseUrl}/search/customer/${customerId}`);
        return response.data;
    }

    async findBySupplierId(supplierId: string): Promise<Order[]> {
        const response = await api.get<Order[]>(`${this.baseUrl}/search/supplier/${supplierId}`);
        return response.data;
    }

    async updateOrder(orderId: string, order: OrderFormData): Promise<Order> {
        const response = await api.put<Order>(
            `${this.baseUrl}/${orderId}`,
            order
        );
        return response.data;
    }

    async deleteOrder(orderId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${orderId}`);
    }


    async getDeliveryProgress(orderId: string): Promise<DeliveryProgress[]> {
        const response = await api.get<DeliveryProgress[]>(`${this.baseUrl}/progress/${orderId}`);
        return response.data;
    }


    async getAllOrderData(id: string, from:string): Promise<AllOrderDataRequest> {
        const response = await api.get<AllOrderDataRequest>(`${this.baseUrl}/sales/${from}/${id}`);
        return response.data;
    }



    async getAllOrderDataAll(): Promise<AllOrderDataRequest[]> {
        const response = await api.get<AllOrderDataRequest[]>(`${this.baseUrl}/sales/order/all`);
        return response.data;
    }


    async fetchSearchOrder(params: OrderSearchFormData) {
        const response = await api.post<OrderDtoFormData[]>(`${this.baseUrl}/date`, params);
        return response.data;
    }


    async getOrderByRole(role: Role, id: string) {
        const response = await api.get<OrderDtoFormData[]>(`${this.baseUrl}/role/${role}/${id}`);
        return response.data;
    }



    async updateOfferText(offerText: OfferTextFormData): Promise<OfferText> {
        const response = await api.put<OfferText>(`${this.baseUrl}/offer-text/${offerText.id}`, offerText);
        return response.data;
    }


    async createOfferText(offerText: OfferTextFormData): Promise<OfferText> {
        const response = await api.post<OfferText>(`${this.baseUrl}/offer-text/`, offerText);
        return response.data;
    }

    async getAllOfferTexts(): Promise<OfferText[]> {
        const response = await api.get<OfferText[]>(`${this.baseUrl}/offer-text/`);
        return response.data;
    }

    async getOfferTextById(offerTextId: string): Promise<OfferText> {
        const response = await api.get<OfferText>(`${this.baseUrl}/offer-text/${offerTextId}`);
        return response.data;
    }
}

export const orderService = new OrderService();