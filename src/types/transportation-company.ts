import {DatabaseObject} from "@/types/base";
import {ECity, EStatus} from "@/types/enumeration";
import {User} from "@/types/auth";
import {Brand} from "@/types/brand";

export interface TransportationCompany extends DatabaseObject {
    name: string;
    companyName: string;
    address: string;
    phone: string;
    email: string;
    contactPerson: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    contactPersonPosition: string;
    contactPersonDepartment: string;
    taxNumber: string;
    taxOffice: string ;
    isMainCompany: boolean;
    city: ECity;
    description: string;
    user: User | null;
    brand: Brand;
}


export interface TransportationCompanyFormData {
    name: string;
    companyName: string;
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
    isMainCompany: boolean;
    city: ECity | null;
    description: string;
    userId: string | null;
    status?: EStatus | null;
    id?: string | null;
    brandId: string;
}


export type TransportationCompanyFormErrors = Partial<Record<keyof TransportationCompanyFormData, string>>;