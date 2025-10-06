import {DatabaseObject} from "@/types/base";
import {EStatus} from "@/types/enumeration";

export interface District extends DatabaseObject {
    name: string;
    code: string;
    cityCode: string;
    cityName: string;
    cityId: string;
}

export interface DistrictFormData {
    name: string;
    code: string;
    cityCode: string;
    cityName: string;
    cityId: string;
    status?: EStatus | null;
    id?: string | null;
}
