export enum ActionType {
    CREATE = 'CREATE',
    LIST = 'LIST',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    OTHER = 'OTHER'
}

export enum ECity {
    ADANA = "ADANA",
    ADIYAMAN = "ADIYAMAN",
    AFYONKARAHISAR = "AFYONKARAHISAR",
    AGRI = "AGRI",
    AKSARAY = "AKSARAY",
    AMASYA = "AMASYA",
    ANKARA = "ANKARA",
    ANTALYA = "ANTALYA",
    ARDAHAN = "ARDAHAN",
    ARTVIN = "ARTVIN",
    AYDIN = "AYDIN",
    BALIKESIR = "BALIKESIR",
    BATMAN = "BATMAN",
    BAYBURT = "BAYBURT",
    BILECIK = "BILECIK",
    BINGOL = "BINGOL",
    BITLIS = "BITLIS",
    BOLU = "BOLU",
    BURDUR = "BURDUR",
    BURSA = "BURSA",
    CANAKKALE = "CANAKKALE",
    CANKIRI = "CANKIRI",
    CORUM = "CORUM",
    DENIZLI = "DENIZLI",
    DIYARBAKIR = "DIYARBAKIR",
    DUZCE = "DUZCE",
    EDIRNE = "EDIRNE",
    ELAZIG = "ELAZIG",
    ERZINCAN = "ERZINCAN",
    ERZURUM = "ERZURUM",
    ESKISEHIR = "ESKISEHIR",
    GAZIANTEP = "GAZIANTEP",
    GIRESUN = "GIRESUN",
    GUMUSHANE = "GUMUSHANE",
    HAKKARI = "HAKKARI",
    HATAY = "HATAY",
    IGDIR = "IGDIR",
    ISPARTA = "ISPARTA",
    ISTANBUL = "ISTANBUL",
    IZMIR = "IZMIR",
    KAHRAMANMARAS = "KAHRAMANMARAS",
    KARABUK = "KARABUK",
    KARAMAN = "KARAMAN",
    KARS = "KARS",
    KASTAMONU = "KASTAMONU",
    KAYSERI = "KAYSERI",
    KILIS = "KILIS",
    KIRIKKALE = "KIRIKKALE",
    KIRKLARELI = "KIRKLARELI",
    KIRSEHIR = "KIRSEHIR",
    KOCAELI = "KOCAELI",
    KONYA = "KONYA",
    KUTAHYA = "KUTAHYA",
    MALATYA = "MALATYA",
    MANISA = "MANISA",
    MARDIN = "MARDIN",
    MERSIN = "MERSIN",
    MUGLA = "MUGLA",
    MUS = "MUS",
    NEVSEHIR = "NEVSEHIR",
    NIGDE = "NIGDE",
    ORDU = "ORDU",
    OSMANIYE = "OSMANIYE",
    RIZE = "RIZE",
    SAKARYA = "SAKARYA",
    SAMSUN = "SAMSUN",
    SANLIURFA = "SANLIURFA",
    SIIRT = "SIIRT",
    SINOP = "SINOP",
    SIVAS = "SIVAS",
    SIRNAK = "SIRNAK",
    TEKIRDAG = "TEKIRDAG",
    TOKAT = "TOKAT",
    TRABZON = "TRABZON",
    TUNCELI = "TUNCELI",
    USAK = "USAK",
    VAN = "VAN",
    YALOVA = "YALOVA",
    YOZGAT = "YOZGAT",
    ZONGULDAK = "ZONGULDAK"
}


export enum EDeliveryStatus {

    ASSIGNED    = 'ASSIGNED',
    STARTED    = 'STARTED',
    CONTINUING   = 'CONTINUING',
    PROBLEM   = 'PROBLEM',
    PENDING  = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    APPROVED = 'APPROVED',
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
}

export enum ELogOperation {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    CREATE = 'CREATE',
    DELETE = 'DELETE',
    UPDATE  = 'UPDATE',
    START = 'START',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    COMPLETE = 'COMPLETE',
    END = 'END',
    NEW = 'NEW',
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
    CHANGE = 'CHANGE',
}

export enum ELogType {
    INFO,
    ERROR
}

export enum EMediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO   = 'AUDIO',
    DOCUMENT = 'DOCUMENT',
    PDF = 'PDF',
    OTHER = 'OTHER'
}

export enum EOfferStatus {
    NEW = 'NEW',
    PENDING = 'PENDING',
    PAUSED = 'PAUSED',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    CONTRACT = 'CONTRACT',
    STARTED = 'STARTED',
    COMPLETED = 'COMPLETED',
    ISSUE = 'ISSUE',
    CANCELLED = 'CANCELLED',
    INVOICED = 'INVOICED',
}


export enum EOfferApprovalStatus {
    NEW = 'NEW',
    APPROVED = 'APPROVED',
    ISSUE = 'ISSUE',
    CANCELLED = 'CANCELLED',
}

export enum EProductType {
    GASOLINE = 'GASOLINE',
    DIESEL = 'DIESEL',
    ENGINE_OIL = 'ENGINE_OIL',

}

export enum EStatus {
    ACTIVE = 'ACTIVE',
    PASSIVE = 'PASSIVE',
    DELETED = 'DELETED',
    WAITING = 'WAITING',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    IN_PROGRESS = 'IN_PROGRESS',
    NOT_STARTED = 'NOT_STARTED',
    PENDING = 'PENDING',
    SUSPENDED = 'SUSPENDED',
    WORKING = 'WORKING',
    NEW = 'NEW',
    FINISHED = 'FINISHED',
}

export enum EOrderStateStage {
    TEKLIF = 'TEKLIF',
    MUSTERI = 'MUSTERI',
    SEVKIYAT = 'SEVKIYAT',
}




export enum EUserAuthorized {
    DELETE = 'DELETE',
}

export enum EVehicleType {
    TRUCK = 'TRUCK',
    TRAILER = 'TRAILER',
    TANKER = 'TANKER',
    SEMI_TRAILER = 'SEMI_TRAILER',
}


export enum ECapacityUnits {
    LT = 'LT',
    M3 = 'M3',
    KG =  'KG',
    TON =  'TON'
}



export enum EInfoStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}







