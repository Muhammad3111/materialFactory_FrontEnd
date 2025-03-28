import { Button } from "@/components/ui/button";
import { addCheckOut } from "@/features/attandance/Attandance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CheckOutButton() {
  const mutation = useMutation({
    mutationFn: addCheckOut,
    onSuccess: () => toast.success("Salomat bo'ling!"),
    onError: () => toast.error("Xatolik! Chiqish vaqti saqlanmadi."),
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="bg-red-500 text-white w-full"
    >
      {mutation.isPending ? "Yuborilmoqda..." : "Ketdim"}
    </Button>
  );
}
