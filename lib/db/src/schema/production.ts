import { pgTable, serial, text, numeric, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productionRecordsTable = pgTable("production_records", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  litersFiltered: numeric("liters_filtered", { precision: 10, scale: 2 }).notNull(),
  chemicalMixed: numeric("chemical_mixed", { precision: 10, scale: 2 }).notNull(),
  wasteWater: numeric("waste_water", { precision: 10, scale: 2 }).notNull(),
  cansFilled: integer("cans_filled").notNull(),
  cansDelivered: integer("cans_delivered").notNull(),
  waterLeft: numeric("water_left", { precision: 10, scale: 2 }).notNull(),
  machineRunningHours: numeric("machine_running_hours", { precision: 6, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductionSchema = createInsertSchema(productionRecordsTable).omit({ id: true, createdAt: true });
export type InsertProduction = z.infer<typeof insertProductionSchema>;
export type ProductionRecord = typeof productionRecordsTable.$inferSelect;
