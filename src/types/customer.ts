import {Department, User} from "@/types/auth";
import {DatabaseObject} from "@/types/base";
import {ECity, EInfoStatus, EStatus} from "@/types/enumeration";
import {Property} from "csstype";
import Order = Property.Order;
import {District} from "@/types/district";
import {PaymentMethod, PaymentMethodFormData} from "@/types/offer";
import {Brand} from "@/types/brand";

export const OfferTextPartList = [
    "SEVK MİKTARI",
    "BİRİM FİYAT",
    "NAKLİYE FİYATI",
    "ÖDEME VADESİ",
    "NAKLİYE FİYATI TL/LT",
    "NAKLİYE DAHİL TEKLİF FİYATI",
    "BİNDİRİM",
    "TÜPRAŞ FİYATI",
    "TÜPRAŞ KOŞULU",
    "AÇIKLAMA",
    "SEVK YERİ"
] as const;


export interface CustomerFormData {
    name: string;
    address: string;
    phone: string;
    email: string;
    contactPerson: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    contactPersonPosition: string;
    contactPersonDepartment: string;
    taxNumber: string;
    taxOffice: string;
    user: User | null;
    code: string;
    code2: string;
    status?: EStatus | null;
    id?: string | null;
    paymentMethods: PaymentMethodFormData[] | [];
    brandId: string;
    contractType: string | null;

    locked: boolean;
    offerTextParts: string | null;


    banned: boolean | null;
    link: string | null;
    maxLimit: number | null;
}


export interface Customer extends DatabaseObject {
    name: string;
    address: string;
    phone: string;
    email: string;
    contactPerson: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    contactPersonPosition: string;
    contactPersonDepartment: string;
    taxNumber: string;
    taxOffice: string;
    userId: string | null;
    code: string;
    code2: string;
    paymentMethods: PaymentMethod[];
    brand: Brand;
    contractType: string | null;
    locked: boolean;
    offerTextParts: string | null;
    banned: boolean | null;
    link: string | null;
    maxLimit: number | null;
}

export interface CustomerInfo extends DatabaseObject {
    customer: Customer;
    order: Order;
    infoStatus: EInfoStatus;
    requestingUser: User;
    requestingUnit: Department;
    respondingUser: User;
    requestDescription: string;
    description: string;
}



export interface CustomerOfferTextParts {
    offerTextParts: string;
}
export interface CustomerLock  {
    locked: boolean;
}



export interface CustomerAddress extends DatabaseObject {
    name: string;
    customer: Customer;
    city: ECity | null;
    district: District;
    address: string;

}


export interface CustomerAddressFormData {
    name: string;
    customerId: string;
    city: ECity | null;
    district: string;
    address: string;
    status?: EStatus | null;
    id?: string | null;
}



export interface CustomerInfoFormData {
    customerId: string;
    orderId: string;
    infoStatus: EInfoStatus;
    requestingUserId: string;
    requestingUnit: Department | null;
    respondingUserId: string;
    requestDescription: string;
    description: string;
    status?: EStatus | null;
    id?: string | null;
}



export type CustomerFormErrors = Partial<Record<keyof CustomerFormData, string>>;
export type CustomerAddressFormErrors = Partial<Record<keyof CustomerAddressFormData, string>>;

