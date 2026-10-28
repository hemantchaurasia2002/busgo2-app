import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const fromCity = searchParams.get("fromCity")?.trim();
  const toCity = searchParams.get("toCity")?.trim();
  const date = searchParams.get("date"); // expected: "YYYY-MM-DD"

  if (!fromCity || !toCity || !date) {
    return NextResponse.json(
      { error: "fromCity, toCity, and date are required." },
      { status: 400 }
    );
  }

  // Build date range: full calendar day in UTC
  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  if (isNaN(dayStart.getTime())) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const buses = await prisma.bus.findMany({
    where: {
      route: {
        origin: { equals: fromCity, mode: "insensitive" },
        destination: { equals: toCity, mode: "insensitive" },
        departureAt: { gte: dayStart, lte: dayEnd },
      },
    },
    include: {
      route: true,
      seats: { select: { id: true, isBooked: true } }, // count only
    },
    orderBy: { route: { departureAt: "asc" } },
  });

  const result = buses.map((bus) => ({
    id: bus.id,
    name: bus.name,
    number: bus.number,
    totalSeats: bus.totalSeats,
    availableSeats: bus.seats.filter((s) => !s.isBooked).length,
    route: {
      id: bus.route.id,
      origin: bus.route.origin,
      destination: bus.route.destination,
      departureAt: bus.route.departureAt,
      arrivalAt: bus.route.arrivalAt,
      price: bus.route.price,
    },
  }));

  return NextResponse.json({ buses: result });
}
