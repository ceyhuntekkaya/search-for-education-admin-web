import api from './base-api';
import {DeliveryDocument, DeliveryDocumentFormData} from "@/types/delivery";



class DeliveryDocumentService {
    private readonly baseUrl = '/delivery/document';

    async createDeliveryDocument(deliveryDocument: FormData): Promise<DeliveryDocument> {
        const response = await api.post<DeliveryDocument>(`${this.baseUrl}/`, deliveryDocument, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }});
        return response.data;
    }

    async getAllDeliveryDocuments(): Promise<DeliveryDocument[]> {
        const response = await api.get<DeliveryDocument[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getDeliveryDocumentById(deliveryDocumentId: string): Promise<DeliveryDocument> {
        const response = await api.get<DeliveryDocument>(`${this.baseUrl}/${deliveryDocumentId}`);
        return response.data;
    }

    async getDeliveryDocumentByDeliveryId(deliveryId: string): Promise<DeliveryDocument[]> {
        const response = await api.get<DeliveryDocument[]>(`${this.baseUrl}/search/delivery/${deliveryId}`);
        return response.data;
    }

    async updateDeliveryDocument(deliveryDocumentId: string, deliveryDocument: DeliveryDocumentFormData): Promise<DeliveryDocument> {
        const response = await api.put<DeliveryDocument>(
            `${this.baseUrl}/${deliveryDocumentId}`,
            deliveryDocument
        );
        return response.data;
    }

    async deleteDeliveryDocument(deliveryDocumentId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${deliveryDocumentId}`);
    }
}

export const deliveryDocumentService = new DeliveryDocumentService();