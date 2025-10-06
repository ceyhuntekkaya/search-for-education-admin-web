import {EStatus, EVehicleType} from "@/types/enumeration";
import {TransportationCompany} from "@/types/transportation-company";
import {User} from "@/types/auth";
import {DatabaseObject} from "@/types/base";
import {Delivery} from "@/types/delivery";

export interface Vehicle extends DatabaseObject {
    id: string;
    mainLicensePlate: string;
    trailerLicensePlate: string;
    brand: string;
    model: string;
    type: EVehicleType;
    transportationCompany: TransportationCompany;
    description: string;
    capacities: VehicleCapacity[];
    capacity: number;
}

export interface VehicleDriver extends DatabaseObject {
    user: User | null;
    transportationCompany: TransportationCompany;
    vehicle: Vehicle | null;
    description: string;
}


export interface VehicleCapacity extends DatabaseObject {
    capacity: number;
    unit: string;
}


export interface VehicleFormData {
    mainLicensePlate: string;
    trailerLicensePlate: string;
    brand: string;
    model: string;
    type: EVehicleType | null;
    transportationCompanyId: string | null;
    description: string;
    capacities: VehicleCapacity[] | null;
    capacity: number;
    status?: EStatus | null;
    id?: string | null;
}

export interface VehicleDriverFormData {
    userId: string | null;
    transportationCompanyId: string | null;
    vehicleId: string | null;
    description: string;
    status?: EStatus | null;
    id?: string | null;
}


export interface VehicleCapacityFormData {
    capacity: number;
    unit: string;
    status?: EStatus | null;
    id?: string
}


export interface VehicleFollow extends DatabaseObject {

    vehicle: Vehicle | null;
    driver: VehicleDriver | null;
    delivery: Delivery | null;
    startKm: number;
    endKm: number;
    oilPrice: number;
    totalCost: number;
    startLocation: string | null;
    endLocation: string | null;

}

export interface VehicleFollowFormData {
    vehicleId: string | null;
    driverId: string | null;
    deliveryId: string | null;
    startKm: number;
    endKm: number;
    oilPrice: number;
    totalCost: number;
    startLocation: string | null;
    endLocation: string | null;
    status?: EStatus | null;
    id?: string | null;
}

export type VehicleFormErrors = Partial<Record<keyof VehicleFormData, string>>;
export type VehicleDriverFormErrors = Partial<Record<keyof VehicleDriverFormData, string>>;
export type VehicleCapacityFormErrors = Partial<Record<keyof VehicleCapacityFormData, string>>;
export type VehicleFollowFormErrors = Partial<Record<keyof VehicleFollowFormData, string>>;