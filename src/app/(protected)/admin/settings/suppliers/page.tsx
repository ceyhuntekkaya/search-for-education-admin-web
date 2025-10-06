'use client';

import {useSuppliers} from "@/hooks/use-supplier";
import React, {useEffect, useState} from "react";
import DynamicTable from "@/components/ui/dynamic-table";
import {Column, RecordType} from "@/types/table";
import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {useFillingFacilities} from "@/hooks/use-filling-facilities";
import {useProducts} from "@/hooks/use-products";
import ProductForm from "@/components/form/product-form";
import FillingFacilityForm from "@/components/form/filling-facility-form";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import ProductPriceTrackingForm from "@/components/form/product-price-tracking-form";
import {useProductPriceTracking} from "@/hooks/use-product-price-tracking";
import LoadingComp from "@/components/ui/loading-comp";
import {Product, ProductPriceTracking, Supplier} from "@/types/supplier";
import {formatDate} from "@/utils/date-formater";
import ModalPanel from "@/components/ui/ModalPanel";

export default function SupplierPage() {
    const {
        suppliers,
        loading,
        fetchSuppliers
    } = useSuppliers();

    const {
        fillingFacilities,
        searchFillingFacilitiesBySupplier,
        createFillingFacility,
    } = useFillingFacilities();

    const {products, searchProductsBySupplier, createProduct} = useProducts();
    const {productPriceTracking, createProductPriceTracking} = useProductPriceTracking();
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const router = useRouter();
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isPriceModalOpen, setPriceIsModalOpen] = useState(false);
    const [isFillingFacilityModalOpen, setIsFillingFacilityModalOpen] = useState(false);
    const [searchProductPriceTracking, setSearchProductPriceTracking] = useState<ProductPriceTracking[]>([]);



    useEffect(() => {
        setSearchProductPriceTracking(productPriceTracking)
        if(selectedSupplier){
            setSearchProductPriceTracking(productPriceTracking.filter(pt => pt.product.supplier.id === selectedSupplier?.id || ''));
        }

    }, [productPriceTracking, selectedSupplier?.id]);

    const onClick = (id: string) => {
        searchFillingFacilitiesBySupplier(id);
        searchProductsBySupplier(id);
        setSelectedSupplier(suppliers.find(supplier => supplier.id === id) || null);
        setSearchProductPriceTracking(productPriceTracking.filter(pt => pt.product.supplier.id === id));
    }


    const updateData = (type: string) => {
        if (type === "product") {
            searchProductsBySupplier(selectedSupplier?.id || '');
        } else if (type === "fillingFacility") {
            searchFillingFacilitiesBySupplier(selectedSupplier?.id || '');
        } else if (type === "productPriceTracking") {
            setSearchProductPriceTracking(productPriceTracking.filter(pt => pt.product.supplier.id === selectedSupplier?.id || ''));
        }

    }

    const columnsProduct: Column<RecordType>[] = [
        {
            key: 'name',
            header: 'Ürün Adı',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/suppliers/${record.id}/products/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }

    ];

    const columnsFillingFacilities: Column<RecordType>[] = [
        {
            key: 'name',
            header: 'Dağıtım Merkezi Adı',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/suppliers/${record.id}/filling-facilities/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }

    ];

    const columnsProductPriceTracking: Column<RecordType>[] = [
        {
            key: 'product',
            header: 'ürün',
            sortable: true,
            render: (value,) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(value as Product).name}
                </div>
            )
        },
        {
            key: 'product',
            header: 'Tedarikçi',
            sortable: true,
            render: (value,) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(value as Product).supplier.name}
                </div>
            )
        },
        {
            key: 'price',
            header: 'Fiyat',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/suppliers/${record.id}/product-prices/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'announcementDate',
            header: 'Fiyat Tarihi',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/suppliers/${record.id}/product-prices/${record.id}`)}
                >
                    {formatDate(value as string)}
                </div>
            )
        }
    ];

    const columns: Column<RecordType>[] = [
        {
            key: 'name',
            header: 'Tedarikçi Adı',
            sortable: true,
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/suppliers/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'code',
            header: 'Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/settings/suppliers/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: '',
            header: '',
            render: (value, record) => (
                <button onClick={() => onClick(record.id + '')} className="text-blue-600 hover:underline">
                    TEDARİKÇİ SEÇ
                </button>
            )
        }
    ];


    useEffect(() => {
        fetchSuppliers();
    }, []);

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    const handleAdd = () => {
        router.push('/admin/settings/suppliers/add');
    };


    return (
        <div className="space-y-1">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Tedarikçi Ekle"
                />
            }/>
            <div className={"row"}>
                <div className="col-12 col-xl-8">
                    <div className="card card-body border-0 shadow mb-4">
                        <DynamicTable columns={columns} data={suppliers}
                                      searchable={false}/>
                    </div>
                    <div className="card card-body border-0 shadow mb-4 mb-xl-0">
                        <h2 className="h5 mb-4">

                            {
                                selectedSupplier ? `${selectedSupplier.name} Ürün Fiyatları` : "Tüm Ürün Fiyatları"
                            }

                        </h2>

                        <Button onClick={() => setPriceIsModalOpen(true)}
                                className={"mb-2"}>
                            <Plus className="w-4 h-4 mr-2"/>
                            Yeni Fiyat Gir
                        </Button>
                        <DynamicTable columns={columnsProductPriceTracking}
                                      data={searchProductPriceTracking}
                                      searchable={false}/>

                    </div>
                </div>
                <div className="col-12 col-xl-4">
                    <div className="card card-body border-0 shadow mb-4">
                        <h2 className="h5 mb-4">
                            {
                                selectedSupplier ? `${selectedSupplier.name} Ürünleri` : "Tüm Ürünler"
                            }
                        </h2>
                        <Button onClick={() => setIsProductModalOpen(true)} className={"mb-2"}>
                            <Plus className="w-4 h-4 mr-2"/>
                            Yeni Ürün Ekle
                        </Button>
                        <DynamicTable columns={columnsProduct} data={products}
                                      searchable={false}/>

                    </div>
                    <div className="card card-body border-0 shadow mb-4">
                        <h2 className="h5 mb-4">
                            {
                                selectedSupplier ? `${selectedSupplier.name} Dağıtım Merkezleri` : "Tüm Dağıtım Merkezleri"
                            }
                        </h2>
                        <Button onClick={() => setIsFillingFacilityModalOpen(true)} className={"mb-2"}>
                            <Plus className="w-4 h-4 mr-2"/>
                            Yeni Dağitim Merkezi Ekle
                        </Button>

                        <DynamicTable columns={columnsFillingFacilities} data={fillingFacilities}
                                      searchable={false}/>
                    </div>
                </div>
            </div>


            <ModalPanel
                isOpen={isProductModalOpen}
                onClose={() => {
                    setIsProductModalOpen(false)
                    updateData("product")
                }}
                title="Ürün"
                size={"large"}
            >
                <ProductForm onSubmit={createProduct} suppliers={suppliers} selectedSupplier={selectedSupplier}/>
            </ModalPanel>
            <ModalPanel
                isOpen={isFillingFacilityModalOpen}
                onClose={() => {
                    setIsFillingFacilityModalOpen(false)
                    updateData("fillingFacility")
                }}
                title="Dağıtım Merkezi"
                size={"large"}
            >
                <FillingFacilityForm onSubmit={createFillingFacility} suppliers={suppliers}
                                     selectedSupplier={selectedSupplier}
                                     products={products}/>
            </ModalPanel>
            <ModalPanel
                isOpen={isPriceModalOpen}
                onClose={() => {
                    setPriceIsModalOpen(false)
                    updateData("productPriceTracking")
                }}
                title="Fiyat Takibi"
                size={"large"}
            >
                <ProductPriceTrackingForm onSubmit={createProductPriceTracking}
                                          fillingFacilities={fillingFacilities}
                                          products={products}/>
            </ModalPanel>

        </div>
    );
};