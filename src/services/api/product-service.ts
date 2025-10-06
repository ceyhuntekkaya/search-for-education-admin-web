import api from './base-api';
import {Product, ProductFormData} from "@/types/supplier";



class ProductService {
    private readonly baseUrl = '/supplier/product';

    async createProduct(product: ProductFormData): Promise<Product> {
        const response = await api.post<Product>(`${this.baseUrl}/`, product);
        return response.data;
    }

    async getAllProducts(): Promise<Product[]> {
        const response = await api.get<Product[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getProductById(productId: string): Promise<Product> {
        const response = await api.get<Product>(`${this.baseUrl}/${productId}`);
        return response.data;
    }

    async findProductsByName(text: string): Promise<Product[]> {
        const response = await api.get<Product[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async findBySupplierId(supplierId: string): Promise<Product[]> {
        const response = await api.get<Product[]>(`${this.baseUrl}/search/supplier/${supplierId}`);
        return response.data;
    }

    async updateProduct(productId: string, product: ProductFormData): Promise<Product> {
        const response = await api.put<Product>(
            `${this.baseUrl}/${productId}`,
            product
        );
        return response.data;
    }

    async deleteProduct(productId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${productId}`);
    }


}

export const productService = new ProductService();