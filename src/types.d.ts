declare type StockSummary = {
  total_products_quantity: string;
  total_incoming_quantity: string;
  total_incoming_value: string;
  total_incoming_expense: string;
  incoming_flaw_quantity: string;
  total_outgoing_quantity: string;
  total_outgoing_value: string;
  total_outgoing_expense: string;
  outgoing_flaw_quantity: string;
  average_flaw_percentage: string;
  total_warehouse_value: string;
};

declare type Product = {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  unit: "metr" | "santimetr" | "kg";
  low_stock_threshold: number;
  created_at?: string;
};

declare type User = {
  id?: number;
  fullname: string;
  phone: string;
  password?: string;
  role: string;
  salary_type: "oylik" | "soatlik" | "ish_bay";
  salary_amount: string;
  total_hours: string;
  final_salary: string;
  total_received: string;
  total_output_products: string;
  created_at: string; // ISO formatdagi sana va vaqt
};

declare type Partners = {
  id?: number;
  name: string;
  phone: string;
  address: string;
  username: string;
  password: string;
  role: "partner";
};

declare type InventoryProduct = {
  id?: number;
  product: Product;
  partner: Partners;
  user_name: string;
  type: "incoming" | "outgoing"; // Faqat kirim yoki chiqim
  quantity: number;
  price: string;
  total_price: string;
  expense: string;
  flaw: string;
  created_at?: string;
};

declare type PermissionTypes = {
  id?: number;
  role: "admin" | "hamkor" | "ishchi";
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
};

declare type Works = {
  id?: number;
  user_name: string;
  type: string;
  amount: string;
  created_at?: string;
};

declare type Transaction = {
  id?: number;
  amount: number;
  type: "income" | "expense";
  description: string;
  user: null | { id: number; fullname: string };
  partner: null | { id: number; name: string };
  debt: number;
  created_at: string;
};
