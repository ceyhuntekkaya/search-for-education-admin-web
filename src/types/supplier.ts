import {ECity, EProductType, EStatus} from "@/types/enumeration";
import {DatabaseObject} from "@/types/base";
import {Brand} from "@/types/brand";


export interface Supplier extends DatabaseObject {
    code: string;
    name: string;
    brand: Brand;

}

export interface FillingFacility extends DatabaseObject {
    name: string;
    location: string;
    city: ECity;
    capacity: number;
    isOperational: boolean;
    supplier: Supplier;
    products: Set<Product>;
}


export interface Product extends DatabaseObject {
    supplier: Supplier;
    name: string;
    type: EProductType;
    description: string;
    code: string;
    brand: Brand;
}


export interface SupplierFormData {
    code: string;
    name: string;
    status?: EStatus | null;
    id?: string | null;
    brandId: string;

}

export interface FillingFacilityFormData {
    name: string;
    location: string;
    city: ECity | null;
    capacity: number;
    isOperational: boolean;
    supplierId: string | null;
    productIds: Set<string> | null;
    status?: EStatus | null;
    id?: string | null;
}


export interface ProductFormData {
    supplierId: string | null;
    name: string;
    type: EProductType | null;
    description: string;
    status?: EStatus | null;
    id?: string | null;
    brandId: string;
}

export interface ProductPriceTracking extends DatabaseObject {
    product: Product;
    price: number;
    pumpPrice: number;
    pumpDiscountRate: number;
    distributorPrice: number;
    distributorDiscountRate: number;
    priceSource: string;
    purchaseDate: Date | null;
    announcementDate: Date | null;
    maturity: string;
    taxRate: number;
    fillingFacility: FillingFacility;

}

export interface ProductPriceTrackingFormData {
    productId: string | null;
    price: number;
    pumpPrice: number;
    pumpDiscountRate: number;
    distributorPrice: number;
    distributorDiscountRate: number;
    priceSource: string;
    purchaseDate: Date | null;
    announcementDate: Date | null;
    maturity: string;
    taxRate: number;
    fillingFacilityId: string | null;
    status?: EStatus | null;
    id?: string | null;
}
export type SupplierFormErrors = Partial<Record<keyof SupplierFormData, string>>;
export type FillingFacilityFormErrors = Partial<Record<keyof FillingFacilityFormData, string>>;
export type ProductFormErrors = Partial<Record<keyof ProductFormData, string>>;