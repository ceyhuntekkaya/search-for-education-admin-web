import api from './base-api';
import {Customer, CustomerFormData} from "@/types/customer";
import {SqlRequest} from "@/types/sql-type";


class CustomerService {

    private readonly baseUrl = '/customer';


    async createCustomer(customer: CustomerFormData): Promise<Customer> {
        const response = await api.post<Customer>(`${this.baseUrl}/`, customer);
        return response.data;
    }

    async getAllCustomers(): Promise<Customer[]> {
        const response = await api.get<Customer[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getCustomerById(customerId: string): Promise<Customer> {
        const response = await api.get<Customer>(`${this.baseUrl}/${customerId}`);
        return response.data;
    }

    async getCustomerBySearchByName(text: string): Promise<Customer[]> {
        const response = await api.get<Customer[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async updateCustomer(customerId: string, customer: CustomerFormData): Promise<Customer> {
        const response = await api.put<Customer>(`${this.baseUrl}/${customerId}`, customer);
        return response.data;
    }

    async deleteCustomer(customerId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${customerId}`);
    }

    async getCustomersFromData(request: SqlRequest): Promise<Customer[]> {
        const response = await api.post<Customer[]>(`/sql/hesap/aktar`, request);
        return response.data;
    }


    async setPaymentMethods(type: string, customerId: string, paymentMethodId: string): Promise<Customer> {
        const response = await api.get<Customer>(`${this.baseUrl}/payment-method/${type}/${customerId}/${paymentMethodId}`);
        return response.data;
    }


    async setCustomerContractType(customerId: string, contractType: string): Promise<Customer> {
        const response = await api.get<Customer>(`${this.baseUrl}/${customerId}/contractType/${contractType}`);
        return response.data;
    }



    async setCustomerOfferTextParts(id: string, parts: string): Promise<Customer> {
        const response = await api.put<Customer>(`${this.baseUrl}/offer/text/parts/${id}`, {offerTextParts: parts, id: id});
        return response.data;
    }

    async updateCustomerLimit(id: string, hasLock: boolean, hasLimit: number): Promise<Customer> {
        const response = await api.put<Customer>(`${this.baseUrl}/limit/${id}`, {hasLock, hasLimit});
        return response.data;
    }


}

export const customerService = new CustomerService();

