'use client';
import {useSql} from "@/hooks/use-sql";
import React, {useEffect, useState} from "react";
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

export default function MuavinPage() {
    const {muavinHesaplarDataList, fetchMuavinHesaplarData, loading, error} = useSql();
    const router = useRouter();
    const [selectedType, setSelectedType] = useState("tumu");

    const [formData, setFormData] = useState<SqlRequest>({
        database: "2025",
        code: "120",
        startAt: "2025-01-01",
        endAt: "2026-01-01"
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
            key: 'altHesapKodu',
            header: 'altHesapKodu',
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


    useEffect(() => {
        const sqlRequest: SqlRequest = {
            database: "2025",
            code: "120",
            startAt: "2025-01-01",
            endAt: "2025-12-01"
        };
        fetchMuavinHesaplarData(sqlRequest);
    }, []);


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
            database: "2025",
            code: "120",
            startAt: "2025-01-01",
            endAt: "2025-12-01"
        };
        fetchMuavinHesaplarData(sqlRequest);
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
                                            searchable={true}
                                        >
                                            <SelectTrigger className={ 'border-red-500' }>
                                                <SelectValue placeholder="Hesap seçin" />
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
                                            searchable={true}
                                        >
                                            <SelectTrigger className={ 'border-red-500' }>
                                                <SelectValue placeholder="Tür seçin" />
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
                    <DynamicTable columns={columns} data={muavinHesaplarDataList}/>
                </div>
            </div>


        </div>
    );
}