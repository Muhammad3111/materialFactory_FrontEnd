import { useState } from "react";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/features/products/products";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Qidiruv uchun state
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const products: Product[] = data;

  // 🔍 Qidiruv natijalarini filter qilish
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📆 Sana formatlash funksiyasi
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="pt-18 px-4 flex flex-col gap-4">
      {/* 🔍 Qidiruv input */}
      <div>
        <Input
          type="text"
          placeholder="Mahsulot izlash..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ➕ Mahsulot qo‘shish tugmasi */}
      <div className="fixed bottom-25 right-4">
        <button
          className="bg-blue-500 text-white rounded-full text-lg p-2"
          onClick={() => navigate("/products/add")}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* 📦 Mahsulotlar ro‘yxati */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 col-span-1"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span>Nomi:</span>
                    <span className="font-semibold">{product.name}</span>
                  </div>
                  <button
                    className="p-1 rounded-full bg-gray-200"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <Ellipsis size={24} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <span>Bo‘limi:</span>
                  <span className="font-semibold">{product.category}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span>Soni:</span>
                  <span className="font-semibold">
                    {product.quantity} {product.unit}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-center">
                    <span>Zahira miqdori:</span>
                    <span className="font-semibold">
                      {product.low_stock_threshold}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Sana:</span>
                    <span className="font-semibold">
                      {formatDate(product.created_at || "")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Mahsulot topilmadi 😕</p>
        )}
      </div>
    </div>
  );
}
