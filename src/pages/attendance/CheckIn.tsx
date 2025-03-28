import { Button } from "@/components/ui/button";
import { addCheckIn } from "@/features/attandance/Attandance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CheckInButton() {
  const mutation = useMutation({
    mutationFn: addCheckIn,
    onSuccess: () => toast.success("Xush kelibsiz!"),
    onError: () => toast.error("Xatolik! Kirish vaqti saqlanmadi."),
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="bg-green-500 text-white w-full"
    >
      {mutation.isPending ? "Yuborilmoqda..." : "Keldim"}
    </Button>
  );
}
