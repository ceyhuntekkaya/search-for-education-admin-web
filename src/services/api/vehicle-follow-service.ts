import api from './base-api';
import {VehicleFollow, VehicleFollowFormData} from "@/types/vehicle";


class VehicleFollowService {
    private readonly baseUrl = '/vehicle/follow';

    async createVehicleFollow(vehicleFollowFormData: VehicleFollowFormData): Promise<VehicleFollow> {
        const response = await api.post<VehicleFollow>(`${this.baseUrl}/`, vehicleFollowFormData);
        return response.data;
    }

    async getAllVehicleFollows(): Promise<VehicleFollow[]> {
        const response = await api.get<VehicleFollow[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getVehicleFollowById(vehicleFollowId: string): Promise<VehicleFollow> {
        const response = await api.get<VehicleFollow>(`${this.baseUrl}/${vehicleFollowId}`);
        return response.data;
    }

    async updateVehicleFollow(vehicleFollowId: string, vehicleFollowFormData: VehicleFollowFormData): Promise<VehicleFollow> {
        const response = await api.put<VehicleFollow>(
            `${this.baseUrl}/${vehicleFollowId}`,
            vehicleFollowFormData
        );
        return response.data;
    }

    async deleteVehicleFollow(vehicleFollowId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${vehicleFollowId}`);
    }

    async getVehicleFollowByVehicleDriver(id: string): Promise<VehicleFollow[]> {
        const response = await api.get<VehicleFollow[]>(`${this.baseUrl}/by/driver/${id}`);
        return response.data;
    }
    async getVehicleFollowByVehicle(id: string): Promise<VehicleFollow[]> {
        const response = await api.get<VehicleFollow[]>(`${this.baseUrl}/by/vehicle/${id}`);
        return response.data;
    }
    async getVehicleFollowByDelivery(id: string): Promise<VehicleFollow[]> {
        const response = await api.get<VehicleFollow[]>(`${this.baseUrl}/by/delivery/${id}`);
        return response.data;
    }

}

export const vehicleFollowService = new VehicleFollowService();