import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, subMonths, addMonths } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListIncome,
  useCreateIncome,
  useDeleteIncome,
  useGetTodayDashboard,
  useGetMonthlyDashboard,
  getListIncomeQueryKey,
  getGetTodayDashboardQueryKey,
  getGetMonthlyDashboardQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, TrendingUp, IndianRupee, CreditCard, Wallet, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import { formatCurrency } from "@/lib/constants";

const formSchema = z.object({
  date: z.string(),
  customerName: z.string().min(1, "Customer name is required"),
  liters: z.coerce.number().min(1, "Liters required"),
  cashAmount: z.coerce.number().min(0),
  upiAmount: z.coerce.number().min(0),
  creditAmount: z.coerce.number().min(0),
  notes: z.string().optional()
});

export function IncomeTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [listMonth, setListMonth] = useState(new Date());

  const { data: today, isLoading: isLoadingToday } = useGetTodayDashboard();
  const { data: monthly, isLoading: isLoadingMonthly } = useGetMonthlyDashboard({ months: 6 });
  const { data: incomeList, isLoading: isLoadingList } = useListIncome({ month: format(listMonth, "yyyy-MM") });

  const createMutation = useCreateIncome();
  const deleteMutation = useDeleteIncome();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      customerName: "",
      liters: 0,
      cashAmount: 0,
      upiAmount: 0,
      creditAmount: 0,
      notes: ""
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Income recorded", description: "Successfully saved the income record." });
          queryClient.invalidateQueries({ queryKey: getListIncomeQueryKey({ month: format(listMonth, "yyyy-MM") }) });
          queryClient.invalidateQueries({ queryKey: getGetTodayDashboardQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMonthlyDashboardQueryKey({ months: 6 }) });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add income record.", variant: "destructive" });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Record deleted", description: "The income record was removed." });
            queryClient.invalidateQueries({ queryKey: getListIncomeQueryKey({ month: format(listMonth, "yyyy-MM") }) });
            queryClient.invalidateQueries({ queryKey: getGetTodayDashboardQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetMonthlyDashboardQueryKey({ months: 6 }) });
          }
        }
      );
    }
  };

  const chartData = monthly?.months.map(m => ({
    name: m.month,
    Revenue: m.totalIncome,
    Expenses: m.totalExpenses,
    Profit: m.netProfit
  })).reverse() || [];

  const paymentData = monthly?.months.map(m => ({
    name: m.month,
    Cash: m.cashIncome,
    UPI: m.upiIncome,
    Credit: m.creditIncome
  })).reverse() || [];

  return (
    <div className="p-4 md:p-6 space-y-8">
      
      {/* Today's Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Sales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Income" value={formatCurrency(today?.totalIncome || 0)} icon={<IndianRupee />} isLoading={isLoadingToday} color="text-primary" />
          <StatCard title="Cash Sales" value={formatCurrency(today?.cashIncome || 0)} icon={<Wallet />} isLoading={isLoadingToday} color="text-emerald-600" />
          <StatCard title="UPI Sales" value={formatCurrency(today?.upiIncome || 0)} icon={<CreditCard />} isLoading={isLoadingToday} color="text-blue-600" />
          <StatCard title="Credit Given" value={formatCurrency(today?.creditIncome || 0)} icon={<CalendarIcon />} isLoading={isLoadingToday} color="text-orange-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1 border-primary/20 shadow-md">
          <CardHeader className="bg-muted/50 border-b pb-4">
            <CardTitle>Record Sale</CardTitle>
            <CardDescription>Log a new delivery and payment</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="liters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volume (L)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe or Shop Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-muted/30 rounded-lg space-y-4 border">
                  <div className="text-sm font-medium mb-2">Payment Split</div>
                  <FormField
                    control={form.control}
                    name="cashAmount"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4 space-y-0">
                        <FormLabel className="w-16">Cash</FormLabel>
                        <FormControl>
                          <Input type="number" className="flex-1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="upiAmount"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4 space-y-0">
                        <FormLabel className="w-16">UPI</FormLabel>
                        <FormControl>
                          <Input type="number" className="flex-1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="creditAmount"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4 space-y-0">
                        <FormLabel className="w-16">Credit</FormLabel>
                        <FormControl>
                          <Input type="number" className="flex-1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Save Record"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Sales Ledger</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setListMonth(prev => subMonths(prev, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-24 text-center">{format(listMonth, "MMM yyyy")}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setListMonth(prev => addMonths(prev, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[500px]">
            {isLoadingList ? (
              <div className="space-y-2 mt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : incomeList?.length === 0 ? (
              <div className="h-full min-h-[200px] flex items-center justify-center text-muted-foreground border border-dashed rounded-lg mt-4">
                No sales recorded for this month.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeList?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                        {format(new Date(item.date), "MMM dd")}
                      </TableCell>
                      <TableCell className="font-medium">{item.customerName}</TableCell>
                      <TableCell>{item.liters} L</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatCurrency(item.totalAmount)}
                        <div className="text-[10px] font-normal text-muted-foreground flex justify-end gap-1 mt-0.5">
                          {item.cashAmount > 0 && <span>C:{item.cashAmount}</span>}
                          {item.upiAmount > 0 && <span>U:{item.upiAmount}</span>}
                          {item.creditAmount > 0 && <span className="text-orange-600">Cr:{item.creditAmount}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)} disabled={deleteMutation.isPending}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Charts */}
      <div className="pt-8 border-t">
        <h2 className="text-xl font-semibold mb-6">Financial Overview (Last 6 Months)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoadingMonthly ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{fontSize: 12}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Area type="monotone" dataKey="Revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="Expenses" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoadingMonthly ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{fontSize: 12}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="Cash" stackId="a" fill="#059669" />
                    <Bar dataKey="UPI" stackId="a" fill="#2563eb" />
                    <Bar dataKey="Credit" stackId="a" fill="#ea580c" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, isLoading, color }: { title: string; value: string; icon: React.ReactNode; isLoading: boolean; color: string }) {
  return (
    <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <div className={color}>{icon}</div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </div>
  );
}
