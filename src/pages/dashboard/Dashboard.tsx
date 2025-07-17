import { getInvetoryStats } from "@/features/inventoryStats/inventoryStats";
import { useQuery } from "@tanstack/react-query";
import { Boxes, CircleDollarSign, PackageOpen, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventoryStats"],
    queryFn: () => getInvetoryStats(),
  });

  const navigate = useNavigate();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const stats: StockSummary = data;

  const normalizeNumbers = (n: string | number) => {
    return Number(n).toLocaleString("en-US");
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-20 px-4 bg-gray-400">
      <div
        onClick={() => navigate("/products")}
        className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4"
      >
        <Boxes size={48} />
        <div className="flex flex-col gap-2 text-left">
          <h1 className="text-base font-semibold">Mahsulotlar</h1>
          <p className="text-lg font-semibold">
            {normalizeNumbers(stats.total_products_quantity)}
          </p>
          <div className="flex flex-col gap-2">
            {stats.product_stats_children?.map((stat, index) => (
              <div className="flex items-center gap-2" key={index}>
                <p className="text-base font-semibold">{stat.unit}</p>
                <p>{stat.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 text-left">
        <CircleDollarSign size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Jami mahsulotlar narxi</h1>
          <p className="text-lg font-semibold">
            $ {normalizeNumbers(stats.total_warehouse_value)}
          </p>
        </div>
      </div>
      <div
        onClick={() => navigate("/inventory")}
        className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 text-left"
      >
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-semibold">Kirib kelgan mahsulotlar</h1>
          <div className="grid grid-cols-2 gap-y-2">
            <p className="text-base font-normal col-span-1">
              Soni: <b>{normalizeNumbers(stats.total_incoming_quantity)} ta</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Kamomat:{" "}
              <b>{normalizeNumbers(stats.incoming_flaw_quantity)} ta</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Narxi: <b>{normalizeNumbers(stats.total_incoming_value)} $</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Xarajat: <b>{normalizeNumbers(stats.total_incoming_expense)} $</b>
            </p>
          </div>
        </div>
      </div>
      <div
        onClick={() => navigate("/inventory")}
        className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 text-left"
      >
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-semibold">Chiqib ketgan mahsulotlar</h1>
          <div className="grid grid-cols-2 gap-y-2">
            <p className="text-base font-normal col-span-1">
              Soni: <b>{normalizeNumbers(stats.total_outgoing_quantity)} ta</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Kamomat:{" "}
              <b>{normalizeNumbers(stats.outgoing_flaw_quantity)} ta</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Narxi: <b>{normalizeNumbers(stats.total_outgoing_value)} $</b>
            </p>
            <p className="text-base font-normal col-span-1">
              Xarajat: <b>{normalizeNumbers(stats.total_outgoing_expense)} $</b>
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 text-left">
        <PackageOpen size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Jami kamomat</h1>
          <p className="text-lg font-semibold">
            {normalizeNumbers(
              Number(stats.incoming_flaw_quantity) +
                Number(stats.outgoing_flaw_quantity)
            )}
            ta
          </p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 text-left">
        <Wallet size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold">Xarajatlar</h1>
          <p className="text-lg font-semibold">
            ${" "}
            {normalizeNumbers(
              Number(stats.total_incoming_expense) +
                Number(stats.total_outgoing_expense)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
