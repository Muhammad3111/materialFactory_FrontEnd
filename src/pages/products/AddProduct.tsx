import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { addProduct } from "@/features/products/products";

export default function AddProduct() {
  const {
    register,
    handleSubmit,
    reset,
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
          <Input
            type="number"
            placeholder="Narx"
            {...register("price", {
              required: "Narx shart",
              valueAsNumber: true,
            })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Input
            type="number"
            placeholder="Minimal miqdor (threshold)"
            {...register("low_stock_threshold", {
              required: "Threshold shart",
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
