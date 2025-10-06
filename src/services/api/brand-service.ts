import api from './base-api';
import {Brand, BrandFormData} from "@/types/brand";
import {SqlRequest} from "@/types/sql-type";


class BrandService {

    private readonly baseUrl = '/brand';


    async createBrand(brand: BrandFormData): Promise<Brand> {
        const response = await api.post<Brand>(`${this.baseUrl}/`, brand);
        return response.data;
    }

    async getAllBrands(): Promise<Brand[]> {
        const response = await api.get<Brand[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getBrandById(brandId: string): Promise<Brand> {
        const response = await api.get<Brand>(`${this.baseUrl}/${brandId}`);
        return response.data;
    }

    async getBrandBySearchByName(text: string): Promise<Brand[]> {
        const response = await api.get<Brand[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async updateBrand(brandId: string, brand: BrandFormData): Promise<Brand> {
        const response = await api.put<Brand>(`${this.baseUrl}/${brandId}`, brand);
        return response.data;
    }

    async deleteBrand(brandId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${brandId}`);
    }

    async getBrandsFromData(request: SqlRequest): Promise<Brand[]> {
        const response = await api.post<Brand[]>(`/sql/hesap/aktar`, request);
        return response.data;
    }

}

export const brandService = new BrandService();

