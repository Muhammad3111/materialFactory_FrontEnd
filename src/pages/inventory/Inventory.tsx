import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomingProducts from "./IncomingProducts";
import OutgoingProducts from "./ExpenseProducts";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function Inventory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeInventoryTab");
    if (savedTab) {
      setActiveTab(savedTab);
    } else {
      setActiveTab("income"); // Agar saqlanmagan bo‘lsa default
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("activeInventoryTab", value);
  };

  // activeTab null bo‘lsa (hali localStorage dan yuklanmay turib) loading holatini ko‘rsatamiz
  if (!activeTab) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-18 pb-24 px-4 h-screen overflow-y-auto bg-green-100">
      <div className="fixed bottom-25 right-4">
        <button
          className="bg-blue-500 text-white rounded-full text-lg p-2"
          onClick={() => navigate("/inventory/add-product")}
        >
          <Plus size={24} />
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full border border-black">
          <TabsTrigger
            value="income"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Kirim
          </TabsTrigger>
          <TabsTrigger
            value="expense"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Chiqim
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-2">
        {activeTab === "income" && <IncomingProducts />}
        {activeTab === "expense" && <OutgoingProducts />}
      </div>
    </div>
  );
}
