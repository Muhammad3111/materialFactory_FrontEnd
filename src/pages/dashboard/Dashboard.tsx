import { getInvetoryStats } from "@/features/inventoryStats/inventoryStats";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownZA,
  ArrowUpAZ,
  Boxes,
  CircleDollarSign,
  PackageOpen,
  Wallet,
} from "lucide-react";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventoryStats"],
    queryFn: () => getInvetoryStats(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const stats: StockSummary = data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-16 px-4">
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <Boxes size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Mahsulotlar</h1>
          <p className="text-lg font-semibold">{stats.total_stock_quantity}</p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <CircleDollarSign size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Jami mahsulotlar narxi</h1>
          <p className="text-lg font-semibold">
            $ {Number(stats.total_stock_value)}
          </p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <ArrowDownZA size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Kirib kelgan mahsulotlar</h1>
          <p className="text-lg font-semibold">
            {stats.total_incoming_quantity}
          </p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <ArrowUpAZ size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Chiqib ketgan mahsulotlar</h1>
          <p className="text-lg font-semibold">
            {stats.total_outgoing_quantity}
          </p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <PackageOpen size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Jami kamomat</h1>
          <p className="text-lg font-semibold">
            {Number(stats.total_incoming_flaw_quantity)}
          </p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4">
        <Wallet size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Xarajatlar</h1>
          <p className="text-lg font-semibold">
            {Number(stats.total_incoming_expense)}
          </p>
        </div>
      </div>
    </div>
  );
}
