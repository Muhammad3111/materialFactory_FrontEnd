import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { addPermission } from "@/features/permissions/permissions"; // ➡️ bu yerdan API funksiya
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export default function AddPermission() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PermissionTypes>({
    defaultValues: {
      role: "admin",
      can_read: false,
      can_create: false,
      can_update: false,
      can_delete: false,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addPermission,
    onSuccess: () => {
      toast.success("Ruxsat muvaffaqiyatli qo‘shildi!");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      reset();
    },
    onError: () => {
      toast.error("Ruxsat qo‘shishda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: PermissionTypes) => {
    mutation.mutate(data);
  };

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Ruxsat Qo‘shish</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
      >
        {/* Role input */}
        <div className="w-full">
          <Controller
            name="role"
            control={control}
            rules={{ required: "Lavozim tanlash shart" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="text-base w-full">
                  <SelectValue placeholder="Lavozimni tanlang" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="partner">Hamkor</SelectItem>
                  <SelectItem value="ishchi">Ishchi</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Switchlar */}
        <div className="flex flex-col gap-4 mt-2">
          {["can_read", "can_create", "can_update", "can_delete"].map(
            (field) => (
              <div
                key={field}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="capitalize">
                  {field.replace("can_", "").toUpperCase()}
                </span>
                <Controller
                  name={field as keyof PermissionTypes}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch checked={!!value} onCheckedChange={onChange} />
                  )}
                />
              </div>
            )
          )}
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending || isSubmitting}
          className="mt-4 text-white"
        >
          {mutation.isPending || isSubmitting ? "Yuborilmoqda..." : "Qo‘shish"}
        </Button>
      </form>
    </div>
  );
}
