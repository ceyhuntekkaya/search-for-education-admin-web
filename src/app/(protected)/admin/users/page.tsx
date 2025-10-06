'use client';

import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useUsers} from "@/hooks/use-user";
import React, {useEffect, useState} from "react";
import {Column, RecordType} from "@/types/table";
import DynamicTable from "@/components/ui/dynamic-table";
import LoadingComp from "@/components/ui/loading-comp";
import {Department, Role, User} from "@/types/auth";
import {useDataContext} from "@/contexts/data-context";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useLanguage} from "@/contexts/language-context";
import {useVehicleDrivers} from "@/hooks/use-vehicle-driver";
import {useTransportationCompanies} from "@/hooks/use-transportation-company";
import {useCustomers} from "@/hooks/use-customer";


export default function UsersPage() {
    const router = useRouter();
    const {users, fetchUsers, loading} = useUsers();
    const [filteredUser, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('ADMIN');

    const {
        roles,
    } = useDataContext();
    const {t} = useLanguage();


    const {vehicleDrivers, fetchVehicleDrivers} = useVehicleDrivers();
    const {transportationCompanies, fetchTransportationCompanies} = useTransportationCompanies();
    const {customers, fetchCustomers} = useCustomers();
    useEffect(() => {
        fetchVehicleDrivers();
        fetchTransportationCompanies();
        fetchCustomers();
    }, []);

    const fetchConnectionData = (id: string, role: string) => {
        if (role === 'ADMIN') {
            return "";
        } else if (role === 'COMPANY') {
            const customer = customers.find(company => company.id === id);
            if(!customer) return "";
            return customer?.name;
        } else if (role === 'TRANSPORTER') {
            const company = transportationCompanies.find(company => company.id === id);
            if(!company) return "";
            return company?.name;
        } else if (role === 'USER') {
            const driver = vehicleDrivers.find(company => company.id === id);
            if(!driver) return "";
            return driver?.user?.name + " " + driver?.user?.lastName;
        }
        return "";
    }

    const columns: Column<RecordType>[] = [
        {
            key: 'name',
            header: 'İsim',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/users/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'lastName',
            header: 'Soyisim',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/users/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'departmentSet',
            header: 'Birimler',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/users/${record.id}`)}
                >
                    {Array.from(value as Department[]).join(" - ")}

                </div>
            )
        },
        {
            key: 'connectionId',
            header: 'Bağlı Hesap',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/users/${record.id}`)}
                >
                    {fetchConnectionData(value as string, (record as User).roleSet[0])}

                </div>
            )
        }
    ];


    const handleAdd = () => {
        router.push('/admin/users/add');
    };


    useEffect(() => {
        fetchUsers();
    }, []);


    useEffect(() => {
        if (users) {
            const filtered = users.filter(user => {
                return user.roleSet.includes(searchTerm as Role);
            });
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);


    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}

                />
            }/>

            <div>

                <div className="space-y-2 mx-6">
                    <Select
                        onValueChange={(value) => setSearchTerm(value as string)}
                        value={searchTerm}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Teslimat seçin"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {roles.map((role, key) => (
                                    <SelectItem
                                        key={key}
                                        value={role}
                                    >
                                        {t(`user.${role}`)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>


                </div>
                <div className="p-6">
                    <DynamicTable columns={columns} data={filteredUser}/>
                </div>
            </div>


        </div>
    );
}