import { pgTable, serial, text, numeric, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const incomeRecordsTable = pgTable("income_records", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  cashAmount: numeric("cash_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  upiAmount: numeric("upi_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  creditAmount: numeric("credit_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  customerName: text("customer_name").notNull(),
  liters: numeric("liters", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertIncomeSchema = createInsertSchema(incomeRecordsTable).omit({ id: true, createdAt: true });
export type InsertIncome = z.infer<typeof insertIncomeSchema>;
export type IncomeRecord = typeof incomeRecordsTable.$inferSelect;
