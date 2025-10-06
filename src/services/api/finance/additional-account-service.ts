import api from "@/services/api/base-api";
import { AdditionalAccount, AdditionalAccountFormData } from "@/types/finance";

class AdditionalAccountService {
    private readonly baseUrl = '/finance/bank/additional-account';

    async createAdditionalAccount(additionalAccount: AdditionalAccountFormData): Promise<AdditionalAccount> {
        const response = await api.post<AdditionalAccount>(`${this.baseUrl}/`, additionalAccount);
        return response.data;
    }

    async getAllAdditionalAccounts(): Promise<AdditionalAccount[]> {
        const response = await api.get<AdditionalAccount[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getAdditionalAccountById(additionalAccountId: string): Promise<AdditionalAccount> {
        const response = await api.get<AdditionalAccount>(`${this.baseUrl}/${additionalAccountId}`);
        return response.data;
    }

    async getAdditionalAccountsByBankAccountId(bankAccountId: string): Promise<AdditionalAccount[]> {
        const response = await api.get<AdditionalAccount[]>(`${this.baseUrl}/bank-account/${bankAccountId}`);
        return response.data;
    }

    async updateAdditionalAccount(additionalAccountId: string, additionalAccount: AdditionalAccountFormData): Promise<AdditionalAccount> {
        const response = await api.put<AdditionalAccount>(`${this.baseUrl}/${additionalAccountId}`, additionalAccount);
        return response.data;
    }

    async deleteAdditionalAccount(additionalAccountId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${additionalAccountId}`);
    }
}
export const additionalAccountService = new AdditionalAccountService();