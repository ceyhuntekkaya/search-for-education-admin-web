import { useState, useCallback, useEffect } from 'react';
import { CreditCard, CreditCardFormData } from '@/types/finance';
import { creditCardService } from "@/services/api/finance/credit-card-service";
import { useRouter } from 'next/navigation';
import { showNotification } from "@/lib/notification";

interface UseCreditCardReturn {
    creditCards: CreditCard[];
    selectedCreditCard: CreditCard | null;
    loading: boolean;
    error: Error | null;
    fetchCreditCards: (shouldRedirect?: boolean) => Promise<void>;
    fetchCreditCardById: (id: string) => Promise<void>;
    fetchCreditCardsByBrandId: (brandId: string) => Promise<void>;
    createCreditCard: (creditCard: CreditCardFormData) => Promise<void>;
    updateCreditCard: (creditCard: CreditCardFormData) => Promise<void>;
    deleteCreditCard: (id: string) => Promise<void>;
}

export const useCreditCards = (): UseCreditCardReturn => {
    const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
    const [selectedCreditCard, setSelectedCreditCard] = useState<CreditCard | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchCreditCards = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await creditCardService.getAllCreditCards();
            setCreditCards(data);

            if (shouldRedirect) {
                router.push('/admin/finance/data/credit-card');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchCreditCardById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await creditCardService.getCreditCardById(id);
            setSelectedCreditCard(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);
    const createCreditCard = useCallback(async (creditCard: CreditCardFormData) => {
        try {
            setLoading(true);
            setError(null);
            await creditCardService.createCreditCard(creditCard);
            await fetchCreditCards();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/credit-card');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCreditCards, router]);

    const fetchCreditCardsByBrandId = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await creditCardService.getCreditCardsByBrandId(brandId);
            setCreditCards(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCreditCard = useCallback(async (creditCard: CreditCardFormData) => {
        try {
            setLoading(true);
            setError(null);
            await creditCardService.updateCreditCard(creditCard.id || '', creditCard);
            await fetchCreditCards();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/credit-card');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCreditCards, router]);

    const deleteCreditCard = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await creditCardService.deleteCreditCard(id);
            await fetchCreditCards();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/credit-card');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchCreditCards, router]);

    useEffect(() => {
        fetchCreditCards();
    }, [fetchCreditCards]);

    return {
        creditCards,
        selectedCreditCard,
        loading,
        error,
        fetchCreditCards,
        fetchCreditCardById,
        fetchCreditCardsByBrandId,
        createCreditCard,
        updateCreditCard,
        deleteCreditCard,
    };

};