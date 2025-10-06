import {Customer, CustomerAddress, CustomerInfo} from "@/types/customer";
import {FillingFacility, Product, Supplier} from "@/types/supplier";
import {ECity, EOrderStateStage, EStatus} from "@/types/enumeration";
import {DatabaseObject} from "@/types/base";
import {Offer, OfferApproval} from "@/types/offer";
import {Delivery, DeliveryDocument, DeliveryProgress} from "@/types/delivery";
import {TransportationCompany} from "@/types/transportation-company";
import {Vehicle, VehicleDriver} from "@/types/vehicle";
import {Brand} from "@/types/brand";
import {RecordType} from "@/types/table";

export interface Order extends DatabaseObject {
    customer: Customer;
    orderDate: Date;
    supplier: Supplier;
    product: Product;
    fillingFacility: FillingFacility;
    location: string;
    city: ECity;
    paymentTerm: number;
    fuelRate: number;
    totalLiter: number;
    orderQuantity: number;
    lastUpdate: Date | null;
    code: string;
    customerAddress: CustomerAddress;
    district: string;
    paymentMethod: string;
    paymentMethodDifference: number;
    orderState: OrderState;

    isExternalTransportation: boolean;
    externalDriver: string;
    externalVehicle: string;
    externalVehiclePlate: string;
    externalVehicleTrailerPlate: string;
    description: string;
    brand: Brand;
}

export interface OrderFormData {

    customerId: string | null;
    orderStateId: string | null;
    orderDate: Date;
    supplierId: string | null;
    productId: string | null;
    fillingFacilityId: string | null;
    location: string;
    city: ECity | null;
    paymentTerm: number;
    fuelRate: number;
    totalLiter: number;
    orderQuantity: number;
    customerAddressId: string | null;
    status?: EStatus | null;
    id?: string | null;
    district: string;
    paymentMethod: string;
    paymentMethodDifference: number;


    isExternalTransportation: boolean;
    externalDriver: string;
    externalVehicle: string;
    externalVehiclePlate: string;
    externalVehicleTrailerPlate: string;
    description: string;
    brandId: string;
}



export interface OrderDtoFormData extends RecordType {

    customerId: string | null;
    orderStateId: string | null;
    orderDate: Date;
    supplierId: string | null;
    productId: string | null;
    fillingFacilityId: string | null;
    location: string;
    city: ECity | null;
    paymentTerm: number;
    fuelRate: number;
    totalLiter: number;
    orderQuantity: number;
    customerAddressId: string | null;
    status?: EStatus | null;
    id?: string | null;
    district: string;
    paymentMethod: string;
    paymentMethodDifference: number;

    isExternalTransportation: boolean;
    externalDriver: string;
    externalVehicle: string;
    externalVehiclePlate: string;
    externalVehicleTrailerPlate: string;
    description: string;
    brandId: string;

    offerDate: Date | null;
    deliveryDate: Date | null;
    finalDate: Date | null;
    approvals: string;
    isFinished: boolean;
    customerName: string;
    supplierName: string;
    productName: string;
    transporterCompanyName: string;
    orderStateName: string;
}


export interface AllOrderDataRequest {
    order: Order;
    offer: Offer | null;
    delivery: Delivery | null;
    deliveryDocuments: DeliveryDocument[] | null;
    deliveryProgresses: DeliveryProgress[] | null;
    customerInfos: CustomerInfo[] | null;
    offerApprovals: OfferApproval[] | null;

}

export interface OrderParts {
    order: Order | null;
    offer: Offer | null;
    loading: boolean;
    error: Error | null;
    customer: Customer | null;
    supplier: Supplier | null;
    product: Product | null;
    fillingFacility: FillingFacility | null;
    delivery: Delivery | null;
    transportationCompany: TransportationCompany | null;
    deliveryDocuments: DeliveryDocument[] | null;
    deliveryProgresses: DeliveryProgress[] | null;
    customerInfos: CustomerInfo[] | null;
    offerApprovals: OfferApproval[] | null;
    vehicle: Vehicle | null;
    vehicleDriver: VehicleDriver | null;
}


export interface OrderState extends DatabaseObject {
    name: string;
    description: string;
    isDefault: boolean;
    isFinal: boolean;
    isActive: boolean;
    orderNumber: number;
    stage: EOrderStateStage;
}

export interface OrderStateFormData {
    name: string;
    description: string;
    isDefault: boolean;
    isFinal: boolean;
    isActive: boolean;
    orderNumber: number;
    status?: EStatus | null;
    id?: string | null;
}

export interface OfferText extends DatabaseObject {
    text: string;
    title: string;
    description: string;
    explain: string;
    contract: string;
    brand: Brand;
}

export interface OfferTextFormData {
    text: string;
    title: string;
    description: string;
    explain: string;
    contract: string;
    status?: EStatus | null;
    id?: string | null;
    brandId: string;
}

export interface OrderSearchFormData {
    beginAt: Date | null;
    endAt: Date | null;

}

export type OfferTextFormErrors = Partial<Record<keyof OfferTextFormData, string>>;
export type OrderFormErrors = Partial<Record<keyof OrderFormData, string>>;



