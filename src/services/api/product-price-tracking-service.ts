import {ProductPriceTracking, ProductPriceTrackingFormData} from "@/types/supplier";
import api from "@/services/api/base-api";

class ProductPriceTrackingService {
    private readonly baseUrl = '/supplier/product/tracking';

    async createProductPriceTracking(productPriceTracking: ProductPriceTrackingFormData): Promise<ProductPriceTracking> {
        const response = await api.post<ProductPriceTracking>(`${this.baseUrl}/`, productPriceTracking);
        return response.data;
    }

    async getAllProductPriceTracking(): Promise<ProductPriceTracking[]> {
        const response = await api.get<ProductPriceTracking[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getProductPriceTrackingById(productProductPriceId: string): Promise<ProductPriceTracking> {
        const response = await api.get<ProductPriceTracking>(`${this.baseUrl}/${productProductPriceId}`);
        return response.data;
    }

    async updateProductPriceTracking(productProductPriceId: string, productPriceTracking: ProductPriceTrackingFormData): Promise<ProductPriceTracking> {
        const response = await api.put<ProductPriceTracking>(
            `${this.baseUrl}/${productProductPriceId}`,
            productPriceTracking
        );
        return response.data;
    }

    async deleteProductPriceTracking(productProductPriceId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${productProductPriceId}`);
    }
}

export const productPriceTrackingService = new ProductPriceTrackingService();