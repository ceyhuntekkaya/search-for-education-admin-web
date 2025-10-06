import api from './base-api';
import {FillingFacility, FillingFacilityFormData} from "@/types/supplier";



class FillingFacilityService {

    private readonly baseUrl = '/supplier/filling-facility';

    async createFillingFacility(facility: FillingFacilityFormData): Promise<FillingFacility> {
        const facilityToSend = {
            ...facility,
            productIds: facility.productIds ? Array.from(facility.productIds) : []
        };
        const response = await api.post<FillingFacility>(`${this.baseUrl}/`, facilityToSend);
        return response.data;
    }

    async getAllFillingFacilities(): Promise<FillingFacility[]> {
        const response = await api.get<FillingFacility[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getFillingFacilityById(facilityId: string): Promise<FillingFacility> {
        const response = await api.get<FillingFacility>(`${this.baseUrl}/${facilityId}`);
        return response.data;
    }

    async findFillingFacilitiesByName(text: string): Promise<FillingFacility[]> {
        const response = await api.get<FillingFacility[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async findFillingFacilitiesByCity(city: string): Promise<FillingFacility[]> {
        const response = await api.get<FillingFacility[]>(`${this.baseUrl}/search/city/${city}`);
        return response.data;
    }

    async findFillingFacilitiesBySupplierId(supplierId: string): Promise<FillingFacility[]> {
        const response = await api.get<FillingFacility[]>(`${this.baseUrl}/search/supplier/${supplierId}`);
        return response.data;
    }

    async updateFillingFacility(facilityId: string, facility: FillingFacilityFormData): Promise<FillingFacility> {
        const facilityToSend = {
            ...facility,
            productIds: facility.productIds ? Array.from(facility.productIds) : []
        };
        const response = await api.put<FillingFacility>(
            `${this.baseUrl}/${facilityId}`,
            facilityToSend
        );
        return response.data;
    }

    async deleteFillingFacility(facilityId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${facilityId}`);
    }


}

export const fillingFacilityService = new FillingFacilityService();