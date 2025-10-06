import { useState, useCallback, useEffect } from 'react';
import {Offer, OfferFormData} from '@/types/offer';
import {offerService} from "@/services/api/offer-service";
import {useRouter} from 'next/navigation';
import {showNotification} from "@/lib/notification";
import {PoData} from "@/app/(protected)/admin/pet/po_data";
import {useAuthContext} from "@/contexts/auth-context";

interface UseOfferReturn {
    offers: Offer[];
    poDataList: PoData[];
    selectedOffer: Offer | null;
    loading: boolean;
    error: Error | null;
    fetchOffers: () => Promise<void>;
    fetchOfferById: (id: string) => Promise<void>;
    searchOffersByOffer: (name: string) => Promise<void>;
    createOffer: (offer: OfferFormData) => Promise<void>;
    updateOffer: (offer: OfferFormData) => Promise<void>;
    deleteOffer: (id: string) => Promise<void>;
    createPoData: (poDataList: PoData[]) => Promise<void>;
    getAllPoData: () => Promise<void>;
}

export const useOffers = (): UseOfferReturn => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [poDataList, setPoDataList] = useState<PoData[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();
    const { activeBrand } = useAuthContext();

    const fetchOffers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await offerService.getAllOffers();
            setOffers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOfferById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await offerService.getOfferById(id);
            setSelectedOffer(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchOffersByOffer = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await offerService.findByOrderId(name);
            setOffers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createOffer = useCallback(async (offer: OfferFormData) => {
        try {
            setLoading(true);
            setError(null);
            await offerService.createOffer(offer);
            await fetchOffers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/offers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOffers, router]);

    const updateOffer = useCallback(async (offer: OfferFormData) => {
        try {
            setLoading(true);
            setError(null);
            await offerService.updateOffer(offer.id || '', offer);
            await fetchOffers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/offers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOffers, router]);

    const deleteOffer = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await offerService.deleteOffer(id);
            await fetchOffers();
            showNotification.success('İşlem başarıyla tamamlandı!');
            router.push(`/admin/offers`)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [fetchOffers, router]);







    const createPoData = useCallback(async (poDataList: PoData[]) => {
        try {
            setLoading(true);
            setError(null);
            const data = await offerService.createPoData(poDataList, activeBrand?.id || '');
            setPoDataList(data);
            showNotification.success('İşlem başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllPoData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await offerService.getAllPoData();
            setPoDataList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    return {
        offers,
        selectedOffer,
        loading,
        error,
        fetchOffers,
        fetchOfferById,
        searchOffersByOffer,
        createOffer,
        updateOffer,
        deleteOffer,
        poDataList,
        createPoData,
        getAllPoData
    };
};