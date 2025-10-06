import {DatabaseObject} from "@/types/base";
import {EStatus} from "@/types/enumeration";

export interface UploadedFile extends DatabaseObject {
    path: string;
    fileOriginalName: string;
    fileName: string;
    documentType: string;
}
export interface UploadedFileFormData {
    path: string;
    fileOriginalName: string;
    fileName: string;
    documentType: string;
    status?: EStatus | null;
    id?: string | null;
}
export type UploadedFileFormErrors = Partial<Record<keyof UploadedFileFormData, string>>;