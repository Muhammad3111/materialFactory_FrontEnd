import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { addPartner } from "@/features/partners/partners";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AddPartner() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Partners>({ defaultValues: { role: "partner" } });
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const passwordValue = watch("password");

  const mutation = useMutation({
    mutationFn: addPartner,
    onSuccess: () => {
      toast.success("Hamkor muvaffaqiyatli qo‘shildi!");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      reset();
    },
    onError: () => {
      toast.error("Hamkor qo‘shishda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: Partners) => {
    mutation.mutate(data);
  };

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Hamkor Qo‘shish</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
      >
        <Input
          type="text"
          placeholder="Hamkor nomi"
          {...register("name", { required: "Hamkor nomi shart" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        <div>
          <Input
            type="tel"
            placeholder="Telefon raqam (+998901234567)"
            {...register("phone", {
              required: "Telefon raqam shart",
              pattern: {
                value: /^\+998[0-9]{9}$/,
                message: "Noto‘g‘ri telefon raqami formati",
              },
            })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <Input
          type="text"
          placeholder="Foydalanuvchi nomi"
          {...register("username", { required: "Foydalanuvchi nomi shart" })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}

        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            placeholder="Parol kiriting"
            {...register("password", {
              required: "Parol shart",
              minLength: {
                value: 8,
                message: "Parol kamida 8 ta belgidan iborat bo‘lishi kerak",
              },
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Parolda kamida 1 harf, 1 raqam va 1 maxsus belgi bo‘lishi kerak",
              },
            })}
          />
          {!show ? (
            <Eye
              className="absolute top-2.5 right-2 cursor-pointer"
              size={18}
              onClick={() => setShow(!show)}
            />
          ) : (
            <EyeOff
              className="absolute top-2.5 right-2 cursor-pointer"
              size={18}
              onClick={() => setShow(!show)}
            />
          )}
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* ⚠️ Ogohlantirish: Agar foydalanuvchi 8 belgidan kam parol kiritsa */}
          {passwordValue && passwordValue.length < 8 && (
            <p className="text-orange-500 text-sm">
              ⚠️ Parol kamida 8 ta belgidan iborat bo‘lishi kerak
            </p>
          )}
        </div>

        <Input
          type="text"
          placeholder="Manzil"
          {...register("address", { required: "Manzil shart" })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}

        <Button type="submit" disabled={mutation.isPending || isSubmitting}>
          {mutation.isPending || isSubmitting ? "Saqlanmoqda..." : "Qo‘shish"}
        </Button>
      </form>
    </div>
  );
}
