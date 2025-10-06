import {CustomerAddress, CustomerAddressFormData} from "@/types/customer";
import api from "@/services/api/base-api";

class CustomerAddressService {

    private readonly baseUrl = '/customer-address';


    async createCustomerAddress(customerAddress: CustomerAddressFormData): Promise<CustomerAddress> {
        const response = await api.post<CustomerAddress>(`${this.baseUrl}/`, customerAddress);
        return response.data;
    }

    async getAllCustomerAddress(): Promise<CustomerAddress[]> {
        const response = await api.get<CustomerAddress[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getCustomerAddressById(customerAddressId: string): Promise<CustomerAddress> {
        const response = await api.get<CustomerAddress>(`${this.baseUrl}/${customerAddressId}`);
        return response.data;
    }

    async getCustomerAddressByCustomerId(customerId: string): Promise<CustomerAddress[]> {
        const response = await api.get<CustomerAddress[]>(`${this.baseUrl}/customer/${customerId}`);
        return response.data;
    }


    async updateCustomerAddress(customerAddressId: string, customerAddress: CustomerAddressFormData): Promise<CustomerAddress> {
        const response = await api.put<CustomerAddress>(`${this.baseUrl}/${customerAddressId}`, customerAddress);
        return response.data;
    }

    async deleteCustomerAddress(customerAddressId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${customerAddressId}`);
    }

}

export const customerAddressService = new CustomerAddressService();