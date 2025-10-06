import api from './base-api';
import {PaymentMethod, PaymentMethodFormData} from "@/types/offer";


class PaymentMethodService {
    private readonly baseUrl = '/payment-methods';

    async createPaymentMethod(paymentMethod: PaymentMethodFormData): Promise<PaymentMethod> {
        const response = await api.post<PaymentMethod>(`${this.baseUrl}/`, paymentMethod);
        return response.data;
    }

    async getAllPaymentMethods(): Promise<PaymentMethod[]> {
        const response = await api.get<PaymentMethod[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getPaymentMethodById(paymentMethodId: string): Promise<PaymentMethod> {
        const response = await api.get<PaymentMethod>(`${this.baseUrl}/${paymentMethodId}`);
        return response.data;
    }

    async updatePaymentMethod(paymentMethodId: string, paymentMethod: PaymentMethodFormData): Promise<PaymentMethod> {
        const response = await api.put<PaymentMethod>(
            `${this.baseUrl}/${paymentMethodId}`,
            paymentMethod
        );
        return response.data;
    }

    async deletePaymentMethod(paymentMethodId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${paymentMethodId}`);
    }

}

export const paymentMethodService = new PaymentMethodService();