import { Router } from "express";
import { db } from "@workspace/db";
import { incomeRecordsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/income", async (req, res) => {
  const { month } = req.query as { month?: string };

  let query = db.select().from(incomeRecordsTable).$dynamic();

  if (month) {
    query = query.where(sql`to_char(${incomeRecordsTable.date}, 'YYYY-MM') = ${month}`);
  }

  const records = await query.orderBy(desc(incomeRecordsTable.date));

  return res.json(
    records.map((r) => ({
      ...r,
      cashAmount: Number(r.cashAmount),
      upiAmount: Number(r.upiAmount),
      creditAmount: Number(r.creditAmount),
      totalAmount: Number(r.cashAmount) + Number(r.upiAmount) + Number(r.creditAmount),
      liters: Number(r.liters),
    }))
  );
});

router.post("/income", async (req, res) => {
  const { date, cashAmount, upiAmount, creditAmount, customerName, liters, notes } = req.body;

  const [record] = await db
    .insert(incomeRecordsTable)
    .values({
      date,
      cashAmount: String(cashAmount || 0),
      upiAmount: String(upiAmount || 0),
      creditAmount: String(creditAmount || 0),
      customerName,
      liters: String(liters),
      notes: notes || null,
    })
    .returning();

  return res.status(201).json({
    ...record,
    cashAmount: Number(record.cashAmount),
    upiAmount: Number(record.upiAmount),
    creditAmount: Number(record.creditAmount),
    totalAmount: Number(record.cashAmount) + Number(record.upiAmount) + Number(record.creditAmount),
    liters: Number(record.liters),
  });
});

router.patch("/income/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { date, cashAmount, upiAmount, creditAmount, customerName, liters, notes } = req.body;

  const existing = await db.select().from(incomeRecordsTable).where(eq(incomeRecordsTable.id, id)).limit(1);
  if (!existing.length) return res.status(404).json({ error: "Not found" });

  const updateData: Record<string, unknown> = {};
  if (date !== undefined) updateData.date = date;
  if (cashAmount !== undefined) updateData.cashAmount = String(cashAmount);
  if (upiAmount !== undefined) updateData.upiAmount = String(upiAmount);
  if (creditAmount !== undefined) updateData.creditAmount = String(creditAmount);
  if (customerName !== undefined) updateData.customerName = customerName;
  if (liters !== undefined) updateData.liters = String(liters);
  if (notes !== undefined) updateData.notes = notes;

  const [record] = await db
    .update(incomeRecordsTable)
    .set(updateData)
    .where(eq(incomeRecordsTable.id, id))
    .returning();

  return res.json({
    ...record,
    cashAmount: Number(record.cashAmount),
    upiAmount: Number(record.upiAmount),
    creditAmount: Number(record.creditAmount),
    totalAmount: Number(record.cashAmount) + Number(record.upiAmount) + Number(record.creditAmount),
    liters: Number(record.liters),
  });
});

router.delete("/income/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(incomeRecordsTable).where(eq(incomeRecordsTable.id, id));
  return res.status(204).send();
});

export default router;
