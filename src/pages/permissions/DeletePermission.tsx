import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deletePermission } from "@/features/permissions/permissions";

export function DeletePermission({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      toast.success("Ruxsatlar muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ["permissions"] }); // Cache yangilash
    },
    onError: () => {
      toast.error("Mahsulot o'chirishda xatolik yuz berdi!");
    },
  });

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">O'chirish</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>O'chirish</DialogTitle>
            <DialogDescription>
              Ushbu ruxsatlarni o'chirmoqchimisiz?
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const handleDelete = () => {
    mutation.mutate(id);
    navigate("/permissions");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="bg-red-500 text-white">
          O'chirish
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Ruxsatlarni o'chirish</DrawerTitle>
          <DrawerDescription>
            Ushbu ruxsatlarni o'chirmoqchimisiz?
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2 flex flex-row gap-2">
          <DrawerClose asChild className="w-1/2">
            <Button variant="outline">Yo'q</Button>
          </DrawerClose>
          <DrawerClose className="w-1/2">
            <Button
              variant="outline"
              className="bg-blue-500 text-white w-full"
              onClick={handleDelete}
            >
              Ha
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
