import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import {
  getPermissionById,
  updatePermission,
} from "@/features/permissions/permissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeletePermission } from "./DeletePermission";

export default function UpdatePermission() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: permissionData, isLoading } = useQuery({
    queryKey: ["permissions", id],
    queryFn: () => getPermissionById(id || ""),
    enabled: !!id,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PermissionTypes>();

  useEffect(() => {
    if (permissionData) {
      reset(permissionData);
    }
  }, [permissionData, reset]);

  const mutation = useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      toast.success("Ruxsat muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      navigate("/permissions");
    },
    onError: () => {
      toast.error("Yangilashda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: PermissionTypes) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="pt-16 text-center">Yuklanmoqda...</div>;

  return (
    <div className="pt-16 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Ruxsatni yangilash</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4 p-6 bg-white shadow-md rounded-lg border"
      >
        <div className="w-full">
          <Controller
            name="role"
            control={control}
            rules={{ required: "Lavozim tanlash shart" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={permissionData?.role}
              >
                <SelectTrigger className="text-base w-full">
                  <SelectValue placeholder="Lavozimni tanlang" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="hamkor">Hamkor</SelectItem>
                  <SelectItem value="omborchi">Omborchi</SelectItem>
                  <SelectItem value="sotuvchi">Sotuvchi</SelectItem>
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

        <div className="flex gap-4 justify-end">
          <Button type="submit" disabled={mutation.isPending || isSubmitting}>
            {mutation.isPending || isSubmitting
              ? "Yangilanmoqda..."
              : "Yangilash"}
          </Button>
          <DeletePermission id={permissionData?.id} />
        </div>
      </form>
    </div>
  );
}
