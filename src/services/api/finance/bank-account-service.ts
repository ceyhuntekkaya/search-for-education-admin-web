import api from "@/services/api/base-api";
import { BankAccount, BankAccountFormData } from "@/types/finance";

class BankAccountService {
    private readonly baseUrl = '/finance/bank/account';

    async createBankAccount(bankAccount: BankAccountFormData): Promise<BankAccount> {
        const response = await api.post<BankAccount>(`${this.baseUrl}/`, bankAccount);
        return response.data;
    }

    async getAllBankAccounts(): Promise<BankAccount[]> {
        const response = await api.get<BankAccount[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getBankAccountById(bankAccountId: string): Promise<BankAccount> {
        const response = await api.get<BankAccount>(`${this.baseUrl}/${bankAccountId}`);
        return response.data;
    }

    async getBankAccountsByBrandId(brandId: string): Promise<BankAccount[]> {
        const response = await api.get<BankAccount[]>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    async updateBankAccount(bankAccountId: string, bankAccount: BankAccountFormData): Promise<BankAccount> {
        const response = await api.put<BankAccount>(`${this.baseUrl}/${bankAccountId}`, bankAccount);
        return response.data;
    }

    async deleteBankAccount(bankAccountId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${bankAccountId}`);
    }
}
export const bankAccountService = new BankAccountService();