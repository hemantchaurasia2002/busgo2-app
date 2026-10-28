import Link from "next/link";
import { BusSearchResult } from "@/lib/types";

interface BusCardProps {
  bus: BusSearchResult;
  searchDate: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function duration(from: string, to: string) {
  const mins = Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 60000
  );
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
}

export default function BusCard({ bus, searchDate }: BusCardProps) {
  const availPct = (bus.availableSeats / bus.totalSeats) * 100;
  const lowAvail = bus.availableSeats <= 5;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
      {/* Bus info */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">{bus.name}</span>
          <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">
            {bus.number}
          </span>
        </div>

        {/* Timing */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="font-semibold text-gray-800">
            {formatTime(bus.route.departureAt)}
          </span>
          <span className="text-gray-300">──</span>
          <span className="text-xs text-gray-400">
            {duration(bus.route.departureAt, bus.route.arrivalAt)}
          </span>
          <span className="text-gray-300">──</span>
          <span className="font-semibold text-gray-800">
            {formatTime(bus.route.arrivalAt)}
          </span>
        </div>

        {/* Seats bar */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 max-w-32 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                availPct > 40
                  ? "bg-green-400"
                  : availPct > 15
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
              style={{ width: `${availPct}%` }}
            />
          </div>
          <span
            className={`text-xs font-medium ${
              lowAvail ? "text-red-500" : "text-gray-500"
            }`}
          >
            {bus.availableSeats} seat{bus.availableSeats !== 1 ? "s" : ""} left
            {lowAvail && " 🔥"}
          </span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
        <div className="text-xl font-bold text-blue-600">
          ₹{bus.route.price.toLocaleString("en-IN")}
        </div>
        <div className="text-xs text-gray-400">per seat</div>
        <Link
          href={`/buses/${bus.id}/seats?date=${searchDate}`}
          className="mt-1 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          Select Seats →
        </Link>
      </div>
    </div>
  );
}
