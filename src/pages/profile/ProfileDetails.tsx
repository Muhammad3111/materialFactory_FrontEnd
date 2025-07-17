import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { updateUser } from "@/features/users/users";
import { useUser } from "@/hooks/useUser";

// Translation
const keyTranslationMap: Record<string, string> = {
  id: "ID",
  fullname: "To‘liq ism",
  name: "Ism",
  phone: "Telefon raqam",
  role: "Roli",
  created_at: "Yaratilgan sana",
  salary_type: "Maosh turi",
  salary_amount: "Maosh miqdori",
  final_salary: "Yakuniy maosh",
  total_hours: "Jami ish soatlari",
  total_output_products: "Chiqarilgan mahsulotlar soni",
  total_received: "Olingan mablag‘",
  address: "Manzil",
  debt: "Qarz",
  credit: "Haq",
  username: "Login",
  password: "Parol",
};

// Tur ajratish
function isUser(user: any): user is User {
  return user && (user.role === "admin" || user.role === "ishchi");
}

export default function ProfileDetails() {
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const form = useForm<User>({
    defaultValues: isUser(user) ? { ...user, id: Number(user.id) } : undefined,
  });

  const { register, handleSubmit } = form;

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Ma'lumotlar muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditMode(false);
    },
    onError: () => {
      toast.error("Yangilashda xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: User) => {
    mutation.mutate(data);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  if (!user)
    return <div className="pt-18 text-center">Ma'lumot topilmadi.</div>;

  const displayEntries = Object.entries(user).filter(
    ([key, value]) =>
      (typeof value === "string" || typeof value === "number") &&
      key !== "password" &&
      key !== "token"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-18 relative px-4">
      <div className="flex items-center justify-between my-4">
        <h2 className="text-xl font-bold">Profil ma'lumotlari</h2>
        {isUser(user) && !editMode && (
          <Button
            onClick={() => setEditMode(true)}
            variant="outline"
            size="sm"
            className="bg-blue-500 text-white"
          >
            <Pencil size={16} />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {displayEntries.map(([key, value]) => {
          const displayValue =
            key === "created_at" ? formatDate(value as string) : value;

          return (
            <div key={key} className="flex justify-between items-center">
              <span className="font-medium capitalize">
                {keyTranslationMap[key] || key.replace(/_/g, " ")}:
              </span>
              {editMode && isUser(user) ? (
                <Input
                  {...register(key as keyof User)}
                  className="w-1/2"
                  disabled={key === "id" || key === "created_at"}
                />
              ) : (
                <span className="text-gray-700 text-right max-w-[50%] break-words">
                  {displayValue}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {editMode && isUser(user) && (
        <div className="flex gap-4 justify-end mt-6">
          <Button type="submit" disabled={mutation.isPending}>
            <Save size={18} /> Saqlash
          </Button>
          <Button
            type="button"
            onClick={() => setEditMode(false)}
            variant="outline"
            className="flex gap-2 bg-red-500 text-white"
          >
            <X size={18} /> Bekor qilish
          </Button>
        </div>
      )}
    </form>
  );
}
