import { useForm, Controller, useWatch } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addTransaction } from "@/features/transactions/transactions";
import { getUsers } from "@/features/users/users";
import { getPartners } from "@/features/partners/partners";
import { useRef } from "react";
import { getUSDCurrency } from "@/features/currency/currency";

export type TransactionForm = {
  amount: string;
  type: "income" | "expense";
  description: string;
  user_id?: number;
  partner_id?: number;
};

export default function AddTransaction() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionForm>();

  const queryClient = useQueryClient();
  const uzsAmountRef = useRef<HTMLInputElement>(null);
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: partners, isLoading: partnersLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: getPartners,
  });

  const { data, isLoading: currencyLoading } = useQuery({
    queryKey: ["currency"],
    queryFn: getUSDCurrency,
  });

  const mutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      toast.success("Tranzaksiya muvaffaqiyatli qo‘shildi!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      reset();
    },
    onError: () => {
      toast.error("Tranzaksiya qo‘shishda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: TransactionForm) => {
    mutation.mutate(data);
  };

  // ✅ user_id va partner_id kuzatuvchi
  const watchedUserId = useWatch({ control, name: "user_id" });
  const watchedPartnerId = useWatch({ control, name: "partner_id" });

  if (currencyLoading) {
    return <h1>Yuklanmoqda...</h1>;
  }

  const uzsToUsdRate = data[0].Rate;

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Tranzaksiya qo‘shish</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
      >
        <div>
          <Input
            type="number"
            step="any"
            placeholder="Narx (UZS da)"
            ref={uzsAmountRef}
            onChange={(e) => {
              const uzsVal = parseFloat(e.target.value);
              if (!isNaN(uzsVal)) {
                const calculatedPrice = uzsVal / uzsToUsdRate;
                setValue("amount", calculatedPrice.toFixed(2));
              }
            }}
          />
        </div>
        <div>
          <Input
            type="number"
            step="any"
            placeholder="Summani kiriting"
            {...register("amount", {
              required: "Summani kiritish shart",
            })}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        {/* USER SELECT */}
        <div>
          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : undefined)
                }
                value={field.value?.toString()}
                disabled={!!watchedPartnerId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Foydalanuvchini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {/* 🧹 Tozalash tugmasi */}
                  <SelectItem value="null">Hech qanday</SelectItem>
                  {usersLoading ? (
                    <p className="text-center p-2">Yuklanmoqda...</p>
                  ) : (
                    users?.map((user: User) => (
                      <SelectItem
                        key={user.id}
                        value={user.id?.toString() ?? ""}
                      >
                        {user.fullname}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.user_id && (
            <p className="text-red-500 text-sm">{errors.user_id.message}</p>
          )}
        </div>

        <div className="flex justify-center">
          <span className="text-sm text-gray-400">Yoki</span>
        </div>

        {/* PARTNER SELECT */}
        <div>
          <Controller
            name="partner_id"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : undefined)
                }
                value={field.value?.toString()}
                disabled={!!watchedUserId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hamkorni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Hech qanday</SelectItem>
                  {partnersLoading ? (
                    <p className="text-center p-2">Yuklanmoqda...</p>
                  ) : (
                    partners?.map((partner: Partners) => (
                      <SelectItem
                        key={partner.id}
                        value={partner.id?.toString() ?? ""}
                      >
                        {partner.name}
                      </SelectItem>
                    ))
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
          <Controller
            name="type"
            control={control}
            rules={{ required: "Turini tanlash shart" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tranzaksiya turi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Kirim</SelectItem>
                  <SelectItem value="expense">Chiqim</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        <div>
          <Input
            type="text"
            placeholder="Izoh (ixtiyoriy)"
            {...register("description")}
          />
        </div>

        <Button type="submit" disabled={mutation.isPending || isSubmitting}>
          {mutation.isPending || isSubmitting ? "Yuborilmoqda..." : "Qo‘shish"}
        </Button>
      </form>
    </div>
  );
}
