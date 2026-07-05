export const EXPENSE_CATEGORIES = [
  "Electricity",
  "Fuel",
  "Chemicals",
  "Vehicle Maintenance",
  "Machine Servicing",
  "Staff Salaries",
  "Rent",
  "Miscellaneous"
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  "Electricity": "bg-yellow-500",
  "Fuel": "bg-orange-500",
  "Chemicals": "bg-cyan-500",
  "Vehicle Maintenance": "bg-slate-500",
  "Machine Servicing": "bg-blue-500",
  "Staff Salaries": "bg-green-500",
  "Rent": "bg-purple-500",
  "Miscellaneous": "bg-gray-400"
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
};
