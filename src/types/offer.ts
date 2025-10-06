import {DatabaseObject} from "@/types/base";
import {Order} from "@/types/order";
import {TransportationCompany} from "@/types/transportation-company";
import {Vehicle, VehicleDriver} from "@/types/vehicle";
import {EOfferStatus, EStatus} from "@/types/enumeration";
import {Department, User} from "@/types/auth";
import {RecordType} from "@/types/table";

export interface Offer extends DatabaseObject {
    order: Order;
    shippingPrice: number;
    totalAmount: number;
    profitMultiplier: number;
    transportDistance: number;
    transportDuration: number;
    literShippingPrice: number;
    description: string;
    pumpPrice: number;
    pumpDiscountRate: number;
    unitPrice: number;
    shippingLiterPrice: number;
    lapping: number;
    unitPriceIncludingShipping: number;
    mainDistributorPrice: number;
    mainDistributorRate: number;
    transportationCompany: TransportationCompany | null;
    vehicle: Vehicle | null;
    lastUpdate: Date;
    offerStatus: EOfferStatus;
    code: string;

    vehicleDriver: VehicleDriver | null;
    priceSource: string;
    maturityCost: number;

}


export interface OfferFormData {
    status?: EStatus | null;
    id?: string | null;
    orderId: string | null;
    shippingPrice: number;
    totalAmount: number;
    profitMultiplier: number;
    transportDistance: number;
    transportDuration: number;
    literShippingPrice: number;
    description: string;
    pumpPrice: number;
    pumpDiscountRate: number;
    unitPrice: number;
    shippingLiterPrice: number;
    lapping: number;
    unitPriceIncludingShipping: number;
    mainDistributorPrice: number;
    mainDistributorRate: number;
    transportationCompanyId: string | null;
    vehicleId: string | null;
    offerStatus: EOfferStatus | null;
    vehicleDriverId: string | null;
    priceSource: string;
    maturityCost: number;

}



export interface OfferApproval extends DatabaseObject {
    offer: Offer;
    user: User;
    approvalDate: Date;
    description: string;
    department: Department;
    offerStatus: EOfferStatus;
}


export interface OfferApprovalGroupDTO extends RecordType {
    offer: Offer;
    approvals: OfferApproval[];
    approvalCount: number;
}


export interface OfferApprovalFormData {
    offerId: string | null;
    userId?: string | null;
    approvalDate: Date;
    description: string;
    department: Department | null;
    offerStatus: EOfferStatus;
    status?: EStatus | null;
    id?: string | null;
}

export interface PaymentMethod extends DatabaseObject {
    name: string;
    maturityDifference: number;
    paymentTerm: number;
    approvalDate: Date;
    description: string;
    department: Department;
    offerStatus: EOfferStatus;
}
export interface PaymentMethodFormData {
    name: string | null;
    paymentTerm: number;
    maturityDifference: number;
    status?: EStatus | null;
    id?: string | null;
}

export type OfferFormErrors = Partial<Record<keyof OfferFormData, string>>;
export type OfferApprovalFormErrors = Partial<Record<keyof OfferApprovalFormData, string>>;
export type PaymentMethodFormErrors = Partial<Record<keyof PaymentMethodFormData, string>>;
