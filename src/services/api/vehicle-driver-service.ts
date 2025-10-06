import api from './base-api';
import {VehicleDriver, VehicleDriverFormData} from "@/types/vehicle";



class VehicleDriverService {
    private readonly baseUrl = '/vehicle/driver';

    async createVehicleDriver(driver: VehicleDriverFormData): Promise<VehicleDriver> {
        const response = await api.post<VehicleDriver>(`${this.baseUrl}/`, driver);
        return response.data;
    }

    async getAllVehicleDrivers(): Promise<VehicleDriver[]> {
        const response = await api.get<VehicleDriver[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getVehicleDriverById(driverId: string): Promise<VehicleDriver> {
        const response = await api.get<VehicleDriver>(`${this.baseUrl}/${driverId}`);
        return response.data;
    }

    async getVehicleDriversByName(text: string): Promise<VehicleDriver[]> {
        const response = await api.get<VehicleDriver[]>(`${this.baseUrl}/search/name/${text}`);
        return response.data;
    }

    async updateVehicleDriver(driverId: string, driver: VehicleDriverFormData): Promise<VehicleDriver> {
        const response = await api.put<VehicleDriver>(
            `${this.baseUrl}/${driverId}`,
            driver
        );
        return response.data;
    }

    async deleteVehicleDriver(driverId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${driverId}`);
    }


}

export const vehicleDriverService = new VehicleDriverService();