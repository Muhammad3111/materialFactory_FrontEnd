import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getPartnerById, updatePartner } from "@/features/partners/partners";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { DeletePartner } from "./DeletePartner";

export default function UpdatePartner() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Partners>();

  const { id } = useParams<{ id: string }>();

  const {
    data: partner,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["partners", id],
    queryFn: () => getPartnerById(id || ""),
  });

  useEffect(() => {
    if (partner) {
      setValue("name", partner.name);
      setValue("phone", partner.phone);
      setValue("address", partner.address);
    }
  }, [partner, setValue]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updatePartner,
    onSuccess: () => {
      toast.success("Hamkor ma'lumotlari muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      reset();
    },
    onError: () => {
      toast.error("Hamkorni yangilashda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: Partners) => {
    mutation.mutate({ ...data, id: partner?.id });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="pt-16">Xatolik yuz berdi!</div>;

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Hamkorni Yangilash</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
      >
        <div>
          <Input
            type="text"
            placeholder="Hamkor nomi"
            {...register("name", { required: "Hamkor nomi shart" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            type="tel"
            placeholder="Telefon raqam"
            {...register("phone", { required: "Telefon raqam shart" })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Input
            type="text"
            placeholder="Manzil"
            {...register("address", { required: "Manzil shart" })}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="submit" disabled={mutation.isPending || isSubmitting}>
            {mutation.isPending || isSubmitting
              ? "Yangilanmoqda..."
              : "Yangilash"}
          </Button>
          <DeletePartner id={partner?.id} />
        </div>
      </form>
    </div>
  );
}
