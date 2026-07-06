import { db, pool, productionRecordsTable } from "./index";
import { eq } from "drizzle-orm";

const productionData = [
  {
    "date": "2026-07-01",
    "litersFiltered": 1800,
    "chemicalMixed": 18,
    "wasteWater": 90,
    "cansFilled": 360,
    "cansDelivered": 340,
    "machineRunningTime": 8,
    "notes": "Normal production. All systems operating efficiently."
  },
  {
    "date": "2026-07-02",
    "litersFiltered": 1950,
    "chemicalMixed": 19,
    "wasteWater": 95,
    "cansFilled": 390,
    "cansDelivered": 380,
    "machineRunningTime": 8.5,
    "notes": "High production due to increased customer demand."
  },
  {
    "date": "2026-07-03",
    "litersFiltered": 1720,
    "chemicalMixed": 17,
    "wasteWater": 82,
    "cansFilled": 345,
    "cansDelivered": 330,
    "machineRunningTime": 7.5,
    "notes": "Routine maintenance completed before production."
  },
  {
    "date": "2026-07-04",
    "litersFiltered": 2100,
    "chemicalMixed": 21,
    "wasteWater": 102,
    "cansFilled": 420,
    "cansDelivered": 405,
    "machineRunningTime": 9,
    "notes": "Weekend bulk orders processed."
  },
  {
    "date": "2026-07-05",
    "litersFiltered": 1600,
    "chemicalMixed": 16,
    "wasteWater": 80,
    "cansFilled": 320,
    "cansDelivered": 300,
    "machineRunningTime": 7,
    "notes": "Lower production due to scheduled cleaning."
  },
  {
    "date": "2026-07-06",
    "litersFiltered": 2250,
    "chemicalMixed": 22,
    "wasteWater": 108,
    "cansFilled": 450,
    "cansDelivered": 435,
    "machineRunningTime": 9.5,
    "notes": "Excellent production with zero machine downtime."
  },
  {
    "date": "2026-07-07",
    "litersFiltered": 1875,
    "chemicalMixed": 18.5,
    "wasteWater": 92,
    "cansFilled": 375,
    "cansDelivered": 360,
    "machineRunningTime": 8,
    "notes": "Minor delay during startup."
  },
  {
    "date": "2026-07-08",
    "litersFiltered": 2025,
    "chemicalMixed": 20,
    "wasteWater": 100,
    "cansFilled": 405,
    "cansDelivered": 390,
    "machineRunningTime": 8.5,
    "notes": "Production completed ahead of schedule."
  },
  {
    "date": "2026-07-09",
    "litersFiltered": 1780,
    "chemicalMixed": 17.8,
    "wasteWater": 86,
    "cansFilled": 356,
    "cansDelivered": 340,
    "machineRunningTime": 7.8,
    "notes": "Regular operations."
  },
  {
    "date": "2026-07-10",
    "litersFiltered": 2150,
    "chemicalMixed": 21.5,
    "wasteWater": 105,
    "cansFilled": 430,
    "cansDelivered": 420,
    "machineRunningTime": 9,
    "notes": "Additional evening production shift."
  },
  {
    "date": "2026-07-11",
    "litersFiltered": 1680,
    "chemicalMixed": 16.8,
    "wasteWater": 84,
    "cansFilled": 336,
    "cansDelivered": 320,
    "machineRunningTime": 7.2,
    "notes": "Reduced production because of low demand."
  },
  {
    "date": "2026-07-12",
    "litersFiltered": 1900,
    "chemicalMixed": 19,
    "wasteWater": 94,
    "cansFilled": 380,
    "cansDelivered": 365,
    "machineRunningTime": 8,
    "notes": "Smooth production run."
  },
  {
    "date": "2026-07-13",
    "litersFiltered": 2050,
    "chemicalMixed": 20.5,
    "wasteWater": 101,
    "cansFilled": 410,
    "cansDelivered": 395,
    "machineRunningTime": 8.8,
    "notes": "New batch processed successfully."
  },
  {
    "date": "2026-07-14",
    "litersFiltered": 1980,
    "chemicalMixed": 19.7,
    "wasteWater": 97,
    "cansFilled": 396,
    "cansDelivered": 382,
    "machineRunningTime": 8.4,
    "notes": "No operational issues reported."
  },
  {
    "date": "2026-07-15",
    "litersFiltered": 2200,
    "chemicalMixed": 22,
    "wasteWater": 110,
    "cansFilled": 440,
    "cansDelivered": 425,
    "machineRunningTime": 9.2,
    "notes": "Highest production this month."
  },
  {
    "date": "2026-07-16",
    "litersFiltered": 1840,
    "chemicalMixed": 18.2,
    "wasteWater": 89,
    "cansFilled": 368,
    "cansDelivered": 352,
    "machineRunningTime": 7.9,
    "notes": "Normal daily production."
  },
  {
    "date": "2026-07-17",
    "litersFiltered": 1765,
    "chemicalMixed": 17.4,
    "wasteWater": 87,
    "cansFilled": 353,
    "cansDelivered": 340,
    "machineRunningTime": 7.6,
    "notes": "Power interruption for 15 minutes."
  },
  {
    "date": "2026-07-18",
    "litersFiltered": 2080,
    "chemicalMixed": 20.8,
    "wasteWater": 104,
    "cansFilled": 416,
    "cansDelivered": 400,
    "machineRunningTime": 8.9,
    "notes": "Weekend production target achieved."
  },
  {
    "date": "2026-07-19",
    "litersFiltered": 1925,
    "chemicalMixed": 19.1,
    "wasteWater": 96,
    "cansFilled": 385,
    "cansDelivered": 370,
    "machineRunningTime": 8.2,
    "notes": "Quality inspection passed."
  },
  {
    "date": "2026-07-20",
    "litersFiltered": 2140,
    "chemicalMixed": 21.2,
    "wasteWater": 106,
    "cansFilled": 428,
    "cansDelivered": 410,
    "machineRunningTime": 9,
    "notes": "Large distributor order completed."
  },
  {
    "date": "2026-07-21",
    "litersFiltered": 1710,
    "chemicalMixed": 17,
    "wasteWater": 83,
    "cansFilled": 342,
    "cansDelivered": 328,
    "machineRunningTime": 7.4,
    "notes": "Production affected by raw material delay."
  },
  {
    "date": "2026-07-22",
    "litersFiltered": 2065,
    "chemicalMixed": 20.6,
    "wasteWater": 103,
    "cansFilled": 413,
    "cansDelivered": 398,
    "machineRunningTime": 8.8,
    "notes": "Good efficiency maintained."
  },
  {
    "date": "2026-07-23",
    "litersFiltered": 1995,
    "chemicalMixed": 19.9,
    "wasteWater": 98,
    "cansFilled": 399,
    "cansDelivered": 385,
    "machineRunningTime": 8.5,
    "notes": "Routine operations with no issues."
  },
  {
    "date": "2026-07-24",
    "litersFiltered": 2185,
    "chemicalMixed": 21.8,
    "wasteWater": 109,
    "cansFilled": 437,
    "cansDelivered": 420,
    "machineRunningTime": 9.3,
    "notes": "Extra production for festival demand."
  },
  {
    "date": "2026-07-25",
    "litersFiltered": 1855,
    "chemicalMixed": 18.4,
    "wasteWater": 91,
    "cansFilled": 371,
    "cansDelivered": 355,
    "machineRunningTime": 8,
    "notes": "Production completed successfully with regular maintenance."
  }
];

export async function seed() {
  console.log("Seeding production records...");
  
  try {
    for (const record of productionData) {
      // Check if a record for this date already exists
      const existing = await db
        .select()
        .from(productionRecordsTable)
        .where(eq(productionRecordsTable.date, record.date))
        .limit(1);

      const waterLeft = Math.max(0, record.litersFiltered - record.wasteWater - record.chemicalMixed);

      const valuesToInsert = {
        date: record.date,
        litersFiltered: String(record.litersFiltered),
        chemicalMixed: String(record.chemicalMixed),
        wasteWater: String(record.wasteWater),
        cansFilled: record.cansFilled,
        cansDelivered: record.cansDelivered,
        waterLeft: String(waterLeft),
        machineRunningHours: String(record.machineRunningTime),
        notes: record.notes
      };

      if (existing.length > 0) {
        console.log(`Record for date ${record.date} already exists. Updating it.`);
        await db
          .update(productionRecordsTable)
          .set(valuesToInsert)
          .where(eq(productionRecordsTable.date, record.date));
      } else {
        console.log(`Inserting record for date ${record.date}...`);
        await db.insert(productionRecordsTable).values(valuesToInsert);
      }
    }
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await pool.end();
  }
}

seed();
