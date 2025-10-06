import api from './base-api';
import {Vehicle, VehicleCapacity, VehicleFormData} from "@/types/vehicle";


class VehicleService {
    private readonly baseUrl = '/vehicle';

    async createVehicle(vehicle: VehicleFormData): Promise<Vehicle> {
        const response = await api.post<Vehicle>(`${this.baseUrl}/`, vehicle);
        return response.data;
    }

    async getAllVehicles(): Promise<Vehicle[]> {
        const response = await api.get<Vehicle[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getVehicleById(vehicleId: string): Promise<Vehicle> {
        const response = await api.get<Vehicle>(`${this.baseUrl}/${vehicleId}`);
        return response.data;
    }

    async getVehiclesByLicensePlate(licensePlateId: string): Promise<Vehicle[]> {
        const response = await api.get<Vehicle[]>(`${this.baseUrl}/search/license-plate/${licensePlateId}`);
        return response.data;
    }

    async updateVehicle(vehicleId: string, vehicle: VehicleFormData): Promise<Vehicle> {
        const response = await api.put<Vehicle>(
            `${this.baseUrl}/${vehicleId}`,
            vehicle
        );
        return response.data;
    }

    async deleteVehicle(vehicleId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${vehicleId}`);
    }

    async addVehicleCapacity(vehicleId: string, capacity: VehicleCapacity): Promise<Vehicle> {
        const response = await api.post<Vehicle>(
            `${this.baseUrl}/capacity/add/${vehicleId}`,
            capacity
        );
        return response.data;
    }

    async removeVehicleCapacity(vehicleId: string, capacity: VehicleCapacity): Promise<Vehicle> {
        const response = await api.post<Vehicle>(
            `${this.baseUrl}/capacity/remove/${vehicleId}`,
            capacity
        );
        return response.data;
    }
}

export const vehicleService = new VehicleService();