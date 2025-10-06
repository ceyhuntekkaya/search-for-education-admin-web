import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {offerApprovalService} from "@/services/api/offer-approval-service";
import {OfferApprovalFormData, OfferApproval, OfferApprovalGroupDTO} from '@/types/offer';
import {showNotification} from "@/lib/notification";


interface UseOfferApprovalReturn {
    offerApprovals: OfferApproval[];
    offerNewApprovals: OfferApprovalGroupDTO[];
    selectedOfferApproval: OfferApproval | null;
    loading: boolean;
    error: Error | null;
    fetchOfferApprovals: (shouldRedirect?: boolean) => Promise<void>;
    fetchOfferApprovalById: (id: string) => Promise<void>;
    getOfferApprovalByOfferId: (offerApprovalId: string) => Promise<void>;
    createOfferApproval: (offerApproval: OfferApprovalFormData) => Promise<void>;
    updateOfferApproval: (offerApproval: OfferApprovalFormData) => Promise<void>;
    deleteOfferApproval: (id: string) => Promise<void>;
}

export const useOfferApprovals = (): UseOfferApprovalReturn => {


    const [offerNewApprovals, setOfferNewApprovals] = useState<OfferApprovalGroupDTO[]>([]);


    const [offerApprovals, setOfferApprovals] = useState<OfferApproval[]>([]);
    const [selectedOfferApproval, setSelectedOfferApproval] = useState<OfferApproval | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const fetchOfferApprovals = useCallback(async (shouldRedirect: boolean = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await offerApprovalService.getAllOfferApprovals();
            setOfferNewApprovals(data);

            if (shouldRedirect) {
                router.push('/admin/customers');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOfferApprovalById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await offerApprovalService.getOfferApprovalById(id);
            setSelectedOfferApproval(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getOfferApprovalByOfferId = useCallback(async (customerId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await offerApprovalService.getOfferApprovalByOfferId(customerId);
            setOfferApprovals(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createOfferApproval = useCallback(async (offerApproval: OfferApprovalFormData) => {
        try {
            setLoading(true);
            setError(null);
            await offerApprovalService.createOfferApproval(offerApproval);
            await fetchOfferApprovals();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOfferApprovals]);

    const updateOfferApproval = useCallback(async (offerApproval: OfferApprovalFormData) => {
        try {
            setLoading(true);
            setError(null);
            await offerApprovalService.updateOfferApproval(offerApproval.id || '', offerApproval);
            await fetchOfferApprovals();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOfferApprovals]);

    const deleteOfferApproval = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await offerApprovalService.deleteOfferApproval(id);
            await fetchOfferApprovals();
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOfferApprovals]);


    useEffect(() => {
        fetchOfferApprovals();
    }, [fetchOfferApprovals]);

    return {
        offerApprovals,
        selectedOfferApproval,
        fetchOfferApprovals,
        fetchOfferApprovalById,
        getOfferApprovalByOfferId,
        createOfferApproval,
        updateOfferApproval,
        deleteOfferApproval,
        loading,
        error,
        offerNewApprovals,
    };
};