declare type StockSummary = {
  total_stock_quantity: number;
  total_stock_value: string;
  total_incoming_quantity: number;
  total_incoming_value: string;
  total_incoming_expense: string;
  total_outgoing_quantity: number;
  total_outgoing_value: string;
  total_outgoing_expense: string;
  average_flaw_percentage: string;
  total_incoming_flaw_quantity: string;
  total_outgoing_flaw_quantity: string;
};

declare type Product = {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  price: string;
  low_stock_threshold: number;
  created_at?: string;
};

declare type User = {
  id?: number;
  fullname: string;
  phone: string;
  password: string;
  role: string;
  salary_type: "oylik" | "soatlik" | "ish_bay"; // Oylik yoki soatlik bo'lishi mumkin
  salary_amount: string;
  total_hours?: string;
  final_salary?: string;
  total_received?: string;
  total_output_products: string;
  created_at?: string; // ISO formatdagi sana va vaqt
};
