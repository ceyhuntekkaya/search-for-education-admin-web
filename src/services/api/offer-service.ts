import api from './base-api';
import {Offer, OfferFormData} from "@/types/offer";
import {PoData} from "@/app/(protected)/admin/pet/po_data";



class OfferService {

    private readonly baseUrl = '/offer';

    async createOffer(offer: OfferFormData): Promise<Offer> {
        const response = await api.post<Offer>(`${this.baseUrl}/`, offer);
        return response.data;
    }

    async getAllOffers(): Promise<Offer[]> {
        const response = await api.get<Offer[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getOfferById(offerId: string): Promise<Offer> {
        const response = await api.get<Offer>(`${this.baseUrl}/${offerId}`);
        return response.data;
    }

    async findByOrderId(orderId: string): Promise<Offer[]> {
        const response = await api.get<Offer[]>(`${this.baseUrl}/search/order/${orderId}`);
        return response.data;
    }

    async updateOffer(offerId: string, offer: OfferFormData): Promise<Offer> {
        const response = await api.put<Offer>(
            `${this.baseUrl}/${offerId}`,
            offer
        );
        return response.data;
    }

    async deleteOffer(offerId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${offerId}`);
    }

    async createPoData(poDataList: PoData[], brandId:string): Promise<PoData[]> {
        const response = await api.post<PoData[]>(`${this.baseUrl}/po-data/${brandId}`, poDataList);
        return response.data;
    }

    async getAllPoData(): Promise<PoData[]> {
        const response = await api.get<PoData[]>(`${this.baseUrl}/po-data`);
        return response.data;
    }

}

export const offerService = new OfferService();