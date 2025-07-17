import { useState } from "react";
import { Input } from "@/components/ui/input";
import { getPartners } from "@/features/partners/partners";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export default function Partners() {
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partners"],
    queryFn: getPartners,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Xatolik yuz berdi!</div>;

  const partners: Partners[] = data;

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdminOrWorker = user?.role === "admin" || user?.role === "ishchi";

  return (
    <div className="py-20 px-4 flex flex-col gap-4 bg-red-100 h-screen overflow-y-auto">
      <Input
        type="text"
        placeholder="Hamkor izlash..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-black"
      />

      {isAdminOrWorker && (
        <div className="fixed bottom-25 right-4">
          <button
            className="bg-blue-500 text-white rounded-full text-lg p-2"
            onClick={() => navigate("/partners/add")}
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredPartners.length > 0 ? (
          filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 cursor-pointer"
              onClick={() =>
                navigate(`/faster-links`, {
                  state: {
                    id: partner.id,
                    partner: partner.name,
                    phone: partner.phone,
                  },
                })
              }
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <span>Ismi:</span>
                    <span className="font-semibold">{partner.name}</span>
                  </div>
                  <button
                    className="p-1 rounded-full bg-gray-200"
                    onClick={() => navigate(`/partners/${partner.id}`)}
                  >
                    <Ellipsis size={24} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <span>Telefon:</span>
                  <span className="font-semibold">{partner.phone}</span>
                </div>
                <div className="flex gap-2">
                  <span>Manzil:</span>
                  <span className="font-semibold">{partner.address}</span>
                </div>
                <div className="flex gap-2">
                  <span>
                    {partner.name}{" "}
                    <b className="text-red-500 font-semibold">Qarz:</b>
                  </span>
                  <span className="font-semibold">$ {partner.debt}</span>
                </div>
                <div className="flex gap-2">
                  <span>
                    {partner.name}{" "}
                    <b className="text-green-500 font-semibold">Haq:</b>
                  </span>
                  <span className="font-semibold">$ {partner.credit}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Hamkor topilmadi 😕</p>
        )}
      </div>
    </div>
  );
}
