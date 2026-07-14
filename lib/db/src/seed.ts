import { db, pool, productionRecordsTable, incomeRecordsTable, expensesTable } from "./index";
import { eq, and } from "drizzle-orm";

const productionData = [
  // June Records
  {
    "date": "2026-06-01",
    "litersFiltered": 1850,
    "chemicalMixed": 18.5,
    "wasteWater": 95,
    "cansFilled": 370,
    "cansDelivered": 352,
    "machineRunningHours": 8.0,
    "notes": "Normal production"
  },
  {
    "date": "2026-06-02",
    "litersFiltered": 1920,
    "chemicalMixed": 19,
    "wasteWater": 102,
    "cansFilled": 384,
    "cansDelivered": 376,
    "machineRunningHours": 8.3,
    "notes": "High office demand"
  },
  {
    "date": "2026-06-03",
    "litersFiltered": 1760,
    "chemicalMixed": 17.5,
    "wasteWater": 91,
    "cansFilled": 352,
    "cansDelivered": 340,
    "machineRunningHours": 7.8,
    "notes": "Routine maintenance"
  },
  {
    "date": "2026-06-04",
    "litersFiltered": 2050,
    "chemicalMixed": 20,
    "wasteWater": 105,
    "cansFilled": 410,
    "cansDelivered": 395,
    "machineRunningHours": 8.6,
    "notes": ""
  },
  {
    "date": "2026-06-05",
    "litersFiltered": 2100,
    "chemicalMixed": 21,
    "wasteWater": 110,
    "cansFilled": 420,
    "cansDelivered": 405,
    "machineRunningHours": 8.8,
    "notes": "Weekend stock"
  },
  {
    "date": "2026-06-06",
    "litersFiltered": 1980,
    "chemicalMixed": 19.5,
    "wasteWater": 98,
    "cansFilled": 396,
    "cansDelivered": 388,
    "machineRunningHours": 8.4,
    "notes": ""
  },
  {
    "date": "2026-06-07",
    "litersFiltered": 1700,
    "chemicalMixed": 17,
    "wasteWater": 85,
    "cansFilled": 340,
    "cansDelivered": 330,
    "machineRunningHours": 7.4,
    "notes": "Sunday"
  },
  {
    "date": "2026-06-08",
    "litersFiltered": 2150,
    "chemicalMixed": 21.5,
    "wasteWater": 112,
    "cansFilled": 430,
    "cansDelivered": 420,
    "machineRunningHours": 8.9,
    "notes": ""
  },
  {
    "date": "2026-06-09",
    "litersFiltered": 2025,
    "chemicalMixed": 20,
    "wasteWater": 101,
    "cansFilled": 405,
    "cansDelivered": 398,
    "machineRunningHours": 8.5,
    "notes": ""
  },
  {
    "date": "2026-06-10",
    "litersFiltered": 1950,
    "chemicalMixed": 19,
    "wasteWater": 96,
    "cansFilled": 390,
    "cansDelivered": 381,
    "machineRunningHours": 8.1,
    "notes": ""
  },
  {
    "date": "2026-06-11",
    "litersFiltered": 1880,
    "chemicalMixed": 18.5,
    "wasteWater": 92,
    "cansFilled": 376,
    "cansDelivered": 365,
    "machineRunningHours": 8.0,
    "notes": ""
  },
  {
    "date": "2026-06-12",
    "litersFiltered": 2200,
    "chemicalMixed": 22,
    "wasteWater": 115,
    "cansFilled": 440,
    "cansDelivered": 430,
    "machineRunningHours": 9.0,
    "notes": "Peak demand"
  },
  {
    "date": "2026-06-13",
    "litersFiltered": 2080,
    "chemicalMixed": 20.5,
    "wasteWater": 108,
    "cansFilled": 416,
    "cansDelivered": 405,
    "machineRunningHours": 8.7,
    "notes": ""
  },
  {
    "date": "2026-06-14",
    "litersFiltered": 1825,
    "chemicalMixed": 18,
    "wasteWater": 90,
    "cansFilled": 365,
    "cansDelivered": 356,
    "machineRunningHours": 7.9,
    "notes": ""
  },
  {
    "date": "2026-06-15",
    "litersFiltered": 2140,
    "chemicalMixed": 21,
    "wasteWater": 110,
    "cansFilled": 428,
    "cansDelivered": 420,
    "machineRunningHours": 8.8,
    "notes": ""
  },
  {
    "date": "2026-06-16",
    "litersFiltered": 2065,
    "chemicalMixed": 20.5,
    "wasteWater": 104,
    "cansFilled": 413,
    "cansDelivered": 400,
    "machineRunningHours": 8.5,
    "notes": ""
  },
  {
    "date": "2026-06-17",
    "litersFiltered": 1900,
    "chemicalMixed": 19,
    "wasteWater": 94,
    "cansFilled": 380,
    "cansDelivered": 371,
    "machineRunningHours": 8.2,
    "notes": ""
  },
  {
    "date": "2026-06-18",
    "litersFiltered": 2250,
    "chemicalMixed": 22.5,
    "wasteWater": 118,
    "cansFilled": 450,
    "cansDelivered": 438,
    "machineRunningHours": 9.1,
    "notes": ""
  },
  {
    "date": "2026-06-19",
    "litersFiltered": 2180,
    "chemicalMixed": 21.5,
    "wasteWater": 111,
    "cansFilled": 436,
    "cansDelivered": 424,
    "machineRunningHours": 8.9,
    "notes": ""
  },
  {
    "date": "2026-06-20",
    "litersFiltered": 2050,
    "chemicalMixed": 20,
    "wasteWater": 100,
    "cansFilled": 410,
    "cansDelivered": 399,
    "machineRunningHours": 8.6,
    "notes": ""
  },
  {
    "date": "2026-06-21",
    "litersFiltered": 1750,
    "chemicalMixed": 17.5,
    "wasteWater": 88,
    "cansFilled": 350,
    "cansDelivered": 340,
    "machineRunningHours": 7.6,
    "notes": "Sunday"
  },
  {
    "date": "2026-06-22",
    "litersFiltered": 2165,
    "chemicalMixed": 21,
    "wasteWater": 112,
    "cansFilled": 433,
    "cansDelivered": 425,
    "machineRunningHours": 8.8,
    "notes": ""
  },
  {
    "date": "2026-06-23",
    "litersFiltered": 2085,
    "chemicalMixed": 20.5,
    "wasteWater": 106,
    "cansFilled": 417,
    "cansDelivered": 409,
    "machineRunningHours": 8.5,
    "notes": ""
  },
  {
    "date": "2026-06-24",
    "litersFiltered": 1990,
    "chemicalMixed": 19.5,
    "wasteWater": 99,
    "cansFilled": 398,
    "cansDelivered": 390,
    "machineRunningHours": 8.3,
    "notes": ""
  },
  {
    "date": "2026-06-25",
    "litersFiltered": 2225,
    "chemicalMixed": 22,
    "wasteWater": 116,
    "cansFilled": 445,
    "cansDelivered": 435,
    "machineRunningHours": 9.0,
    "notes": "Month-end stock"
  },

  // July Records
  {
    "date": "2026-07-01",
    "litersFiltered": 1800,
    "chemicalMixed": 18,
    "wasteWater": 90,
    "cansFilled": 360,
    "cansDelivered": 340,
    "machineRunningHours": 8,
    "notes": "Normal production. All systems operating efficiently."
  },
  {
    "date": "2026-07-02",
    "litersFiltered": 1950,
    "chemicalMixed": 19,
    "wasteWater": 95,
    "cansFilled": 390,
    "cansDelivered": 380,
    "machineRunningHours": 8.5,
    "notes": "High production due to increased customer demand."
  },
  {
    "date": "2026-07-03",
    "litersFiltered": 1720,
    "chemicalMixed": 17,
    "wasteWater": 82,
    "cansFilled": 345,
    "cansDelivered": 330,
    "machineRunningHours": 7.5,
    "notes": "Routine maintenance completed before production."
  },
  {
    "date": "2026-07-04",
    "litersFiltered": 2100,
    "chemicalMixed": 21,
    "wasteWater": 102,
    "cansFilled": 420,
    "cansDelivered": 405,
    "machineRunningHours": 9,
    "notes": "Weekend bulk orders processed."
  },
  {
    "date": "2026-07-05",
    "litersFiltered": 1600,
    "chemicalMixed": 16,
    "wasteWater": 80,
    "cansFilled": 320,
    "cansDelivered": 300,
    "machineRunningHours": 7,
    "notes": "Lower production due to scheduled cleaning."
  },
  {
    "date": "2026-07-06",
    "litersFiltered": 2250,
    "chemicalMixed": 22,
    "wasteWater": 108,
    "cansFilled": 450,
    "cansDelivered": 435,
    "machineRunningHours": 9.5,
    "notes": "Excellent production with zero machine downtime."
  },
  {
    "date": "2026-07-07",
    "litersFiltered": 1875,
    "chemicalMixed": 18.5,
    "wasteWater": 92,
    "cansFilled": 375,
    "cansDelivered": 360,
    "machineRunningHours": 8,
    "notes": "Minor delay during startup."
  },
  {
    "date": "2026-07-08",
    "litersFiltered": 2025,
    "chemicalMixed": 20,
    "wasteWater": 100,
    "cansFilled": 405,
    "cansDelivered": 390,
    "machineRunningHours": 8.5,
    "notes": "Production completed ahead of schedule."
  },
  {
    "date": "2026-07-09",
    "litersFiltered": 1780,
    "chemicalMixed": 17.8,
    "wasteWater": 86,
    "cansFilled": 356,
    "cansDelivered": 340,
    "machineRunningHours": 7.8,
    "notes": "Regular operations."
  },
  {
    "date": "2026-07-10",
    "litersFiltered": 2150,
    "chemicalMixed": 21.5,
    "wasteWater": 105,
    "cansFilled": 430,
    "cansDelivered": 420,
    "machineRunningHours": 9,
    "notes": "Additional evening production shift."
  },
  {
    "date": "2026-07-11",
    "litersFiltered": 1680,
    "chemicalMixed": 16.8,
    "wasteWater": 84,
    "cansFilled": 336,
    "cansDelivered": 320,
    "machineRunningHours": 7.2,
    "notes": "Reduced production because of low demand."
  },
  {
    "date": "2026-07-12",
    "litersFiltered": 1900,
    "chemicalMixed": 19,
    "wasteWater": 94,
    "cansFilled": 380,
    "cansDelivered": 365,
    "machineRunningHours": 8,
    "notes": "Smooth production run."
  },
  {
    "date": "2026-07-13",
    "litersFiltered": 2050,
    "chemicalMixed": 20.5,
    "wasteWater": 101,
    "cansFilled": 410,
    "cansDelivered": 395,
    "machineRunningHours": 8.8,
    "notes": "New batch processed successfully."
  },
  {
    "date": "2026-07-14",
    "litersFiltered": 1980,
    "chemicalMixed": 19.7,
    "wasteWater": 97,
    "cansFilled": 396,
    "cansDelivered": 382,
    "machineRunningHours": 8.4,
    "notes": "No operational issues reported."
  },
  {
    "date": "2026-07-15",
    "litersFiltered": 2200,
    "chemicalMixed": 22,
    "wasteWater": 110,
    "cansFilled": 440,
    "cansDelivered": 425,
    "machineRunningHours": 9.2,
    "notes": "Highest production this month."
  },
  {
    "date": "2026-07-16",
    "litersFiltered": 1840,
    "chemicalMixed": 18.2,
    "wasteWater": 89,
    "cansFilled": 368,
    "cansDelivered": 352,
    "machineRunningHours": 7.9,
    "notes": "Normal daily production."
  },
  {
    "date": "2026-07-17",
    "litersFiltered": 1765,
    "chemicalMixed": 17.4,
    "wasteWater": 87,
    "cansFilled": 353,
    "cansDelivered": 340,
    "machineRunningHours": 7.6,
    "notes": "Power interruption for 15 minutes."
  },
  {
    "date": "2026-07-18",
    "litersFiltered": 2080,
    "chemicalMixed": 20.8,
    "wasteWater": 104,
    "cansFilled": 416,
    "cansDelivered": 400,
    "machineRunningHours": 8.9,
    "notes": "Weekend production target achieved."
  },
  {
    "date": "2026-07-19",
    "litersFiltered": 1925,
    "chemicalMixed": 19.1,
    "wasteWater": 96,
    "cansFilled": 385,
    "cansDelivered": 370,
    "machineRunningHours": 8.2,
    "notes": "Quality inspection passed."
  },
  {
    "date": "2026-07-20",
    "litersFiltered": 2140,
    "chemicalMixed": 21.2,
    "wasteWater": 106,
    "cansFilled": 428,
    "cansDelivered": 410,
    "machineRunningHours": 9,
    "notes": "Large distributor order completed."
  },
  {
    "date": "2026-07-21",
    "litersFiltered": 1710,
    "chemicalMixed": 17,
    "wasteWater": 83,
    "cansFilled": 342,
    "cansDelivered": 328,
    "machineRunningHours": 7.4,
    "notes": "Production affected by raw material delay."
  },
  {
    "date": "2026-07-22",
    "litersFiltered": 2065,
    "chemicalMixed": 20.6,
    "wasteWater": 103,
    "cansFilled": 413,
    "cansDelivered": 398,
    "machineRunningHours": 8.8,
    "notes": "Good efficiency maintained."
  },
  {
    "date": "2026-07-23",
    "litersFiltered": 1995,
    "chemicalMixed": 19.9,
    "wasteWater": 98,
    "cansFilled": 399,
    "cansDelivered": 385,
    "machineRunningHours": 8.5,
    "notes": "Routine operations with no issues."
  },
  {
    "date": "2026-07-24",
    "litersFiltered": 2185,
    "chemicalMixed": 21.8,
    "wasteWater": 109,
    "cansFilled": 437,
    "cansDelivered": 420,
    "machineRunningHours": 9.3,
    "notes": "Extra production for festival demand."
  },
  {
    "date": "2026-07-25",
    "litersFiltered": 1855,
    "chemicalMixed": 18.4,
    "wasteWater": 91,
    "cansFilled": 371,
    "cansDelivered": 355,
    "machineRunningHours": 8,
    "notes": "Production completed successfully with regular maintenance."
  }
];

const incomeData = [
  {"date":"2026-06-01","customerName":"Sri Lakshmi Super Market","liters":300,"cashAmount":1200,"upiAmount":900,"creditAmount":0,"notes":""},
  {"date":"2026-06-02","customerName":"Green Valley Apartments","liters":500,"cashAmount":0,"upiAmount":3500,"creditAmount":0,"notes":""},
  {"date":"2026-06-03","customerName":"Sunrise Hospital","liters":400,"cashAmount":0,"upiAmount":0,"creditAmount":2800,"notes":"Monthly billing"},
  {"date":"2026-06-04","customerName":"Ravi Tea Point","liters":120,"cashAmount":600,"upiAmount":240,"creditAmount":0,"notes":""},
  {"date":"2026-06-05","customerName":"Blue Star Hotel","liters":600,"cashAmount":1500,"upiAmount":2700,"creditAmount":0,"notes":""},
  {"date":"2026-06-06","customerName":"Sai Function Hall","liters":800,"cashAmount":4000,"upiAmount":1600,"creditAmount":0,"notes":"Marriage function"},
  {"date":"2026-06-07","customerName":"Fresh Mart","liters":250,"cashAmount":500,"upiAmount":1250,"creditAmount":0,"notes":""},
  {"date":"2026-06-08","customerName":"Annapurna Mess","liters":350,"cashAmount":700,"upiAmount":1750,"creditAmount":0,"notes":""},
  {"date":"2026-06-09","customerName":"TechNova Pvt Ltd","liters":700,"cashAmount":0,"upiAmount":4900,"creditAmount":0,"notes":""},
  {"date":"2026-06-10","customerName":"Royal Residency","liters":450,"cashAmount":900,"upiAmount":2250,"creditAmount":0,"notes":""},
  {"date":"2026-06-11","customerName":"Vijaya Medicals","liters":150,"cashAmount":300,"upiAmount":750,"creditAmount":0,"notes":""},
  {"date":"2026-06-12","customerName":"Global School","liters":900,"cashAmount":2000,"upiAmount":4300,"creditAmount":0,"notes":""},
  {"date":"2026-06-13","customerName":"Hotel Grand Palace","liters":650,"cashAmount":1500,"upiAmount":3050,"creditAmount":0,"notes":""},
  {"date":"2026-06-14","customerName":"Krishna Bakery","liters":180,"cashAmount":450,"upiAmount":810,"creditAmount":0,"notes":""},
  {"date":"2026-06-15","customerName":"ABC Industries","liters":1000,"cashAmount":0,"upiAmount":3500,"creditAmount":3500,"notes":"Partial credit"},
  {"date":"2026-06-16","customerName":"City Hospital","liters":550,"cashAmount":0,"upiAmount":3850,"creditAmount":0,"notes":""},
  {"date":"2026-06-17","customerName":"Sai Kirana","liters":220,"cashAmount":660,"upiAmount":880,"creditAmount":0,"notes":""},
  {"date":"2026-06-18","customerName":"Lotus Apartments","liters":750,"cashAmount":1000,"upiAmount":4250,"creditAmount":0,"notes":""},
  {"date":"2026-06-19","customerName":"Shree Canteen","liters":280,"cashAmount":560,"upiAmount":1400,"creditAmount":0,"notes":""},
  {"date":"2026-06-20","customerName":"Mega Mart","liters":620,"cashAmount":1200,"upiAmount":3140,"creditAmount":0,"notes":""},
  {"date":"2026-06-21","customerName":"Lakshmi Hostel","liters":500,"cashAmount":1000,"upiAmount":2500,"creditAmount":0,"notes":""},
  {"date":"2026-06-22","customerName":"Elite Gym","liters":200,"cashAmount":400,"upiAmount":1000,"creditAmount":0,"notes":""},
  {"date":"2026-06-23","customerName":"Silver Spoon Restaurant","liters":420,"cashAmount":840,"upiAmount":2100,"creditAmount":0,"notes":""},
  {"date":"2026-06-24","customerName":"Venkateswara Traders","liters":380,"cashAmount":760,"upiAmount":1900,"creditAmount":0,"notes":""},
  {"date":"2026-06-25","customerName":"Orange County Resort","liters":850,"cashAmount":2000,"upiAmount":3950,"creditAmount":0,"notes":""}
];

const expenseData = [
  {"date":"2026-06-01","category":"Electricity","amount":4850,"description":"Factory electricity bill"},
  {"date":"2026-06-02","category":"Fuel","amount":1800,"description":"Diesel for delivery vehicle"},
  {"date":"2026-06-03","category":"Chemicals","amount":3250,"description":"RO membrane chemicals"},
  {"date":"2026-06-04","category":"Vehicle Maintenance","amount":2100,"description":"Oil and brake service"},
  {"date":"2026-06-05","category":"Staff Salaries","amount":25000,"description":"Weekly wage payment"},
  {"date":"2026-06-06","category":"Miscellaneous","amount":750,"description":"Cleaning materials"},
  {"date":"2026-06-07","category":"Fuel","amount":1650,"description":"Delivery van diesel"},
  {"date":"2026-06-08","category":"Machine Servicing","amount":4200,"description":"Filter replacement"},
  {"date":"2026-06-09","category":"Chemicals","amount":2950,"description":"Mineral additives"},
  {"date":"2026-06-10","category":"Rent","amount":18000,"description":"Factory rent"},
  {"date":"2026-06-11","category":"Electricity","amount":5100,"description":"Power usage"},
  {"date":"2026-06-12","category":"Fuel","amount":1950,"description":"Delivery vehicle refill"},
  {"date":"2026-06-13","category":"Miscellaneous","amount":920,"description":"Office stationery"},
  {"date":"2026-06-14","category":"Vehicle Maintenance","amount":2600,"description":"Tyre replacement"},
  {"date":"2026-06-15","category":"Chemicals","amount":3400,"description":"Purification chemicals"},
  {"date":"2026-06-16","category":"Electricity","amount":4980,"description":"Electricity charges"},
  {"date":"2026-06-17","category":"Fuel","amount":1720,"description":"Diesel purchase"},
  {"date":"2026-06-18","category":"Machine Servicing","amount":3800,"description":"Pump maintenance"},
  {"date":"2026-06-19","category":"Miscellaneous","amount":650,"description":"Water testing kits"},
  {"date":"2026-06-20","category":"Chemicals","amount":3150,"description":"RO cleaning chemicals"},
  {"date":"2026-06-21","category":"Fuel","amount":1840,"description":"Delivery van fuel"},
  {"date":"2026-06-22","category":"Electricity","amount":5020,"description":"Factory electricity"},
  {"date":"2026-06-23","category":"Staff Salaries","amount":25000,"description":"Staff payroll"},
  {"date":"2026-06-24","category":"Vehicle Maintenance","amount":1700,"description":"Wheel alignment"},
  {"date":"2026-06-25","category":"Miscellaneous","amount":1100,"description":"Packaging supplies"}
];

export async function seed() {
  console.log("Seeding database...");
  try {
    // 1. Seed Production Records
    console.log("Seeding production records...");
    for (const record of productionData) {
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
        machineRunningHours: String(record.machineRunningHours),
        notes: record.notes
      };

      if (existing.length > 0) {
        console.log(`Record for production date ${record.date} already exists. Updating it.`);
        await db
          .update(productionRecordsTable)
          .set(valuesToInsert)
          .where(eq(productionRecordsTable.date, record.date));
      } else {
        console.log(`Inserting production record for date ${record.date}...`);
        await db.insert(productionRecordsTable).values(valuesToInsert);
      }
    }

    // 2. Seed Income Records
    console.log("Seeding income records...");
    for (const record of incomeData) {
      const existing = await db
        .select()
        .from(incomeRecordsTable)
        .where(
          and(
            eq(incomeRecordsTable.date, record.date),
            eq(incomeRecordsTable.customerName, record.customerName)
          )
        )
        .limit(1);

      const valuesToInsert = {
        date: record.date,
        customerName: record.customerName,
        liters: String(record.liters),
        cashAmount: String(record.cashAmount),
        upiAmount: String(record.upiAmount),
        creditAmount: String(record.creditAmount),
        notes: record.notes
      };

      if (existing.length > 0) {
        console.log(`Record for income date ${record.date} for ${record.customerName} already exists. Updating it.`);
        await db
          .update(incomeRecordsTable)
          .set(valuesToInsert)
          .where(
            and(
              eq(incomeRecordsTable.date, record.date),
              eq(incomeRecordsTable.customerName, record.customerName)
            )
          );
      } else {
        console.log(`Inserting income record for ${record.customerName} on ${record.date}...`);
        await db.insert(incomeRecordsTable).values(valuesToInsert);
      }
    }

    // 3. Seed Expense Records
    console.log("Seeding expense records...");
    for (const record of expenseData) {
      const existing = await db
        .select()
        .from(expensesTable)
        .where(
          and(
            eq(expensesTable.date, record.date),
            eq(expensesTable.category, record.category),
            eq(expensesTable.description, record.description)
          )
        )
        .limit(1);

      const valuesToInsert = {
        date: record.date,
        category: record.category,
        amount: String(record.amount),
        description: record.description
      };

      if (existing.length > 0) {
        console.log(`Record for expense date ${record.date} (${record.category}) already exists. Updating it.`);
        await db
          .update(expensesTable)
          .set(valuesToInsert)
          .where(
            and(
              eq(expensesTable.date, record.date),
              eq(expensesTable.category, record.category),
              eq(expensesTable.description, record.description)
            )
          );
      } else {
        console.log(`Inserting expense record for ${record.category} on ${record.date}...`);
        await db.insert(expensesTable).values(valuesToInsert);
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
