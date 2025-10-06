'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Order, OrderFormData, OrderFormErrors} from "@/types/order";
import {Customer} from "@/types/customer";
import {FillingFacility, Product, Supplier} from "@/types/supplier";
import {ECity, EStatus} from "@/types/enumeration";
import {useDistrict} from "@/hooks/use-district";
import {useCustomerAddress} from "@/hooks/use-customer-address";
import {useCustomers} from "@/hooks/use-customer";
import {Textarea} from "@/components/ui/textarea";
import {useAuthContext} from "@/contexts/auth-context";
import ModalPanel from "@/components/ui/ModalPanel";
import CustomerPaymentMethod from "@/components/customer/customer-payment-method";
import CustomerAddressForm from "@/components/form/customer-address-form";
import {NumberInput} from "@/components/ui/number-input";

interface OrderFormProps {
    onSubmit: (arg0: OrderFormData, arg1?: null) => void;
    customers: Customer[];
    suppliers: Supplier[];
    products: Product[];
    fillingFacilities: FillingFacility[];
    order?: Order | null
    customerId?: string | null
}

const CreateOrderForm: React.FC<OrderFormProps> = ({
                                                       onSubmit,
                                                       customers = [],
                                                       suppliers = [],
                                                       products = [],
                                                       fillingFacilities = [],
                                                       order,
                                                       customerId
                                                   }) => {
    const {activeBrand} = useAuthContext();
    const [formData, setFormData] = useState<OrderFormData>({
        id: null,
        status: EStatus.NEW,
        customerId: customerId || '',
        orderDate: new Date(),
        supplierId: '',
        productId: '',
        fillingFacilityId: '',
        location: '',
        city: null,
        paymentTerm: -1,
        fuelRate: 100,
        totalLiter: 0,
        orderQuantity: 0,
        customerAddressId: '',
        district: '',
        paymentMethod: '',
        paymentMethodDifference: 0,
        orderStateId: '',
        isExternalTransportation: false,
        externalDriver: '',
        externalVehicle: '',
        externalVehiclePlate: '',
        externalVehicleTrailerPlate: '',
        description: '',
        brandId: activeBrand?.id || ''

    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const {filterCityDistrict, cityDistricts} = useDistrict();
    const {selectedCustomer, fetchCustomerById} = useCustomers();

    const [isPaymentModalOpen, setPaymentIsModalOpen] = useState(false);
    const [isAddressModalOpen, setAddressIsModalOpen] = useState(false);
    const {createCustomerAddress} = useCustomerAddress();




    useEffect(() => {
        if (customerId) {
            fetchCustomerById(customerId)

            handleChange('customerId',customerId)
            handleCustomerAddress(customerId);
        }
    }, [customerId]);


    useEffect(() => {
        if (formData.orderQuantity && formData.fuelRate) {
            //const totalLiter = Math.round(formData.orderQuantity * (1 + formData.fuelRate / 100));
            //const totalLiter = formData.fuelRate;
            //handleChange('totalLiter', totalLiter);

            //const totalLiter = Math.round(formData.orderQuantity * (1 + formData.fuelRate / 100));
            const totalLiter = formData.orderQuantity * 1000;
            handleChange('totalLiter', totalLiter);
        }
    }, [formData.orderQuantity]);


    useEffect(() => {
        if (order) {
            filterCityDistrict(order.city + '').then(() => {
                setFormData({
                    id: order.id,
                    status: order.status,
                    customerId: order.customer.id,
                    orderDate: new Date(order.orderDate),
                    supplierId: order.supplier.id,
                    productId: order.product.id,
                    fillingFacilityId: order.fillingFacility.id,
                    location: order.location,
                    city: order.city,
                    paymentTerm: order.paymentTerm,
                    fuelRate: order.fuelRate,
                    totalLiter: order.totalLiter,
                    orderQuantity: order.orderQuantity,
                    customerAddressId: order.customerAddress.id,
                    district: order.district,
                    paymentMethod: order.paymentMethod,
                    paymentMethodDifference: order.paymentMethodDifference,
                    orderStateId: order.orderState.id,
                    isExternalTransportation: order.isExternalTransportation,
                    externalDriver: order.externalDriver,
                    externalVehicle: order.externalVehicle,
                    externalVehiclePlate: order.externalVehiclePlate,
                    externalVehicleTrailerPlate: order.externalVehicleTrailerPlate,
                    description: order.description,
                    brandId: order.brand.id,
                })
            });


            handleChange('customerId', order.customer.id)
            handleCustomerAddress(order.customer.id);
            fetchCustomerById(order.customer.id);
        }
    }, [order]);


    const validateForm = () => {
        const newErrors: OrderFormErrors = {};


        if (!formData.district) {
            newErrors.district = 'İlçe seçimi zorunludur.';
        }

        if (!formData.customerId) {
            newErrors.customerId = 'Müşteri seçimi zorunludur';
        }

        if (!formData.supplierId) {
            newErrors.supplierId = 'Tedarikçi seçimi zorunludur';
        }

        if (!formData.productId) {
            newErrors.productId = 'Ürün seçimi zorunludur';
        }

        if (!formData.fillingFacilityId) {
            newErrors.fillingFacilityId = 'Dolum tesisi seçimi zorunludur';
        }

        if (!formData.location) {
            newErrors.location = 'Lokasyon bilgisi zorunludur';
        }

        if (!formData.city) {
            newErrors.city = 'Şehir seçimi zorunludur';
        }

        if (!formData.status) {
            newErrors.status = 'Durum seçimi zorunludur';
        }

        if (formData.paymentTerm < 0) {
            newErrors.paymentTerm = 'Ödeme vadesi seçili olmalıdır';
        }

        if (formData.fuelRate < 0) {
            newErrors.fuelRate = 'Yakıt oranı 0\'dan küçük olamaz';
        }

        if (formData.totalLiter <= 0) {
            newErrors.totalLiter = 'Sipariş miktarı 0\'dan büyük olmalıdır';
        }

        if (formData.isExternalTransportation) {
            if (!formData.externalDriver) {
                newErrors.externalDriver = 'Şoför bilgisi girilmelidir.';
            }

            if (!formData.externalVehicle) {
                newErrors.externalVehicle = 'Araç bilgisi girilmelidir.';
            }

            if (!formData.externalVehiclePlate) {
                newErrors.externalVehiclePlate = 'Plaka bilgisi girilmelidir.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData
            });
        }
    };

    const handleChange = <T extends keyof OrderFormData>(
        name: T,
        value: OrderFormData[T]
    ) => {

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const {fetchCustomerAddressByCustomerId, customerAddress} = useCustomerAddress();
    const handleCustomerAddress = (
        customerId: string
    ) => {
        fetchCustomerAddressByCustomerId(customerId)

    };


    const SelectCustomer = () => {
        return (
            <div className="flex flex-col items-center justify-center pt-16">
                <h2 className="text-2xl font-bold mb-4">Sipariş İçin Müşteri Seçiniz.</h2>
            </div>
        );
    }

    const AddPaymentMethod = () => {
        return (
            <div className="flex flex-col items-center justify-center pt-16">
                <h2 className="text-2xl font-bold mb-4">Müşteriye atanmış ödeme yöntemi bulunmamaktadır. </h2>
                <button
                    onClick={() => setPaymentIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    ÖDEME YÖNTEMİ EKLE
                </button>
            </div>
        );
    }


    const handleConfirm = () => {
        alert("Onaylandı!");
        setPaymentIsModalOpen(false);
        setAddressIsModalOpen(false);
    };

    const handleCancel = () => {
        alert("İptal edildi.");
        setPaymentIsModalOpen(false);
        setAddressIsModalOpen(false);
    };


    const AddCustomerAddress = () => {
        return (
            <div className="flex flex-col items-center justify-center pt-16">
                <h2 className="text-2xl font-bold mb-4">Müşteriye için bir adres bulunmamaktadır.</h2>
                <button
                    onClick={() => setAddressIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    MÜŞTERİ SİPARİŞİ İÇİN ADRES EKLE
                </button>
            </div>
        );
    }

    const updatePaymentData = () => {
        if (selectedCustomer) {
            fetchCustomerById(selectedCustomer?.id);
        }
    };

    const updateAddressData = () => {
        if (selectedCustomer) {
            handleCustomerAddress(selectedCustomer?.id);
        }
    };


    return (<>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {order ? "Sipariş Güncelle" : "  Yeni Sipariş Oluştur"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* İlişkili Seçimler */}
                        <div className="grid grid-cols-4 gap-4">

                            {
                                !customerId &&
                                <div className="col-span-4 space-y-2">
                                    <Label htmlFor="customer">Müşteri *</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            handleChange('customerId', value as string | null)
                                            handleCustomerAddress(value as string);
                                            fetchCustomerById(value as string);
                                        }}
                                        searchable={true}
                                        value={formData.customerId ?? ""}
                                        disabled={order ? true : false}
                                    >
                                        <SelectTrigger className={errors.customerId ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Müşteri seçin"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {customers.map(customer => (
                                                    <SelectItem key={customer.id} value={customer.id}>
                                                        {customer.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.customerId && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.customerId}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            }

                        </div>
                        {

                            !selectedCustomer ?
                                <SelectCustomer/> : selectedCustomer.paymentMethods && selectedCustomer.paymentMethods.length > 0 ? customerAddress && customerAddress.length > 0 ?


                                    <>

                                        <div className="grid grid-cols-4 gap-4">

                                            <div className="space-y-2">
                                                <Label htmlFor="paymentMethod">Vade *</Label>
                                                <Select
                                                    onButtonEvent={() => setPaymentIsModalOpen(true)}
                                                    buttonText="+"
                                                    onValueChange={(value) => {
                                                        handleChange('paymentMethod', value as string)
                                                        const methods = selectedCustomer?.paymentMethods.find(method => method.name === value);
                                                        setFormData({
                                                            ...formData,
                                                            paymentMethodDifference: methods?.maturityDifference || 0,
                                                            paymentMethod: value as string,
                                                            paymentTerm: methods?.paymentTerm || 0
                                                        })
                                                    }}
                                                    searchable={true}
                                                    value={formData.paymentMethod ?? ""}
                                                >
                                                    <SelectTrigger className={errors.paymentMethod ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Vade seçin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {selectedCustomer && selectedCustomer.paymentMethods.map(customer => (
                                                                <SelectItem key={customer.name} value={customer.name}>
                                                                    {customer.name} (%{customer.maturityDifference} Vade
                                                                    Farkı)
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.paymentTerm && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{errors.paymentTerm}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>

                                            {/* Sipariş Tarihi */}
                                            <div className="space-y-2">
                                                <Label htmlFor="orderDate">Sevkiyat Tarihi *</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.orderDate.toISOString().split('T')[0]}
                                                    onChange={(e) => {
                                                        const dateValue = new Date(e.target.value);
                                                        handleChange('orderDate', dateValue);
                                                    }}
                                                />
                                            </div>

                                            {/* Tedarikçi Seçimi */}
                                            <div className="space-y-2">
                                                <Label htmlFor="supplier">Tedarikçi *</Label>
                                                <Select
                                                    onValueChange={(value) => handleChange('supplierId', value as string | null)}
                                                    value={formData.supplierId ?? ""}
                                                >
                                                    <SelectTrigger className={errors.supplierId ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Tedarikçi seçin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {suppliers.map(supplier => (
                                                                <SelectItem key={supplier.id} value={supplier.id}>
                                                                    {supplier.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.supplierId && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{errors.supplierId}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>

                                            {/* Ürün Seçimi */}
                                            <div className="space-y-2">
                                                <Label htmlFor="product">Ürün *</Label>
                                                <Select
                                                    onValueChange={(value) => handleChange('productId', value as string | null)}
                                                    value={formData.productId ?? ""}
                                                >
                                                    <SelectTrigger className={errors.productId ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Ürün seçin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {products.map(product => (
                                                                <SelectItem key={product.id} value={product.id}>
                                                                    {product.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.productId && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{errors.productId}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>

                                            {/* Dolum Tesisi */}
                                            <div className="space-y-2">
                                                <Label htmlFor="fillingFacility">Dolum Tesisi *</Label>
                                                <Select
                                                    onValueChange={(value) => handleChange('fillingFacilityId', value as string | null)}
                                                    value={formData.fillingFacilityId ?? ""}
                                                >
                                                    <SelectTrigger
                                                        className={errors.fillingFacilityId ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Dolum tesisi seçin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {fillingFacilities.map(facility => (
                                                                <SelectItem key={facility.id} value={facility.id}>
                                                                    {facility.name} (Kapasite: {facility.capacity} ton)
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.fillingFacilityId && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{errors.fillingFacilityId}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>


                                            {/* Adresler */}
                                            <div className="space-y-2">
                                                <Label htmlFor="customerAddressId">Adresler *</Label>
                                                <Select
                                                    onButtonEvent={() => setAddressIsModalOpen(true)}
                                                    buttonText={"+"}
                                                    onValueChange={(value) => {

                                                        const address = customerAddress?.find(address => address.id === value);
                                                        if (address) {
                                                            setFormData({
                                                                ...formData,
                                                                city: address.city as ECity,
                                                                district: address.district as unknown as string || '',
                                                                location: address.address as string,
                                                                customerAddressId: value as string
                                                            })
                                                            filterCityDistrict((address.city ?? "").toString());
                                                        }

                                                    }}
                                                    value={formData.location ?? ""}
                                                >
                                                    <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Adres seçin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {customerAddress?.map((value, key) => (
                                                                <SelectItem key={key} value={value.id}>
                                                                    {value.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.customerAddressId && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{errors.customerAddressId}</AlertDescription>
                                                    </Alert>
                                                )}

                                            </div>

                                            {/* Şehir */}
                                            <div className="space-y-2">
                                                <Label htmlFor="city">Şehir *</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        handleChange('city', value as ECity);
                                                        setFormData({
                                                            ...formData,
                                                            district: ''
                                                        })
                                                        filterCityDistrict(value as string);
                                                    }}
                                                    disabled
                                                    value={formData.city ?? ""}
                                                >
                                                    <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Şehir seçin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.entries(ECity).map(([key, value]) => (
                                                                <SelectItem key={key} value={value}>
                                                                    {value}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.city && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{errors.city}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="district">İlçe *</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        handleChange('district', value as string);
                                                    }}
                                                    disabled
                                                    value={formData.district ?? ""}
                                                >
                                                    <SelectTrigger className={errors.district ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Sipariş seçin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {cityDistricts.map(district => (
                                                                <SelectItem key={district.name} value={district.name}>
                                                                    {district.name}
                                                                </SelectItem>

                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.district && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{errors.district}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>


                                            <div className="space-y-2">
                                                <Label htmlFor="district">Sevkiyat Şekli</Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        handleChange('isExternalTransportation', value === "true");
                                                    }}
                                                    value={formData.isExternalTransportation ? "true" : "false"}
                                                    searchable={false}
                                                >
                                                    <SelectTrigger className={errors.district ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Sipariş seçin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem key={"false"} value={"false"}>
                                                            Sevkiyat Dahil
                                                        </SelectItem>
                                                        <SelectItem key={"true"} value={"true"}>
                                                            Sevkiyatı kendim yapacağım.
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {
                                                formData.isExternalTransportation ?
                                                    <>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="externalDriver">Şoför Bilgisi</Label>
                                                            <Input
                                                                value={formData.externalDriver}
                                                                onChange={(e) => handleChange('externalDriver', e.target.value)}
                                                            />
                                                            {errors.externalDriver && (
                                                                <Alert variant="destructive">
                                                                    <AlertDescription>{errors.externalDriver}</AlertDescription>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="externalVehicle">Araç Bilgisi</Label>
                                                            <Input
                                                                value={formData.externalVehicle}
                                                                onChange={(e) => handleChange('externalVehicle', e.target.value)}
                                                            />
                                                            {errors.externalVehicle && (
                                                                <Alert variant="destructive">
                                                                    <AlertDescription>{errors.externalVehicle}</AlertDescription>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="externalVehiclePlate">Plaka</Label>
                                                            <Input
                                                                value={formData.externalVehiclePlate}
                                                                onChange={(e) => handleChange('externalVehiclePlate', e.target.value)}
                                                            />
                                                            {errors.externalVehiclePlate && (
                                                                <Alert variant="destructive">
                                                                    <AlertDescription>{errors.externalVehiclePlate}</AlertDescription>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="externalVehicleTrailerPlate">Dorse Plaka</Label>
                                                            <Input
                                                                value={formData.externalVehicleTrailerPlate}
                                                                onChange={(e) => handleChange('externalVehicleTrailerPlate', e.target.value)}
                                                            />
                                                            {errors.externalVehicleTrailerPlate && (
                                                                <Alert variant="destructive">
                                                                    <AlertDescription>{errors.externalVehicleTrailerPlate}</AlertDescription>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                    </>

                                                    : null
                                            }


                                            {/* Toplam Litre (Hesaplanan) */}
                                            <div className="space-y-2">
                                                <Label htmlFor="totalLiter">Toplam Litre</Label>
                                                <NumberInput
                                                    value={formData.totalLiter}
                                                    className="bg-gray-50"
                                                    onChange={(value) => {
                                                        handleChange('orderQuantity', value / 1000)
                                                        handleChange('totalLiter', value)
                                                    }}



                                                    inputType="distance"
                                                    name="totalLiter"
                                                    unit="Litre"
                                                    decimalPlaces={0}



                                                />
                                                {errors.totalLiter && (
                                                    <Alert variant="destructive">
                                                        <AlertDescription>{errors.totalLiter}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>

                                            {/* Lokasyon */}


                                            <div className="col-span-4 space-y-2">
                                                <Label htmlFor="description">Teslimat Adresi *</Label>
                                                <Textarea
                                                    value={formData.location}
                                                    onChange={(e) => handleChange('location', e.target.value)}
                                                    className="min-h-[100px]"
                                                    placeholder="Detaylı teslimat adresi giriniz..."
                                                />
                                            </div>

                                            <div className="col-span-4 space-y-2">
                                                <Label htmlFor="description">Açıklama ve Notlar</Label>
                                                <Textarea
                                                    value={formData.description}
                                                    onChange={(e) => handleChange('description', e.target.value)}
                                                    className="min-h-[100px]"
                                                    placeholder="Teklif hakkında açıklama giriniz..."
                                                />
                                            </div>


                                        </div>


                                    </>


                                    : <AddCustomerAddress/> : <AddPaymentMethod/>
                        }


                        {
                            selectedCustomer && selectedCustomer.paymentMethods && selectedCustomer.paymentMethods.length > 0 && customerAddress && customerAddress.length > 0 &&
                            <div className="flex justify-end space-x-4 pt-4">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {order ? "Sipariş Güncelle" : " Sipariş Oluştur"}
                                </Button>
                            </div>
                        }

                    </form>
                </CardContent>
            </Card>
            {
                selectedCustomer && (
                    <>
                        <ModalPanel
                            isOpen={isPaymentModalOpen}
                            onClose={() => setPaymentIsModalOpen(false)}
                            title="ÖDEME YÖNTEMLERİ"
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                            size={"large"}
                        >
                            <CustomerPaymentMethod setContractType={null} selectedCustomer={selectedCustomer}
                                                   updateData={updatePaymentData}/>
                        </ModalPanel>

                        <ModalPanel
                            isOpen={isAddressModalOpen}
                            onClose={() => {
                                setAddressIsModalOpen(false)
                                updateAddressData()
                            }}
                            title="MÜŞTERİ ADRESLERİ"
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                            size={"large"}
                        >
                            <CustomerAddressForm onSubmit={createCustomerAddress} customerId={selectedCustomer.id}/>
                        </ModalPanel>
                    </>
                )
            }

        </>

    );
};

export default CreateOrderForm;