'use client';

import React from 'react';
import {useRouter} from 'next/navigation';



export default function FinanceList() {
    const router = useRouter();



    return (
        <div className="bg-white rounded-lg shadow">

            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Verilere erişimde hata alınmaktadır.</h2>
                <p className="text-gray-600 mb-6">Sistem Yöneticisi İle İletişime Geçiniz.</p>
                <button
                    onClick={() => router.push('/admin')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Ana Sayfaya Geri Dön
                </button>
            </div>


        </div>
    );
}




