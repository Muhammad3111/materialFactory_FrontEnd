import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllWorks } from "@/features/addWork/addWork";

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

type Entry = {
  id: number;
  type: string;
  amount: string;
  user: { id: number; fullname: string };
  created_at: string;
};

type GroupedData = {
  [date: string]: Entry[];
};

const groupByDate = (data: Entry[]): GroupedData => {
  return data.reduce((acc, entry) => {
    const date = entry.created_at.split("T")[0]; // "2025-04-07"
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as GroupedData);
};

const ReadWorks = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const { data, isLoading } = useQuery({
    queryKey: ["works"],
    queryFn: getAllWorks,
  });

  if (isLoading) return <div>Yuklanmoqda...</div>;

  // Filtering data based on selected month
  const filteredData = data.filter((entry: any) => {
    const entryMonth = new Date(entry.created_at).getMonth();
    return entryMonth === selectedMonth;
  });

  const grouped = groupByDate(filteredData);

  return (
    <div className="py-16 px-4">
      <div className="overflow-x-auto py-2">
        <h1 className="text-lg font-semibold mb-4">Bajarilgan ishlar</h1>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {months.map((month, index) => (
            <button
              key={month}
              className={`px-4 py-2 rounded-md ${
                selectedMonth === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedMonth(index)}
            >
              {month}
            </button>
          ))}
        </div>

        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date}>
            <h2 className="text-sm font-semibold my-2">{date}</h2>
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Ishchi</th>
                  <th className="border px-4 py-2">Ish Soni</th>
                  <th className="border px-4 py-2">Ish turi</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border px-4 py-2">{entry.user?.fullname}</td>
                    <td className="border px-4 py-2">{entry.amount}</td>
                    <td className="border px-4 py-2">{entry.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadWorks;
