import { Router } from "express";
import { db } from "@workspace/db";
import { productionRecordsTable, expensesTable, incomeRecordsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/today", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const [prodRow] = await db
    .select()
    .from(productionRecordsTable)
    .where(sql`${productionRecordsTable.date} = ${today}`)
    .limit(1);

  const expenseRows = await db
    .select({ total: sql<string>`COALESCE(sum(${expensesTable.amount}), 0)` })
    .from(expensesTable)
    .where(sql`${expensesTable.date} = ${today}`);

  const incomeRows = await db
    .select({
      cashIncome: sql<string>`COALESCE(sum(${incomeRecordsTable.cashAmount}), 0)`,
      upiIncome: sql<string>`COALESCE(sum(${incomeRecordsTable.upiAmount}), 0)`,
      creditIncome: sql<string>`COALESCE(sum(${incomeRecordsTable.creditAmount}), 0)`,
    })
    .from(incomeRecordsTable)
    .where(sql`${incomeRecordsTable.date} = ${today}`);

  const totalExpenses = Number(expenseRows[0]?.total || 0);
  const cashIncome = Number(incomeRows[0]?.cashIncome || 0);
  const upiIncome = Number(incomeRows[0]?.upiIncome || 0);
  const creditIncome = Number(incomeRows[0]?.creditIncome || 0);
  const totalIncome = cashIncome + upiIncome + creditIncome;

  return res.json({
    date: today,
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    cashIncome,
    upiIncome,
    creditIncome,
    litersFiltered: prodRow ? Number(prodRow.litersFiltered) : 0,
    cansFilled: prodRow?.cansFilled || 0,
    cansDelivered: prodRow?.cansDelivered || 0,
    cansLeft: prodRow ? (prodRow.cansFilled - prodRow.cansDelivered) : 0,
    machineRunningHours: prodRow ? Number(prodRow.machineRunningHours) : 0,
  });
});

router.get("/dashboard/monthly", async (req, res) => {
  const months = Math.min(Number(req.query.months) || 6, 12);

  const monthRows = await db
    .select({
      month: sql<string>`to_char(${incomeRecordsTable.date}, 'YYYY-MM')`,
      cashIncome: sql<string>`COALESCE(sum(${incomeRecordsTable.cashAmount}), 0)`,
      upiIncome: sql<string>`COALESCE(sum(${incomeRecordsTable.upiAmount}), 0)`,
      creditIncome: sql<string>`COALESCE(sum(${incomeRecordsTable.creditAmount}), 0)`,
    })
    .from(incomeRecordsTable)
    .where(sql`${incomeRecordsTable.date} >= (CURRENT_DATE - (${months} || ' months')::interval)::date`)
    .groupBy(sql`to_char(${incomeRecordsTable.date}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${incomeRecordsTable.date}, 'YYYY-MM') ASC`);

  const expenseRows = await db
    .select({
      month: sql<string>`to_char(${expensesTable.date}, 'YYYY-MM')`,
      total: sql<string>`COALESCE(sum(${expensesTable.amount}), 0)`,
    })
    .from(expensesTable)
    .where(sql`${expensesTable.date} >= (CURRENT_DATE - (${months} || ' months')::interval)::date`)
    .groupBy(sql`to_char(${expensesTable.date}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${expensesTable.date}, 'YYYY-MM') ASC`);

  const prodRows = await db
    .select({
      month: sql<string>`to_char(${productionRecordsTable.date}, 'YYYY-MM')`,
      totalLiters: sql<string>`COALESCE(sum(${productionRecordsTable.litersFiltered}), 0)`,
      totalCans: sql<string>`COALESCE(sum(${productionRecordsTable.cansDelivered}), 0)`,
    })
    .from(productionRecordsTable)
    .where(sql`${productionRecordsTable.date} >= (CURRENT_DATE - (${months} || ' months')::interval)::date`)
    .groupBy(sql`to_char(${productionRecordsTable.date}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${productionRecordsTable.date}, 'YYYY-MM') ASC`);

  const expenseByMonth: Record<string, number> = {};
  for (const r of expenseRows) expenseByMonth[r.month] = Number(r.total);

  const prodByMonth: Record<string, { liters: number; cans: number }> = {};
  for (const r of prodRows) prodByMonth[r.month] = { liters: Number(r.totalLiters), cans: Number(r.totalCans) };

  const allMonths = new Set([
    ...monthRows.map((r) => r.month),
    ...Object.keys(expenseByMonth),
    ...Object.keys(prodByMonth),
  ]);

  const sortedMonths = Array.from(allMonths).sort().slice(-months);

  const result = sortedMonths.map((m) => {
    const incRow = monthRows.find((r) => r.month === m);
    const cashIncome = Number(incRow?.cashIncome || 0);
    const upiIncome = Number(incRow?.upiIncome || 0);
    const creditIncome = Number(incRow?.creditIncome || 0);
    const totalIncome = cashIncome + upiIncome + creditIncome;
    const totalExpenses = expenseByMonth[m] || 0;
    const prod = prodByMonth[m] || { liters: 0, cans: 0 };

    return {
      month: m,
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      cashIncome,
      upiIncome,
      creditIncome,
      totalLiters: prod.liters,
      totalCansDelivered: prod.cans,
    };
  });

  return res.json({ months: result });
});

export default router;
