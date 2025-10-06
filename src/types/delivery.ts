import {TransportationCompany} from "@/types/transportation-company";
import {DatabaseObject} from "@/types/base";
import {Offer} from "@/types/offer";
import {Order} from "@/types/order";
import {EDeliveryStatus, EMediaType, EStatus} from "@/types/enumeration";
import {User} from "@/types/auth";
import {UploadedFile} from "@/types/uploaded-file";
import {Vehicle, VehicleDriver} from "@/types/vehicle";

export interface Delivery extends DatabaseObject {
    deliveryDate: Date;
    deliveryTime: string;
    cost: number;
    distance: number;
    duration: number;
    transportationCompany: TransportationCompany;
    offer: Offer;
    order: Order;
    code: string;
    deliveryStatus: EDeliveryStatus;
    vehicle:Vehicle;
    vehicleDriver: VehicleDriver
    link: string | null;
}

export interface DeliveryDocument extends DatabaseObject {
    delivery: Delivery;
    deliveryProgress: DeliveryProgress;
    user: User;
    documentType: DeliveryDocumentType;
    mediaType: EMediaType;
    documentPath: string;
    description: string;
    file: UploadedFile;
}

export interface DeliveryProgress extends DatabaseObject {
    delivery?: Delivery | null;
    order: Order;
    offer?: Offer | null;
    user: User;
    description: string;
    deliveryStatus: EDeliveryStatus;
}

export interface DeliveryDocumentType extends DatabaseObject {
    name: string;
    description: string;
}


export interface DeliveryFormData {
    deliveryDate: Date | null;
    deliveryTime: string;
    cost: number;
    distance: number;
    duration: number;
    transportationCompanyId: string | null;
    offerId: string | null;
    orderId: string | null;
    deliveryStatus: EDeliveryStatus | null;
    vehicleId: string | null;
    vehicleDriverId: string | null;
    status?: EStatus | null;
    id?: string | null;
    link?: string | null;
}

export interface DeliveryDocumentFormData {
    deliveryId: string | null;
    deliveryProgressId: string | null;
    userId: string | null;
    documentTypeId: string | null;
    mediaType: EMediaType | null;
    documentPath: string;
    description: string;
    file: UploadedFile | null;
    status?: EStatus | null;
    id?: string | null;
}

export interface DeliveryProgressFormData {
    deliveryId: string | null;
    orderId: string | null;
    offerId: string | null;
    userId: string | null;
    description: string;
    deliveryStatus: EDeliveryStatus | null;
    status?: EStatus | null;
    id?: string | null;
}

export interface DeliveryDocumentTypeFormData {
    name: string;
    description: string;
    status?: EStatus | null;
    id?: string | null;
}




export type DeliveryFormErrors = Partial<Record<keyof DeliveryFormData, string>>;
export type DeliveryDocumentFormErrors = Partial<Record<keyof DeliveryDocumentFormData, string>>;
export type DeliveryProgressFormErrors = Partial<Record<keyof DeliveryProgressFormData, string>>;
export type DeliveryDocumentTypeFormErrors = Partial<Record<keyof DeliveryDocumentTypeFormData, string>>;


