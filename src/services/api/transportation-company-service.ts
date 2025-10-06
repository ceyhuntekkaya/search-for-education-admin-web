import api from './base-api';
import {TransportationCompany, TransportationCompanyFormData} from "@/types/transportation-company";



class TransportationCompanyService {
    private readonly baseUrl = '/transportation';

    async createTransportationCompany(company: TransportationCompanyFormData): Promise<TransportationCompany> {
        const response = await api.post<TransportationCompany>(`${this.baseUrl}/`, company);
        return response.data;
    }

    async getAllTransportationCompanies(): Promise<TransportationCompany[]> {
        const response = await api.get<TransportationCompany[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getTransportationCompanyById(companyId: string): Promise<TransportationCompany> {
        const response = await api.get<TransportationCompany>(`${this.baseUrl}/${companyId}`);
        return response.data;
    }

    async getTransportationCompaniesByName(text: string): Promise<TransportationCompany[]> {
        const response = await api.get<TransportationCompany[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async updateTransportationCompany(companyId: string, company: TransportationCompanyFormData): Promise<TransportationCompany> {
        const response = await api.put<TransportationCompany>(
            `${this.baseUrl}/${companyId}`,
            company
        );
        return response.data;
    }

    async deleteTransportationCompany(companyId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${companyId}`);
    }


}

export const transportationCompanyService = new TransportationCompanyService();