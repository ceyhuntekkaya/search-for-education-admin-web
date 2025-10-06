import { useState, useCallback, useEffect } from 'react';
import {AllOrderDataRequest, Order, OrderParts} from '@/types/order';
import {orderService} from "@/services/api/order-service";
import {Customer, CustomerInfo} from "@/types/customer";
import {FillingFacility, Product, Supplier} from "@/types/supplier";
import {Offer, OfferApproval} from "@/types/offer";
import {Delivery, DeliveryDocument, DeliveryProgress} from "@/types/delivery";
import {TransportationCompany} from "@/types/transportation-company";
import {Vehicle, VehicleDriver} from "@/types/vehicle";


interface useOrderAllDataReturn {
    order: Order | null;
    offer: Offer | null;
    loading: boolean;
    error: Error | null;
    allOrderData: AllOrderDataRequest | null;
    allOrderDataAll: AllOrderDataRequest[] | null;
    orderParts: OrderParts | null;
    customer: Customer | null;
    supplier: Supplier | null;
    product: Product | null;
    fillingFacility: FillingFacility | null;
    delivery: Delivery | null;
    transportationCompany: TransportationCompany | null;
    deliveryDocuments: DeliveryDocument[] | null;
    deliveryProgresses: DeliveryProgress[] | null;
    customerInfos: CustomerInfo[] | null;
    offerApprovals: OfferApproval[] | null;

    vehicle: Vehicle | null;
    vehicleDriver: VehicleDriver | null;


    getAllOrderData: (id: string, from: string) => Promise<void>;
    getAllOrderDataAll: () => Promise<void>;
}

export const useOrderAllData = (): useOrderAllDataReturn => {
    const [orderParts, setOrderParts] = useState<OrderParts | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [fillingFacility, setFillingFacility] = useState<FillingFacility | null>(null);
    const [offer, setOffer] = useState<Offer | null>(null);

    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [transportationCompany, setTransportationCompany] = useState<TransportationCompany | null>(null);
    const [deliveryDocuments, setDeliveryDocuments] = useState<DeliveryDocument[] | null>(null);
    const [deliveryProgresses, setDeliveryProgresses] = useState<DeliveryProgress[] | null>(null);
    const [customerInfos, setCustomerInfos] = useState<CustomerInfo[] | null>(null);
    const [offerApprovals, setOfferApprovals] = useState<OfferApproval[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [allOrderData, setAllOrderData] = useState<AllOrderDataRequest | null>(null);

    const [allOrderDataAll, setAllOrderDataAll] = useState<AllOrderDataRequest[] | null>(null);



    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [vehicleDriver, setVehicleDriver] = useState<VehicleDriver | null>(null);


    const getAllOrderData = useCallback(async (id: string, from: string) => {

        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getAllOrderData(id, from);
            setAllOrderData(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);





    const getAllOrderDataAll = useCallback(async () => {

        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getAllOrderDataAll();
            setAllOrderDataAll(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadRelatedData = async () => {
            if (!allOrderData) return;


            try {
                setLoading(true);
                if (allOrderData.offer) {
                    setOffer(allOrderData.offer as Offer);

                }
                if (allOrderData.offer?.customer) {
                    setCustomer(allOrderData.offer?.customer as Customer);
                }
                if (allOrderData.order) {
                    setOrder(allOrderData.order as Order);
                }
                if (allOrderData.offer?.supplier) {
                    setSupplier(allOrderData.offer?.supplier as Supplier);
                }
                if (allOrderData.offer?.product) {
                    setProduct(allOrderData.offer?.product as Product);
                }
                if (allOrderData.offer?.fillingFacility) {
                    setFillingFacility(allOrderData.offer?.fillingFacility as FillingFacility);
                }
                if (allOrderData.delivery) {
                    setDelivery(allOrderData.delivery as Delivery);
                }
                if (allOrderData.delivery?.transportationCompany) {
                    setTransportationCompany(allOrderData?.delivery.transportationCompany as TransportationCompany);
                }
                if (allOrderData.deliveryDocuments) {
                    setDeliveryDocuments(allOrderData.deliveryDocuments as DeliveryDocument[]);
                }
                if (allOrderData.deliveryProgresses) {
                    setDeliveryProgresses(allOrderData.deliveryProgresses as DeliveryProgress[]);
                }
                if (allOrderData.customerInfos) {
                    setCustomerInfos(allOrderData.customerInfos as CustomerInfo[]);
                }
                if (allOrderData.offerApprovals) {
                    setOfferApprovals(allOrderData.offerApprovals as OfferApproval[]);
                }
                if (allOrderData.delivery?.vehicle) {
                    setVehicle(allOrderData?.delivery.vehicle as Vehicle);
                }
                if (allOrderData.delivery?.vehicleDriver) {
                    setVehicleDriver(allOrderData?.delivery.vehicleDriver as VehicleDriver);
                }

                setOrderParts({offer, order, customer, supplier, product, fillingFacility, delivery,
                    transportationCompany, deliveryDocuments, deliveryProgresses,
                    customerInfos, offerApprovals, vehicle, vehicleDriver, loading, error});

            } catch (error) {
                console.error('İlişkili veriler yüklenirken hata oluştu:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRelatedData();
    }, [allOrderData, customer, customerInfos, delivery, deliveryDocuments, deliveryProgresses, error, fillingFacility, loading, offer, offerApprovals, order, product, supplier, transportationCompany, vehicle, vehicleDriver]);

    return {
        order,
        loading,
        error,
        allOrderData,
        customer,
        supplier,
        product,
        fillingFacility,
        delivery,
        transportationCompany,
        deliveryDocuments,
        deliveryProgresses,
        customerInfos,
        offerApprovals,
        getAllOrderData,
        offer,
        vehicle,
        vehicleDriver,
        orderParts,
        getAllOrderDataAll,
        allOrderDataAll
    };
};