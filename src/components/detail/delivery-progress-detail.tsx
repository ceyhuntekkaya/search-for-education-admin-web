'use client';

import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {DeliveryProgress} from "@/types/delivery";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import {User} from "@/types/auth";
import {formatDate} from "@/utils/date-formater";


interface DeliveryProgressDetailProps {
    deliveryProgress: DeliveryProgress[];
}

const DeliveryProgressTable: React.FC<DeliveryProgressDetailProps> = ({
                                                                               deliveryProgress,
                                                                           }) => {

    const columns: Column<RecordType>[] = [
        {
            key: 'description',
            header: 'İşlem',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'user',
            header: 'Kullanıcı',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(value as User).name}  {(value as User).lastName}
                </div>
            )
        },
        {
            key: 'createdAt',
            header: 'Tarih',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {formatDate(value as string, "dateTime")}
                </div>
            )
        }
    ];

    return (
        <div>
            <Card>
                <CardContent>
                    <DynamicTable columns={columns} data={deliveryProgress}/>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeliveryProgressTable;