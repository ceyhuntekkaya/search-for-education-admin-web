import {FillingFacility, Product, ProductPriceTrackingFormData} from "@/types/supplier";
import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {NumberInput} from "@/components/ui/number-input";
import {Input} from "@/components/ui/input";

interface ProductPriceTrackingFormProps {
    onSubmit: (arg0: ProductPriceTrackingFormData) => void;
    fillingFacilities: FillingFacility[];
    products: Product[];
}

const CreateProductPriceTrackingForm: React.FC<ProductPriceTrackingFormProps> = ({
                                                                                     onSubmit,
                                                                                     fillingFacilities = [],
                                                                                     products = [],
                                                                                 }) => {
    const [formData, setFormData] = useState<ProductPriceTrackingFormData>({
        productId: '',
        price: 0,
        pumpPrice: 0,
        pumpDiscountRate: 0,
        distributorPrice: 0,
        distributorDiscountRate: 0,
        priceSource: 'supplier',
        purchaseDate: null,
        announcementDate: null,
        maturity: '',
        taxRate: 0,
        fillingFacilityId: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                ...formData
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Zorunlu alan kontrolleri
        if (!formData.productId) {
            newErrors.productId = 'Ürün seçimi zorunludur';
        }

        if (!formData.fillingFacilityId) {
            newErrors.fillingFacilityId = 'Dolum tesisi seçimi zorunludur';
        }

        if (formData.price < 0) {
            newErrors.price = 'Fiyat 0\'dan küçük olamaz';
        }

        if (formData.pumpPrice < 0) {
            newErrors.pumpPrice = 'Pompa fiyatı 0\'dan küçük olamaz';
        }

        if (formData.pumpDiscountRate < 0 || formData.pumpDiscountRate > 100) {
            newErrors.pumpDiscountRate = 'İndirim oranı 0-100 arasında olmalıdır';
        }

        if (formData.distributorPrice < 0) {
            newErrors.distributorPrice = 'Dağıtıcı fiyatı 0\'dan küçük olamaz';
        }

        if (formData.distributorDiscountRate < 0 || formData.distributorDiscountRate > 100) {
            newErrors.distributorDiscountRate = 'Dağıtıcı indirim oranı 0-100 arasında olmalıdır';
        }

        if (!formData.priceSource || formData.priceSource.trim() === '') {
            newErrors.priceSource = 'Fiyat kaynağı zorunludur';
        }



        if (formData.taxRate < 0 || formData.taxRate > 100) {
            newErrors.taxRate = 'Vergi oranı 0-100 arasında olmalıdır';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = <T extends keyof ProductPriceTrackingFormData>(
        name: T,
        value: ProductPriceTrackingFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Ürün Fiyat Takibi Oluştur</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ürün ve Dolum Tesisi Seçimi */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="product">Ürün *</Label>
                            <Select
                                onValueChange={(value) => handleChange('productId', value as string | null)}
                                value={formData.productId ?? ""}
                            >
                                <SelectTrigger className={errors.productId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Ürün seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {products.map(product => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.productId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.productId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fillingFacility">Dolum Tesisi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('fillingFacilityId', value as string | null)}
                                value={formData.fillingFacilityId ?? ""}
                            >
                                <SelectTrigger className={errors.fillingFacilityId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Dolum tesisi seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    {fillingFacilities.map(facility => (
                                        <SelectItem key={facility.id} value={facility.id}>
                                            {facility.name} (Kapasite: {facility.capacity} ton)
                                        </SelectItem>
                                    ))}
                                        </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.fillingFacilityId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.fillingFacilityId}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        {/* Fiyat Bilgileri */}

                        <div className="space-y-2">
                            <Label htmlFor="price">Fiyat *</Label>


                            <NumberInput
                                id="price"
                                name="price"
                                value={formData.price}
                                min="0"
                                step="0.01"
                                onChange={(value) => {
                                    handleChange('price', value)
                                }}
                                className={errors.price ? 'border-red-500' : ''}
                            />



                            {errors.price && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.price}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        {
                            /*


                        <div className="space-y-2">
                            <Label htmlFor="pumpPrice">Pompa Fiyatı *</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.pumpPrice.toFixed(2)}
                                onChange={(e) => handleChange('pumpPrice', parseFloat(e.target.value))}
                                className={errors.pumpPrice ? 'border-red-500' : ''}
                            />
                            {errors.pumpPrice && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.pumpPrice}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pumpDiscountRate">Pompa İndirim Oranı (%) *</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={formData.pumpDiscountRate}
                                onChange={(e) => handleChange('pumpDiscountRate', parseFloat(e.target.value))}
                                className={errors.pumpDiscountRate ? 'border-red-500' : ''}
                            />
                            {errors.pumpDiscountRate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.pumpDiscountRate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="distributorPrice">Dağıtıcı Fiyatı *</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.distributorPrice.toFixed(2)}
                                onChange={(e) => handleChange('distributorPrice', parseFloat(e.target.value))}
                                className={errors.distributorPrice ? 'border-red-500' : ''}
                            />
                            {errors.distributorPrice && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.distributorPrice}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="distributorDiscountRate">Dağıtıcı İndirim Oranı (%) *</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={formData.distributorDiscountRate}
                                onChange={(e) => handleChange('distributorDiscountRate', parseFloat(e.target.value))}
                                className={errors.distributorDiscountRate ? 'border-red-500' : ''}
                            />
                            {errors.distributorDiscountRate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.distributorDiscountRate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxRate">Vergi Oranı (%) *</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={formData.taxRate}
                                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                                className={errors.taxRate ? 'border-red-500' : ''}
                            />
                            {errors.taxRate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.taxRate}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                     */
                        }


                        {/* Diğer Bilgiler */}

                        <div className="space-y-2">
                            <Label htmlFor="priceSource">Fiyat Kaynağı *</Label>
                            <Select
                                onValueChange={(value) => handleChange('priceSource', value as string)}
                                value={formData.priceSource}
                                searchable={false}
                            >
                                <SelectTrigger className={errors.priceSource ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Kaynak seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">Firma</SelectItem>
                                    <SelectItem value="supplier">TÜPRAŞ</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priceSource && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.priceSource}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        {/*
                        <div className="space-y-2">
                            <Label htmlFor="maturity">Vade *</Label>
                            <Select
                                onValueChange={(value) => handleChange('maturity', value as string)}
                                value={formData.maturity}
                            >
                                <SelectTrigger className={errors.maturity ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Vade seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="spot">Spot</SelectItem>
                                    <SelectItem value="7">7 Gün</SelectItem>
                                    <SelectItem value="15">15 Gün</SelectItem>
                                    <SelectItem value="30">30 Gün</SelectItem>
                                    <SelectItem value="45">45 Gün</SelectItem>
                                    <SelectItem value="60">60 Gün</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.maturity && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maturity}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Satın Alma Tarihi</Label>
                            <Input
                                type="date"
                                value={formData.purchaseDate ? formData.purchaseDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const dateValue = e.target.value ? new Date(e.target.value) : null;
                                    handleChange('purchaseDate', dateValue);
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="announcementDate">Duyuru Tarihi</Label>
                            <Input
                                type="date"
                                value={formData.announcementDate ? formData.announcementDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const dateValue = e.target.value ? new Date(e.target.value) : null;
                                    handleChange('announcementDate', dateValue);
                                }}
                            />
                        </div>
*/



                        }
                        <div className="space-y-2">
                            <Label htmlFor="announcementDate">Satın Alma Tarihi</Label>
                            <Input
                                type="date"
                                value={formData.announcementDate ? formData.announcementDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const dateValue = e.target.value ? new Date(e.target.value) : null;
                                    handleChange('announcementDate', dateValue);
                                }}
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Fiyat Kaydet
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateProductPriceTrackingForm;