import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeSeats(count: number) {
  const cols = ["A", "B", "C", "D"];
  return Array.from({ length: count }, (_, i) => ({
    seatNumber: `${Math.floor(i / 4) + 1}${cols[i % 4]}`,
    isBooked: Math.random() < 0.25, // ~25% pre-booked for realism
  }));
}

// ─── seed data ────────────────────────────────────────────────────────────────

const ROUTES = [
  // Mumbai ↔ Pune (multiple daily departures)
  {
    id: "route-mum-pun-0600",
    origin: "Mumbai",
    destination: "Pune",
    departureAt: new Date("2026-11-01T00:30:00.000Z"), // 06:00 IST
    arrivalAt: new Date("2026-11-01T04:00:00.000Z"),   // 09:30 IST
    price: 350,
    buses: [
      { id: "bus-mp-01", name: "Volvo A/C Sleeper", number: "MH12AB1234", totalSeats: 40 },
      { id: "bus-mp-02", name: "Shivneri Express",  number: "MH12CD5678", totalSeats: 36 },
    ],
  },
  {
    id: "route-mum-pun-2100",
    origin: "Mumbai",
    destination: "Pune",
    departureAt: new Date("2026-11-01T15:30:00.000Z"), // 21:00 IST
    arrivalAt: new Date("2026-11-01T19:00:00.000Z"),   // 00:30 IST
    price: 320,
    buses: [
      { id: "bus-mp-03", name: "Hirkani A/C Semi-Sleeper", number: "MH12EF9012", totalSeats: 44 },
    ],
  },
  // Pune → Delhi
  {
    id: "route-pun-del-2000",
    origin: "Pune",
    destination: "Delhi",
    departureAt: new Date("2026-11-01T14:30:00.000Z"), // 20:00 IST
    arrivalAt: new Date("2026-11-02T09:30:00.000Z"),   // next day
    price: 1800,
    buses: [
      { id: "bus-pd-01", name: "VRL Travels Luxury", number: "KA01AB3456", totalSeats: 40 },
    ],
  },
  // Bangalore → Chennai
  {
    id: "route-blr-che-2200",
    origin: "Bangalore",
    destination: "Chennai",
    departureAt: new Date("2026-11-01T16:30:00.000Z"), // 22:00 IST
    arrivalAt: new Date("2026-11-01T22:00:00.000Z"),   // 03:30 IST
    price: 750,
    buses: [
      { id: "bus-bc-01", name: "SRS Travels A/C Sleeper", number: "KA05BC7890", totalSeats: 40 },
      { id: "bus-bc-02", name: "Orange Travels Platinum", number: "TN07XY1234", totalSeats: 36 },
    ],
  },
  // Delhi → Jaipur
  {
    id: "route-del-jai-0600",
    origin: "Delhi",
    destination: "Jaipur",
    departureAt: new Date("2026-11-01T00:30:00.000Z"), // 06:00 IST
    arrivalAt: new Date("2026-11-01T05:00:00.000Z"),   // 10:30 IST
    price: 500,
    buses: [
      { id: "bus-dj-01", name: "RSRTC Volvo A/C", number: "DL01AB2345", totalSeats: 40 },
    ],
  },
];

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 1. Seeding demo user...");
  try {
    const res = await auth.api.signUpEmail({
      body: {
        name: "Demo Passenger",
        email: "demo@busgo.app",
        password: "demo1234",
      },
    });
    if (res?.user) {
      console.log(`✅ Demo user created: ${res.user.email} (Password: demo1234)`);
    } else {
      console.log("ℹ️  Demo user already exists or configured.");
    }
  } catch (err: any) {
    console.log("ℹ️  Demo user status:", err?.message || "Already seeded");
  }

  console.log("\n🌱 2. Seeding routes, buses, and seats…\n");

  for (const routeData of ROUTES) {
    const { buses: busesData, ...routeFields } = routeData;

    const route = await prisma.route.upsert({
      where: { id: routeFields.id },
      update: {},
      create: routeFields,
    });
    console.log(`✅ Route: ${route.origin} → ${route.destination} @ ${route.departureAt.toISOString()}`);

    for (const busData of busesData) {
      const existing = await prisma.bus.findUnique({ where: { id: busData.id } });

      if (!existing) {
        await prisma.bus.create({
          data: {
            id: busData.id,
            name: busData.name,
            number: busData.number,
            totalSeats: busData.totalSeats,
            routeId: route.id,
            seats: {
              createMany: { data: makeSeats(busData.totalSeats) },
            },
          },
        });
        console.log(`   🚌 Bus: ${busData.name} (${busData.number}) — ${busData.totalSeats} seats`);
      } else {
        console.log(`   ⏭️  Bus ${busData.number} already exists, skipping.`);
      }
    }
  }

  console.log("\n🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
