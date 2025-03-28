import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/features/permissions/permissions"; // 👉 bu yerdan API chaqiruv funksiyasini import qilasiz
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Ellipsis, Plus, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Permissions() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  const navigate = useNavigate();

  if (isLoading) return <div className="pt-16 text-center">Yuklanmoqda...</div>;
  if (isError)
    return <div className="pt-16 text-center">Xatolik yuz berdi!</div>;

  const permissions: PermissionTypes[] = data || [];

  const filteredPermissions = permissions.filter((item) =>
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  const renderIcon = (value: boolean) =>
    value ? (
      <BadgeCheck className="text-green-500" size={20} />
    ) : (
      <XCircle className="text-red-500" size={20} />
    );

  return (
    <div className="pt-18 px-4 flex flex-col gap-6">
      <h1 className="text-xl font-bold">Ruxsatlar ro‘yxati</h1>

      <Input
        placeholder="Rol nomi bo‘yicha qidirish..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="fixed bottom-25 right-4">
        <button
          className="bg-blue-500 text-white rounded-full text-lg p-2"
          onClick={() => navigate("/permissions/add")}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredPermissions.length > 0 ? (
          filteredPermissions.map((perm) => (
            <Card
              key={perm.id}
              className="p-4 bg-white shadow-md border rounded-xl flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold capitalize">
                  {perm.role}
                </h2>
                <button
                  className="p-1 rounded-full bg-gray-200"
                  onClick={() => navigate(`/permissions/${perm.id}`)}
                >
                  <Ellipsis size={24} className="text-gray-600" />
                </button>
              </div>
              <CardContent className="flex flex-col gap-2 p-0">
                <div className="flex items-center justify-between">
                  <span>O‘qish (read):</span>
                  {renderIcon(perm.can_read)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Yaratish (create):</span>
                  {renderIcon(perm.can_create)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Yangilash (update):</span>
                  {renderIcon(perm.can_update)}
                </div>
                <div className="flex items-center justify-between">
                  <span>O‘chirish (delete):</span>
                  {renderIcon(perm.can_delete)}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">Ruxsatlar topilmadi 😕</p>
        )}
      </div>
    </div>
  );
}
