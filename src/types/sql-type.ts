// MuavinHesaplarData.ts
import {DatabaseObject} from "@/types/base";
import {RecordType} from "@/types/table";

export interface MuavinHesaplarData extends DatabaseObject {
    hesapKodu: string;
    hesapAdi: string;
    altHesapKodu: string;
    altHesapAdi: string;
    tarih: string;
    belgeNo: string;
    aciklama: string;
    borc: number;
    alacak: number;
    borcBakiye: number;
    alacakBakiye: number;
}

export interface DataByCode extends RecordType {
    hesapKodu: string;
    hesapAdi: string;
    altHesapKodu: string;
    altHesapAdi: string;
    tarih: string;
    belgeNo: string;
    aciklama: string;
    borc: number;
    alacak: number;
    borcBakiye: number;
    alacakBakiye: number;
}

export interface GroupDataByCode extends RecordType {
    hesapKodu: string;
    hesapAdi: string;
    altHesapKodu: string;
    altHesapAdi: string;
    toplamBorc: number;
    toplamAlacak: number;
    toplamBorcBakiye: number;
    toplamAlacakBakiye: number;
    count: number;
}


// MusteriCariKartHareketleriData.ts
export interface MusteriCariKartHareketleriData extends DatabaseObject {
    hesapAdi: string;
    hesapKodu: string;
    fisTarihi: string;
    tur: string;
    fisNo: string;
    yevNo: string;
    evrakTarihi: Date; // TypeScript'te de Date olarak kullanılabilir
    seri: string;
    evrakNo: string;
    vergiNo: string;
    aciklama: string;
    borcTutari: number;
    alacakTutari: number;
    bakiye: string;
    bA: string;
    sube: string;
    masrafMerkezi: string;
    belgeTuru: string;
    belgeTuruAciklamasi: string;
    urunMu: boolean;
    musteriMi: boolean;
    tedarikciMi: boolean;
}

export interface SqlRequest {
    database: string;
    code: string;
    startAt: string;
    endAt: string;
}


// Yevmiye tablosundan banka işlemleri için tip
export interface BankaIslemi extends DatabaseObject {
    islemTarihi: Date;
    hesapAdi: string;
    hesapKodu: string;
    aciklama: string;
    evrakNo: string;
    seriNo: string;
    borc: number;
    alacak: number;
    evrakTarihi: Date;
    vergiNo: string;
    belgeTuruAciklamasi: string;
}

// BankaServis_Hareket tablosundan banka işlemleri için tip
export interface BankaServisHareketi extends DatabaseObject {
    hesapAdi: string;
    hesapKodu: string;
    evrakNo: string;
    aciklama: string;
    evrakTarihi: Date;
    islemTarihi: Date;
    belgeTuruAciklamasi: string;
    borc: number;
    alacak: number;
    seriNo: string;
    vergiNo: string;
}

// spMuavin prosedürü ile alınan banka işlemleri için tip
export interface BankaMuavinIslemi extends DatabaseObject {
    islemTarihi: Date;
    hesapAdi: string;
    hesapKodu: string;
    aciklama: string;
    evrakNo: string;
    seriNo: string;
    borc: number;
    alacak: number;
    borcBakiye: number;
    alacakBakiye: number;
    evrakTarihi: Date;
}