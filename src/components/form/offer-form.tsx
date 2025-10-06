'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Offer, OfferFormData, OfferFormErrors} from "@/types/offer";
import {TransportationCompany} from "@/types/transportation-company";
import {Vehicle} from "@/types/vehicle";
import {Order} from "@/types/order";
import {formatDate} from "@/utils/date-formater";
import {EStatus} from "@/types/enumeration";
import {Product, ProductPriceTracking} from "@/types/supplier";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import POSearchComponent from "@/app/(protected)/admin/pet/po";
import {MoneyInput, NumberInput} from "@/components/ui/number-input";
import {User} from "@/types/auth";
import {useCustomerInfos} from "@/hooks/use-customer-info";
import {CustomerInfo} from "@/types/customer";


interface OfferFormProps {
    onSubmit: (arg0: OfferFormData) => void;
    orders: Order[];
    offers?: Offer[];
    transportationCompanies: TransportationCompany[];
    vehicles: Vehicle[];
    offer?: Offer | null;
    productPriceTrackingList: ProductPriceTracking[];
}

const CreateOfferForm: React.FC<OfferFormProps> = ({
                                                       onSubmit,
                                                       offers = [],
                                                       orders = [],
                                                       offer,
                                                       productPriceTrackingList = []
                                                   }) => {
    const [formData, setFormData] = useState<OfferFormData>({
        id: null,
        orderId: '',
        shippingPrice: 0,
        totalAmount: 0,
        profitMultiplier: 1.0,
        transportDistance: 0,
        transportDuration: 0,
        literShippingPrice: 0,
        description: '',
        pumpPrice: 0,
        pumpDiscountRate: 0,
        unitPrice: 0,
        shippingLiterPrice: 0,
        lapping: 0,
        unitPriceIncludingShipping: 0,
        mainDistributorPrice: 0,
        mainDistributorRate: 0,
        transportationCompanyId: '',
        vehicleId: '',
        offerStatus: null,
        status: EStatus.NEW,
        vehicleDriverId: '',
        priceSource: 'pompa',
        maturityCost: 0,
    });

    const [hasLock, setHasLock] = useState(false);
    const [hasLimit, setHasLimit] = useState(-1);


    console.log(hasLock)
    console.log(hasLimit)

    const [hasCustomerProblem, setHasCustomerProblem] = useState("");


    useEffect(() => {
        if (offer) {
            setSelectedOrder(offer.order);
            setFormData({
                id: offer.id,
                orderId: offer.order.id,
                shippingPrice: offer.pumpPrice,
                totalAmount: offer.totalAmount,
                profitMultiplier: offer.profitMultiplier,
                transportDistance: offer.transportDistance,
                transportDuration: offer.transportDuration,
                literShippingPrice: offer.literShippingPrice,
                description: offer.description,
                pumpPrice: offer.pumpPrice,
                pumpDiscountRate: offer.pumpDiscountRate,
                unitPrice: offer.unitPrice,
                shippingLiterPrice: offer.shippingLiterPrice,
                lapping: offer.lapping,
                unitPriceIncludingShipping: offer.unitPriceIncludingShipping,
                mainDistributorPrice: offer.mainDistributorPrice,
                mainDistributorRate: offer.mainDistributorRate,
                transportationCompanyId: offer.transportationCompany?.id || '',
                vehicleId: offer.vehicle?.id || '',
                offerStatus: offer.offerStatus,
                status: offer.status,
                vehicleDriverId: offer.vehicleDriver?.id || '',
                priceSource: offer.priceSource,
                maturityCost: offer.maturityCost,
            });

            // Input state'lerini de güncelle
            setPumpDiscountRateInput(offer.pumpDiscountRate.toString());
            setMainDistributorRateInput(offer.mainDistributorRate.toString());
            //handleChange('orderId',offer.order.id);

            /*
                        setFormData({
                            ...formData,
                            pumpDiscountRate: offer.order?.paymentMethodDifference || 0,
                            mainDistributorRate: offer.order?.paymentMethodDifference || 0,
                            orderId: offer.order.id,
                        });

             */

        }
    }, [offer]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [orderList, setOrderList] = useState<Order[]>([]);

    // Input değerleri için ayrı state'ler (yazma sırasında string olarak tutmak için)
    const [pumpDiscountRateInput, setPumpDiscountRateInput] = useState<string>('');
    const [mainDistributorRateInput, setMainDistributorRateInput] = useState<string>('');


    console.log(pumpDiscountRateInput)
    console.log(mainDistributorRateInput)


    const {
        customerInfos,
        fetchCustomerInfoByCustomerId
    } = useCustomerInfos();


    useEffect(() => {


        if (selectedOrder && selectedOrder.customer) {
            let problem = "";
            setHasLock(selectedOrder.customer.locked as boolean || false);
            setHasLimit(selectedOrder.customer.maxLimit as number || -1);
            fetchCustomerInfoByCustomerId(selectedOrder.customer.id);


            if (selectedOrder.customer.locked) {
                problem += "Müşteri kilitli, teklif oluşturulamaz. ";
            }


            if (formData.totalAmount && selectedOrder.customer.maxLimit) {
                const _totalAmount = formData.totalAmount as number;
                const _limit = selectedOrder.customer.maxLimit as number;


                if (_totalAmount > _limit && _limit > 0) {
                    problem += `Müşteri limiti (${_limit} TL) aşıldı, teklif oluşturulamaz. `;
                }
            }

            setHasCustomerProblem(problem)
        }

    }, [selectedOrder, formData.totalAmount]);


    useEffect(() => {
        if (orders && offers) {
            const filteredOrders = orders.filter(order =>
                !offers.some(offer => offer.order.id === order.id)
            );
            setOrderList(filteredOrders);
        }
    }, [orders]);


    // Ana hesaplama fonksiyonu
    const calculatePrices = (updatedFormData: OfferFormData) => {
        if (!selectedOrder) return updatedFormData;

        const quantity = selectedOrder.totalLiter || 0;

        // 1. Litre başı nakliye hesaplama
        const literShipping = (quantity > 0 && updatedFormData.shippingPrice > 0) ? updatedFormData.shippingPrice / quantity : 0;

        // 2. Birim fiyat hesaplama (tedarik şekline göre)
        let unitPrice = 0;
        if (updatedFormData.priceSource === "pompa") {
            unitPrice = updatedFormData.pumpPrice * (1 + updatedFormData.pumpDiscountRate / 100);
        } else {
            unitPrice = updatedFormData.mainDistributorPrice * (1 + updatedFormData.mainDistributorRate / 100);
        }

        // 3. Nakliye dahil birim fiyat
        const unitPriceIncludingShipping = unitPrice + literShipping;

        // 4. Toplam tutar
        const totalAmount = quantity * unitPrice;

        return {
            ...updatedFormData,
            literShippingPrice: Number(literShipping.toFixed(4)),
            unitPrice: Number(unitPrice.toFixed(4)),
            unitPriceIncludingShipping: Number(unitPriceIncludingShipping.toFixed(4)),
            totalAmount: Number(totalAmount.toFixed(2))
        };
    };

    // İndirim oranlarını hesaplayan fonksiyon
    const calculateDiscountRates = (updatedFormData: OfferFormData) => {
        const newFormData = {...updatedFormData};

        // Pompa indirim oranını hesapla (eğer pompa fiyatı varsa)
        if (newFormData.pumpPrice > 0) {
            const pumpDiscountRate = 100 * (newFormData.unitPrice / newFormData.pumpPrice - 1);
            const calculatedRate = Number(isNaN(pumpDiscountRate) ? 0 : pumpDiscountRate.toFixed(2));
            newFormData.pumpDiscountRate = calculatedRate;
            setPumpDiscountRateInput(calculatedRate.toString());
        }

        // Tüpraş indirim oranını hesapla (eğer Tüpraş fiyatı varsa)
        if (newFormData.mainDistributorPrice > 0) {
            const mainDiscountRate = 100 * (newFormData.unitPrice / newFormData.mainDistributorPrice - 1);
            const calculatedRate = Number(isNaN(mainDiscountRate) ? 0 : mainDiscountRate.toFixed(2));
            newFormData.mainDistributorRate = calculatedRate;
            setMainDistributorRateInput(calculatedRate.toString());
        }

        return newFormData;
    };

    // Form değerlerini güncelleyen ana fonksiyon
    const updateFormData = (field: keyof OfferFormData, value: number, skipDiscountCalculation = false) => {
        setFormData(prev => {
            let updatedData = {...prev, [field]: value};

            // Birim fiyat manuel değiştirildiğinde indirim oranlarını güncelle
            if (field === 'unitPrice' && !skipDiscountCalculation) {
                // Birim fiyatı manuel girişte korumak için önce indirim oranlarını hesapla
                updatedData = calculateDiscountRates(updatedData);
                // Sonra fiyatları hesapla ama birim fiyatı değiştirme
                const calculatedData = calculatePrices(updatedData);
                // Birim fiyatı kullanıcının girdiği değerde koru
                calculatedData.unitPrice = value;
                updatedData = calculatedData;
            } else {
                // Fiyatları yeniden hesapla
                updatedData = calculatePrices(updatedData);
            }

            return updatedData;
        });
    };

    const handleChange = <T extends keyof OfferFormData>(
        name: T,
        value: OfferFormData[T]
    ) => {
        const numericValue = typeof value === 'string' && value === '' ? 0 : Number(value);
        switch (name) {
            case 'shippingPrice':
            case 'pumpPrice':
            case 'mainDistributorPrice':
            case 'pumpDiscountRate':
            case 'mainDistributorRate':
            case 'priceSource':
                updateFormData(name, name === 'priceSource' ? (value as number) : numericValue);
                break;
            case 'unitPrice':
                updateFormData(name, numericValue);
                break;

            default:
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
                break;
        }
    };


    const handleChangeOrderId = (
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            orderId: value
        }));
    };


    const validateForm = () => {
        const newErrors: OfferFormErrors = {};

        if (!selectedOrder) {
            newErrors.orderId = 'Sipariş seçimi zorunludur';
        }

        if (formData.shippingPrice < 0) {
            newErrors.shippingPrice = 'Nakliye fiyatı 0\'dan küçük olamaz';
        }

        if (formData.profitMultiplier <= 0) {
            newErrors.profitMultiplier = 'Kar çarpanı 0\'dan büyük olmalıdır';
        }

        if (formData.transportDistance <= 0) {
            newErrors.transportDistance = 'Taşıma mesafesi 0\'dan büyük olmalıdır';
        }

        if (formData.transportDuration <= 0) {
            newErrors.transportDuration = 'Taşıma süresi 0\'dan büyük olmalıdır';
        }

        if (!formData.status) {
            newErrors.status = 'Durum seçimi zorunludur';
        }

        if (hasCustomerProblem.length > 0) {
            newErrors.orderId = 'Kontrol Et.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOrder && validateForm()) {
            onSubmit({
                ...formData,
                orderId: selectedOrder.id,
            });
        }
    };

    const columns: Column<RecordType>[] = [
        {
            key: 'product',
            header: 'Ürün',
            sortable: true,
            render: (value,) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(value as Product).name}
                </div>
            )
        },
        {
            key: 'price',
            header: 'TÜPRAŞ Fiyat',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(value as string)}
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
                    {(formatDate(value as string))}
                </div>

            )
        }
        ,
        {
            key: 'price',
            header: '',
            render: (value) => (
                <button
                    onClick={() => handleUsePrice(value as number, "tubras")}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    KULLAN
                </button>

            )
        }
    ];

    const handleUsePrice = (price: number, type: string) => {
        if (type === "pompa") {
            handleChange('pumpPrice', price);
        } else {
            handleChange('mainDistributorPrice', price);
        }
    };


    const columnsCustomerInfo: Column<RecordType>[] = [

        {
            key: 'requestingUser',
            header: 'İstek',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(value as User).name as string} {(value as User).lastName as string} -
                    {(record as CustomerInfo).createdAt ? formatDate((record as CustomerInfo).createdAt as unknown as string, "dateTime") : ""}
                </div>
            )
        },
        {
            key: 'description',
            header: 'Not',
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
        <Card>
            <CardHeader>
                <CardTitle>
                    {offer ? "Teklif Güncelle" : "Yeni Teklif Oluştur"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Temel Bilgiler */}
                    <div className="grid grid-cols-4 gap-4">
                        {/* Sipariş Seçimi */}
                        <div className="col-span-4 space-y-2">
                            <Label htmlFor="order">Sipariş *</Label>
                            <Select
                                onValueChange={(value) => {


                                    handleChangeOrderId(value as string);
                                    const order = orderList.find(o => o.id === value);
                                    setSelectedOrder(order || null);
                                    if (order !== null) {
                                        setPumpDiscountRateInput(order?.paymentMethodDifference.toString() || "0");
                                        setMainDistributorRateInput(order?.paymentMethodDifference.toString() || "0");
                                        setFormData({
                                            ...formData,
                                            pumpDiscountRate: order?.paymentMethodDifference || 0,
                                            mainDistributorRate: order?.paymentMethodDifference || 0,
                                        });
                                    }
                                }}
                                value={formData.orderId ?? ""}
                            >
                                <SelectTrigger className={errors.orderId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sipariş seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {orderList.map(order => (
                                            <SelectItem key={order.id} value={order.id}>
                                                {order.code} - {formatDate(order.orderDate)} - {order.customer.name} ({order.totalLiter} Lt)
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.orderId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.orderId}</AlertDescription>
                                </Alert>
                            )}

                            {hasCustomerProblem && (
                                <Alert variant="destructive">
                                    <AlertDescription>{hasCustomerProblem}</AlertDescription>
                                </Alert>
                            )}


                        </div>
                        {
                            selectedOrder && (
                                <div className="col-span-4  space-y-2">
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        {
                                            selectedOrder && (
                                                <div>
                                                    <div>
                                            <span
                                                className="text-sm text-gray-600"><b>TESLİM YERİ:</b> {selectedOrder?.city}-{selectedOrder?.district} / </span>
                                                        <span
                                                            className="text-sm text-gray-600"><b>LİTRE:</b> {selectedOrder?.totalLiter} / </span>
                                                        <span
                                                            className="text-sm text-gray-600"><b>TARİH:</b> {formatDate(selectedOrder?.orderDate as unknown as string || "")} </span>
                                                    </div>


                                                    <div>
                                            <span
                                                className="text-sm text-gray-600"><b>ÖDEME YÖNTEMİ:</b> {selectedOrder?.paymentMethod} / </span>
                                                        <span
                                                            className="text-sm text-gray-600"><b>VADE ORANI:</b> %{selectedOrder?.paymentMethodDifference}  </span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                        {selectedOrder &&
                            <>
                                {/* Nakliye Fiyatı */}
                                <div className="space-y-2">
                                    <Label htmlFor="shippingPrice">Nakliye Fiyatı (TL) *</Label>

                                    <MoneyInput
                                        id="shippingPrice"
                                        name="shippingPrice"
                                        value={formData.shippingPrice}
                                        min="0"
                                        step="0.01"
                                        onChange={(value) => {
                                            handleChange('shippingPrice', value)
                                        }}
                                        className={errors.shippingPrice ? 'border-red-500' : ''}
                                    />


                                    {errors.shippingPrice && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.shippingPrice}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Mesafe ve Süre */}
                                <div className="space-y-2">
                                    <Label htmlFor="transportDistance">Taşıma Mesafesi (km) *</Label>

                                    <NumberInput
                                        inputType="distance"
                                        id="transportDistance"
                                        name="transportDistance"
                                        value={formData.transportDistance}
                                        onChange={(value) => handleChange('transportDistance', value)}
                                        unit="km"
                                        decimalPlaces={0}
                                        className={errors.transportDistance ? 'border-red-500' : ''}
                                    />

                                    {errors.transportDistance && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.transportDistance}</AlertDescription>
                                        </Alert>
                                    )}


                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="transportDuration">Tahmini Taşıma Süresi (saat) *</Label>


                                    <NumberInput
                                        inputType="distance"
                                        id="transportDuration"
                                        name="transportDuration"
                                        value={formData.transportDuration}
                                        onChange={(value) => handleChange('transportDuration', value)}
                                        unit="saat"
                                        decimalPlaces={0}
                                        className={errors.transportDuration ? 'border-red-500' : ''}
                                    />
                                    {errors.transportDuration && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.transportDuration}</AlertDescription>
                                        </Alert>
                                    )}

                                </div>


                                {/* Tedarik Şekli */}
                                <div className="space-y-2">
                                    <Label htmlFor="priceSource">Tedarik Şekli</Label>
                                    <Select
                                        onValueChange={(value) => handleChange('priceSource', value as string)}
                                        value={formData.priceSource}
                                        searchable={false}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tedarik şekli seçin."/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pompa">
                                                Pompa Fiyatı üzerinden.
                                            </SelectItem>
                                            <SelectItem value="tupras">
                                                Tüpraş fiyatı üzerinden.
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.priceSource && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.priceSource}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Fiyatlandırma Detayları */}
                                <div className="space-y-2">
                                    <Label htmlFor="pumpPrice">Pompa Fiyatı (TL) *</Label>


                                    <MoneyInput
                                        id="pumpPrice"
                                        name="pumpPrice"
                                        value={formData.pumpPrice}
                                        min="0"
                                        step="0.01"
                                        decimalPlaces={4}
                                        onChange={(value) => {
                                            handleChange('pumpPrice', value)
                                        }}

                                    />

                                    {errors.pumpPrice && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.pumpPrice}</AlertDescription>
                                        </Alert>
                                    )}

                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pumpDiscountRate">Pompa İndirim Oranı (%) *</Label>


                                    <NumberInput
                                        inputType="percent"
                                        value={formData.pumpDiscountRate}
                                        decimalPlaces={0.01}
                                        minValue={-100}
                                        maxValue={100}
                                        allowNegative={true}
                                        step="0.01"
                                        className={errors.pumpDiscountRate ? 'border-red-500' : ''}
                                        placeholder="0.00"
                                        onChange={(value) => {
                                            setPumpDiscountRateInput(value.toString());
                                            handleChange('pumpDiscountRate', value);
                                        }}
                                    />
                                    {errors.pumpDiscountRate && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.pumpDiscountRate}</AlertDescription>
                                        </Alert>
                                    )}


                                </div>

                                <div className="space-y-2">
                                    <Label>TÜPRAŞ Fiyatı (TL)</Label>


                                    <MoneyInput
                                        id="mainDistributorPrice"
                                        name="mainDistributorPrice"
                                        value={formData.mainDistributorPrice}
                                        min="0"
                                        step="0.01"
                                        decimalPlaces={4}
                                        onChange={(value) => {
                                            handleChange('mainDistributorPrice', value)
                                        }}
                                    />
                                    {errors.mainDistributorPrice && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.mainDistributorPrice}</AlertDescription>
                                        </Alert>
                                    )}


                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mainDistributorRate">TÜPRAŞ İndirim Oranı (%) *</Label>
                                    <NumberInput
                                        inputType="percent"
                                        value={formData.mainDistributorRate}
                                        decimalPlaces={0.01}
                                        minValue={-100}
                                        maxValue={100}
                                        allowNegative={true}
                                        step="0.01"
                                        className={errors.mainDistributorRate ? 'border-red-500' : ''}
                                        placeholder="0.00"
                                        onChange={(value) => {
                                            setMainDistributorRateInput(value.toString());
                                            handleChange('mainDistributorRate', value);
                                        }}
                                    />
                                    {errors.mainDistributorRate && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.mainDistributorRate}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Litre Başı Nakliye (TL)</Label>
                                    <MoneyInput
                                        value={formData.literShippingPrice}
                                        readOnly
                                        decimalPlaces={4}
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Birim Fiyat (TL)</Label>

                                    <MoneyInput
                                        value={formData.unitPrice}
                                        minValue={0}
                                        decimalPlaces={4}
                                        onChange={(value) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                unitPrice: value
                                            }));
                                        }}
                                        className="bg-white"
                                    />

                                    {errors.unitPrice && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.unitPrice}</AlertDescription>
                                        </Alert>
                                    )}

                                </div>

                                <div className="space-y-2">
                                    <Label>Nakliye Dahil Birim Fiyat (TL)</Label>
                                    <MoneyInput
                                        value={formData.unitPriceIncludingShipping}
                                        readOnly
                                        decimalPlaces={4}
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Toplam Tutar (TL)</Label>
                                    <MoneyInput
                                        value={formData.totalAmount}
                                        readOnly
                                        decimalPlaces={4}
                                        className="bg-gray-50 text-lg font-bold"
                                    />
                                </div>

                                {/* Açıklama */}
                                <div className="space-y-2 col-span-4">
                                    <Label htmlFor="description">Açıklama</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        className="min-h-[100px]"
                                        placeholder="Teklif hakkında açıklama giriniz..."
                                    />
                                </div>
                                <div className="space-y-2 col-span-4">
                                    <div className="flex justify-end space-x-4">
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                            {offer ? "Teklif Güncelle" : "Yeni Teklif Oluştur"}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        }


                    </div>


                </form>

                {
                    customerInfos && customerInfos.length > 0 &&
                    <DynamicTable columns={columnsCustomerInfo} data={customerInfos} pageSize={10}/>

                }


                {selectedOrder &&
                    <>
                        <hr/>
                        {
                            formData.priceSource === "pompa" ? <POSearchComponent handleUsePrice={handleUsePrice}/> :
                                <>
                                    <h5>TÜPRAŞ Fiyat Listesi</h5>
                                    <DynamicTable columns={columns} data={productPriceTrackingList}/>
                                </>
                        }
                    </>
                }
            </CardContent>
        </Card>
    );
};

export default CreateOfferForm;

