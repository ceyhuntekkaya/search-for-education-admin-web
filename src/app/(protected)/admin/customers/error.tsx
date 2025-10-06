'use client';

import { useEffect } from 'react';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
                Bir hata oluştu
            </h2>
            <p className="text-gray-600 mb-4">
                {error.message || 'Beklenmeyen bir hata oluştu'}
            </p>
            {error.digest && (
                <p className="text-sm text-gray-500 mb-4">
                    Hata Kodu: {error.digest}
                </p>
            )}
            <button
                onClick={reset}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                Tekrar Dene
            </button>
        </div>
    );
}