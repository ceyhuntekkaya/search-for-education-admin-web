import api from './base-api';
import {CustomerInfo, CustomerInfoFormData} from "@/types/customer";


class CustomerInfoService {

    private readonly baseUrl = '/customer-info';


    async createCustomerInfo(customerInfo: CustomerInfoFormData): Promise<CustomerInfo> {
        const response = await api.post<CustomerInfo>(`${this.baseUrl}/`, customerInfo);
        return response.data;
    }

    async getAllCustomerInfos(): Promise<CustomerInfo[]> {
        const response = await api.get<CustomerInfo[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getCustomerInfoById(customerInfoId: string): Promise<CustomerInfo> {
        const response = await api.get<CustomerInfo>(`${this.baseUrl}/${customerInfoId}`);
        return response.data;
    }

    async getCustomerInfoByCustomerId(customerId: string): Promise<CustomerInfo[]> {
        const response = await api.get<CustomerInfo[]>(`${this.baseUrl}/customer/${customerId}`);
        return response.data;
    }


    async updateCustomerInfo(customerInfoId: string, customerInfo: CustomerInfoFormData): Promise<CustomerInfo> {
        const response = await api.put<CustomerInfo>(`${this.baseUrl}/${customerInfoId}`, customerInfo);
        return response.data;
    }

    async deleteCustomerInfo(customerInfoId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${customerInfoId}`);
    }

}

export const customerInfoService = new CustomerInfoService();

