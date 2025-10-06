
export default function OfferApprovalDetailPages() {

}
/*'use client';

import React, { useState } from 'react';

interface SqlConverterProps {
    dataDetail:string | null;

}

const SqlConverter: React.FC<SqlConverterProps> = (
    dataDetail,
) => {
    const [csvData, setCsvData] = useState('');
    const [sqlOutput, setSqlOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Tarih dönüştürme fonksiyonu
    const convertDateToISO = (dateStr: string): string | null => {
        if (!dateStr || dateStr.trim() === '') return null;

        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
        return null;
    };

    // Sayı temizleme fonksiyonu
    const cleanNumber = (numStr: string): number | null => {
        if (!numStr || numStr.trim() === '') return null;

        // TL sembolü ve gereksiz karakterleri temizle
        let cleaned = numStr.replace(/₺/g, '').replace(/\s/g, '').trim();

        // Virgülü noktaya çevir (Türk format -> PostgreSQL format)
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');

        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    };

    // CSV'yi SQL'e dönüştür
    const convertToSql = () => {
        setIsLoading(true);

        try {
            // CSV satırlarını ayır
            const lines = csvData.split('\n').filter(line => line.trim().length > 0);

            if (lines.length === 0) {
                setSqlOutput('Veri bulunamadı!');
                setIsLoading(false);
                return;
            }

            const sqlValues: string[] = [];

            lines.forEach((line, index) => {
                // Tab ile ayır
                const columns = line.split('\t');
                console.log(index)

                if (columns.length < 10) return; // Eksik veri varsa atla

                const id = columns[0];
                const credit_id = columns[1];
                const installment_no = parseInt(columns[2]) || null;
                const credit_installment_date = convertDateToISO(columns[3]);
                const principal = cleanNumber(columns[4]);
                const interest = cleanNumber(columns[5]);
                const bsmv = cleanNumber(columns[6]);
                // columns[7] atlanacak
                const paid_amount = cleanNumber(columns[8]);
                const paid = cleanNumber(columns[9]);
                const remaining = cleanNumber(columns[10]);

                // SQL VALUES formatında hazırla
                const valueString = `  ('${id}', '${credit_id}', ${credit_installment_date ? `'${credit_installment_date}'` : 'NULL'}, ${installment_no || 'NULL'}, ${principal || 'NULL'}, ${interest || 'NULL'}, ${bsmv || 'NULL'}, ${paid_amount || 'NULL'}, ${paid || 'NULL'}, ${remaining || 'NULL'}, 'ACTIVE', 'ee74db9c-df45-4595-a3a7-49afeb018520', CURRENT_TIMESTAMP)`;

                sqlValues.push(valueString);
            });

            // Tam SQL sorgusunu oluştur
            const fullSQL = `INSERT INTO credit_installments (
    id,
    credit_id,
    credit_installment_date,
    installment_no,
    principal,
    interest,
    bsmv,
    paid_amount,
    paid,
    remaining,
    status,
    created_by_id,
    created_at
) VALUES
${sqlValues.join(',\n')};`;

            setSqlOutput(fullSQL);

        } catch (error) {
            setSqlOutput(`Hata oluştu: ${error}`);
        }

        setIsLoading(false);
    };

    // SQL'i panoya kopyala
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(sqlOutput);
            alert('SQL sorgusu panoya kopyalandı!');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            alert('Kopyalama başarısız!');
        }
    };

    // Verileri temizle
    const clearData = () => {
        setCsvData('');
        setSqlOutput('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        📊 CSV ➡️ SQL Dönüştürücü
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-700">
                                    CSV Verileri
                                </h2>
                                <button
                                    onClick={clearData}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    🗑️ Temizle
                                </button>
                            </div>

                            <textarea
                                value={csvData}
                                onChange={(e) => setCsvData(e.target.value)}
                                placeholder="CSV verilerinizi buraya yapıştırın... (Tab ile ayrılmış)"
                                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={convertToSql}
                                    disabled={!csvData.trim() || isLoading}
                                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? '⏳ Dönüştürülüyor...' : '🔄 SQL\'e Dönüştür'}
                                </button>
                            </div>

                            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                <h3 className="font-semibold mb-2">📋 Alan Eşlemeleri:</h3>
                                <ul className="space-y-1">
                                    <li>• <strong>1:</strong> id</li>
                                    <li>• <strong>2:</strong> credit_id</li>
                                    <li>• <strong>3:</strong> installment_no</li>
                                    <li>• <strong>4:</strong> credit_installment_date</li>
                                    <li>• <strong>5:</strong> principal</li>
                                    <li>• <strong>6:</strong> interest</li>
                                    <li>• <strong>7:</strong> bsmv</li>
                                    <li>• <strong>8:</strong> <span className="text-red-500">ATLANACAK</span></li>
                                    <li>• <strong>9:</strong> paid_amount</li>
                                    <li>• <strong>10:</strong> paid</li>
                                    <li>• <strong>11:</strong> remaining</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-700">
                                    SQL Sorgusu
                                </h2>
                                {sqlOutput && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        📋 Kopyala
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                <pre className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 overflow-auto">
                  {sqlOutput || 'SQL sorgusu buraya gelecek...'}
                </pre>
                            </div>

                            {sqlOutput && (
                                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                                    <h3 className="font-semibold mb-2">✅ Dönüştürme Başarılı!</h3>
                                    <p>• Tarihler PostgreSQL formatına dönüştürüldü</p>
                                    <p>• Türkçe sayı formatı düzeltildi</p>
                                    <p>• TL sembolleri temizlendi</p>
                                    <p>• Boş alanlar NULL yapıldı</p>
                                    <p className="font-semibold mt-2">
                                        📊 İşlenen kayıt sayısı: {sqlOutput.split('VALUES')[1]?.split(');').length - 1 || 0}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SqlConverter;

*/