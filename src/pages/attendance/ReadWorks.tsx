import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { getWorkById } from "@/features/addWork/addWork";
import { useUser } from "@/hooks/useUser"; // Context hook’ini chaqirish

export default function ReadWorks() {
  const { user } = useUser(); // Contextdan user olish
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["works", user?.id],
    queryFn: () => getWorkById(user?.id?.toString() || ""), // user bo'lmasa bo'sh string yuboriladi
    enabled: !!user?.id, // faqat user mavjud bo‘lsa query ishga tushadi
  });

  if (isLoading) return <div className="pt-16 text-center">Yuklanmoqda...</div>;
  if (isError)
    return <div className="pt-16 text-center">Xatolik yuz berdi</div>;

  const works: Works[] = data || [];

  const filteredWorks = works.filter((work) =>
    work.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="pt-16 px-4 flex flex-col gap-4">
      <Input
        placeholder="Ishchi izlash..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredWorks.length > 0 ? (
          filteredWorks.map((work) => (
            <Card
              key={work.id}
              onClick={() => navigate(`/works/${work.id}`)}
              className="p-4 rounded-2xl bg-white shadow-md border cursor-pointer hover:shadow-lg transition"
            >
              <CardContent className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ishchi:</span>
                  <span className="font-semibold">{work.user_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ish soni:</span>
                  <span className="font-semibold">{work.amount} ta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ish turi:</span>
                  <span className="font-semibold">{work.type} sm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sana:</span>
                  <span className="font-semibold">
                    {formatDate(work.created_at || "")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">Ishlar topilmadi 😕</p>
        )}
      </div>
    </div>
  );
}
