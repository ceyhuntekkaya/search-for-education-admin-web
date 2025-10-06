import { useState, useCallback, useEffect } from 'react';
import { Credit, CreditFormData } from '@/types/finance';
import { creditService } from "@/services/api/finance/credit-service";
import { useRouter } from 'next/navigation';
import { showNotification } from "@/lib/notification";

interface UseCreditReturn {
    credits: Credit[];
    creditsWithInstallments: CreditFormData[];
    selectedCredit: Credit | null;
    loading: boolean;
    error: Error | null;
    fetchCredits: (shouldRedirect?: boolean) => Promise<void>;
    fetchCreditById: (id: string) => Promise<void>;
    fetchCreditsByBrandId: (brandId: string) => Promise<void>;
    createCredit: (credit: CreditFormData) => Promise<void>;
    updateCredit: (credit: CreditFormData) => Promise<void>;
    deleteCredit: (id: string) => Promise<void>;
    filterCredits: (creditList: CreditFormData[]) => Promise<void>;
}

export const useCredits = (): UseCreditReturn => {
    const [credits, setCredits] = useState<Credit[]>([]);
    const [creditsWithInstallments, setCreditsWithInstallments] = useState<CreditFormData[]>([]);
    const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();





    const filterCredits = useCallback(async (creditList:CreditFormData[]) => {
        try {
            setCreditsWithInstallments(creditList);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);




    const fetchCredits = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await creditService.getAllCredits();
            setCreditsWithInstallments(data);

            if (shouldRedirect) {
                router.push(`/admin/finance/data/credit`);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchCreditById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await creditService.getCreditById(id);
            setSelectedCredit(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCreditsByBrandId = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await creditService.getCreditsByBrandId(brandId);
            setCredits(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCredit = useCallback(async (credit: CreditFormData) => {
        try {
            setLoading(true);
            setError(null);
            await creditService.createCredit(credit);
            await fetchCredits();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/credit`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCredits, router]);

    const updateCredit = useCallback(async (credit: CreditFormData) => {
        try {
            setLoading(true);
            setError(null);
            await creditService.updateCredit(credit.id || '', credit);
            await fetchCredits();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/credit`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCredits, router]);

    const deleteCredit = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await creditService.deleteCredit(id);
            await fetchCredits();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/credit`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCredits, router]);

    useEffect(() => {
        fetchCredits();
    }, [fetchCredits]);

    return {
        credits,
        selectedCredit,
        loading,
        error,
        fetchCredits,
        fetchCreditById,
        fetchCreditsByBrandId,
        createCredit,
        updateCredit,
        deleteCredit,
        creditsWithInstallments,
        filterCredits
    };
};