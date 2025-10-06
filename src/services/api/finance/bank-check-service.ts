import api from "@/services/api/base-api";
import { BankCheck, BankCheckFormData } from "@/types/finance";

class BankCheckService {
    private readonly baseUrl = '/finance/bank/check';

    async createBankCheck(bankCheck: BankCheckFormData): Promise<BankCheck> {
        const response = await api.post<BankCheck>(`${this.baseUrl}/`, bankCheck);
        return response.data;
    }

    async getAllBankChecks(): Promise<BankCheck[]> {
        const response = await api.get<BankCheck[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getBankCheckById(bankCheckId: string): Promise<BankCheck> {
        const response = await api.get<BankCheck>(`${this.baseUrl}/${bankCheckId}`);
        return response.data;
    }

    async getBankChecksByBrandId(brandId: string): Promise<BankCheck[]> {
        const response = await api.get<BankCheck[]>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    async updateBankCheck(bankCheckId: string, bankCheck: BankCheckFormData): Promise<BankCheck> {
        const response = await api.put<BankCheck>(`${this.baseUrl}/${bankCheckId}`, bankCheck);
        return response.data;
    }

    async deleteBankCheck(bankCheckId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${bankCheckId}`);
    }
}

export const bankCheckService = new BankCheckService();