import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getProductById, updateProduct } from "@/features/products/products";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { DeleteProduct } from "./DeleteProduct";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdateProduct() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Product>();
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id || ""),
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("category", product.category);
      setValue("quantity", product.quantity);
      setValue("unit", product.unit);
      setValue("low_stock_threshold", product.low_stock_threshold);
    }
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Mahsulot muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Cache yangilash
      reset(); // Formani tozalash
    },
    onError: () => {
      toast.error("Mahsulot yangilashda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: Product) => {
    mutation.mutate({ ...data, id: product?.id });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="pt-16">Error</div>;

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Mahsulotni Yangilash</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
      >
        <div>
          <Input
            type="text"
            placeholder="Mahsulot nomi"
            {...register("name", { required: "Mahsulot nomi shart" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            type="text"
            placeholder="Kategoriya"
            {...register("category", { required: "Kategoriya shart" })}
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
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
          <Controller
            name="unit"
            control={control}
            rules={{ required: "Mahsulot birligini tanlash shart" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="text-base w-full">
                  <SelectValue placeholder="Mahsulot birligi" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="metr">M</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="santimetr">Sm</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.unit && (
            <p className="text-red-500 text-sm">{errors.unit.message}</p>
          )}
        </div>

        <div>
          <Input
            type="number"
            placeholder="Minimal miqdor"
            {...register("low_stock_threshold", {
              required: "Minimal miqdor shart",
              valueAsNumber: true,
            })}
          />
          {errors.low_stock_threshold && (
            <p className="text-red-500 text-sm">
              {errors.low_stock_threshold.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="submit" disabled={mutation.isPending || isSubmitting}>
            {mutation.isPending || isSubmitting
              ? "Yangilanmoqda..."
              : "Yangilash"}
          </Button>
          <DeleteProduct id={product?.id} />
        </div>
      </form>
    </div>
  );
}
