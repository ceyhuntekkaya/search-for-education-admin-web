'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import UserDetailPage from '@/components/detail/user-detail';
import {useUsers} from '@/hooks/use-user';
import PageHeader from "@/components/layout/page-header";


export default function UserDetail() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        selectedUser,
        fetchUserById,
        deleteUser,
        resetUserPassword,
        loading: userLoading
    } = useUsers();

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                setError(null);
                await fetchUserById(userId);
            } catch (err) {
                console.error('Error loading user:', err);
                setError('Kullanıcı yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadUser();
        }
    }, [userId, fetchUserById]);

    const handleEdit = () => {
        router.push(`/admin/users/edit/${userId}`);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        if (window.confirm(`${selectedUser.name} ${selectedUser.lastName} kullanıcısını silmek istediğinizden emin misiniz?`)) {
            try {
                setLoading(true);
                await deleteUser(userId);
                router.push('/admin/users');
            } catch (error) {
                console.error('Kullanıcı silinirken hata oluştu:', error);
                setError('Kullanıcı silinirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser) return;

        const newPassword = prompt('Lütfen yeni şifreyi girin:');
        if (!newPassword) return;

        try {
            setLoading(true);
            await resetUserPassword(userId, newPassword);
            alert('Şifre sıfırlama başarılı.');
        } catch (error) {
            console.error('Şifre sıfırlanırken hata oluştu:', error);
            setError('Şifre sıfırlanırken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = true;
    const isCurrentUser = false;

    const isLoading = loading || userLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Hata</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => router.push('/admin/users')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Kullanıcı Listesine Dön
                </button>
            </div>
        );
    }

    if (!selectedUser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Kullanıcı Bulunamadı</h2>
                <p className="text-gray-600 mb-6">İstenen kullanıcı bilgisi bulunamadı veya silinmiş olabilir.</p>
                <button
                    onClick={() => router.push('/admin/users')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Kullanıcı Listesine Dön
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <PageHeader/>
            <UserDetailPage
                user={selectedUser}
                isLoading={isLoading}
                onEdit={isAdmin || isCurrentUser ? handleEdit : undefined}
                onDelete={isAdmin && !isCurrentUser ? handleDelete : undefined}
                onResetPassword={isAdmin ? handleResetPassword : undefined}
            /></div>
    );
}