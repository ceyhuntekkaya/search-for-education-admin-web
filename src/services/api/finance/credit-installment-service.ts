import api from "@/services/api/base-api";
import { CreditInstallment, CreditInstallmentFormData } from "@/types/finance";

class CreditInstallmentService {
    private readonly baseUrl = '/finance/credit/installment';

    async createCreditInstallment(creditInstallment: CreditInstallmentFormData): Promise<CreditInstallment> {
        const response = await api.post<CreditInstallment>(`${this.baseUrl}/`, creditInstallment);
        return response.data;
    }

    async getCreditInstallmentById(creditInstallmentId: string): Promise<CreditInstallment> {
        const response = await api.get<CreditInstallment>(`${this.baseUrl}/${creditInstallmentId}`);
        return response.data;
    }

    async getCreditInstallmentsByCreditId(creditId: string): Promise<CreditInstallment[]> {
        const response = await api.get<CreditInstallment[]>(`${this.baseUrl}/credit/${creditId}`);
        return response.data;
    }

    async updateCreditInstallment(creditInstallmentId: string, creditInstallment: CreditInstallmentFormData): Promise<CreditInstallment> {
        const response = await api.put<CreditInstallment>(`${this.baseUrl}/${creditInstallmentId}`, creditInstallment);
        return response.data;
    }

    async deleteCreditInstallment(creditInstallmentId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${creditInstallmentId}`);
    }
}

export const creditInstallmentService = new CreditInstallmentService();