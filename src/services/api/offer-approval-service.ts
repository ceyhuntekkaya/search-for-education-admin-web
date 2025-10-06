import api from './base-api';
import {OfferApproval, OfferApprovalFormData, OfferApprovalGroupDTO} from "@/types/offer";


class OfferApprovalService {

    private readonly baseUrl = '/offer-approval';


    async createOfferApproval(offerApproval: OfferApprovalFormData): Promise<OfferApproval> {
        const response = await api.post<OfferApproval>(`${this.baseUrl}/`, offerApproval);
        return response.data;
    }

    async getAllOfferApprovals(): Promise<OfferApprovalGroupDTO[]> {
        const response = await api.get<OfferApprovalGroupDTO[]>(`${this.baseUrl}/new`);
        return response.data;
    }

    async getOfferApprovalById(offerApprovalId: string): Promise<OfferApproval> {
        const response = await api.get<OfferApproval>(`${this.baseUrl}/${offerApprovalId}`);
        return response.data;
    }

    async getOfferApprovalByOfferId(offerId: string): Promise<OfferApproval[]> {
        const response = await api.get<OfferApproval[]>(`${this.baseUrl}/offer/${offerId}`);
        return response.data;
    }


    async updateOfferApproval(offerApprovalId: string, offerApproval: OfferApprovalFormData): Promise<OfferApproval> {
        const response = await api.put<OfferApproval>(`${this.baseUrl}/${offerApprovalId}`, offerApproval);
        return response.data;
    }

    async deleteOfferApproval(offerApprovalId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${offerApprovalId}`);
    }

}

export const offerApprovalService = new OfferApprovalService();

