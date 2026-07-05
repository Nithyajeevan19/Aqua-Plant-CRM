import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout";
import { ProductionTab } from "@/components/tabs/production-tab";
import { ExpenseTab } from "@/components/tabs/expense-tab";
import { IncomeTab } from "@/components/tabs/income-tab";
import { Activity, IndianRupee, Receipt } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("production");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-8 bg-muted border border-border">
            <TabsTrigger value="production" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Activity className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Daily Production</span>
              <span className="sm:hidden">Production</span>
            </TabsTrigger>
            <TabsTrigger value="expense" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Receipt className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Expense Management</span>
              <span className="sm:hidden">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <IndianRupee className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Income Management</span>
              <span className="sm:hidden">Income</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-card border border-border rounded-xl shadow-sm min-h-[500px]">
            <TabsContent value="production" className="m-0 focus-visible:outline-none">
              <ProductionTab />
            </TabsContent>
            
            <TabsContent value="expense" className="m-0 focus-visible:outline-none">
              <ExpenseTab />
            </TabsContent>
            
            <TabsContent value="income" className="m-0 focus-visible:outline-none">
              <IncomeTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
