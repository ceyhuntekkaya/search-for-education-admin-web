import api from './base-api';
import {DeliveryDocumentType, DeliveryDocumentTypeFormData} from "@/types/delivery";



class DeliveryDocumentTypeService {
    private readonly baseUrl = '/delivery/document/type';

    async createDeliveryDocumentType(documentType: DeliveryDocumentTypeFormData): Promise<DeliveryDocumentType> {
        const response = await api.post<DeliveryDocumentType>(`${this.baseUrl}/`, documentType);
        return response.data;
    }

    async getAllDeliveryDocumentTypes(): Promise<DeliveryDocumentType[]> {
        const response = await api.get<DeliveryDocumentType[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getDeliveryDocumentTypeById(documentTypeId: string): Promise<DeliveryDocumentType> {
        const response = await api.get<DeliveryDocumentType>(`${this.baseUrl}/${documentTypeId}`);
        return response.data;
    }

    async getDeliveryDocumentTypesByName(text: string): Promise<DeliveryDocumentType[]> {
        const response = await api.get<DeliveryDocumentType[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async updateDeliveryDocumentType(documentTypeId: string, documentType: DeliveryDocumentTypeFormData): Promise<DeliveryDocumentType> {
        const response = await api.put<DeliveryDocumentType>(
            `${this.baseUrl}/${documentTypeId}`,
            documentType
        );
        return response.data;
    }

    async deleteDeliveryDocumentType(documentTypeId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${documentTypeId}`);
    }
}

export const deliveryDocumentTypeService = new DeliveryDocumentTypeService();