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

import { deletePartner } from "@/features/partners/partners";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function DeletePartner({ id }: { id: number | undefined }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      toast.success("Hamkor muvaffaqiyatli o‘chirildi!");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      navigate("/partners");
    },
    onError: () => {
      toast.error("Hamkor o‘chirishda xatolik yuz berdi!");
    },
  });

  const handleDelete = () => {
    if (id) {
      mutation.mutate(id);
    }
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">O‘chirish</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>O‘chirish</DialogTitle>
            <DialogDescription>
              Ushbu hamkorni o‘chirmoqchimisiz?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Yo‘q
            </Button>
            <Button className="bg-red-500 text-white" onClick={handleDelete}>
              Ha, o‘chirish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive">O‘chirish</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Hamkorni o‘chirish</DrawerTitle>
          <DrawerDescription>
            Ushbu hamkorni o‘chirmoqchimisiz?
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2 flex flex-row gap-2">
          <DrawerClose asChild className="w-1/2">
            <Button variant="outline">Yo‘q</Button>
          </DrawerClose>
          <DrawerClose className="w-1/2">
            <Button
              className="bg-red-500 text-white w-full"
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
