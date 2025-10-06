import api from "@/services/api/base-api";
import { Bank, BankFormData } from "@/types/finance";

class BankService {
    private readonly baseUrl = '/finance/bank';

    async createBank(bank: BankFormData): Promise<Bank> {
        const response = await api.post<Bank>(`${this.baseUrl}/`, bank);
        return response.data;
    }

    async getAllBanks(): Promise<Bank[]> {
        const response = await api.get<Bank[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getBankById(bankId: string): Promise<Bank> {
        const response = await api.get<Bank>(`${this.baseUrl}/${bankId}`);
        return response.data;
    }

    async getBanksByBrandId(brandId: string): Promise<Bank[]> {
        const response = await api.get<Bank[]>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    async updateBank(bankId: string, bank: BankFormData): Promise<Bank> {
        const response = await api.put<Bank>(`${this.baseUrl}/${bankId}`, bank);
        return response.data;
    }

    async deleteBank(bankId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${bankId}`);
    }
}

export const bankService = new BankService();