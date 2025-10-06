import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        // Request body'sini al
        const body = await request.json();
        const { template, cityId, districtId } = body;

        // URLSearchParams kullanarak form data'sı oluştur
        const formData = new URLSearchParams();
        formData.append('template', template.toString());
        formData.append('cityId', cityId);
        formData.append('districtId', districtId);

        // Petrol Ofisi API'ye istek gönder
        const response = await axios.post('https://www.petrolofisi.com.tr/Fuel/Search',
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json',
                }
            }
        );

        // API yanıtını client'a ilet
        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Proxy hatası:', error);
        return NextResponse.json(
            { error: 'Proxy isteği başarısız oldu' },
            { status: 500 }
        );
    }
}