import { Router } from "express";
import { db } from "@workspace/db";
import { expensesTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

const ALL_CATEGORIES = [
  "Electricity",
  "Fuel",
  "Chemicals",
  "Vehicle Maintenance",
  "Machine Servicing",
  "Staff Salaries",
  "Rent",
  "Miscellaneous",
];

router.get("/expenses/summary", async (req, res) => {
  const { month } = req.query as { month?: string };
  const targetMonth = month || new Date().toISOString().slice(0, 7);

  const rows = await db
    .select({
      category: expensesTable.category,
      total: sql<string>`sum(${expensesTable.amount})`,
    })
    .from(expensesTable)
    .where(sql`to_char(${expensesTable.date}, 'YYYY-MM') = ${targetMonth}`)
    .groupBy(expensesTable.category);

  const byCategoryMap: Record<string, number> = {};
  for (const row of rows) {
    byCategoryMap[row.category] = Number(row.total);
  }

  const byCategory = ALL_CATEGORIES.map((cat) => ({
    category: cat,
    total: byCategoryMap[cat] || 0,
  }));

  const totalExpenses = byCategory.reduce((sum, c) => sum + c.total, 0);

  return res.json({ month: targetMonth, totalExpenses, byCategory });
});

router.get("/expenses", async (req, res) => {
  const { month, category } = req.query as { month?: string; category?: string };

  let query = db.select().from(expensesTable).$dynamic();

  const conditions = [];
  if (month) conditions.push(sql`to_char(${expensesTable.date}, 'YYYY-MM') = ${month}`);
  if (category) conditions.push(eq(expensesTable.category, category));

  if (conditions.length > 0) {
    query = query.where(sql`${conditions.reduce((acc, c) => sql`${acc} AND ${c}`)}`);
  }

  const expenses = await query.orderBy(desc(expensesTable.date));

  return res.json(
    expenses.map((e) => ({
      ...e,
      amount: Number(e.amount),
    }))
  );
});

router.post("/expenses", async (req, res) => {
  const { date, category, amount, description } = req.body;

  const [expense] = await db
    .insert(expensesTable)
    .values({ date, category, amount: String(amount), description })
    .returning();

  return res.status(201).json({ ...expense, amount: Number(expense.amount) });
});

router.patch("/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { date, category, amount, description } = req.body;

  const existing = await db.select().from(expensesTable).where(eq(expensesTable.id, id)).limit(1);
  if (!existing.length) return res.status(404).json({ error: "Not found" });

  const updateData: Record<string, unknown> = {};
  if (date !== undefined) updateData.date = date;
  if (category !== undefined) updateData.category = category;
  if (amount !== undefined) updateData.amount = String(amount);
  if (description !== undefined) updateData.description = description;

  const [expense] = await db
    .update(expensesTable)
    .set(updateData)
    .where(eq(expensesTable.id, id))
    .returning();

  return res.json({ ...expense, amount: Number(expense.amount) });
});

router.delete("/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(expensesTable).where(eq(expensesTable.id, id));
  return res.status(204).send();
});

export default router;
