import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    getIncomingProducts,
    getOutgoingProducts,
} from "@/features/inventroyLogs/inventoryLogs";

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

type GroupedData = {
    [date: string]: InventoryProduct[];
};

const groupByDate = (data: InventoryProduct[]): GroupedData => {
    return data.reduce((acc, entry) => {
        const date = entry.created_at!.split("T")[0]; // e.g. "2025-04-07"
        if (!acc[date]) acc[date] = [];
        acc[date].push(entry);
        return acc;
    }, {} as GroupedData);
};

const ReportInventory = () => {
    const [selectedMonth, setSelectedMonth] = useState<number>(
        new Date().getMonth()
    );

    const { data: incomingProducts = [], isLoading: loadingIncoming } =
        useQuery({
            queryKey: ["inventoryLogs", "incoming"],
            queryFn: () => getIncomingProducts(""),
        });

    const { data: outgoingProducts = [], isLoading: loadingOutgoing } =
        useQuery({
            queryKey: ["inventoryLogs", "outgoing"],
            queryFn: () => getOutgoingProducts(""),
        });

    const isLoading = loadingIncoming || loadingOutgoing;

    const mergedData = useMemo(() => {
        return [...incomingProducts, ...outgoingProducts];
    }, [incomingProducts, outgoingProducts]);

    const filteredData = useMemo(() => {
        return mergedData.filter((entry) => {
            const entryMonth = new Date(entry.created_at).getMonth();
            return entryMonth === selectedMonth;
        });
    }, [mergedData, selectedMonth]);

    const grouped = useMemo(() => groupByDate(filteredData), [filteredData]);

    if (isLoading) return <div>Yuklanmoqda...</div>;
    const flawCount = (entry: InventoryProduct) => {
        return (entry.quantity * Number(entry.flaw)) / 100 || 0;
    };
    return (
        <div className="py-20 px-4">
            <div className="overflow-x-auto py-2">
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

                <div className="h-[65vh] overflow-y-auto">
                    {Object.entries(grouped).map(([date, entries]) => (
                        <div key={date} className="h-max overflow-auto py-1">
                            <h2 className="text-sm font-semibold my-2">
                                {date}
                            </h2>
                            <table className="table-auto w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2">
                                            Mahsulot
                                        </th>
                                        <th className="border px-4 py-2">
                                            Hamkor
                                        </th>
                                        <th className="border px-4 py-2">
                                            Xodim
                                        </th>
                                        <th className="border px-4 py-2">
                                            Metr
                                        </th>
                                        <th className="border px-4 py-2">
                                            Santimetr
                                        </th>
                                        <th className="border px-4 py-2">
                                            Shtuk
                                        </th>
                                        <th className="border px-4 py-2">
                                            Narx 1ta
                                        </th>
                                        <th className="border px-4 py-2">
                                            Umumiy narx
                                        </th>
                                        <th className="border px-4 py-2">
                                            Kamomat
                                        </th>
                                        <th className="border px-4 py-2">
                                            Sof Mahsulot
                                        </th>
                                        <th className="border px-4 py-2">
                                            Xarajat
                                        </th>
                                        <th className="border px-4 py-2">
                                            Chek turi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td className="border px-4 py-2">
                                                Nomi:{" "}
                                                <b>{entry.product.name}</b>{" "}
                                                Bo'limi:{" "}
                                                <b>{entry.product.category}</b>
                                            </td>
                                            <td className="border px-4 py-2">
                                                {entry.partner.name}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {entry.user_name}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {entry.quantity_meters}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {entry.length_cm}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {entry.quantity}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {entry.price}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {entry.total_price}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {Number(entry.flaw)}% /{" "}
                                                {flawCount(entry)}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {Number(entry.quantity) -
                                                    flawCount(entry)}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {Number(entry.expense)}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 ${
                                                    entry.type === "incoming"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {entry.type === "incoming"
                                                    ? "Kirim"
                                                    : "Chiqim"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportInventory;
