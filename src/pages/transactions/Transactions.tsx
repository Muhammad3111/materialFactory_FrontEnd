import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllTransactions } from "@/features/transactions/transactions";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const months = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

export default function Transactions() {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getAllTransactions(),
  });

  const navigate = useNavigate();

  const transactions = data
    ? data.filter((t: Transaction) => {
        const date = new Date(t.created_at);
        return date.getMonth() === selectedMonth;
      })
    : [];

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="pt-16 px-4 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-center">Tranzaksiyalar</h1>

      <div className="fixed bottom-25 right-4">
        <button
          className="bg-blue-500 text-white rounded-full text-lg p-2"
          onClick={() => navigate("/transactions/add")}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {months.map((month, index) => (
          <Button
            key={month}
            variant={selectedMonth === index ? "default" : "outline"}
            onClick={() => setSelectedMonth(index)}
          >
            {month}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <h1 className="text-center">Yuklanmoqda ...</h1>
        ) : transactions.length > 0 ? (
          transactions.map((transaction: Transaction) => (
            <Card
              key={transaction.id}
              className="p-4 rounded-2xl bg-white shadow-md border"
            >
              <CardContent className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Turi:</span>
                  <span
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "Kirim" : "Chiqim"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kimga:</span>
                  <span className="font-semibold">
                    {transaction.partner?.name || transaction.user?.fullname}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Miqdor:</span>
                  <span className="font-semibold">
                    {Number(transaction.amount)} $
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sana:</span>
                  <span className="font-semibold">
                    {formatDate(transaction.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Bu oydagi tranzaksiyalar topilmadi 😕
          </p>
        )}
      </div>
    </div>
  );
}
