import { useState, useCallback } from 'react';
import { CreditInstallment, CreditInstallmentFormData } from '@/types/finance';
import { creditInstallmentService } from "@/services/api/finance//credit-installment-service";
import { useRouter } from 'next/navigation';
import { showNotification } from "@/lib/notification";

interface UseCreditInstallmentReturn {
    creditInstallments: CreditInstallment[];
    selectedCreditInstallment: CreditInstallment | null;
    loading: boolean;
    error: Error | null;
    fetchCreditInstallmentById: (id: string) => Promise<void>;
    fetchCreditInstallmentsByCreditId: (creditId: string) => Promise<void>;
    createCreditInstallment: (creditInstallment: CreditInstallmentFormData) => Promise<void>;
    updateCreditInstallment: (creditInstallment: CreditInstallmentFormData) => Promise<void>;
    deleteCreditInstallment: (id: string) => Promise<void>;
}

export const useCreditInstallments = (): UseCreditInstallmentReturn => {
    const [creditInstallments, setCreditInstallments] = useState<CreditInstallment[]>([]);
    const [selectedCreditInstallment, setSelectedCreditInstallment] = useState<CreditInstallment | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchCreditInstallmentById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await creditInstallmentService.getCreditInstallmentById(id);
            setSelectedCreditInstallment(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCreditInstallmentsByCreditId = useCallback(async (creditId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await creditInstallmentService.getCreditInstallmentsByCreditId(creditId);
            setCreditInstallments(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCreditInstallment = useCallback(async (creditInstallment: CreditInstallmentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await creditInstallmentService.createCreditInstallment(creditInstallment);
            showNotification.success('İşlem başarıyla tamamlandı!');
         //   router.push(`/admin/finance/credit-installments`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const updateCreditInstallment = useCallback(async (creditInstallment: CreditInstallmentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await creditInstallmentService.updateCreditInstallment(creditInstallment.id || '', creditInstallment);
            showNotification.success('İşlem başarıyla tamamlandı!');
           // router.push(`/admin/finance/credit-installments`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const deleteCreditInstallment = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await creditInstallmentService.deleteCreditInstallment(id);
            showNotification.success('İşlem başarıyla tamamlandı!');
         //   router.push(`/admin/finance/credit-installments`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    return {
        creditInstallments,
        selectedCreditInstallment,
        loading,
        error,
        fetchCreditInstallmentById,
        fetchCreditInstallmentsByCreditId,
        createCreditInstallment,
        updateCreditInstallment,
        deleteCreditInstallment,
    };
};