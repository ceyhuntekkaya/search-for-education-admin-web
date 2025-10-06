import api from "@/services/api/base-api";
import {
    BankaIslemi, BankaMuavinIslemi,
    BankaServisHareketi, DataByCode,
    MuavinHesaplarData,
    MusteriCariKartHareketleriData,
    SqlRequest
} from "@/types/sql-type";
import {BankAccount} from "@/types/finance";

class SqlService {

    private readonly baseUrl = '/sql';


    async getMuavinHesaplarData(request: SqlRequest): Promise<MuavinHesaplarData[]> {
        const response = await api.post<MuavinHesaplarData[]>(`${this.baseUrl}/muavin`, request);
        return response.data;
    }

    async getMusteriCariKartHareketleriData(request: SqlRequest): Promise<MusteriCariKartHareketleriData[]> {
        const response = await api.post<MusteriCariKartHareketleriData[]>(`${this.baseUrl}/cari`, request);
        return response.data;
    }



    async getBankaIslem(request: SqlRequest): Promise<BankaIslemi[]> {
        const response = await api.post<BankaIslemi[]>(`${this.baseUrl}/banka/islem`, request);
        return response.data;
    }
    async getBankaHareket(request: SqlRequest): Promise<BankaServisHareketi[]> {
        const response = await api.post<BankaServisHareketi[]>(`${this.baseUrl}/banka/haraket`, request);
        return response.data;
    }
    async getBankaMuavin(request: SqlRequest): Promise<BankaMuavinIslemi[]> {
        const response = await api.post<BankaMuavinIslemi[]>(`${this.baseUrl}/banka/muavin`, request);
        return response.data;
    }

    async getDataByCode(request: SqlRequest) {
        const response = await api.post<DataByCode[]>(`${this.baseUrl}/data/by-code`, request);
        return response.data;
    }

    async fetchDataAll(request: SqlRequest) {
        const response = await api.post<DataByCode[]>(`${this.baseUrl}/data/all`, request);
        return response.data;

    }


    async getBankList(request: SqlRequest): Promise<BankAccount[]> {
        const response = await api.post<BankAccount[]>(`${this.baseUrl}/bank/list`, request);
        return response.data;
    }


}

export const sqlService = new SqlService();
