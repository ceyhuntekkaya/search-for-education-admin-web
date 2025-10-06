import { useState, useCallback, useEffect } from 'react';
import {
    OfferText,
    OfferTextFormData,
    Order,
    OrderDtoFormData,
    OrderFormData,
    OrderSearchFormData,
    OrderState
} from '@/types/order';
import {orderService} from "@/services/api/order-service";
import {showNotification} from "@/lib/notification";
import {useRouter} from 'next/navigation';
import {DeliveryProgress} from "@/types/delivery";
import {useAuthContext} from "@/contexts/auth-context";
import {Role} from "@/types/auth";

interface UseOrderReturn {
    orders: Order[];
    orderDtoList: OrderDtoFormData[];
    orderRoleList: OrderDtoFormData[];
    orderStates: OrderState[];
    selectedOrder: Order | null;
    loading: boolean;
    error: Error | null;
    fetchOrders: () => Promise<void>;
    fetchBaseOrders: () => Promise<void>;
    fetchOrderStates: () => Promise<void>;
    fetchOrderById: (id: string) => Promise<void>;
    updateOrderStates: (orderId: string, orderStateId: string) => Promise<void>;
    searchOrdersByCustomer: (name: string) => Promise<void>;
    createOrder: (order: OrderFormData) => Promise<void>;
    updateOrder: (order: OrderFormData) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    fetchSearchOrder: (order: OrderSearchFormData) => Promise<void>;
    progressList: DeliveryProgress[];
    fetchDeliveryProgress: (orderId: string) => Promise<void>;
    offerTexts: OfferText[];
    selectedOfferText: OfferText | null;
    getAllOfferTexts: () => Promise<void>;
    getOfferTextById: (id: string) => Promise<void>;
    createOfferText: (offerTextFormData: OfferTextFormData) => Promise<void>;
    updateOfferText: (offerTextFormData: OfferTextFormData) => Promise<void>;
    fetchByRole: (role: Role, id: string) => Promise<void>;
}

export const useOrders = (): UseOrderReturn => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDtoList, setOrderDtoList] = useState<OrderDtoFormData[]>([]);

    const [orderRoleList, setOrderRoleList] = useState<OrderDtoFormData[]>([]);


    const [progressList, setProgressList] = useState<DeliveryProgress[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();
    const [orderStates, setOrderStates] = useState<OrderState[]>([]);
    const { activeBrand } = useAuthContext();



    const [offerTexts, setOfferTexts] = useState<OfferText[]>([]);
    const [selectedOfferText, setSelectedOfferText] = useState<OfferText | null>(null);





    const fetchByRole = useCallback(async (role: Role, id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getOrderByRole(role, id);
            setOrderRoleList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);







    const fetchDeliveryProgress = useCallback(async (orderId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getDeliveryProgress(orderId);
            setProgressList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);





    const fetchSearchOrder = useCallback(async (params: OrderSearchFormData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.fetchSearchOrder(params);
            setOrderDtoList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);



    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getAllOrders();
            setOrderDtoList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchBaseOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getAllBaseOrders();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);
    //getAllBaseOrders



    const fetchOrderStates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getAllOrderStates();
            setOrderStates(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrderById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getOrderById(id);
            setSelectedOrder(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);


    const updateOrderStates = useCallback(async (orderId: string, orderStateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.setOrderStates(orderId, orderStateId);
            setSelectedOrder(data);
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);




    const searchOrdersByCustomer = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.findByCustomerId(name);
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createOrder = useCallback(async (order: OrderFormData) => {
        try {
            setLoading(true);
            setError(null);
            order.brandId = activeBrand?.id || '';
            await orderService.createOrder(order);
            await fetchOrders();
            showNotification.success('İşlem başarıyla tamamlandı!');
           // router.push(`/admin/orders`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOrders, router]);

    const updateOrder = useCallback(async (order: OrderFormData) => {
        try {
            setLoading(true);
            setError(null);
            await orderService.updateOrder(order.id || '', order);
            await fetchOrders();
            await fetchOrders();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/orders`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOrders, router]);

    const deleteOrder = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await orderService.deleteOrder(id);
            await fetchOrders();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/orders`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOrders, router]);

    const getAllOfferTexts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getAllOfferTexts();
            setOfferTexts(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getOfferTextById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getOfferTextById(id);
            setSelectedOfferText(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createOfferText = useCallback(async (offerText: OfferTextFormData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.createOfferText(offerText);
            setSelectedOfferText(data);
            await getAllOfferTexts();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/offer-text`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [getAllOfferTexts, router]);

    const updateOfferText = useCallback(async (offerText: OfferTextFormData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.updateOfferText(offerText);
            setSelectedOfferText(data);
            await getAllOfferTexts();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/settings/offer-text`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [getAllOfferTexts, router]);


    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        selectedOrder,
        loading,
        error,
        fetchOrders,
        fetchOrderById,
        searchOrdersByCustomer,
        createOrder,
        updateOrder,
        deleteOrder,
        fetchOrderStates,
        orderStates,
        updateOrderStates,
        progressList,
        fetchDeliveryProgress,
        fetchSearchOrder,
        orderDtoList,


        offerTexts,
        selectedOfferText,

        getAllOfferTexts,
        getOfferTextById,
        createOfferText,
        updateOfferText,
        fetchBaseOrders,
        fetchByRole,
        orderRoleList

    };
};
