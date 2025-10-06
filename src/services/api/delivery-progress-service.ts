import api from './base-api';
import {DeliveryProgress, DeliveryProgressFormData} from "@/types/delivery";


class DeliveryProgressService {
    private readonly baseUrl = '/delivery/progress';

    async createDeliveryProgress(progress: DeliveryProgressFormData): Promise<DeliveryProgress> {
        const response = await api.post<DeliveryProgress>(`${this.baseUrl}/`, progress);
        return response.data;
    }

    async getAllDeliveryProgress(): Promise<DeliveryProgress[]> {
        const response = await api.get<DeliveryProgress[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getDeliveryProgressById(progressId: string): Promise<DeliveryProgress> {
        const response = await api.get<DeliveryProgress>(`${this.baseUrl}/${progressId}`);
        return response.data;
    }

    async getDeliveryProgressByDeliveryId(deliveryId: string): Promise<DeliveryProgress[]> {
        const response = await api.get<DeliveryProgress[]>(`${this.baseUrl}/search/delivery/${deliveryId}`);
        return response.data;
    }

    async updateDeliveryProgress(progressId: string, progress: DeliveryProgressFormData): Promise<DeliveryProgress> {
        const response = await api.put<DeliveryProgress>(
            `${this.baseUrl}/${progressId}`,
            progress
        );
        return response.data;
    }

    async deleteDeliveryProgress(progressId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${progressId}`);
    }
}

export const deliveryProgressService = new DeliveryProgressService();