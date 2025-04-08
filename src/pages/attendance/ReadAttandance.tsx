import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttandances } from "@/features/attandance/Attandance";

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
  check_in: string; // ISO format: "2025-04-07T08:00:00"
  check_out: string | null;
  worked_hours: number;
  fullname: string;
};

type GroupedData = {
  [date: string]: Entry[];
};

const groupByDate = (data: Entry[]): GroupedData => {
  return data.reduce((acc, entry) => {
    const date = entry.check_in.split("T")[0]; // "2025-04-07"
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as GroupedData);
};

const AttendanceTable = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const { data, isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: getAttandances,
  });

  if (isLoading) return <div>Yuklanmoqda...</div>;

  // Filtering data based on selected month
  const filteredData = data.filter((entry: any) => {
    const entryMonth = new Date(entry.check_in).getMonth();
    return entryMonth === selectedMonth;
  });

  const grouped = groupByDate(filteredData);

  return (
    <div className="py-16 px-4">
      <div className="overflow-x-auto py-2">
        <h1 className="text-lg font-semibold mb-4">Ishga kelish va ketish</h1>

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
          <div key={date} className="mb-6">
            <h2 className="text-sm font-semibold mb-2 pb-1">{date}</h2>
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Ishchi</th>
                  <th className="border px-4 py-2">Keldi</th>
                  <th className="border px-4 py-2">Keti</th>
                  <th className="border px-4 py-2">Ish soat</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border px-4 py-2">{entry.fullname}</td>
                    <td className="border px-4 py-2">
                      {entry.check_in ? (
                        new Date(entry.check_in).toLocaleTimeString("uz-UZ", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      ) : (
                        <div>
                          <span className="text-red-500">Yo'q</span>
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {entry.check_out ? (
                        new Date(entry.check_out).toLocaleTimeString("uz-UZ", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      ) : (
                        <div>
                          <span className="text-red-500">Yo'q</span>
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">{entry.worked_hours}</td>
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

export default AttendanceTable;
