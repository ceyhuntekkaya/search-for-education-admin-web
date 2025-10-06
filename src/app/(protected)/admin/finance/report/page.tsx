'use client';
import {useSql} from "@/hooks/use-sql";
import React, {useEffect, useState} from "react";
import {DataByCode, GroupDataByCode, SqlRequest} from "@/types/sql-type";
import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import {useRouter} from "next/navigation";
import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {formatNumberToMoney} from "@/utils/base-formatter";
import LoadingComp from "@/components/ui/loading-comp";
import ModalPanel from "@/components/ui/ModalPanel";

export default function FinanceReportPage() {
    const {dataByCodeDataList, fetchDataByCode, loading, error, fetchDataAll} = useSql();
    const router = useRouter();

    const today = new Date();
    const yearEnd = today.getFullYear();
    const monthEnd = String(today.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arasıdır
    const dayEnd = String(today.getDate()).padStart(2, '0');
    const formattedDateEnd = `${yearEnd}-${monthEnd}-${dayEnd}`;
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const yearStart = oneWeekAgo.getFullYear();
    const monthStart = String(oneWeekAgo.getMonth() + 1).padStart(2, '0');
    const dayStart = String(oneWeekAgo.getDate()).padStart(2, '0');
    const formattedDateStart = `${yearStart}-${monthStart}-${dayStart}`;
    const [sumValuesObject, setSumValuesObject] = useState({borc: 0, alacak: 0, borcBakiye: 0, alacakBakiye: 0});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupDataByCode, setGroupDataByCode] = useState<GroupDataByCode[]>([]);

    const [isDetail, setIsDetail] = useState(false);
    const [selectedSubCode, setSelectedSubCode] = useState<GroupDataByCode | null>(null);

    const [formData, setFormData] = useState<SqlRequest>({
        database: "2025",
        code: "120",
        startAt: formattedDateStart,
        endAt: formattedDateEnd
    });

    const hesapKod = [
        {
            id: "100",
            name: "Kasa"
        },
        {
            id: "101",
            name: "Alınan Çekler"
        },
        {
            id: "102",
            name: "Bankalar"
        }, {
            id: "103",
            name: "Verilen Çekler ve Ödeme Emirleri (-)"
        },
        {
            id: "108",
            name: "Diğer Hazır Değerler"
        },
        {
            id: "120",
            name: "Alıcılar"
        }, {
            id: "300",
            name: "Banka Kredileri"
        },
        {
            id: "309",
            name: "Diğer Mali Borçlar"
        },
        {
            id: "320",
            name: "Satıcılar"
        }, {
            id: "321",
            name: "Borç Senetleri"
        },
        {
            id: "400",
            name: "Banka Kredileri"
        },
        {
            id: "0",
            name: "Tümü"
        }
    ]

    const columns: Column<RecordType>[] = [

        {
            key: 'altHesapKodu',
            header: 'Kod',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'altHesapAdi',
            header: 'altHesapAdi',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'tarih',
            header: 'tarih',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'belgeNo',
            header: 'belgeNo',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'aciklama',
            header: 'aciklama',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'borc',
            header: 'borc',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'alacak',
            header: 'alacak',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'borcBakiye',
            header: 'borcBakiye',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'alacakBakiye',
            header: 'alacakBakiye',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'durum',
            header: 'durum',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },

    ];

    const modalColumns: Column<RecordType>[] = [
        {
            key: 'tarih',
            header: 'tarih',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'belgeNo',
            header: 'belgeNo',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'aciklama',
            header: 'aciklama',
            sortable: true,
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'borc',
            header: 'borc',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'alacak',
            header: 'alacak',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'borcBakiye',
            header: 'borcBakiye',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'alacakBakiye',
            header: 'alacakBakiye',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        }
    ];

    /*
      {
                key: 'hesapKodu',
                header: 'hesapKodu',
                sortable: true,
                render: (value) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600">
                        {value as string}
                    </div>
                )
            },
            {
                key: 'hesapAdi',
                header: 'hesapAdi',
                sortable: true,
                render: (value) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600">
                        {value as string}
                    </div>
                )
            },
     */
    const groupColumns: Column<RecordType>[] = [
        {
            key: 'altHesapKodu',
            header: 'Kod',
            sortable: true,
            render: (value, record) => (
                <div onClick={() => {
                    setIsModalOpen(true)
                    setSelectedSubCode(record as GroupDataByCode)
                }}
                     className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'altHesapAdi',
            header: 'Hesap',
            sortable: true,
            render: (value, record) => (
                <div onClick={() => {
                    setIsModalOpen(true)
                    setSelectedSubCode(record as GroupDataByCode)
                }}
                     className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'toplamBorcBakiye',
            header: 'borcBakiye',
            render: (value, record) => (
                <div onClick={() => {
                    setIsModalOpen(true)
                    setSelectedSubCode(record as GroupDataByCode)
                }}
                     className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'toplamAlacakBakiye',
            header: 'alacakBakiye',
            render: (value, record) => (
                <div onClick={() => {
                    setIsModalOpen(true)
                    setSelectedSubCode(record as GroupDataByCode)
                }}
                     className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
        {
            key: 'count',
            header: 'Kayıt',
            render: (value, record) => (
                <div onClick={() => {
                    setIsModalOpen(true)
                    setSelectedSubCode(record as GroupDataByCode)
                }}
                     className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },

        {
            key: 'durum',
            header: 'durum',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {formatNumberToMoney(value as number)}
                </div>
            )
        },
    ];

    function sumValues() {
        return dataByCodeDataList.reduce((toplam, item) => {
            toplam.borc += item.borc || 0;
            toplam.alacak += item.alacak || 0;
            toplam.borcBakiye += item.borcBakiye || 0;
            toplam.alacakBakiye += item.alacakBakiye || 0;
            return toplam;
        }, {borc: 0, alacak: 0, borcBakiye: 0, alacakBakiye: 0});
    }

    useEffect(() => {
        if (dataByCodeDataList) {
            setSumValuesObject(sumValues());
        }
    }, [dataByCodeDataList]);


    useEffect(() => {
        fetchDataByCode(formData);
        setGroupDataByCode(groupAndSumAccountData(dataByCodeDataList));
    }, []);

    useEffect(() => {
        if (dataByCodeDataList && Array.isArray(dataByCodeDataList) && dataByCodeDataList.length > 0) {
            setGroupDataByCode(groupAndSumAccountData(dataByCodeDataList));
        } else {
            setGroupDataByCode([]);
        }
    }, [dataByCodeDataList]);

    const handleAdd = () => {
        router.push('/admin/offers/add');
    };

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-700">{error.message}</p>
            </div>
        );
    }


    const handleChange = <T extends keyof SqlRequest>(
        name: T,
        value: SqlRequest[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const sqlRequest: SqlRequest = {
            database: formData.database,
            code: formData.code,
            startAt: formData.startAt,
            endAt: formData.endAt,
        };
        if(formData.code === "0") {
            fetchDataAll(sqlRequest);
        }
        fetchDataByCode(sqlRequest);

    };

    function groupAndSumAccountData(data: DataByCode[]): GroupDataByCode[] {
        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            return [];
        }
        // altHesapKodu'na göre gruplama için Map kullanıyoruz
        const groupedMap = new Map<string, GroupDataByCode>();

        data.forEach((item) => {
            const key = item.altHesapKodu;

            if (groupedMap.has(key)) {
                // Eğer bu altHesapKodu zaten varsa, toplamları güncelle
                const existing = groupedMap.get(key)!;
                existing.toplamBorc += item.borc;
                existing.toplamAlacak += item.alacak;
                existing.toplamBorcBakiye += item.borcBakiye;
                existing.toplamAlacakBakiye += item.alacakBakiye;
                existing.durum = item.durum;
                existing.count += 1;
            } else {
                // Yeni bir grup oluştur
                groupedMap.set(key, {
                    hesapKodu: item.hesapKodu,
                    hesapAdi: item.hesapAdi,
                    altHesapKodu: item.altHesapKodu,
                    altHesapAdi: item.altHesapAdi,
                    toplamBorc: item.borc,
                    toplamAlacak: item.alacak,
                    toplamBorcBakiye: item.borcBakiye,
                    toplamAlacakBakiye: item.alacakBakiye,
                    durum: item.durum,
                    count: 1,
                });
            }
        });

        return Array.from(groupedMap.values());
    }

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                />
            }/>

            <div>
                <div className="p-6 pt-0 pb-0" style={{maxWidth: 'calc(100vw - 100px)'}}>
                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-10 gap-4 mt-4 p-3">

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`contractType-sort`}
                                            checked={isDetail}
                                            onChange={() => setIsDetail(!isDetail)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <Label
                                            htmlFor={`contractType-sort`}
                                            className="text-sm text-gray-700"
                                        >
                                            Detaylı Liste
                                        </Label>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="codeSelect">Hesap Kodu</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                handleChange('code', value as string);
                                            }}
                                            value={formData.code ?? ""}
                                        >
                                            <SelectTrigger className={'border-red-500'}>
                                                <SelectValue placeholder="Hesap seçin"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                {hesapKod.map(code => (
                                                    <SelectItem key={code.id} value={code.id}>
                                                        {code.name}
                                                    </SelectItem>
                                                ))}
                                                    </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="approvalDate">Başlangıç Tarihi</Label>
                                        <Input
                                            type="date"
                                            id="approvalDate"
                                            value={formData.startAt}
                                            onChange={(e) => {
                                                handleChange('startAt', e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="approvalDate">Bitiş Tarihi</Label>
                                        <Input
                                            type="date"
                                            id="approvalDate"
                                            value={formData.endAt}
                                            onChange={(e) => {
                                                handleChange('endAt', e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2 mt-4">
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                            FİTRELE
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div>
                <div className="p-6 pt-0">
                    {
                        isDetail ?
                            <DynamicTable columns={columns} data={dataByCodeDataList}/>
                            :
                            <DynamicTable columns={groupColumns} data={groupDataByCode}/>
                    }

                </div>

                <div className="p-6 pt-0">
                    <div><b>TOPLAM BORÇ:</b> {formatNumberToMoney(sumValuesObject?.borc)} TL</div>
                    <div><b>TOPLAM ALACAK:</b> {formatNumberToMoney(sumValuesObject?.alacak)} TL</div>
                    <div><b>TOPLAM BORÇ BAKİYE: </b>{formatNumberToMoney(sumValuesObject?.borcBakiye)} TL</div>
                    <div><b>TOPLAM ALACAK BAKİYE:</b> {formatNumberToMoney(sumValuesObject?.alacakBakiye)} TL</div>
                </div>
            </div>

            {
                selectedSubCode &&
                <ModalPanel
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedSubCode(null)
                    }}
                    title={`${selectedSubCode.altHesapKodu} - ${selectedSubCode.altHesapAdi}`}
                    size={"large"}
                >
                    <DynamicTable columns={modalColumns}
                                  data={dataByCodeDataList.filter(item => item.altHesapKodu === selectedSubCode.altHesapKodu)}/>
                </ModalPanel>
            }
        </div>
    );
}