import { MouseEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getIncomingProducts } from "@/features/inventroyLogs/inventoryLogs";
import { useQuery } from "@tanstack/react-query";
import { Download, Ellipsis } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { generatePdf } from "@/components/pdf/generetaPdf";

export default function IncomingProducts() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const partnerParam = user?.role === "partner" ? user?.id : "";
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invetoryLogs", partnerParam],
    queryFn: () => getIncomingProducts(partnerParam!),
  });

  useEffect(() => {
    const partnerName = location.state?.partner;
    if (partnerName) {
      setSearchQuery(partnerName);
    }
  }, [location.state]);

  console.log(searchQuery);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Xatolik yuz berdi!</div>;

  const incomingProducts: InventoryProduct[] = data || [];

  // 🔍 Qidiruv bo‘yicha filter
  const filteredIncoming = incomingProducts.filter(
    (item) =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sana formatlash funksiyasi
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const shareFile = async (
    e: MouseEvent<HTMLButtonElement>,
    item: InventoryProduct
  ) => {
    e.stopPropagation(); // kartani ochilishiga to‘sqinlik qiladi

    // Faylni ko‘rsatish uchun ochiladi
    const pdfBlob = generatePdf(item);
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Faylni avtomatik yuklab olish
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "kirim-check.pdf";
    a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 🔍 Qidiruv input */}
      <div>
        <Input
          type="text"
          placeholder="Mahsulot, foydalanuvchi yoki hamkor nomi bo‘yicha izlash..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-black"
        />
      </div>

      {/* 📦 Kirim qilgan mahsulotlar ro‘yxati */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredIncoming.length > 0 ? (
          filteredIncoming.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 col-span-1 cursor-pointer"
              onClick={() => navigate(`/inventory/${item.id}`)}
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span>Mahsulot:</span>
                    <span className="font-semibold">{item.product.name}</span>
                  </div>
                  <button
                    className="p-1 rounded-full bg-gray-200"
                    onClick={() => navigate(`/inventory/${item.id}`)}
                  >
                    <Ellipsis size={24} className="text-gray-600" />
                  </button>
                </div>

                <div className="flex gap-2 items-center">
                  <span>Hamkor:</span>
                  <span className="font-semibold">{item.partner.name}</span>
                </div>

                <div className="flex gap-2 items-center">
                  <span>Xodim:</span>
                  <span className="font-semibold">{item.user_name}</span>
                </div>

                <div className="flex gap-2 items-center">
                  <span>Miqdori:</span>
                  <span className="font-semibold">
                    {item.quantity} {item.product.unit}
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <span>Kamomat:</span>
                  <span className="font-semibold">{item.flaw} %</span>
                </div>

                <div className="flex gap-2 items-center">
                  <span>Dona narx:</span>
                  <span className="font-semibold">{Number(item.price)} $</span>
                </div>

                <div className="flex gap-2 items-center">
                  <span>Umumiy narx:</span>
                  <span className="font-semibold">
                    {Number(item.total_price)} $
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <span>Xarajat:</span>
                    <span className="font-semibold">
                      {Number(item.expense)} $
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span>Sana:</span>
                      <span className="font-semibold">
                        {formatDate(item.created_at || "")}
                      </span>
                    </div>
                    <button
                      onClick={async (e) => shareFile(e, item)}
                      className="text-black"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Kirim qilingan mahsulot topilmadi 😕
          </p>
        )}
      </div>
    </div>
  );
}
