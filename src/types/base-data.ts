import {Department, Permission, Role, User} from "@/types/auth";
import {TransportationCompany} from "@/types/transportation-company";
import {Product, Supplier} from "@/types/supplier";
import {Brand} from "@/types/brand";


export interface DataContextType {
    transportationCompanies: TransportationCompany[] | null;
    users: User[] | null;
    products: Product[] | null;
    brands: Brand[] | null;
    suppliers: Supplier[] | null;
    loading: boolean;
    error: string | null;
    permissions: Permission[];
    departments: Department[];
    roles: Role[];
}