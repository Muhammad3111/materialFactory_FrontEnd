import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { getProducts } from "@/features/products/products";
import { addProductToInventory } from "@/features/inventroyLogs/inventoryLogs";
import { getPartners } from "@/features/partners/partners";
import { useEffect, useRef } from "react";
import { getUSDCurrency } from "@/features/currency/currency";

export type InventoryProductForm = {
    product_id: number;
    partner_id: string;
    quantity: number;
    length_cm: number;
    quantity_meters: number;
    price: string;
    expense: string;
    flaw: string;
    type: "incoming" | "outgoing";
};

export default function AddProductToInventory() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<InventoryProductForm>({
        defaultValues: {
            length_cm: 0,
            quantity_meters: 0,
            expense: "0",
            flaw: "0",
        },
    });

    const queryClient = useQueryClient();

    // bu kursni API'dan olib dinamik qilsa ham bo'ladi

    const uzsAmountRef = useRef<HTMLInputElement>(null);
    const uzsExpenseRef = useRef<HTMLInputElement>(null);

    // Mahsulotlarni olish uchun query
    const { data: products, isLoading: productsLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    const { data: partners, isLoading: partnersLoading } = useQuery({
        queryKey: ["partners"],
        queryFn: getPartners,
    });

    const { data, isLoading: currencyLoading } = useQuery({
        queryKey: ["currency"],
        queryFn: getUSDCurrency,
    });

    const watchedLength = watch("length_cm");
    const watchedQuantity = watch("quantity");

    useEffect(() => {
        if (watchedLength && watchedQuantity) {
            const meters = (watchedLength * watchedQuantity) / 100;
            setValue("quantity_meters", parseFloat(meters.toFixed(2)));
        }
    }, [watchedLength, watchedQuantity, setValue]);

    const mutation = useMutation({
        mutationFn: addProductToInventory,
        onSuccess: () => {
            toast.success("Omborga mahsulot muvaffaqiyatli qo‘shildi!");
            queryClient.invalidateQueries({ queryKey: ["inventoryLogs"] });
            reset();
        },
        onError: () => {
            toast.error("Mahsulot qo‘shishda xatolik yuz berdi!");
        },
    });

    if (currencyLoading) {
        return <h1>Yuklanmoqda...</h1>;
    }

    const uzsToUsdRate = data[0].Rate;
    const onSubmit = (data: InventoryProductForm) => {
        mutation.mutate(data);
    };

    return (
        <div className="pt-16 flex flex-col items-center gap-6">
            <h1 className="text-xl font-bold">Omborga Mahsulot Qo‘shish</h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
            >
                {/* Product select */}
                <div>
                    <Controller
                        name="product_id"
                        control={control}
                        rules={{ required: "Mahsulotni tanlash shart" }}
                        render={({ field }) => (
                            <Select
                                onValueChange={(val) =>
                                    field.onChange(Number(val))
                                }
                                value={
                                    field.value ? field.value.toString() : ""
                                }
                            >
                                <SelectTrigger className="w-full text-base">
                                    <SelectValue placeholder="Mahsulotni tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {productsLoading ? (
                                        <p className="text-center p-2">
                                            Yuklanmoqda...
                                        </p>
                                    ) : products && products.length > 0 ? (
                                        products.map((product: Product) => (
                                            <SelectItem
                                                key={product.id}
                                                value={
                                                    product.id?.toString() ?? ""
                                                }
                                            >
                                                {product.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 p-2">
                                            Mahsulotlar topilmadi
                                        </p>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.product_id && (
                        <p className="text-red-500 text-sm">
                            {errors.product_id.message}
                        </p>
                    )}
                </div>

                <div>
                    <Controller
                        name="partner_id"
                        control={control}
                        rules={{ required: "Hamkorni tanlash shart" }}
                        render={({ field }) => (
                            <Select
                                onValueChange={(val) =>
                                    field.onChange(Number(val))
                                }
                                value={
                                    field.value ? field.value.toString() : ""
                                }
                            >
                                <SelectTrigger className="w-full text-base">
                                    <SelectValue placeholder="Hamkorni tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {partnersLoading ? (
                                        <p className="text-center p-2">
                                            Yuklanmoqda...
                                        </p>
                                    ) : partners && partners.length > 0 ? (
                                        partners.map((partners: Partners) => (
                                            <SelectItem
                                                key={partners.id}
                                                value={
                                                    partners.id?.toString() ??
                                                    ""
                                                }
                                            >
                                                {partners.username}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 p-2">
                                            Hamkor topilmadi
                                        </p>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.partner_id && (
                        <p className="text-red-500 text-sm">
                            {errors.partner_id.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        type="number"
                        step="any"
                        placeholder="Shtuk yoki Kg"
                        {...register("quantity", {
                            required: "Soni shart",
                            valueAsNumber: true,
                        })}
                    />
                    {errors.quantity && (
                        <p className="text-red-500 text-sm">
                            {errors.quantity.message}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    <div>
                        <Input
                            type="number"
                            step="1"
                            placeholder="Uzunlik (sm)"
                            {...register("length_cm", {
                                valueAsNumber: true,
                            })}
                        />
                        {errors.length_cm && (
                            <p className="text-red-500 text-sm">
                                {errors.length_cm.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <Input
                            type="number"
                            step="any"
                            placeholder="Uzunlik metr"
                            {...register("quantity_meters", {
                                valueAsNumber: true,
                            })}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div>
                        <Input
                            type="number"
                            step="any"
                            placeholder="Narx (UZS da)"
                            ref={uzsAmountRef}
                            onChange={(e) => {
                                const uzsVal = parseFloat(e.target.value);
                                if (!isNaN(uzsVal)) {
                                    const calculatedPrice =
                                        uzsVal / uzsToUsdRate;
                                    setValue(
                                        "price",
                                        calculatedPrice.toFixed(4)
                                    );
                                }
                            }}
                        />
                    </div>

                    <div>
                        <Input
                            type="number"
                            step="any"
                            placeholder="Narxi ($ da)"
                            {...register("price", {
                                required: "Narx shart",
                                valueAsNumber: true,
                            })}
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm">
                                {errors.price.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div>
                        <Input
                            type="number"
                            step="any"
                            placeholder="Xarajat (UZS da)"
                            ref={uzsExpenseRef}
                            onChange={(e) => {
                                const uzsVal = parseFloat(e.target.value);
                                if (!isNaN(uzsVal)) {
                                    const calculatedPrice =
                                        uzsVal / uzsToUsdRate;
                                    setValue(
                                        "expense",
                                        calculatedPrice.toFixed(4)
                                    );
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            step="any"
                            placeholder="Xarajat ($ da)"
                            {...register("expense", {
                                required: "Xarajat shart",
                                valueAsNumber: true,
                            })}
                        />
                        {errors.expense && (
                            <p className="text-red-500 text-sm">
                                {errors.expense.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Input
                        type="number"
                        step="any"
                        placeholder="Brak (flaw) miqdori"
                        {...register("flaw", {
                            required: "Brak miqdori shart",
                            valueAsNumber: true,
                        })}
                    />
                    {errors.flaw && (
                        <p className="text-red-500 text-sm">
                            {errors.flaw.message}
                        </p>
                    )}
                </div>

                {/* Type select */}
                <div>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Turini tanlash shart" }}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="text-base w-full">
                                    <SelectValue placeholder="Turi (kirim/chiqim) ni tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="incoming">
                                        Kirim
                                    </SelectItem>
                                    <SelectItem value="outgoing">
                                        Chiqim
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && (
                        <p className="text-red-500 text-sm">
                            {errors.type.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={mutation.isPending || isSubmitting}
                >
                    {mutation.isPending || isSubmitting
                        ? "Saqlanmoqda..."
                        : "Qo‘shish"}
                </Button>
            </form>
        </div>
    );
}
