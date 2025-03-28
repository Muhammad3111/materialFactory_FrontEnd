import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { addWork } from "@/features/addWork/addWork";

export default function DailyWorkForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Works>();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addWork,
    onSuccess: () => {
      toast.success("Bajarilgan ish soni saqlandi!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["works"] });
    },
    onError: () => toast.error("Xatolik! Ish soni saqlanmadi."),
  });

  const onSubmit = (data: Works) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 border shadow-md rounded-xl"
    >
      <Input
        type="number"
        placeholder="Bugun bajargan ish soni"
        {...register("amount", {
          required: "Ish sonini kiritish shart",
          valueAsNumber: true,
        })}
      />
      {errors.amount && (
        <p className="text-red-500 text-sm">{errors.amount.message}</p>
      )}

      <Input
        type="number"
        placeholder="Bugun bajargan ish turi"
        {...register("type", {
          required: "Qaysi ishni bajargan kiritish shart",
          valueAsNumber: true,
        })}
      />
      {errors.amount && (
        <p className="text-red-500 text-sm">{errors.amount.message}</p>
      )}

      <Button
        type="submit"
        disabled={mutation.isPending || isSubmitting}
        className="bg-blue-500 text-white"
      >
        {mutation.isPending || isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
      </Button>
    </form>
  );
}
