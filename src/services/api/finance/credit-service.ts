import api from "@/services/api/base-api";
import { Credit, CreditFormData } from "@/types/finance";

class CreditService {
    private readonly baseUrl = '/finance/credit';

    async createCredit(credit: CreditFormData): Promise<Credit> {
        const response = await api.post<Credit>(`${this.baseUrl}/`, credit);
        return response.data;
    }

    async getAllCredits(): Promise<CreditFormData[]> {
        const response = await api.get<CreditFormData[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getCreditById(creditId: string): Promise<Credit> {
        const response = await api.get<Credit>(`${this.baseUrl}/${creditId}`);
        return response.data;
    }

    async getCreditsByBrandId(brandId: string): Promise<Credit[]> {
        const response = await api.get<Credit[]>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    async updateCredit(creditId: string, credit: CreditFormData): Promise<Credit> {
        const response = await api.put<Credit>(`${this.baseUrl}/${creditId}`, credit);
        return response.data;
    }

    async deleteCredit(creditId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${creditId}`);
    }
}

export const creditService = new CreditService();