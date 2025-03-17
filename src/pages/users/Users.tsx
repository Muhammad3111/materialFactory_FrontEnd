import { useState } from "react";
import { Input } from "@/components/ui/input";
import { getUsers } from "@/features/users/users";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Ellipsis, Plus } from "lucide-react";

export default function Users() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Qidiruv uchun state
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const users: User[] = data;

  // 🔍 Qidiruv natijalarini filter qilish
  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  // 📆 Sana formatlash funksiyasi
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="pt-16 px-4 flex flex-col gap-4">
      {/* 🔍 Qidiruv input */}
      <div>
        <Input
          type="text"
          placeholder="Foydalanuvchi izlash..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="fixed bottom-25 right-4">
        <button
          className="bg-blue-500 text-white rounded-full text-lg p-2"
          onClick={() => navigate("/users/add")}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* 👥 Userlar ro‘yxati */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-2xl bg-white shadow-md border flex flex-col gap-2 col-span-1"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold">{user.fullname}</h2>
                <button
                  className="p-1 rounded-full bg-gray-200"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <Ellipsis size={24} className="text-gray-600" />
                </button>
              </div>
              <a className="text-gray-600" href={`tel:${user.phone}`}>
                Tel raqam: {user.phone}
              </a>
              <p className="text-gray-600">Lavozimi: {user.role}</p>
              <p className="text-gray-500 text-sm">
                Sana: {formatDate(user.created_at || "")}
              </p>
              <p>Oylik turi: {user.salary_type}</p>
              <p>Oylik maosh: {Number(user.salary_amount)}</p>
              <p>Mahsulot soni: {Number(user.total_output_products)} ta</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Foydalanuvchi topilmadi 😕
          </p>
        )}
      </div>
    </div>
  );
}
