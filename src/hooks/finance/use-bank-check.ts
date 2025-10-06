import { useState, useCallback, useEffect } from 'react';
import { BankCheck, BankCheckFormData } from '@/types/finance';
import { bankCheckService } from "@/services/api/finance/bank-check-service";
import { useRouter } from 'next/navigation';
import { showNotification } from "@/lib/notification";

interface UseBankCheckReturn {
    bankChecks: BankCheck[];
    selectedBankCheck: BankCheck | null;
    loading: boolean;
    error: Error | null;
    fetchBankChecks: (shouldRedirect?: boolean) => Promise<void>;
    fetchBankCheckById: (id: string) => Promise<void>;
    fetchBankChecksByBrandId: (brandId: string) => Promise<void>;
    createBankCheck: (bankCheck: BankCheckFormData) => Promise<void>;
    updateBankCheck: (bankCheck: BankCheckFormData) => Promise<void>;
    deleteBankCheck: (id: string) => Promise<void>;
}

export const useBankChecks = (): UseBankCheckReturn => {
    const [bankChecks, setBankChecks] = useState<BankCheck[]>([]);
    const [selectedBankCheck, setSelectedBankCheck] = useState<BankCheck | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchBankChecks = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankCheckService.getAllBankChecks();
            setBankChecks(data);

            if (shouldRedirect) {
                router.push('/admin/finance/data/check');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchBankCheckById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankCheckService.getBankCheckById(id);
            setSelectedBankCheck(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBankChecksByBrandId = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankCheckService.getBankChecksByBrandId(brandId);
            setBankChecks(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createBankCheck = useCallback(async (bankCheck: BankCheckFormData) => {
        try {
            setLoading(true);
            setError(null);
            await bankCheckService.createBankCheck(bankCheck);
            await fetchBankChecks();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/check`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBankChecks, router]);

    const updateBankCheck = useCallback(async (bankCheck: BankCheckFormData) => {
        try {
            setLoading(true);
            setError(null);
            await bankCheckService.updateBankCheck(bankCheck.id || '', bankCheck);
            await fetchBankChecks();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/check`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBankChecks, router]);

    const deleteBankCheck = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await bankCheckService.deleteBankCheck(id);
            await fetchBankChecks();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/check`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBankChecks, router]);

    useEffect(() => {
        fetchBankChecks();
    }, [fetchBankChecks]);

    return {
        bankChecks,
        selectedBankCheck,
        loading,
        error,
        fetchBankChecks,
        fetchBankCheckById,
        fetchBankChecksByBrandId,
        createBankCheck,
        updateBankCheck,
        deleteBankCheck,
    };
};