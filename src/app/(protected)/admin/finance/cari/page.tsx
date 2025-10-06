'use client';
import {useSql} from "@/hooks/use-sql";
import React, {useState} from "react";
import {SqlRequest} from "@/types/sql-type";
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
import LoadingComp from "@/components/ui/loading-comp";

export default function CariPage() {
    const {musteriCariKartHareketleriDataList, fetchMusteriCariKartHareketleriData, loading, error} = useSql();
    const router = useRouter();
    const [selectedType, setSelectedType] = useState("tumu");
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

    const [formData, setFormData] = useState<SqlRequest>({
        database: "2025",
        code: "120",
        startAt: formattedDateStart,
        endAt: formattedDateEnd
    });


    const hesapKod = [
        {
            id: "120",
            name: "Alıcılar"
        },
        {
            id: "320",
            name: "Tedarikçiler"
        },
        {
            id: "153",
            name: "Ticari Mallar"
        }
    ]

    const columns: Column<RecordType>[] = [
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
                    {value as string}
                </div>
            )
        },
        {
            key: 'alacak',
            header: 'alacak',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'borcBakiye',
            header: 'borcBakiye',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        },
        {
            key: 'alacakBakiye',
            header: 'alacakBakiye',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600">
                    {value as string}
                </div>
            )
        }
    ];


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
        fetchMusteriCariKartHareketleriData(sqlRequest);
    };

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}

                />
            }/>


            <div>
                <div className="p-6 pt-0 pb-0">


                    <Card>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-10 gap-4 mt-4 p-3">
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
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="codeSelect">Hesap Türü</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                setSelectedType(value as string);
                                            }}
                                            value={selectedType ?? ""}
                                        >
                                            <SelectTrigger className={'border-red-500'}>
                                                <SelectValue placeholder="Tür seçin"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                <SelectItem value={"tumu"}>
                                                    TÜMÜ
                                                </SelectItem>
                                                <SelectItem value={"borc"}>
                                                    BORÇ
                                                </SelectItem>
                                                <SelectItem value={"alacak"}>
                                                    ALACAK
                                                </SelectItem>
                                                    </SelectGroup>
                                            </SelectContent>
                                        </Select>
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
                    <DynamicTable columns={columns} data={musteriCariKartHareketleriDataList}/>
                </div>
            </div>


        </div>
    );
}