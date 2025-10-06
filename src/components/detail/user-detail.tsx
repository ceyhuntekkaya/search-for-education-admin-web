'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Clock, User as UserIcon, Phone, Key, Shield, CheckCircle, XCircle} from 'lucide-react';
import {User} from '@/types/auth';
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface UserDetailProps {
    user: User;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onResetPassword?: () => void;
}

const UserDetailPage: React.FC<UserDetailProps> = ({
                                                       user,
                                                       isLoading = false,
                                                       onEdit,
                                                       onDelete,
                                                       onResetPassword,
                                                   }) => {
    const [activeTab, setActiveTab] = useState("details");

    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }




    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Detayı</h1>
                    <p className="text-gray-500">{user.username} ({user.name} {user.lastName})</p>
                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            Düzenle
                        </Button>
                    )}
                    {onResetPassword && (
                        <Button variant="outline" onClick={onResetPassword}>
                            Şifre Sıfırla
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="outline" onClick={onDelete}>
                            Sil
                        </Button>
                    )}
                </div>
            </div>

            {/* Basit Sekme Navigasyonu */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px space-x-8">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "details"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Kullanıcı Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("permissions")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "permissions"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Yetkiler ve Roller
                    </button>
                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "activity"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Hesap Aktiviteleri
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Kullanıcı Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kişisel Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <UserIcon className="h-6 w-6 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{user.name} {user.lastName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Kullanıcı Adı</p>
                                        <p className="font-medium">{user.username}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Mail</p>
                                        <p className="font-medium">{user.email || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <Phone className="h-6 w-6 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{user.mobilePhone || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Hesap Durumu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle
                                            className={`h-5 w-5 ${user.enabled ? 'text-green-500' : 'text-gray-300'}`}/>
                                        <span>Aktif</span>
                                    </div>
                                    <Badge
                                        className={user.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {user.enabled ? 'Evet' : 'Hayır'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Key
                                            className={`h-5 w-5 ${user.credentialsNonExpired ? 'text-green-500' : 'text-gray-300'}`}/>
                                        <span>Kimlik Bilgileri Geçerli</span>
                                    </div>
                                    <Badge
                                        className={user.credentialsNonExpired ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {user.credentialsNonExpired ? 'Evet' : 'Hayır'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <XCircle
                                            className={`h-5 w-5 ${user.accountNonLocked ? 'text-green-500' : 'text-red-500'}`}/>
                                        <span>Hesap Kilitli Değil</span>
                                    </div>
                                    <Badge
                                        className={user.accountNonLocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                        {user.accountNonLocked ? 'Evet' : 'Hayır'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Clock
                                            className={`h-5 w-5 ${user.accountNonExpired ? 'text-green-500' : 'text-gray-300'}`}/>
                                        <span>Hesap Süresi Geçerli</span>
                                    </div>
                                    <Badge
                                        className={user.accountNonExpired ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {user.accountNonExpired ? 'Evet' : 'Hayır'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Yetkiler ve Roller Sekmesi */}
                {activeTab === "permissions" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Roller</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {user.roleSet && user.roleSet.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {user.roleSet.map((role, index) => (
                                                <Badge key={index}
                                                       className="bg-blue-100 text-blue-800 text-sm py-1 px-2">
                                                    {typeof role === 'string' ? role : String(role)}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Rol bulunmamaktadır.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Departmanlar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {user.departmentSet && user.departmentSet.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {user.departmentSet.map((department, index) => (
                                                <Badge key={index}
                                                       className="bg-purple-100 text-purple-800 text-sm py-1 px-2">
                                                    {typeof department === 'string' ? department : String(department)}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Departman bulunmamaktadır.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Yetkiler</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {user.authoritySet && user.authoritySet.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {user.authoritySet.map((permission, index) => (
                                                <div key={index}
                                                     className="flex items-center p-2 bg-gray-50 rounded-md">
                                                    <Shield className="h-4 w-4 text-gray-500 mr-2"/>
                                                    <span className="text-sm">
                            {typeof permission === 'string' ? permission : String(permission)}
                          </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Yetki bulunmamaktadır.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Hesap Aktiviteleri Sekmesi */}
                {activeTab === "activity" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hesap Zaman Çizelgesi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex">
                                        <div className="mr-4 flex-shrink-0">
                                            <div
                                                className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                                                <UserIcon className="h-5 w-5"/>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Hesap Oluşturuldu</p>
                                            <p className="text-sm text-gray-500">{formatDate(user.createdAt || '')}</p>
                                        </div>
                                    </div>

                                    {user.lastLoginTime && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div
                                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600">
                                                    <Clock className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Son Giriş</p>
                                                <p className="text-sm text-gray-500">{formatDate(user.lastLoginTime)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {user.status === 'DELETED' && user.deletedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div
                                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
                                                    <XCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Hesap Silindi</p>
                                                <p className="text-sm text-gray-500">{formatDate(user.deletedAt)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {!user.accountNonLocked && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div
                                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-600">
                                                    <XCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Hesap Kilitlendi</p>
                                                <p className="text-sm text-gray-500">Hesap güvenlik nedeniyle kilitli
                                                    durumda.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Aktivasyon Durumu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    {user.activationCode ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Aktivasyon Kodu</span>
                                                <Badge className="bg-yellow-100 text-yellow-800">Onay Bekliyor</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Kullanıcı hesabını henüz aktifleştirmemiş. Aktivasyon kodu mevcut.
                                            </p>
                                            <div className="flex justify-end">
                                                <Button variant="outline" size="sm">
                                                    Aktivasyon Kodu Yeniden Gönder
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Aktivasyon Durumu</span>
                                                <Badge className="bg-green-100 text-green-800">Aktifleştirildi</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Kullanıcı hesabını aktifleştirmiş. Aktivasyon kodu kullanılmış.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailPage;