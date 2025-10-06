import { useState, useCallback, useEffect } from 'react';
import { AdditionalAccount, AdditionalAccountFormData } from '@/types/finance';
import { additionalAccountService } from "@/services/api/finance/additional-account-service";
import { useRouter } from 'next/navigation';
import { showNotification } from "@/lib/notification";

interface UseAdditionalAccountReturn {
    additionalAccounts: AdditionalAccount[];
    selectedAdditionalAccount: AdditionalAccount | null;
    loading: boolean;
    error: Error | null;
    fetchAdditionalAccounts: (shouldRedirect?: boolean) => Promise<void>;
    fetchAdditionalAccountById: (id: string) => Promise<void>;
    fetchAdditionalAccountsByBankAccountId: (bankAccountId: string) => Promise<void>;
    createAdditionalAccount: (additionalAccount: AdditionalAccountFormData) => Promise<void>;
    updateAdditionalAccount: (additionalAccount: AdditionalAccountFormData) => Promise<void>;
    deleteAdditionalAccount: (id: string) => Promise<void>;
}

export const useAdditionalAccounts = (): UseAdditionalAccountReturn => {
    const [additionalAccounts, setAdditionalAccounts] = useState<AdditionalAccount[]>([]);
    const [selectedAdditionalAccount, setSelectedAdditionalAccount] = useState<AdditionalAccount | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchAdditionalAccounts = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await additionalAccountService.getAllAdditionalAccounts();
            setAdditionalAccounts(data);

            if (shouldRedirect) {
                router.push('/admin/finance/data/additional-account');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchAdditionalAccountById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await additionalAccountService.getAdditionalAccountById(id);
            setSelectedAdditionalAccount(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAdditionalAccountsByBankAccountId = useCallback(async (bankAccountId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await additionalAccountService.getAdditionalAccountsByBankAccountId(bankAccountId);
            setAdditionalAccounts(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createAdditionalAccount = useCallback(async (additionalAccount: AdditionalAccountFormData) => {
        try {
            setLoading(true);
            setError(null);
            await additionalAccountService.createAdditionalAccount(additionalAccount);
            await fetchAdditionalAccounts();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/additional-account`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchAdditionalAccounts, router]);

    const updateAdditionalAccount = useCallback(async (additionalAccount: AdditionalAccountFormData) => {
        try {
            setLoading(true);
            setError(null);
            await additionalAccountService.updateAdditionalAccount(additionalAccount.id || '', additionalAccount);
            await fetchAdditionalAccounts();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/additional-account`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchAdditionalAccounts, router]);

    const deleteAdditionalAccount = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await additionalAccountService.deleteAdditionalAccount(id);
            await fetchAdditionalAccounts();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/additional-account`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchAdditionalAccounts, router]);

    useEffect(() => {
        fetchAdditionalAccounts();
    }, [fetchAdditionalAccounts]);

    return {
        additionalAccounts,
        selectedAdditionalAccount,
        loading,
        error,
        fetchAdditionalAccounts,
        fetchAdditionalAccountById,
        fetchAdditionalAccountsByBankAccountId,
        createAdditionalAccount,
        updateAdditionalAccount,
        deleteAdditionalAccount,
    };
};