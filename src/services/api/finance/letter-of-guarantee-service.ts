import api from "@/services/api/base-api";
import { LetterOfGuarantee, LetterOfGuaranteeFormData } from "@/types/finance";

class LetterOfGuaranteeService {
    private readonly baseUrl = '/finance/letter-of-guarantee';

    async createLetterOfGuarantee(letterOfGuarantee: LetterOfGuaranteeFormData): Promise<LetterOfGuarantee> {
        const response = await api.post<LetterOfGuarantee>(`${this.baseUrl}/`, letterOfGuarantee);
        return response.data;
    }

    async getAllLetterOfGuarantees(): Promise<LetterOfGuarantee[]> {
        const response = await api.get<LetterOfGuarantee[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getLetterOfGuaranteeById(letterOfGuaranteeId: string): Promise<LetterOfGuarantee> {
        const response = await api.get<LetterOfGuarantee>(`${this.baseUrl}/${letterOfGuaranteeId}`);
        return response.data;
    }

    async getLetterOfGuaranteesByBrandId(brandId: string): Promise<LetterOfGuarantee[]> {
        const response = await api.get<LetterOfGuarantee[]>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    async updateLetterOfGuarantee(letterOfGuaranteeId: string, letterOfGuarantee: LetterOfGuaranteeFormData): Promise<LetterOfGuarantee> {
        const response = await api.put<LetterOfGuarantee>(`${this.baseUrl}/${letterOfGuaranteeId}`, letterOfGuarantee);
        return response.data;
    }

    async deleteLetterOfGuarantee(letterOfGuaranteeId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${letterOfGuaranteeId}`);
    }
}

export const letterOfGuaranteeService = new LetterOfGuaranteeService();