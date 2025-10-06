import { useState, useCallback } from 'react';
import {
    BankaIslemi, BankaMuavinIslemi,
    BankaServisHareketi, DataByCode,
    MuavinHesaplarData,
    MusteriCariKartHareketleriData,
    SqlRequest
} from '@/types/sql-type';
import {sqlService} from "@/services/sql-service";
import {BankAccount} from "@/types/finance";


interface UseSqlReturn {
    muavinHesaplarDataList: MuavinHesaplarData[];
    musteriCariKartHareketleriDataList: MusteriCariKartHareketleriData[];
    loading: boolean;
    error: Error | null;
    fetchMuavinHesaplarData: (sqlRequest:SqlRequest) => Promise<void>;
    fetchMusteriCariKartHareketleriData: (sqlRequest:SqlRequest) => Promise<void>;
    bankaIslemiList: BankaIslemi[];
    bankaServisHareketiList: BankaServisHareketi[];
    bankaMuavinIslemiList: BankaMuavinIslemi[];
    fetchBankaIslem: (sqlRequest:SqlRequest) => Promise<void>;
    fetchBankaHareket: (sqlRequest:SqlRequest) => Promise<void>;
    fetchBankList: (sqlRequest:SqlRequest) => Promise<void>;
    fetchBankaMuavin: (sqlRequest:SqlRequest) => Promise<void>;
    fetchDataByCode: (sqlRequest:SqlRequest) => Promise<void>;
    dataByCodeDataList: DataByCode[];
    fetchDataAll: (sqlRequest:SqlRequest) => Promise<void>;
    bankAccountList: BankAccount[];
}

export const useSql = (): UseSqlReturn => {
    const [muavinHesaplarDataList, setMuavinHesaplarDataList] = useState<MuavinHesaplarData[]>([]);
    const [musteriCariKartHareketleriDataList, setMusteriCariKartHareketleriDataList] = useState<MusteriCariKartHareketleriData[]>([]);



    const [bankaIslemiList, setBankaIslemiList] = useState<BankaIslemi[]>([]);
    const [bankaServisHareketiList, setBankaServisHareketiList] = useState<BankaServisHareketi[]>([]);
    const [bankaMuavinIslemiList, setBankaMuavinIslemiList] = useState<BankaMuavinIslemi[]>([]);

    const [bankAccountList, setBankAccountList] = useState<BankAccount[]>([]);


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [dataByCodeDataList, setDataByCodeDataList] = useState<DataByCode[]>([]);


    const fetchMuavinHesaplarData = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await sqlService.getMuavinHesaplarData(sqlRequest);



            setMuavinHesaplarDataList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMusteriCariKartHareketleriData = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await sqlService.getMusteriCariKartHareketleriData(sqlRequest);

            setMusteriCariKartHareketleriDataList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);









    const fetchBankaIslem = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await sqlService.getBankaIslem(sqlRequest);
            setBankaIslemiList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);
    const fetchBankaHareket = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await sqlService.getBankaHareket(sqlRequest);
            setBankaServisHareketiList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);
    const fetchBankaMuavin = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await sqlService.getBankaMuavin(sqlRequest);
            setBankaMuavinIslemiList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);



    const fetchDataByCode = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await sqlService.getDataByCode(sqlRequest);
            setDataByCodeDataList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchDataAll = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await sqlService.fetchDataAll(sqlRequest);
            setDataByCodeDataList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);



    const fetchBankList = useCallback(async (sqlRequest:SqlRequest) => {
        try {
            setLoading(true);
            setError(null);
            const data = await sqlService.getBankList(sqlRequest);
            setBankAccountList(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);


    return {
        muavinHesaplarDataList,
        musteriCariKartHareketleriDataList,
        loading,
        error,
        fetchMuavinHesaplarData,
        fetchMusteriCariKartHareketleriData,
        bankaIslemiList,
        bankaServisHareketiList,
        bankaMuavinIslemiList,
        fetchBankaIslem,
        fetchBankaHareket,
        fetchBankaMuavin,
        fetchDataByCode,
        dataByCodeDataList,
        fetchDataAll,
        fetchBankList,

        bankAccountList
    };
};