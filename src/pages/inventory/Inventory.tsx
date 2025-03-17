import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Inventory() {
  return (
    <div className="pt-16 px-4">
      <Tabs defaultValue="income">
        <TabsList className="w-full border">
          <TabsTrigger value="income">Kirim</TabsTrigger>
          <TabsTrigger value="expense">Chiqim</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="expense">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
