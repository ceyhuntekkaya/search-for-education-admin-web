import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    Home,
    UserCog,
    Mail,
    HelpCircle, LucideIcon
} from 'lucide-react';
import {Department, Permission, Role} from "@/types/auth";

export interface MenuItem {
    title: string;
    path: string;
    icon?: LucideIcon;
    requiredPermissions?: Permission[];
    requiredDepartments?: Department[];
    requiredRoles?: Role[];
    children?: MenuItem[];
    parent?: MenuItem;
}

export interface RouteConfig {
    menuItems: MenuItem[];
}

export const adminRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Ana Sayfa',
            path: '/admin',
            icon: LayoutDashboard,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
            requiredRoles: ['ADMIN'],
        },
        {
            title: 'Siparişler',
            path: '/admin/orders',
            icon: Settings,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
            requiredRoles: ['ADMIN'],
        },
        {
            title: 'Teklifler',
            path: '/admin/offers',
            icon: Settings,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
            requiredRoles: ['ADMIN'],
        },
        {
            title: 'Sevkiyatlar',
            path: '/admin/deliveries',
            icon: Settings,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
            requiredRoles: ['ADMIN'],
        },
        {
            title: 'Müşteriler',
            path: '/admin/customers',
            icon: LayoutDashboard,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
            requiredRoles: ['ADMIN'],
        },


        {
            title: 'Ayarlar',
            path: '/admin/settings',
            icon: Settings,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
            requiredRoles: ['ADMIN'],
            children: [
                {
                    title: 'Kullanıcılar',
                    path: '/admin/users',
                    icon: Users,
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['MANAGEMENT'],
                    requiredRoles: ['ADMIN'],

                },
                {
                    title: 'Tedarikçiler',
                    path: '/admin/settings/suppliers',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Nakliye Firmaları',
                    path: '/admin/settings/transportation-companies',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: [ 'SALES', 'MANAGEMENT'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Araçlar',
                    path: '/admin/settings/vehicles',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: [ 'SALES', 'MANAGEMENT'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Şoförler',
                    path: '/admin/settings/vehicle-drivers',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['SALES', 'MANAGEMENT'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Teklif Metni',
                    path: '/admin/settings/offer-text',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },

            ]
        }
        ,
        {
            title: 'Finans',
            path: '/admin/finance',
            icon: Users,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING',  'MANAGEMENT', 'FINANCE'],
            requiredRoles: ['ADMIN'],
            children: [
                {
                    title: 'Muavin',
                    path: '/admin/finance/muavin',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Cari',
                    path: '/admin/finance/cari',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Banka Haraket',
                    path: '/admin/finance/banka-haraket',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Finans Verisi',
                    path: '/admin/finance/report',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Banka İşlem',
                    path: '/admin/finance/banka-islem',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },







                {
                    title: 'Banka Listesi',
                    path: '/admin/finance/data/bank',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Çek işlemleri',
                    path: '/admin/finance/data/check',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Kredi İşlemleri',
                    path: '/admin/finance/data/credit',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Kredi Kartı İşlemleri',
                    path: '/admin/finance/data/credit-card',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Teminat Mektubu İşlemleri',
                    path: '/admin/finance/data/letter',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },

                {
                    title: 'KMH İşlemleri',
                    path: '/admin/finance/data/additional-account',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Turuncu Liste',
                    path: '/admin/finance/data/payment-plan/payment',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Alacaklar',
                    path: '/admin/finance/data/payment-plan/credit',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },

                /*
                {
                    title: 'Banka Muavin',
                    path: '/admin/finance/banka-muavin',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },


                {
                    title: 'Fatura İşlemleri 120',
                    path: '/admin/1',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Borç Durumu 320',
                    path: '/admin/2',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Ödeme Listesi',
                    path: '/admin/3',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Tedarikçi Hesap Dökümü',
                    path: '/admin/4',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Çek Kart Takip',
                    path: '/admin/5',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Kasa Raporu',
                    path: '/admin/6',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Aktif / Pasif',
                    path: '/admin/7',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Banka İşlemleri',
                    path: '/admin/8',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Altın Takibi',
                    path: '/admin/9',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Kredi Kartları',
                    path: '/admin/10',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Stok',
                    path: '/admin/11',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Banka Haraketleri',
                    path: '/admin/12',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Gelir Gider Takip',
                    path: '/admin/13',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Kredi Kullanımı',
                    path: '/admin/14',
                    requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
                    requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE'],
                    requiredRoles: ['ADMIN'],
                }
*/
            ],
        },


    ]
};

export const appRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Ana Sayfa',
            path: '/app/orders',
            icon: Home,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE', 'EXTERNAL'],
            requiredRoles: ['USER'],
        }

    ]
};

export const publicRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Home',
            path: '/',
            icon: Home,

        },
        {
            title: 'About',
            path: '/about',
            icon: FileText
        },
        {
            title: 'Help',
            path: '/help',
            icon: HelpCircle
        }
    ]
};


export const transporterRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Ana Sayfa',
            path: '/transporter',
            icon: Home,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['TRANSPORTER'],
        },
        {
            title: 'Sevkiyatlar',
            path: '/transporter/tasks',
            icon: UserCog,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['TRANSPORTER'],
        },
        {
            title: 'Raporlar',
            path: '/transporter/reports',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['TRANSPORTER'],
        },
        {
            title: 'Ayarlar',
            path: '/transporter/setting',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['TRANSPORTER'],
        }
    ]
};

export const companyRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Ana Sayfa',
            path: '/company/orders',
            icon: Home,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['COMPANY'],
        }
    ]
};

export const getRoutesByRole = (roles: string[]): RouteConfig => {
    if (roles.includes('ADMIN')) return adminRoutes;
    if (roles.includes('USER')) return appRoutes;
    if (roles.includes('TRANSPORTER')) return transporterRoutes;
    if (roles.includes('COMPANY')) return companyRoutes;

    return publicRoutes;
};


export const isPathAllowed = (path: string, role: string[]): boolean => {
    const config = getRoutesByRole(role);
    const allPaths = config.menuItems.flatMap(item =>
        item.children
            ? [item.path, ...item.children.map(child => child.path)]
            : [item.path]
    );

    return allPaths.includes(path);
};


export const findMenuItemByPath = (path: string): MenuItem | null => {
    const allRoutes = [adminRoutes, appRoutes, transporterRoutes, companyRoutes, publicRoutes];

    for (const route of allRoutes) {
        const findItem = (items: MenuItem[]): MenuItem | null => {
            for (const item of items) {
                if (item.path === path) {
                    return item;
                }

                if (item.children) {
                    const found = findItem(item.children);
                    if (found) {
                        found.parent = item;
                        return found;
                    }
                }
            }
            return null;
        };

        const found = findItem(route.menuItems);
        if (found) return found;
    }

    return null;
};