import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { updateUser } from "@/features/users/users";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteUser } from "./DeleteUser";

export default function UpdateUser() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<User>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // localStorage'dan user ma'lumotlarini olish va formaga set qilish
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      Object.keys(parsedUser).forEach((key) => {
        setValue(key as keyof User, parsedUser[key]);
      });
    }
  }, [setValue]);

  const queryClient = useQueryClient();
  const passwordValue = watch("password"); // 🔍 Parolni kuzatamiz

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Foydalanuvchi muvaffaqiyatli qo‘shildi!");
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Cache yangilash
      reset(); // Formani tozalash
    },
    onError: () => {
      toast.error("Foydalanuvchi qo‘shishda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: User) => {
    mutation.mutate(data);
    navigate("/users");
  };

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Foydalanuvchi Qo‘shish</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
      >
        {/* Full Name */}
        <div>
          <Input
            type="text"
            placeholder="To‘liq ism"
            {...register("fullname", { required: "To‘liq ism shart" })}
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm">{errors.fullname.message}</p>
          )}
        </div>

        {/* Phone Number */}
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

        {/* Password */}
        <div>
          <Input
            type="password"
            placeholder="Parol kiriting"
            {...register("password", {
              required: "Parol bo'lishi shart",
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

        {/* Role - Select */}
        <div>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="text-base w-full">
                  <SelectValue placeholder="Lavozimni tanlang" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="omborchi">Omborchi</SelectItem>
                  <SelectItem value="sotuvchi">Sotuvchi</SelectItem>
                  <SelectItem value="ishchi">ishchi</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Salary Type */}
        <div>
          <Controller
            name="salary_type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="text-base w-full">
                  <SelectValue placeholder="Ish haqi turini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oylik">Oylik</SelectItem>
                  <SelectItem value="soatlik">Soatlik</SelectItem>
                  <SelectItem value="ish_bay">Ish bay</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.salary_type && (
            <p className="text-red-500 text-sm">{errors.salary_type.message}</p>
          )}
        </div>

        {/* Salary Inputs */}
        <div>
          <Input
            type="number"
            placeholder="Maosh miqdori"
            {...register("salary_amount", { required: "Maosh miqdori shart" })}
          />
          {errors.salary_amount && (
            <p className="text-red-500 text-sm">
              {errors.salary_amount.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 justify-end">
          <Button type="submit" disabled={mutation.isPending || isSubmitting}>
            {mutation.isPending || isSubmitting
              ? "Yangilanmoqda..."
              : "Yangilash"}
          </Button>
          <DeleteUser id={id || ""} />
        </div>
      </form>
    </div>
  );
}
