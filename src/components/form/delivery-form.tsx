'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Offer} from "@/types/offer";
import {Delivery, DeliveryFormData, DeliveryFormErrors} from "@/types/delivery";
import {EDeliveryStatus, EStatus} from "@/types/enumeration";
import {useDataContext} from "@/contexts/data-context";
import {Vehicle, VehicleDriver} from "@/types/vehicle";
import {NumberInput} from "@/components/ui/number-input";
import {useOrderAllData} from "@/hooks/use-order-all-data";

interface DeliveryFormProps {
    onSubmit: (arg0: DeliveryFormData) => void;
    offers?: Offer[];
    delivery?: Delivery | null;
    vehicles: Vehicle[];
    vehicleDrivers: VehicleDriver[];
    deliveries?: Delivery[] | [];
}


const CreateDeliveryForm: React.FC<DeliveryFormProps> = ({
                                                             onSubmit,
                                                             delivery,
                                                             offers = [],
                                                             vehicles = [],
                                                             vehicleDrivers = [],
                                                             deliveries = []
                                                         }) => {
    const [formData, setFormData] = useState<DeliveryFormData>({

        offerId: '',
        cost: 0,
        deliveryDate: new Date(),
        deliveryStatus: EDeliveryStatus.NEW,
        deliveryTime: "15:00",
        distance: 0,
        duration: 0,
        transportationCompanyId: "",
        orderId: '',
        vehicleId: '',
        vehicleDriverId: '',
        id: null,
        status: EStatus.NEW,
        link: ''
    });

    const {
        orderParts,
        getAllOrderData,
    } = useOrderAllData();

    const [orderErrors, setOrderErrors] = useState("");


    const handleSelectedOffer = (id: string) => {
        getAllOrderData(id, "offer");

    };


    useEffect(() => {
        if (orderParts) {
            if (orderParts.offerApprovals) {
                const offerApproval = orderParts.offerApprovals.filter(appr => appr.offerStatus !== "APPROVED");
                if(offerApproval.length>0){
                    setOrderErrors("Bu teklif henüz onaylanmamış. Lütfen teklif onaylandıktan sonra sevkiyat oluşturun.");
                }else{
                    setOrderErrors("");
                }


            }

        }
    }, [orderParts]);


    useEffect(() => {
        if (delivery) {
            setFormData({
                offerId: delivery.order.id,
                cost: delivery.cost,
                deliveryDate: new Date(delivery.order.orderDate),
                deliveryStatus: delivery.deliveryStatus,
                deliveryTime: delivery.deliveryTime,
                distance: delivery.distance,
                duration: delivery.duration,
                transportationCompanyId: delivery.transportationCompany.id,
                orderId: delivery.order.id,
                vehicleId: delivery.vehicle?.id,
                vehicleDriverId: delivery.vehicleDriver?.id,
                id: delivery.id,
                status: delivery.status,
                link: delivery.link
            })
            setOfferList(offers)
        }
    }, [delivery]);

    const {
        transportationCompanies,

    } = useDataContext();


    const [offerList, setOfferList] = useState<Offer[]>([]);


    useEffect(() => {
        if (offers) {
            const filteredOffers = offers.filter(offer =>
                !deliveries.some(delivery => delivery.offer.id === offer.id)
            );
            setOfferList(filteredOffers);
        }
    }, [offers]);


    useEffect(() => {
        if (formData.offerId) {

            setTransportData();
        }
    }, [
        formData.offerId,
    ]);

    const setTransportData = () => {
        if (!formData.offerId) return;
        const selectedOffer = offers.find(offer => offer.id === formData.offerId);
        if (selectedOffer) {
            const {transportDistance, transportDuration, order, totalAmount} = selectedOffer;

            setFormData(prev => ({
                ...prev,
                distance: transportDistance || 0,
                duration: transportDuration || 0,
                deliveryDate: order.orderDate ? new Date(order.orderDate) : null,
                cost: totalAmount
            }));
        }
    };


    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: DeliveryFormErrors = {};

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Bugünün başlangıcı (saat 00:00:00)

        if (!formData.deliveryDate) {
            newErrors.deliveryDate = 'Sevkiyat tarihi zorunludur';
        } else {
            const deliveryDate = new Date(formData.deliveryDate);
            deliveryDate.setHours(0, 0, 0, 0); // Saat bilgisini sıfırlayalım

            if (deliveryDate < today) {
                newErrors.deliveryDate = 'Sevkiyat tarihi geçmiş bir tarih olamaz';
            }
        }

        if (orderErrors.length>0) {
            newErrors.orderId = 'Kontrol edin.';
        }

        if (!formData.deliveryTime) {
            newErrors.deliveryTime = 'Sevkiyat saati zorunludur';
        }

        if (formData.cost && (isNaN(formData.cost) || formData.cost < 0)) {
            newErrors.cost = 'Geçerli bir maliyet giriniz';
        }

        if (formData.distance && (isNaN(formData.distance) || formData.distance < 0)) {
            newErrors.distance = 'Geçerli bir mesafe giriniz';
        }

        if (formData.duration && (isNaN(formData.duration) || formData.duration < 0)) {
            newErrors.duration = 'Geçerli bir süre giriniz';
        }

        if (!formData.transportationCompanyId) {
            newErrors.transportationCompanyId = 'Nakliye firması seçimi zorunludur';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
            });
        }
    };

    const handleChange = <T extends keyof DeliveryFormData>(
        name: T,
        value: DeliveryFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = <T extends keyof DeliveryFormData>(
        name: T,
        value: DeliveryFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>

                    {
                        delivery ? 'Sevkiyatı Güncelle' : 'Yeni Sevkiyat Oluştur'
                    }

                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="offer">Teklif</Label>
                            <Select
                                onValueChange={(value) => {
                                    handleSelectChange('offerId', value as string | null)
                                    handleSelectedOffer(value as string);
                                }}
                                value={formData.offerId ?? ""}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Teklif seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {offerList.map(offer => (
                                            <SelectItem key={offer.id} value={offer.id}>
                                                {offer.code}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {orderErrors && (
                                <Alert variant="destructive">
                                    <AlertDescription>{orderErrors}</AlertDescription>
                                </Alert>
                            )}
                            {errors.offerId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.offerId}</AlertDescription>
                                </Alert>
                            )}

                        </div>


                        {/* Teslimat Tarihi ve Saati */}
                        <div className="space-y-2">
                            <Label htmlFor="deliveryDate">Sevkiyat Tarihi *</Label>
                            <Input
                                id="deliveryDate"
                                name="deliveryDate"
                                type="date"
                                readOnly={true}
                                value={formData.deliveryDate ? formData.deliveryDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    if (!isNaN(date.getTime())) {
                                        handleChange('deliveryDate', date);
                                    }
                                }}
                                className={errors.deliveryDate ? 'border-red-500' : ''}
                            />
                            {errors.deliveryDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.deliveryDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deliveryTime">Sevkiyat Saati *</Label>
                            <Input
                                id="deliveryTime"
                                name="deliveryTime"
                                type="time"
                                value={formData.deliveryTime ?? ''} // null ise boş string kullan
                                onChange={(e) => handleChange('deliveryTime', e.target.value)}
                                className={errors.deliveryTime ? 'border-red-500' : ''}
                            />
                            {errors.deliveryTime && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.deliveryTime}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Maliyet, Mesafe ve Süre */}
                        <div className="space-y-2">
                            <Label htmlFor="cost">Maliyet</Label>


                            <NumberInput
                                id="cost"
                                name="cost"
                                value={formData.cost}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('cost', value)
                                }}
                                className={errors.cost ? 'border-red-500' : ''}
                            />


                            {errors.cost && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.cost}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="distance">Mesafe (km)</Label>

                            <NumberInput
                                inputType="distance"
                                id="distance"
                                name="distance"
                                value={formData.distance}
                                onChange={(value) => handleChange('distance', value)}
                                unit="km"
                                decimalPlaces={0}
                                className={errors.distance ? 'border-red-500' : ''}
                            />

                            {errors.distance && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.distance}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Süre (dakika)</Label>

                            <NumberInput
                                inputType="distance"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                unit="saat"
                                decimalPlaces={0}
                                onChange={(value) => {
                                    handleChange('duration', value)
                                }}
                                className={errors.duration ? 'border-red-500' : ''}
                            />


                            {errors.duration && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.duration}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* İlişkili Seçimler */}
                        <div className="space-y-2">
                            <Label htmlFor="transportationCompany">Nakliye Firması *</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('transportationCompanyId', value as string | null)}
                                value={formData.transportationCompanyId ?? ""}
                            >
                                <SelectTrigger className={errors.transportationCompanyId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Nakliye firması seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {transportationCompanies?.map(company => (
                                            <SelectItem key={company.id} value={company.id}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.transportationCompanyId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.transportationCompanyId}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="vehicleId">Araç</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('vehicleId', value as string | null)}
                                value={formData.vehicleId ?? ""}
                            >
                                <SelectTrigger className={errors.vehicleId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Araç seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {vehicles?.map(vehicle => (
                                            <SelectItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.mainLicensePlate}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.vehicleId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.vehicleId}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicleDriverId">Şoför</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('vehicleDriverId', value as string | null)}
                                value={formData.vehicleDriverId ?? ""}
                            >
                                <SelectTrigger className={errors.vehicleDriverId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Şoför seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {vehicleDrivers?.map(vehicleDriver => (
                                            <SelectItem key={vehicleDriver.id} value={vehicleDriver.id}>
                                                {vehicleDriver.user?.name} {vehicleDriver.user?.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.vehicleDriverId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.vehicleDriverId}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        {
                            /*
                            <div className="space-y-2 col-span-2 ">
                            <Label htmlFor="order">Sipariş</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('orderId', value as string | null)}
                                value={formData.orderId ?? ""}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sipariş seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {orders.map(order => (
                                        <SelectItem key={order.id} value={order.id}>
                                            {order.code} - {order.customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="deliveryStatus">Teslimat Durumu *</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('deliveryStatus', value as EDeliveryStatus)}
                                value={formData.deliveryStatus ?? ""}
                            >
                                <SelectTrigger className={errors.deliveryStatus ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Durum seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(EDeliveryStatus).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.deliveryStatus && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.deliveryStatus}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Durum *</Label>
                            <Select
                                onValueChange={(value) => handleChange('status', value as EStatus)}
                                value={formData.status ?? ""}
                            >
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Durum seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(EStatus).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {t(`status.${value}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.status}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    */
                        }
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            {
                                delivery ? 'Sevkiyatı Güncelle' : 'Sevkiyat Oluştur'
                            }


                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateDeliveryForm;