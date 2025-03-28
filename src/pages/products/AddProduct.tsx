import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { addProduct } from "@/features/products/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddProduct() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Product>();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast.success("Mahsulot muvaffaqiyatli qo'shildi!");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Cache yangilash
      reset(); // Formani tozalash
    },
    onError: () => {
      toast.error("Mahsulot qo'shishda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: Product) => {
    mutation.mutate(data);
  };

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Mahsulot Qo'shish</h1>

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

        <Button type="submit" disabled={mutation.isPending || isSubmitting}>
          {mutation.isPending || isSubmitting ? "Saqlanmoqda..." : "Qo‘shish"}
        </Button>
      </form>
    </div>
  );
}
