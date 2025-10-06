import api from './base-api';
import {Supplier, SupplierFormData} from "@/types/supplier";


class SupplierService {
    private readonly baseUrl = '/supplier';

    async createSupplier(supplier: SupplierFormData): Promise<Supplier> {
        const response = await api.post<Supplier>(`${this.baseUrl}/`, supplier);
        return response.data;
    }

    async getAllSuppliers(): Promise<Supplier[]> {
        const response = await api.get<Supplier[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getSupplierById(supplierId: string): Promise<Supplier> {
        const response = await api.get<Supplier>(`${this.baseUrl}/${supplierId}`);
        return response.data;
    }

    async getSuppliersByName(text: string): Promise<Supplier[]> {
        const response = await api.get<Supplier[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async updateSupplier(supplierId: string, supplier: SupplierFormData): Promise<Supplier> {
        const response = await api.put<Supplier>(
            `${this.baseUrl}/${supplierId}`,
            supplier
        );
        return response.data;
    }

    async deleteSupplier(supplierId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${supplierId}`);
    }
}

export const supplierService = new SupplierService();

