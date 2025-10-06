import {useState, useCallback} from 'react';
import {
    PaymentPlanDataDto,
    PaymentPlanGroupFormData, PaymentPlanInstallmentFormData
} from '@/types/finance';
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";
import {paymentPlanService} from "@/services/api/finance/payment-plan-service";

interface UsePaymentPlanReturn {
    paymentPlanGroups: PaymentPlanGroupFormData[];
    paymentPlanDataList: PaymentPlanDataDto[];
    selectedPaymentPlanData: PaymentPlanDataDto | null;
    loading: boolean;
    error: Error | null;

    createPaymentPlan: (paymentPlanDataDto: PaymentPlanDataDto) => Promise<void>;
    fetchPaymentPlans: () => Promise<void>;
    fetchCreditPlans: () => Promise<void>;
    fetchPaymentPlanById: (paymentPlanId: string) => Promise<void>;
    updatePaymentPlan: (paymentPlanDto: PaymentPlanDataDto) => Promise<void>;
    fetchPaymentPlanInstallments: (paymentPlanId: string) => Promise<void>;
    deletePaymentPlan: (paymentPlanId: string) => Promise<void>;
    createPaymentPlanGroup: (paymentPlanGroupFormData: PaymentPlanGroupFormData) => Promise<void>;
    updatePaymentPlanGroup: (paymentPlanGroupFormData: PaymentPlanGroupFormData) => Promise<void>;
    deletePaymentPlanGroup: (paymentPlanGroupId: string) => Promise<void>;
    fetchPaymentPlanGroups: () => Promise<void>;
    createPaymentPlanInstallment: (paymentPlanInstallment: PaymentPlanInstallmentFormData) => Promise<void>;
    updatePaymentPlanInstallment: (paymentPlanInstallment: PaymentPlanInstallmentFormData) => Promise<void>;
    deletePaymentPlanInstallment: (paymentPlanInstallmentId: string) => Promise<void>;
    paymentPlanInstallments: PaymentPlanInstallmentFormData[];
}

export const usePaymentPlans = (): UsePaymentPlanReturn => {
    const [paymentPlanGroups, setPaymentPlanGroups] = useState<PaymentPlanGroupFormData[]>([]);

    const [paymentPlanInstallments, setPaymentPlanInstallments] = useState<PaymentPlanInstallmentFormData[]>([]);


    const [paymentPlanDataList, setPaymentPlanDataList] = useState<PaymentPlanDataDto[]>([]);
    const [selectedPaymentPlanData, setSelectedPaymentPlanData] = useState<PaymentPlanDataDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();


    const createPaymentPlan = useCallback(async (paymentPlanDataDto: PaymentPlanDataDto) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.createPaymentPlan(paymentPlanDataDto);
            await fetchPaymentPlans();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/payment-plan/payment');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);


    const createPaymentPlanGroup = useCallback(async (paymentPlanGroupFormData: PaymentPlanGroupFormData) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.createPaymentPlanGroup(paymentPlanGroupFormData);
            await fetchPaymentPlanGroups();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/payment-plan/payment');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);


    const createPaymentPlanInstallment = useCallback(async (paymentPlanInstallment: PaymentPlanInstallmentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.createPaymentPlanInstallment(paymentPlanInstallment);
            await fetchPaymentPlans();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/payment-plan/payment');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const updatePaymentPlan = useCallback(async (paymentPlanDto: PaymentPlanDataDto) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.updatePaymentPlan(paymentPlanDto.paymentPlanDto.id || '', paymentPlanDto);
            await fetchPaymentPlans();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/payment-plan/payment');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);
    const updatePaymentPlanGroup = useCallback(async (paymentPlanGroupFormData: PaymentPlanGroupFormData) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.updatePaymentPlanGroup(paymentPlanGroupFormData.id || '', paymentPlanGroupFormData);
            await fetchPaymentPlanGroups();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/payment-plan/payment');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);
    const updatePaymentPlanInstallment = useCallback(async (paymentPlanInstallment: PaymentPlanInstallmentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.updatePaymentPlanInstallment(paymentPlanInstallment.id || '', paymentPlanInstallment);
            await fetchPaymentPlans();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/payment-plan/payment');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);


    const deletePaymentPlan = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.deletePaymentPlan(id);
            await fetchPaymentPlans();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/payment-plan/payment');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);
    const deletePaymentPlanGroup = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.deletePaymentPlanGroup(id);
            await fetchPaymentPlanGroups();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/payment-plan/payment');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);
    const deletePaymentPlanInstallment = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await paymentPlanService.deletePaymentPlanInstallment(id);
            await fetchPaymentPlans();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);


    const fetchPaymentPlans = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentPlanService.getAllPaymentPlans();
            setPaymentPlanDataList(data);

            if (shouldRedirect) {
                router.push('/admin/finance/data/payment-plan/payment');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);



    const fetchCreditPlans = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentPlanService.getAllCreditPlans();
            setPaymentPlanDataList(data);

            if (shouldRedirect) {
                router.push('/admin/finance/data/payment-plan/credit');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);


    const fetchPaymentPlanById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentPlanService.getPaymentPlanById(id);
            setSelectedPaymentPlanData(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPaymentPlanGroups = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentPlanService.getAllPaymentPlanGroups();
            setPaymentPlanGroups(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);



    const fetchPaymentPlanInstallments = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentPlanService.getPaymentInstallments(id);
            setPaymentPlanInstallments(data);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);


    return {
        paymentPlanGroups,
        paymentPlanDataList,
        selectedPaymentPlanData,
        loading,
        error,
        createPaymentPlan,
        fetchPaymentPlans,
        fetchPaymentPlanById,
        updatePaymentPlan,
        deletePaymentPlan,
        createPaymentPlanGroup,
        updatePaymentPlanGroup,
        deletePaymentPlanGroup,
        fetchPaymentPlanGroups,
        createPaymentPlanInstallment,
        updatePaymentPlanInstallment,
        deletePaymentPlanInstallment,
        paymentPlanInstallments,
        fetchPaymentPlanInstallments,
        fetchCreditPlans

    };
};
