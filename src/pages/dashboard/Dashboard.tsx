import { getInvetoryStats } from "@/features/inventoryStats/inventoryStats";
import { useQuery } from "@tanstack/react-query";
import { Boxes, CircleDollarSign, PackageOpen, Wallet } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventoryStats"],
    queryFn: () => getInvetoryStats(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const stats: StockSummary = data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-20 px-4">
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <Boxes size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Mahsulotlar</h1>
          <p className="text-lg font-semibold">
            {stats.total_products_quantity}
          </p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <CircleDollarSign size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Jami mahsulotlar narxi</h1>
          <p className="text-lg font-semibold">
            $ {Number(stats.total_warehouse_value)}
          </p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-semibold">Kirib kelgan mahsulotlar</h1>
          <div className="grid grid-cols-2 gap-y-2">
            <p className="text-base font-normal col-span-1">
              Soni: <b>{Number(stats.total_incoming_quantity)} ta</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Kamomat: <b>{Number(stats.incoming_flaw_quantity)} ta</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Narxi: <b>{Number(stats.total_incoming_value)} $</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Xarajat: <b>{Number(stats.total_incoming_expense)} $</b>
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-semibold">Chiqib ketgan mahsulotlar</h1>
          <div className="grid grid-cols-2 gap-y-2">
            <p className="text-base font-normal col-span-1">
              Soni: <b>{Number(stats.total_outgoing_quantity)} ta</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Kamomat: <b>{Number(stats.outgoing_flaw_quantity)} ta</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Narxi: <b>{Number(stats.total_outgoing_value)} $</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Xarajat: <b>{Number(stats.total_outgoing_expense)} $</b>
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <PackageOpen size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Jami kamomat</h1>
          <p className="text-lg font-semibold">
            {Number(stats.incoming_flaw_quantity) +
              Number(stats.outgoing_flaw_quantity)}{" "}
            ta
          </p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <Wallet size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Xarajatlar</h1>
          <p className="text-lg font-semibold">
            ${" "}
            {Number(stats.total_incoming_expense) +
              Number(stats.total_outgoing_expense)}
          </p>
        </div>
      </div>
    </div>
  );
}
