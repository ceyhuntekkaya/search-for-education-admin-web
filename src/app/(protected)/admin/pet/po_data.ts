import {RecordType} from "@/types/table";


export interface PoData extends RecordType{
    district: string;
    city: string;
    gasoline: number;
    diesel: number;
    autogas: number;

}