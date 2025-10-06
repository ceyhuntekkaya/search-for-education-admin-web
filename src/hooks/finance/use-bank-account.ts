import { useState, useCallback, useEffect } from 'react';
import { BankAccount, BankAccountFormData } from '@/types/finance';
import { bankAccountService } from "@/services/api/finance/bank-account-service";
import { useRouter } from 'next/navigation';
import { showNotification } from "@/lib/notification";

interface UseBankAccountReturn {
    bankAccounts: BankAccount[];
    selectedBankAccount: BankAccount | null;
    loading: boolean;
    error: Error | null;
    fetchBankAccounts: (shouldRedirect?: boolean) => Promise<void>;
    fetchBankAccountById: (id: string) => Promise<void>;
    fetchBankAccountsByBrandId: (brandId: string) => Promise<void>;
    createBankAccount: (bankAccount: BankAccountFormData) => Promise<void>;
    updateBankAccount: (bankAccount: BankAccountFormData) => Promise<void>;
    deleteBankAccount: (id: string) => Promise<void>;
}

export const useBankAccounts = (): UseBankAccountReturn => {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchBankAccounts = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankAccountService.getAllBankAccounts();
            setBankAccounts(data);

            if (shouldRedirect) {
                router.push('/admin/finance/bank-accounts');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchBankAccountById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankAccountService.getBankAccountById(id);
            setSelectedBankAccount(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBankAccountsByBrandId = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankAccountService.getBankAccountsByBrandId(brandId);
            setBankAccounts(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createBankAccount = useCallback(async (bankAccount: BankAccountFormData) => {
        try {
            setLoading(true);
            setError(null);
            await bankAccountService.createBankAccount(bankAccount);
            await fetchBankAccounts();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/bank-accounts`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBankAccounts, router]);

    const updateBankAccount = useCallback(async (bankAccount: BankAccountFormData) => {
        try {
            setLoading(true);
            setError(null);
            await bankAccountService.updateBankAccount(bankAccount.id || '', bankAccount);
            await fetchBankAccounts();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/bank-accounts`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBankAccounts, router]);

    const deleteBankAccount = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await bankAccountService.deleteBankAccount(id);
            await fetchBankAccounts();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/bank-accounts`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBankAccounts, router]);

    useEffect(() => {
        fetchBankAccounts();
    }, [fetchBankAccounts]);

    return {
        bankAccounts,
        selectedBankAccount,
        loading,
        error,
        fetchBankAccounts,
        fetchBankAccountById,
        fetchBankAccountsByBrandId,
        createBankAccount,
        updateBankAccount,
        deleteBankAccount,
    };
};


