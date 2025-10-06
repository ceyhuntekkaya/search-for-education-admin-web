import api from "@/services/api/base-api";
import {
    PaymentPlanDataDto,
    PaymentPlanFormData,
    PaymentPlanGroupFormData,
    PaymentPlanInstallment,
    PaymentPlanInstallmentFormData
} from "@/types/finance";

class PaymentPlanService {
    private readonly baseUrl = '/finance/payment-plan';

    async createPaymentPlan(paymentPlanDataDto: PaymentPlanDataDto): Promise<PaymentPlanDataDto> {
        const response = await api.post<PaymentPlanDataDto>(`${this.baseUrl}/`, paymentPlanDataDto);
        return response.data;
    }

    async getAllPaymentPlans(): Promise<PaymentPlanDataDto[]> {
        const response = await api.get<PaymentPlanDataDto[]>(`${this.baseUrl}/PAYMENTS/list`);
        return response.data;
    }

    async getAllCreditPlans(): Promise<PaymentPlanDataDto[]> {
        const response = await api.get<PaymentPlanDataDto[]>(`${this.baseUrl}/CREDITS/list`);
        return response.data;
    }

    async getPaymentPlanById(paymentPlanId: string): Promise<PaymentPlanDataDto> {
        const response = await api.get<PaymentPlanDataDto>(`${this.baseUrl}/${paymentPlanId}`);
        return response.data;
    }

    async updatePaymentPlan(paymentPlanId: string, paymentPlanDto: PaymentPlanDataDto): Promise<PaymentPlanFormData> {
        const response = await api.put<PaymentPlanFormData>(`${this.baseUrl}/${paymentPlanId}`, paymentPlanDto);
        return response.data;
    }

    async deletePaymentPlan(paymentPlanId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${paymentPlanId}`);
    }

    async createPaymentPlanGroup(paymentPlanGroupFormData: PaymentPlanGroupFormData): Promise<PaymentPlanGroupFormData> {
        const response = await api.post<PaymentPlanGroupFormData>(`${this.baseUrl}/group/`, paymentPlanGroupFormData);
        return response.data;
    }

    async updatePaymentPlanGroup(paymentPlanGroupId: string, paymentPlanGroupFormData: PaymentPlanGroupFormData): Promise<PaymentPlanFormData> {
        const response = await api.put<PaymentPlanFormData>(`${this.baseUrl}/group/${paymentPlanGroupId}`, paymentPlanGroupFormData);
        return response.data;
    }

    async deletePaymentPlanGroup(paymentPlanGroupId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/group/${paymentPlanGroupId}`);
    }

    async getAllPaymentPlanGroups(): Promise<PaymentPlanGroupFormData[]> {
        const response = await api.get<PaymentPlanGroupFormData[]>(`${this.baseUrl}/group/`);
        return response.data;
    }

    async createPaymentPlanInstallment(paymentPlanInstallment: PaymentPlanInstallmentFormData): Promise<PaymentPlanInstallment> {
        const response = await api.post<PaymentPlanInstallment>(`${this.baseUrl}/installment/`, paymentPlanInstallment);
        return response.data;
    }

    async updatePaymentPlanInstallment(paymentPlanInstallmentId: string, paymentPlanInstallment: PaymentPlanInstallmentFormData): Promise<PaymentPlanInstallment> {
        const response = await api.put<PaymentPlanInstallment>(`${this.baseUrl}/installment/${paymentPlanInstallmentId}`, paymentPlanInstallment);
        return response.data;
    }

    async deletePaymentPlanInstallment(paymentPlanInstallmentId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/installment/${paymentPlanInstallmentId}`);
    }


    async getPaymentInstallments(paymentPlanId: string): Promise<PaymentPlanInstallmentFormData[]> {
        const response = await api.get<PaymentPlanInstallmentFormData[]>(`${this.baseUrl}/installment/${paymentPlanId}`);
        return response.data;
    }

}

export const paymentPlanService = new PaymentPlanService();