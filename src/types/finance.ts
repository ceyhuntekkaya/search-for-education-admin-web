// Finance entity interfaces
import {Brand} from "@/types/brand";
import {DatabaseObject} from "./base";
import {EStatus} from "@/types/enumeration";
import {RecordType} from "@/types/table";
import {Customer} from "./customer";

export interface Bank extends DatabaseObject {
    brand: Brand;
    name: string;
    swiftCode: string;
    accountingCode: string;
}

export interface BankFormData {
    status?: EStatus | null;
    id?: string | null;
    brandId: string | null;
    name: string;
    swiftCode: string;
    accountingCode: string;
}

export interface BankAccount extends DatabaseObject {
    brand: Brand;
    branchName: string;
    branchCode: string;
    iban: string;
    accountNumber: string;

    bank?: Bank | null;
    accountCode?: string | null;
    accountDescription?: string | null;
    detailFlag?: string | null;
    totalDebit?: number | null;
    totalCredit?: number | null;
    debitBalance?: number | null;
    creditBalance?: number | null;
    bankName?: string | null;
    address?: string | null;
    city?: string | null;
    district?: string | null;
    phone1?: string | null;
    phone2?: string | null;
    fax?: string | null
    email?: string | null;
    contactPerson?: string | null;
    taxNumber?: string | null;
    taxOffice?: string | null;
    secondaryAccountCode?: string | null;
    ba1Flag?: string | null;
    ba2Flag?: string | null;
    ba3Field?: string | null;
}

export interface BankAccountFormData {
    status?: EStatus | null;
    id?: string | null;
    brandId: string | null;
    branchName: string;
    branchCode: string;
    iban: string;
    accountNumber: string;

    bankId?: string | null;
    accountCode?: string | null;
    accountDescription?: string | null;
    detailFlag?: string | null;
    totalDebit?: number | null;
    totalCredit?: number | null;
    debitBalance?: number | null;
    creditBalance?: number | null;
    bankName?: string | null;
    address?: string | null;
    city?: string | null;
    district?: string | null;
    phone1?: string | null;
    phone2?: string | null;
    fax?: string | null
    email?: string | null;
    contactPerson?: string | null;
    taxNumber?: string | null;
    taxOffice?: string | null;
    secondaryAccountCode?: string | null;
    ba1Flag?: string | null;
    ba2Flag?: string | null;
    ba3Field?: string | null;
}

export interface AdditionalAccount extends DatabaseObject {
    bankAccount: BankAccount;
    amount: number;
    used: number;
    remaining: number;
}

export interface AdditionalAccountFormData {
    status?: EStatus | null;
    id?: string | null;
    bankAccountId: string | null;
    amount: number;
    used: number;
    remaining: number;
}

export interface BankCheck extends DatabaseObject {
    brand: Brand;
    serialNumber: string;
    bankName: string;
    amount: number;
    dueDate: string;
    issuer: string;
    bankForCollection: string;
    checkType: string; // 'GIVEN' | 'RECEIVED'
    bank: Bank | null;
    useDate: string | null;
    description: string | null;
    cashingDate: string | null;
    cashingAmount: number | null;


}

export interface BankCheckFormData {
    status?: EStatus | null;
    id?: string | null;
    brandId: string | null;
    serialNumber: string;
    bankName: string;
    amount: number;
    dueDate: string;
    issuer: string;
    bankForCollection: string;
    checkType: string; // 'GIVEN' | 'RECEIVED'
    bankId: string | null;
    useDate: string | null;
    description: string | null;
    cashingDate: string | null;
    cashingAmount: number | null;
}

export interface Credit extends DatabaseObject {
    brand: Brand;
    bank: Bank;
    creditDate: Date;
    interestRate: number;
    principal: number;
    interest: number;
    paidAmount: number;
    numberOfInstallments: number;
    bsmv: number;
    name: string;
    description: string;
    installments?: CreditInstallmentFormData[] | null;
}

export interface CreditFormData extends RecordType {
    status?: EStatus | null;
    id?: string | null;
    brandId: string | null;
    bankId: string | null;
    creditDate: Date | null;
    interestRate: number;
    principal: number;
    interest: number;
    paidAmount: number;
    numberOfInstallments: number;
    bsmv: number;
    name: string;
    description: string;
    installments?: CreditInstallmentFormData[] | null;
    brandName?: string | null;
    bankName?: string | null;
}

export interface CreditInstallment extends DatabaseObject {
    credit: Credit;
    creditInstallmentDate: Date;
    installmentNo: number;
    principal: number;
    interest: number;
    bsmv: number;
    paidAmount: number;
    paid: number;
    remaining: number;
}

export interface CreditInstallmentFormData {
    status?: EStatus | null;
    id?: string | null;
    creditId: string | null;
    creditInstallmentDate: Date | null;
    installmentNo: number;
    principal: number;
    interest: number;
    bsmv: number;
    paidAmount: number;
    paid: number;
    remaining: number;
}

export interface CreditCard extends DatabaseObject {
    brand: Brand;
    bank: Bank;
    owner: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    limitAmount: number;
    accountCutOffDate: string;
    paymentDate: string;
    used: number;
    remaining: number;
}

export interface CreditCardFormData {
    status?: EStatus | null;
    id?: string | null;
    brandId: string | null;
    bankId: string | null;
    owner: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    limitAmount: number;
    accountCutOffDate: string;
    paymentDate: string;
    used: number;
    remaining: number;
}

export interface LetterOfGuarantee extends DatabaseObject {
    brand: Brand;
    bank: Bank;
    interlocutor: string;
    letterNumber: string;
    letterDate: string;
    duration: string;
    amount: number;
}

export interface LetterOfGuaranteeFormData {
    status?: EStatus | null;
    id?: string | null;
    brandId: string | null;
    bankId: string | null;
    interlocutor: string;
    letterNumber: string;
    letterDate: string | null;
    duration: string | null;
    amount: number;
}


export interface CreditFormDataForError {
    status?: EStatus | null;
    id?: string | null;
    brandId: string | null;
    bankId: string | null;
    creditDate: Date | null;
    interestRate: number;
    principal: number;
    interest: number;
    paidAmount: number;
    numberOfInstallments: number;
    bsmv: number;
    name: string;
    description: string;
    installments?: CreditInstallmentFormData[] | null;
    brandName?: string | null;
    bankName?: string | null;
}


export interface PaymentPlan extends DatabaseObject {
    customer: Customer | null;
    invoiceDate: Date | null;
    description: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    maturityDate: Date | null;
    documentNo?: string | null;
    nonCustomerName?: string | null;
    brand: Brand | null;
    paymentPlanGroup: PaymentPlanGroup | null;
}

export interface PaymentPlanFormData {
    status?: EStatus | null;
    id?: string | null;
    customerId: string | null;
    invoiceDate: Date | null;
    description: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    maturityDate: Date;
    documentNo?: string | null;
    nonCustomerName?: string | null;
    brandId: string | null;
    paymentPlanGroupId: string | null;
}


export interface PaymentPlanGroup extends DatabaseObject {
    name: string | null;
    description?: string | null;
    paymentPlanType: string;
}

export interface PaymentPlanGroupFormData {
    status?: EStatus | null;
    id?: string | null;
    name: string | null;
    description?: string | null;
    paymentPlanType: string;
}


export interface PaymentPlanInstallment extends DatabaseObject {
    paymentPlan: PaymentPlan;
    description: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number | null;
    maturityDate?: Date | null;
    documentNo?: string | null;

}

export interface PaymentPlanInstallmentFormData {
    status?: EStatus | null;
    id?: string | null;
    paymentPlanId: string;
    description: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    maturityDate?: Date | null;
    documentNo?: string | null;
}

export interface PaymentPlanDataDto extends RecordType {
    paymentPlanDto: PaymentPlanFormData;
    paymentPlanGroupDto?: PaymentPlanGroupFormData | null;
    paymentPlanInstallmentDtos: PaymentPlanInstallmentFormData[];
}


export interface PaymentPlanDetail extends RecordType {
    status?: EStatus | null;
    id?: string | null;
    mainId?: string | null;
    paymentPlanId: string;
    description: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    maturityDate?: Date;
    documentNo?: string | null;

    customerId: string | null;
    invoiceDate: Date | null;
    nonCustomerName?: string | null;
    brandId: string | null;
    paymentPlanGroupId: string | null;

    paymentGroupId?: string | null;
    paymentGroupName?: string | null;
    paymentPlanType: string | null;
}


export interface PaymentPlanFormDataError {
    status?: EStatus | null;
    id?: string | null;
    customerId: string | null;
    invoiceDate: Date | null;
    description: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    maturityDate: Date;
    documentNo?: string | null;
    nonCustomerName?: string | null;
    brandId: string | null;
    paymentPlanGroupId: string | null;
    installments: string | null;
}


export type BankFormErrors = Partial<Record<keyof BankFormData, string>>;
export type BankAccountFormErrors = Partial<Record<keyof BankAccountFormData, string>>;
export type AdditionalAccountFormErrors = Partial<Record<keyof AdditionalAccountFormData, string>>;
export type BankCheckFormErrors = Partial<Record<keyof BankCheckFormData, string>>;
export type CreditFormErrors = Partial<Record<keyof CreditFormDataForError, string>>;
export type CreditInstallmentFormErrors = Partial<Record<keyof CreditInstallmentFormData, string>>;
export type CreditCardFormErrors = Partial<Record<keyof CreditCardFormData, string>>;
export type LetterOfGuaranteeFormErrors = Partial<Record<keyof LetterOfGuaranteeFormData, string>>;

export type PaymentPlanFormErrors = Partial<Record<keyof PaymentPlanFormDataError, string>>;




