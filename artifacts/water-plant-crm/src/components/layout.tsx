import { useGetTodayDashboard } from "@workspace/api-client-react";
import { formatCurrency } from "../lib/constants";
import { Droplet, IndianRupee, TrendingUp, Package } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";

export function Header() {
  const { data: today, isLoading } = useGetTodayDashboard();

  return (
    <header className="bg-primary text-primary-foreground py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Droplet className="w-6 h-6" />
              AquaTrack CRM
            </h1>
            <p className="text-primary-foreground/80 mt-1">
              Operations Dashboard • {format(new Date(), "EEEE, MMMM do, yyyy")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Today's Net Profit"
            value={isLoading ? null : formatCurrency(today?.netProfit || 0)}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={today?.netProfit ? today.netProfit > 0 ? "positive" : "negative" : "neutral"}
          />
          <StatCard
            title="Total Income"
            value={isLoading ? null : formatCurrency(today?.totalIncome || 0)}
            icon={<IndianRupee className="w-4 h-4" />}
            trend="positive"
          />
          <StatCard
            title="Total Expenses"
            value={isLoading ? null : formatCurrency(today?.totalExpenses || 0)}
            icon={<IndianRupee className="w-4 h-4" />}
            trend="negative"
          />
          <StatCard
            title="Cans Delivered"
            value={isLoading ? null : (today?.cansDelivered || 0).toString()}
            icon={<Package className="w-4 h-4" />}
            trend="neutral"
          />
        </div>
      </div>
    </header>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | null; icon: React.ReactNode; trend: "positive" | "negative" | "neutral" }) {
  return (
    <div className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm border border-primary-foreground/20">
      <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      {value === null ? (
        <Skeleton className="h-8 w-24 bg-primary-foreground/20" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </div>
  );
}
