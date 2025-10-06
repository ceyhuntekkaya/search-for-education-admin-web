
type PetrolOfisiSearchParams = {
    template: number;
    cityId: string;
    districtId: string;
}

type PetrolOfisiResponse = {

    success: boolean;
    data: string; // veya daha spesifik bir tip
}

// Fonksiyonu export ederken "export function" şeklinde tanımlayın
export async function searchPetrolOfisi({
                                            template,
                                            cityId,
                                            districtId
                                        }: PetrolOfisiSearchParams): Promise<PetrolOfisiResponse> {
    try {
        const response = await fetch('/po/petrolOfisiProxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                template,
                cityId,
                districtId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Arama sırasında hata oluştu:', error);
        throw error;
    }
}