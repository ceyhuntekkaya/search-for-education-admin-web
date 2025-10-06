import { useState, useCallback, useEffect } from 'react';
import { Bank, BankFormData } from '@/types/finance';
import { bankService } from "@/services/api/finance/bank-service";
import { useRouter } from 'next/navigation';
import { showNotification } from "@/lib/notification";

interface UseBankReturn {
    banks: Bank[];
    selectedBank: Bank | null;
    loading: boolean;
    error: Error | null;
    fetchBanks: (shouldRedirect?: boolean) => Promise<void>;
    fetchBankById: (id: string) => Promise<void>;
    fetchBanksByBrandId: (brandId: string) => Promise<void>;
    createBank: (bank: BankFormData) => Promise<void>;
    updateBank: (bank: BankFormData) => Promise<void>;
    deleteBank: (id: string) => Promise<void>;
}

export const useBanks = (): UseBankReturn => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchBanks = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankService.getAllBanks();
            setBanks(data);

            if (shouldRedirect) {
                router.push('/admin/finance/data/bank');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchBankById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankService.getBankById(id);
            setSelectedBank(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBanksByBrandId = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bankService.getBanksByBrandId(brandId);
            setBanks(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createBank = useCallback(async (bank: BankFormData) => {
        try {
            setLoading(true);
            setError(null);
            await bankService.createBank(bank);
            await fetchBanks();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/bank`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBanks, router]);

    const updateBank = useCallback(async (bank: BankFormData) => {
        try {
            setLoading(true);
            setError(null);
            await bankService.updateBank(bank.id || '', bank);
            await fetchBanks();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/bank`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBanks, router]);

    const deleteBank = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await bankService.deleteBank(id);
            await fetchBanks();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/finance/data/bank`);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchBanks, router]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    return {
        banks,
        selectedBank,
        loading,
        error,
        fetchBanks,
        fetchBankById,
        fetchBanksByBrandId,
        createBank,
        updateBank,
        deleteBank,
    };
};