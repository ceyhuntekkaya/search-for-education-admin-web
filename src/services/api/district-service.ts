import {District, DistrictFormData} from "@/types/district";
import api from "@/services/api/base-api";

class DistrictService {

    private readonly baseUrl = '/districts';


    async createDistrict(customerAddress: DistrictFormData): Promise<District> {
        const response = await api.post<District>(`${this.baseUrl}/`, customerAddress);
        return response.data;
    }

    async getAllDistricts(): Promise<District[]> {
        const response = await api.get<District[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getDistrictById(customerAddressId: string): Promise<District> {
        const response = await api.get<District>(`${this.baseUrl}/${customerAddressId}`);
        return response.data;
    }

    async getDistrictByCustomerId(customerId: string): Promise<District[]> {
        const response = await api.get<District[]>(`${this.baseUrl}/customer/${customerId}`);
        return response.data;
    }


    async updateDistrict(customerAddressId: string, customerAddress: DistrictFormData): Promise<District> {
        const response = await api.put<District>(`${this.baseUrl}/${customerAddressId}`, customerAddress);
        return response.data;
    }

    async deleteDistrict(customerAddressId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${customerAddressId}`);
    }

}

export const districtService = new DistrictService();