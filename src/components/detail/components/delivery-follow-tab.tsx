'use client';

import React, {useEffect} from 'react';
import {Delivery} from "@/types/delivery";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/table";
import {useVehicleFollows} from "@/hooks/use-vehicle-follow";
import {Vehicle, VehicleDriver} from "@/types/vehicle";

interface OfferDetailProps {
    delivery?: Delivery | null;
}

const DeliveryVehicleFollowTab: React.FC<OfferDetailProps> = ({
                                                                  delivery,
                                                              }) => {


    const {
        getVehicleFollowByDelivery,
        vehicleFollows,
    } = useVehicleFollows();

    useEffect(() => {
        getVehicleFollowByDelivery(delivery?.id || '');
    }, []);


    const router = useRouter();

    const columns: Column<RecordType>[] = [
        {
            key: 'vehicle',
            header: 'Araç',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${delivery?.id}/follow/${record.id}`)}
                >
                    {(value as Vehicle).mainLicensePlate}
                </div>
            )
        },
        {
            key: 'driver',
            header: 'Şoför',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${delivery?.id}/follow/${record.id}`)}
                >
                    {(value as VehicleDriver).user?.name}  {(value as VehicleDriver).user?.lastName}
                </div>
            )
        },
        {
            key: 'startKm',
            header: 'İlk KM',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${delivery?.id}/follow/${record.id}`)}
                >
                    {value as string} KM
                </div>
            )
        },
        {
            key: 'endKm',
            header: 'Son KM',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${delivery?.id}/follow/${record.id}`)}
                >
                    {value as string} KM
                </div>
            )
        }
        ,
        {
            key: 'oilPrice',
            header: 'Akarkakıt Fiyatı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${delivery?.id}/follow/${record.id}`)}
                >
                    {value as string} TL
                </div>
            )
        }
        ,
        {
            key: 'totalCost',
            header: 'Maliyet',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/deliveries/${delivery?.id}/follow/${record.id}`)}
                >
                    {value as string} TL
                </div>
            )
        }

    ];

    const handleAdd = () => {
        router.push(`/admin/deliveries/${delivery?.id}/follow/add`);
    };


    return (
        <div className="space-y-6">
            <ActionButtons
                onAdd={handleAdd}

            />
            <div className="p-6">
                <DynamicTable columns={columns} data={vehicleFollows}/>
            </div>
        </div>
    );
};

export default DeliveryVehicleFollowTab;