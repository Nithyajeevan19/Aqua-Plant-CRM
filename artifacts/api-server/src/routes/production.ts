import { Router } from "express";
import { db } from "@workspace/db";
import { productionRecordsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/production/today", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const records = await db
    .select()
    .from(productionRecordsTable)
    .where(eq(productionRecordsTable.date, today))
    .limit(1);

  if (records.length === 0) {
    return res.json({
      id: 0,
      date: today,
      litersFiltered: 0,
      chemicalMixed: 0,
      wasteWater: 0,
      cansFilled: 0,
      cansDelivered: 0,
      cansLeft: 0,
      waterLeft: 0,
      machineRunningHours: 0,
      notes: null,
      createdAt: new Date().toISOString(),
    });
  }

  const r = records[0];
  return res.json({
    ...r,
    litersFiltered: Number(r.litersFiltered),
    chemicalMixed: Number(r.chemicalMixed),
    wasteWater: Number(r.wasteWater),
    waterLeft: Number(r.waterLeft),
    machineRunningHours: Number(r.machineRunningHours),
    cansLeft: r.cansFilled - r.cansDelivered,
  });
});

router.get("/production", async (req, res) => {
  const { date, month } = req.query as { date?: string; month?: string };

  let records;
  if (date) {
    records = await db
      .select()
      .from(productionRecordsTable)
      .where(eq(productionRecordsTable.date, date))
      .orderBy(desc(productionRecordsTable.date));
  } else if (month) {
    records = await db
      .select()
      .from(productionRecordsTable)
      .where(sql`to_char(${productionRecordsTable.date}, 'YYYY-MM') = ${month}`)
      .orderBy(desc(productionRecordsTable.date));
  } else {
    records = await db
      .select()
      .from(productionRecordsTable)
      .orderBy(desc(productionRecordsTable.date))
      .limit(30);
  }

  return res.json(
    records.map((r) => ({
      ...r,
      litersFiltered: Number(r.litersFiltered),
      chemicalMixed: Number(r.chemicalMixed),
      wasteWater: Number(r.wasteWater),
      waterLeft: Number(r.waterLeft),
      machineRunningHours: Number(r.machineRunningHours),
      cansLeft: r.cansFilled - r.cansDelivered,
    }))
  );
});

router.post("/production", async (req, res) => {
  const { date, litersFiltered, chemicalMixed, wasteWater, cansFilled, cansDelivered, machineRunningHours, notes } = req.body;

  const waterLeft = Math.max(0, Number(litersFiltered) - Number(wasteWater) - Number(chemicalMixed));

  const [record] = await db
    .insert(productionRecordsTable)
    .values({
      date,
      litersFiltered: String(litersFiltered),
      chemicalMixed: String(chemicalMixed),
      wasteWater: String(wasteWater),
      cansFilled: Number(cansFilled),
      cansDelivered: Number(cansDelivered),
      waterLeft: String(waterLeft),
      machineRunningHours: String(machineRunningHours),
      notes: notes || null,
    })
    .returning();

  return res.status(201).json({
    ...record,
    litersFiltered: Number(record.litersFiltered),
    chemicalMixed: Number(record.chemicalMixed),
    wasteWater: Number(record.wasteWater),
    waterLeft: Number(record.waterLeft),
    machineRunningHours: Number(record.machineRunningHours),
    cansLeft: record.cansFilled - record.cansDelivered,
  });
});

router.patch("/production/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { litersFiltered, chemicalMixed, wasteWater, cansFilled, cansDelivered, machineRunningHours, notes } = req.body;

  const existing = await db.select().from(productionRecordsTable).where(eq(productionRecordsTable.id, id)).limit(1);
  if (!existing.length) return res.status(404).json({ error: "Not found" });

  const updateData: Record<string, unknown> = {};
  if (litersFiltered !== undefined) updateData.litersFiltered = String(litersFiltered);
  if (chemicalMixed !== undefined) updateData.chemicalMixed = String(chemicalMixed);
  if (wasteWater !== undefined) updateData.wasteWater = String(wasteWater);
  if (cansFilled !== undefined) updateData.cansFilled = Number(cansFilled);
  if (cansDelivered !== undefined) updateData.cansDelivered = Number(cansDelivered);
  if (machineRunningHours !== undefined) updateData.machineRunningHours = String(machineRunningHours);
  if (notes !== undefined) updateData.notes = notes;

  const merged = { ...existing[0], ...updateData };
  const waterLeft = Math.max(0, Number(merged.litersFiltered) - Number(merged.wasteWater) - Number(merged.chemicalMixed));
  updateData.waterLeft = String(waterLeft);

  const [record] = await db
    .update(productionRecordsTable)
    .set(updateData)
    .where(eq(productionRecordsTable.id, id))
    .returning();

  return res.json({
    ...record,
    litersFiltered: Number(record.litersFiltered),
    chemicalMixed: Number(record.chemicalMixed),
    wasteWater: Number(record.wasteWater),
    waterLeft: Number(record.waterLeft),
    machineRunningHours: Number(record.machineRunningHours),
    cansLeft: record.cansFilled - record.cansDelivered,
  });
});

router.delete("/production/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(productionRecordsTable).where(eq(productionRecordsTable.id, id));
  return res.status(204).send();
});

export default router;
