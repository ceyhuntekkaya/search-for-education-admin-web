import { useState, useCallback, useEffect } from 'react';
import { LetterOfGuarantee, LetterOfGuaranteeFormData } from '@/types/finance';
import { letterOfGuaranteeService } from "@/services/api/finance/letter-of-guarantee-service";
import { useRouter } from 'next/navigation';
import { showNotification } from "@/lib/notification";

interface UseLetterOfGuaranteeReturn {
    letterOfGuarantees: LetterOfGuarantee[];
    selectedLetterOfGuarantee: LetterOfGuarantee | null;
    loading: boolean;
    error: Error | null;
    fetchLetterOfGuarantees: (shouldRedirect?: boolean) => Promise<void>;
    fetchLetterOfGuaranteeById: (id: string) => Promise<void>;
    fetchLetterOfGuaranteesByBrandId: (brandId: string) => Promise<void>;
    createLetterOfGuarantee: (letterOfGuarantee: LetterOfGuaranteeFormData) => Promise<void>;
    updateLetterOfGuarantee: (letterOfGuarantee: LetterOfGuaranteeFormData) => Promise<void>;
    deleteLetterOfGuarantee: (id: string) => Promise<void>;
}

export const useLetterOfGuarantees = (): UseLetterOfGuaranteeReturn => {
    const [letterOfGuarantees, setLetterOfGuarantees] = useState<LetterOfGuarantee[]>([]);
    const [selectedLetterOfGuarantee, setSelectedLetterOfGuarantee] = useState<LetterOfGuarantee | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchLetterOfGuarantees = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await letterOfGuaranteeService.getAllLetterOfGuarantees();
            setLetterOfGuarantees(data);

            if (shouldRedirect) {
                router.push('/admin/finance/data/letter');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchLetterOfGuaranteeById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await letterOfGuaranteeService.getLetterOfGuaranteeById(id);
            setSelectedLetterOfGuarantee(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLetterOfGuaranteesByBrandId = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await letterOfGuaranteeService.getLetterOfGuaranteesByBrandId(brandId);
            setLetterOfGuarantees(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createLetterOfGuarantee = useCallback(async (letterOfGuarantee: LetterOfGuaranteeFormData) => {
        try {
            setLoading(true);
            setError(null);
            await letterOfGuaranteeService.createLetterOfGuarantee(letterOfGuarantee);
            await fetchLetterOfGuarantees();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/letter');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchLetterOfGuarantees, router]);

    const updateLetterOfGuarantee = useCallback(async (letterOfGuarantee: LetterOfGuaranteeFormData) => {
        try {
            setLoading(true);
            setError(null);
            await letterOfGuaranteeService.updateLetterOfGuarantee(letterOfGuarantee.id || '', letterOfGuarantee);
            await fetchLetterOfGuarantees();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/letter');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchLetterOfGuarantees, router]);

    const deleteLetterOfGuarantee = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await letterOfGuaranteeService.deleteLetterOfGuarantee(id);
            await fetchLetterOfGuarantees();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push('/admin/finance/data/letter');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchLetterOfGuarantees, router]);

    useEffect(() => {
        fetchLetterOfGuarantees();
    }, [fetchLetterOfGuarantees]);

    return {
        letterOfGuarantees,
        selectedLetterOfGuarantee,
        loading,
        error,
        fetchLetterOfGuarantees,
        fetchLetterOfGuaranteeById,
        fetchLetterOfGuaranteesByBrandId,
        createLetterOfGuarantee,
        updateLetterOfGuarantee,
        deleteLetterOfGuarantee,
    };
};
