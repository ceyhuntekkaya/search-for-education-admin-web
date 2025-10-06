'use client';

import React, {useEffect} from 'react';
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import {Customer} from "@/types/customer";
import Link from "next/link";
import {useCustomerAddress} from "@/hooks/use-customer-address";
import {useRouter} from "next/navigation";


interface CustomerAddressProps {
    customerId: string;
    selectedCustomer: Customer;
}

const CustomerAddress: React.FC<CustomerAddressProps> = ({
                                                       customerId,
                                                             selectedCustomer,
                                                         }) => {
    const router = useRouter();

    const {
        customerAddress,
        fetchCustomerAddressByCustomerId
    } = useCustomerAddress();


    useEffect(() => {
        const loadCustomer = async () => {
            try {
                await fetchCustomerAddressByCustomerId(customerId);
            } catch (error) {
                console.error('Sevkiyat yüklenirken hata oluştu:', error);
            } finally {
            }
        };

        if (customerId) {
            loadCustomer();
        }
    }, [customerId, fetchCustomerAddressByCustomerId]);

    const columnsCustomerAddress: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'İsim',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/customers/${selectedCustomer.id}/address/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'city',
            header: 'Şehir',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'district',
            header: 'İlçe',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'address',
            header: 'Adres',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        }
    ];


    return (
        <>
            <div className="flex items-center justify-between">
                <div>

                </div>
                <div className="flex space-x-3">

                    <Link href="/admin/customers/[id]/address"
                          as={`/admin/customers/${selectedCustomer.id}/address`}>
                        YENİ ADRES EKLE
                    </Link>
                </div>
            </div>
            <DynamicTable columns={columnsCustomerAddress} data={customerAddress}
                          pageSize={50}/>
        </>
    );
};

export default CustomerAddress;