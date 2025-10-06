import api from "@/services/api/base-api";
import { CreditCard, CreditCardFormData } from "@/types/finance";

class CreditCardService {
    private readonly baseUrl = '/finance/credit-card';

    async createCreditCard(creditCard: CreditCardFormData): Promise<CreditCard> {
        const response = await api.post<CreditCard>(`${this.baseUrl}/`, creditCard);
        return response.data;
    }

    async getAllCreditCards(): Promise<CreditCard[]> {
        const response = await api.get<CreditCard[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getCreditCardById(creditCardId: string): Promise<CreditCard> {
        const response = await api.get<CreditCard>(`${this.baseUrl}/${creditCardId}`);
        return response.data;
    }

    async getCreditCardsByBrandId(brandId: string): Promise<CreditCard[]> {
        const response = await api.get<CreditCard[]>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    async updateCreditCard(creditCardId: string, creditCard: CreditCardFormData): Promise<CreditCard> {
        const response = await api.put<CreditCard>(`${this.baseUrl}/${creditCardId}`, creditCard);
        return response.data;
    }

    async deleteCreditCard(creditCardId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${creditCardId}`);
    }
}

export const creditCardService = new CreditCardService();