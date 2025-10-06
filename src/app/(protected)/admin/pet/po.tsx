'use client';

import React, {useEffect, useState} from 'react';
import {searchPetrolOfisi} from './api';
import {parsePoHtmlTable} from "@/app/(protected)/admin/pet/parsePoHtmlTable";
import {PoData} from "@/app/(protected)/admin/pet/po_data";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import {useOffers} from "@/hooks/use-offer";


interface POSearchComponentProps {
    handleUsePrice: (arg0: number, arg1: string) => void;
}


const POSearchComponent: React.FC<POSearchComponentProps> = ({
                                                                 handleUsePrice
                                                   }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState("");

    interface City {
        name: string;
        plate: string;
    }

    const cities: City[] = [
        {name: "Adana", plate: "01"},
        {name: "Adıyaman", plate: "02"},
        {name: "Afyon", plate: "03"},
        {name: "Ağrı", plate: "04"},
        {name: "Amasya", plate: "05"},
        {name: "Ankara", plate: "06"},
        {name: "Antalya", plate: "07"},
        {name: "Artvin", plate: "08"},
        {name: "Aydın", plate: "09"},
        {name: "Balıkesir", plate: "10"},
        {name: "Bilecik", plate: "11"},
        {name: "Bingöl", plate: "12"},
        {name: "Bitlis", plate: "13"},
        {name: "Bolu", plate: "14"},
        {name: "Burdur", plate: "15"},
        {name: "Bursa", plate: "16"},
        {name: "Çanakkale", plate: "17"},
        {name: "Çankırı", plate: "18"},
        {name: "Çorum", plate: "19"},
        {name: "Denizli", plate: "20"},
        {name: "Diyarbakır", plate: "21"},
        {name: "Edirne", plate: "22"},
        {name: "Elazığ", plate: "23"},
        {name: "Erzincan", plate: "24"},
        {name: "Erzurum", plate: "25"},
        {name: "Eskişehir", plate: "26"},
        {name: "Gaziantep", plate: "27"},
        {name: "Giresun", plate: "28"},
        {name: "Gümüşhane", plate: "29"},
        {name: "Hakkari", plate: "30"},
        {name: "Hatay", plate: "31"},
        {name: "Isparta", plate: "32"},
        {name: "İçel", plate: "33"},
        {name: "İstanbul", plate: "34"},
        {name: "İzmir", plate: "35"},
        {name: "Kars", plate: "36"},
        {name: "Kastamonu", plate: "37"},
        {name: "Kayseri", plate: "38"},
        {name: "Kırklareli", plate: "39"},
        {name: "Kırşehir", plate: "40"},
        {name: "Kocaeli", plate: "41"},
        {name: "Konya", plate: "42"},
        {name: "Kütahya", plate: "43"},
        {name: "Malatya", plate: "44"},
        {name: "Manisa", plate: "45"},
        {name: "K.Maraş", plate: "46"},
        {name: "Mardin", plate: "47"},
        {name: "Muğla", plate: "48"},
        {name: "Muş", plate: "49"},
        {name: "Nevşehir", plate: "50"},
        {name: "Niğde", plate: "51"},
        {name: "Ordu", plate: "52"},
        {name: "Rize", plate: "53"},
        {name: "Sakarya", plate: "54"},
        {name: "Samsun", plate: "55"},
        {name: "Siirt", plate: "56"},
        {name: "Sinop", plate: "57"},
        {name: "Sivas", plate: "58"},
        {name: "Tekirdağ", plate: "59"},
        {name: "Tokat", plate: "60"},
        {name: "Trabzon", plate: "61"},
        {name: "Tunceli", plate: "62"},
        {name: "Şanlıurfa", plate: "63"},
        {name: "Uşak", plate: "64"},
        {name: "Van", plate: "65"},
        {name: "Yozgat", plate: "66"},
        {name: "Zonguldak", plate: "67"},
        {name: "Aksaray", plate: "68"},
        {name: "Bayburt", plate: "69"},
        {name: "Karaman", plate: "70"},
        {name: "Kırıkkale", plate: "71"},
        {name: "Batman", plate: "72"},
        {name: "Şırnak", plate: "73"},
        {name: "Bartın", plate: "74"},
        {name: "Ardahan", plate: "75"},
        {name: "Iğdır", plate: "76"},
        {name: "Yalova", plate: "77"},
        {name: "Karabük", plate: "78"},
        {name: "Kilis", plate: "79"},
        {name: "Osmaniye", plate: "80"},
        {name: "Düzce", plate: "81"},
    ];


    useEffect(() => {
        const loadData = async () => {
            await getAllPoData()
        };
        loadData();
    }, []);


    const {poDataList, getAllPoData, createPoData} = useOffers();

    const handleSearch = async () => {
        setError(null);
        let tempData = [] as PoData[];
        try {
            setLoading(true);
            for (let i = 0; i < cities.length; i++) {
                setCityName(cities[i].name);
                const city = cities[i];
                const data = await searchPetrolOfisi({
                    template: 1,
                    cityId: city.plate,
                    districtId: ""
                });

                if (data) {
                    const resultTable = parsePoHtmlTable(data as unknown as string, city.name);
                    for (let i = 0; i < resultTable.length; i++) {
                        tempData = addUniquePoData(tempData, resultTable[i]);
                    }

                }
            }
            setLoading(false);
        } catch (error: unknown) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        await createPoData(tempData);
    };


    function addUniquePoData(dataArray: PoData[], newItem: PoData): PoData[] {
        const isDuplicate = dataArray.some(
            (item) => item.district === newItem.district && item.city === newItem.city
        );

        if (!isDuplicate) {
            dataArray.push(newItem);
        }

        return dataArray;
    }


    const poDataColumns: Column<RecordType>[] = [

        {
            key: 'city',
            header: 'İl',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'district',
            header: 'İlçe',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },

        {
            key: 'diesel',
            header: 'V/Max Diesel',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'diesel',
            header: '',
            render: (value) => (
                <button
                    onClick={()=>handleUsePrice(value as number, "pompa")}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    KULLAN
                </button>

            )
        }
    ];

    return (
        <div>
            <h5>Petrol Ofisi Fiyat Listesi</h5>
            {error && <div style={{color: 'red'}}>{error}</div>}


            {
                !loading && (
                    <div className="flex justify-end space-x-4">
                        <button type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 mb-2"
                                onClick={handleSearch}>
                            Güncel Verileri Tekrar Çek...
                        </button>
                    </div>
                )
            }




            {
                loading && (
                    <div className="flex items-center">
                        <svg
                            className="animate-spin h-5 w-5 mr-3 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="blue"
                                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-1h11a2.5 2.5 0 1 1-5 0h-6a2.5 2.5 0 0 1-5 0z"
                            />
                        </svg>
                        <span> Bu işlem tamamlanana kadar sayfayı kapatmayınız. Aksi durumda veriler kaydedilemeyecektir.  {cityName} </span>
                    </div>
                )
            }


            <DynamicTable columns={poDataColumns} data={poDataList}/>


        </div>
    );
}

export default POSearchComponent;