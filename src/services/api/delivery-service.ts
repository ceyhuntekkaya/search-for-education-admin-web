import api from './base-api';
import {Delivery, DeliveryFormData} from "@/types/delivery";


class DeliveryService {
    private readonly baseUrl = '/delivery';

    async createDelivery(delivery: DeliveryFormData): Promise<Delivery> {
        const response = await api.post<Delivery>(`${this.baseUrl}/`, delivery);
        return response.data;
    }

    async getAllDeliveries(): Promise<Delivery[]> {
        const response = await api.get<Delivery[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getDeliveryById(deliveryId: string): Promise<Delivery> {
        const response = await api.get<Delivery>(`${this.baseUrl}/${deliveryId}`);
        return response.data;
    }

    async findByOfferId(offerId: string): Promise<Delivery[]> {
        const response = await api.get<Delivery[]>(`${this.baseUrl}/search/offer/${offerId}`);
        return response.data;
    }

    async findByOrderId(orderId: string): Promise<Delivery[]> {
        const response = await api.get<Delivery[]>(`${this.baseUrl}/search/order/${orderId}`);
        return response.data;
    }

    async updateDelivery(deliveryId: string, delivery: DeliveryFormData): Promise<Delivery> {
        const response = await api.put<Delivery>(
            `${this.baseUrl}/${deliveryId}`,
            delivery
        );
        return response.data;
    }

    async deleteDelivery(deliveryId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${deliveryId}`);
    }


}

export const deliveryService = new DeliveryService();