/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllTransactions } from "@/features/transactions/transactions";
import { BetweenHorizontalStart, Plus, Table } from "lucide-react";

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

const groupByDate = (data: Transaction[]) => {
    return data.reduce((acc, item) => {
        const date = item.created_at!.split("T")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {} as Record<string, Transaction[]>);
};

const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
        date: `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
        ).padStart(2, "0")}/${d.getFullYear()}`,
        hour: `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
        ).padStart(2, "0")}`,
    };
};

export default function Transactions() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("grid");
    const navigate = useNavigate();
    const location = useLocation();

    const { data: allTransactions = [], isLoading } = useQuery({
        queryKey: ["transactions"],
        queryFn: () => getAllTransactions(""),
    });

    useEffect(() => {
        const partner = location.state?.partner;
        if (partner) setSearchQuery(partner);
        console.log("Location state:", location.state);
    }, [location.state]);

    useEffect(() => {
        const saved = localStorage.getItem("activeTransactionTab");
        if (saved) setActiveTab(saved);
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        localStorage.setItem("activeTransactionTab", value);
    };

    const filteredTransactions = useMemo(() => {
        const search = searchQuery.toLowerCase();
        return allTransactions.filter((t: any) => {
            const monthMatch =
                new Date(t.created_at).getMonth() === selectedMonth;

            const partner = t.partner?.name?.toLowerCase() || "";
            const user = t.user?.fullname?.toLowerCase() || "";

            const searchMatch =
                partner.includes(search) || user.includes(search);
            return monthMatch && searchMatch;
        });
    }, [allTransactions, selectedMonth, searchQuery]);

    const groupedTransactions = useMemo(
        () => groupByDate(filteredTransactions),
        [filteredTransactions]
    );

    return (
        <div className="py-20 px-4 flex flex-col gap-4 bg-blue-100">
            <h1 className="text-xl font-bold text-center">Tranzaksiyalar</h1>

            {/* Qidiruv + Tablar */}
            <div className="flex items-center gap-2">
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hamkor yoki foydalanuvchi bo‘yicha izlash..."
                    className="max-w-md border border-gray-400"
                />
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="border rounded-md">
                        <TabsTrigger
                            value="grid"
                            className="p-1.5 data-[state=active]:border data-[state=active]:border-black"
                        >
                            <BetweenHorizontalStart size={20} />
                        </TabsTrigger>
                        <TabsTrigger
                            value="table"
                            className="p-1.5 data-[state=active]:border data-[state=active]:border-black"
                        >
                            <Table size={20} />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Oylik filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {months.map((month, i) => (
                    <Button
                        key={month}
                        variant={selectedMonth === i ? "default" : "outline"}
                        onClick={() => setSelectedMonth(i)}
                    >
                        {month}
                    </Button>
                ))}
            </div>

            {/* Qo‘shish tugmasi */}
            <div className="fixed bottom-24 right-4">
                <button
                    className="bg-blue-500 text-white rounded-full p-3"
                    onClick={() => navigate("/transactions/add")}
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Kontent */}
            <div className="h-[70vh] overflow-y-auto">
                {isLoading ? (
                    <p className="text-center">Yuklanmoqda...</p>
                ) : activeTab === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((t: Transaction) => (
                                <Card
                                    key={t.id}
                                    className="bg-white border shadow rounded-2xl p-4"
                                >
                                    <CardContent className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Turi:
                                            </span>
                                            <span
                                                className={`font-semibold ${
                                                    t.type === "income"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {t.type === "income"
                                                    ? "Kirim"
                                                    : "Chiqim"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Kimga:
                                            </span>
                                            <span className="font-semibold">
                                                {t.partner?.name ||
                                                    t.user?.fullname}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Miqdor:</span>
                                            <span>{t.amount} $</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Qarz:</span>
                                            <span>{t.debt} $</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Soat:</span>
                                            <span>
                                                {
                                                    formatDateTime(t.created_at)
                                                        .hour
                                                }
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                Tranzaksiyalar topilmadi 😕
                            </p>
                        )}
                    </div>
                ) : (
                    Object.entries(groupedTransactions).map(
                        ([date, entries]) => (
                            <div key={date} className="mb-6">
                                <h2 className="text-sm font-semibold my-2">
                                    {date}
                                </h2>
                                <table className="w-max border text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {[
                                                "Turi",
                                                "Kimga",
                                                "Miqdor",
                                                "Qarz",
                                                "Soat",
                                            ].map((h) => (
                                                <th
                                                    key={h}
                                                    className="border px-2 py-1"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-100">
                                        {entries.map((t) => (
                                            <tr key={t.id}>
                                                <td className="border p-2">
                                                    <span
                                                        className={`font-semibold ${
                                                            t.type === "income"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {t.type === "income"
                                                            ? "Kirim"
                                                            : "Chiqim"}
                                                    </span>
                                                </td>
                                                <td className="border p-2">
                                                    {t.partner?.name ||
                                                        t.user?.fullname}
                                                </td>
                                                <td className="border p-2">
                                                    {t.amount} $
                                                </td>
                                                <td className="border p-2">
                                                    {t.debt} $
                                                </td>
                                                <td className="border p-2">
                                                    {
                                                        formatDateTime(
                                                            t.created_at
                                                        ).hour
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
}
