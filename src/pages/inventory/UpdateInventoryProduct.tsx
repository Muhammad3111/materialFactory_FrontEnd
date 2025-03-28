import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
import {
  getInventoryProductById,
  updateInventoryProduct,
} from "@/features/inventroyLogs/inventoryLogs";
import { getProducts } from "@/features/products/products";
import { DeleteInventoryProduct } from "./DeleteInventoryProduct";
import { getPartners } from "@/features/partners/partners";

export type UpdateInventoryProductForm = {
  id?: number;
  product_id: number;
  partner_id: string;
  user_name: string;
  quantity: number;
  price: string;
  expense: string;
  flaw: string;
  type: "incoming" | "outgoing";
};

export default function UpdateInventoryProduct() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: inventoryProductData, isLoading } = useQuery({
    queryKey: ["inventoryProduct", id],
    queryFn: () => getInventoryProductById(id || ""),
    enabled: !!id,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: partners, isLoading: partnersLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: getPartners,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateInventoryProductForm>();

  useEffect(() => {
    if (inventoryProductData) {
      reset(inventoryProductData);
    }
  }, [inventoryProductData, reset]);

  const mutation = useMutation({
    mutationFn: updateInventoryProduct,
    onSuccess: () => {
      toast.success("Ombordagi mahsulot muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["inventoryLogs"] });
    },
    onError: () => {
      toast.error("Yangilashda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: UpdateInventoryProductForm) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="pt-16 text-center">Yuklanmoqda...</div>;

  console.log(inventoryProductData);

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Ombor mahsulotini yangilash</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
      >
        {/* ✅ Product select */}
        <div>
          <Controller
            name="product_id"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
                defaultValue={inventoryProductData?.product.id.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mahsulotni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product: Product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id?.toString() || ""}
                    >
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.product_id && (
            <p className="text-red-500 text-sm">{errors.product_id.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="partner_id"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
                defaultValue={inventoryProductData?.partner.id.toString()}
              >
                <SelectTrigger className="w-full text-base">
                  <SelectValue placeholder="Hamkorni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {partnersLoading ? (
                    <p className="text-center p-2">Yuklanmoqda...</p>
                  ) : partners && partners.length > 0 ? (
                    partners.map((partners: Partners) => (
                      <SelectItem
                        key={partners.id}
                        value={partners.id?.toString() ?? ""}
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
            <p className="text-red-500 text-sm">{errors.partner_id.message}</p>
          )}
        </div>

        <div>
          <Input
            type="number"
            placeholder="Miqdor"
            {...register("quantity", {
              required: "Miqdor shart",
              valueAsNumber: true,
            })}
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <Input
            type="number"
            step="any"
            placeholder="Narxi (1 dona uchun)"
            {...register("price", { required: "Narx shart" })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Input
            type="number"
            placeholder="Xarajat summasi"
            {...register("expense", { required: "Xarajat summasi shart" })}
          />
          {errors.expense && (
            <p className="text-red-500 text-sm">{errors.expense.message}</p>
          )}
        </div>

        <div>
          <Input
            type="number"
            step="any"
            placeholder="Brak (flaw) miqdori"
            {...register("flaw", { required: "Brak miqdori shart" })}
          />
          {errors.flaw && (
            <p className="text-red-500 text-sm">{errors.flaw.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Turini tanlash shart" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={inventoryProductData?.type}
              >
                <SelectTrigger className="text-base w-full">
                  <SelectValue placeholder="Turi (kirim/chiqim) ni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incoming">Kirim</SelectItem>
                  <SelectItem value="outgoing">Chiqim</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="submit" disabled={mutation.isPending || isSubmitting}>
            {mutation.isPending || isSubmitting
              ? "Yangilanmoqda..."
              : "Yangilash"}
          </Button>
          <DeleteInventoryProduct id={inventoryProductData?.id} />
        </div>
      </form>
    </div>
  );
}
