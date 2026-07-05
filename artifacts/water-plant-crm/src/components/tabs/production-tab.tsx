import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetTodayProduction, 
  useListProduction, 
  useCreateProduction, 
  useUpdateProduction,
  getListProductionQueryKey,
  getGetTodayProductionQueryKey,
  ProductionRecord
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, Droplets, Activity, Box, Filter, Timer } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  litersFiltered: z.coerce.number().min(0, "Must be positive"),
  chemicalMixed: z.coerce.number().min(0, "Must be positive"),
  wasteWater: z.coerce.number().min(0, "Must be positive"),
  cansFilled: z.coerce.number().min(0, "Must be positive"),
  cansDelivered: z.coerce.number().min(0, "Must be positive"),
  machineRunningHours: z.coerce.number().min(0, "Must be positive"),
  notes: z.string().optional(),
});

export function ProductionTab() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: todayStats, isLoading: isLoadingToday } = useGetTodayProduction();
  const { data: productionList, isLoading: isLoadingList } = useListProduction({ date: dateStr });
  
  const currentRecord = productionList?.[0] as ProductionRecord | undefined;
  
  const createMutation = useCreateProduction();
  const updateMutation = useUpdateProduction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      litersFiltered: 0,
      chemicalMixed: 0,
      wasteWater: 0,
      cansFilled: 0,
      cansDelivered: 0,
      machineRunningHours: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (currentRecord) {
      form.reset({
        litersFiltered: currentRecord.litersFiltered,
        chemicalMixed: currentRecord.chemicalMixed,
        wasteWater: currentRecord.wasteWater,
        cansFilled: currentRecord.cansFilled,
        cansDelivered: currentRecord.cansDelivered,
        machineRunningHours: currentRecord.machineRunningHours,
        notes: currentRecord.notes || "",
      });
    } else {
      form.reset({
        litersFiltered: 0,
        chemicalMixed: 0,
        wasteWater: 0,
        cansFilled: 0,
        cansDelivered: 0,
        machineRunningHours: 0,
        notes: "",
      });
    }
  }, [currentRecord, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (currentRecord) {
      updateMutation.mutate(
        { id: currentRecord.id, data: values },
        {
          onSuccess: () => {
            toast({ title: "Production updated", description: "The record has been updated successfully." });
            queryClient.invalidateQueries({ queryKey: getListProductionQueryKey({ date: dateStr }) });
            queryClient.invalidateQueries({ queryKey: getGetTodayProductionQueryKey() });
          },
          onError: () => {
            toast({ title: "Error", description: "Failed to update record.", variant: "destructive" });
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: { ...values, date: dateStr } },
        {
          onSuccess: () => {
            toast({ title: "Production logged", description: "The record has been created successfully." });
            queryClient.invalidateQueries({ queryKey: getListProductionQueryKey({ date: dateStr }) });
            queryClient.invalidateQueries({ queryKey: getGetTodayProductionQueryKey() });
          },
          onError: () => {
            toast({ title: "Error", description: "Failed to create record.", variant: "destructive" });
          }
        }
      );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Top Stat Cards (Always shows today) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <StatCard title="Filtered" value={todayStats?.litersFiltered} unit="L" icon={<Filter />} isLoading={isLoadingToday} />
          <StatCard title="Filled" value={todayStats?.cansFilled} unit="cans" icon={<Box />} isLoading={isLoadingToday} />
          <StatCard title="Delivered" value={todayStats?.cansDelivered} unit="cans" icon={<Box />} isLoading={isLoadingToday} />
          <StatCard title="Left" value={todayStats?.cansLeft} unit="cans" icon={<Box />} isLoading={isLoadingToday} />
          <StatCard title="Water Left" value={todayStats?.waterLeft} unit="L" icon={<Droplets />} isLoading={isLoadingToday} />
          <StatCard title="Machine" value={todayStats?.machineRunningHours} unit="hrs" icon={<Timer />} isLoading={isLoadingToday} />
          <StatCard title="Chemical" value={todayStats?.chemicalMixed} unit="L" icon={<Activity />} isLoading={isLoadingToday} />
          <StatCard title="Waste" value={todayStats?.wasteWater} unit="L" icon={<Droplets />} isLoading={isLoadingToday} />
        </div>
      </div>

      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold">Production Log</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {isLoadingList ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{currentRecord ? "Edit Record" : "Log Production"} for {format(selectedDate, "MMM do, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="litersFiltered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Liters Filtered</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" {...field} className="pr-8" />
                            <span className="absolute right-3 top-2 text-muted-foreground text-sm">L</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chemicalMixed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chemical Mixed</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" {...field} className="pr-8" />
                            <span className="absolute right-3 top-2 text-muted-foreground text-sm">L</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wasteWater"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waste Water</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" {...field} className="pr-8" />
                            <span className="absolute right-3 top-2 text-muted-foreground text-sm">L</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cansFilled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cans Filled</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" {...field} className="pr-12" />
                            <span className="absolute right-3 top-2 text-muted-foreground text-sm">cans</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cansDelivered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cans Delivered</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" {...field} className="pr-12" />
                            <span className="absolute right-3 top-2 text-muted-foreground text-sm">cans</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="machineRunningHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machine Running Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" step="0.1" {...field} className="pr-10" />
                            <span className="absolute right-3 top-2 text-muted-foreground text-sm">hrs</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any anomalies or remarks for today..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : currentRecord ? "Update Record" : "Save Record"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ title, value, unit, icon, isLoading }: { title: string; value?: number; unit: string; icon: React.ReactNode; isLoading: boolean }) {
  return (
    <div className="bg-card border border-border p-3 rounded-lg shadow-sm flex flex-col items-start gap-2">
      <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 w-full">
        {icon && <span className="text-primary/60 w-3 h-3 [&>svg]:w-full [&>svg]:h-full">{icon}</span>}
        <span className="truncate">{title}</span>
      </div>
      {isLoading ? (
        <Skeleton className="h-6 w-16" />
      ) : (
        <div className="text-lg font-bold">
          {value || 0} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
        </div>
      )}
    </div>
  );
}
