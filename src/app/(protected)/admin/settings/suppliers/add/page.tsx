'use client';
import SupplierForm from "@/components/form/supplier-form";
import PageHeader from "@/components/layout/page-header";
import {useSuppliers} from "@/hooks/use-supplier";

export default function SupplierAddPage() {
    const{createSupplier} = useSuppliers();

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="bg-white">
                <SupplierForm onSubmit={createSupplier}/>
            </div>
        </div>
    );
}