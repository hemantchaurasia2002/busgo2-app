"use client";

import { useState } from "react";
import Link from "next/link";
import { BusSearchResult, Seat } from "@/lib/types";
import SeatMap from "@/components/SeatMap";

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
  const [showInlineSeats, setShowInlineSeats] = useState(false);
  const [seats, setSeats] = useState<Seat[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  const availPct = (bus.availableSeats / bus.totalSeats) * 100;
  const lowAvail = bus.availableSeats <= 6;

  async function toggleInlineSeats() {
    if (!showInlineSeats && !seats) {
      setLoadingSeats(true);
      try {
        const res = await fetch(`/api/buses/${bus.id}/seats`);
        const data = await res.json();
        if (data.bus?.seats) {
          setSeats(data.bus.seats);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSeats(false);
      }
    }
    setShowInlineSeats(!showInlineSeats);
  }

  function handleSeatToggle(seatId: string) {
    setSelectedIds((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Top Banner Tag */}
      <div className="bg-slate-50/80 border-b border-slate-100 px-5 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 font-semibold">{bus.number}</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Tracking
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>❄️ AC</span>
          <span>⚡ Charging</span>
          <span>💧 Water</span>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Bus Operator Info */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-black text-slate-900 group-hover:text-[#d84e55] transition">
              {bus.name}
            </h3>
            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
              ★ 4.5
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            2+2 Premium A/C Sleeper / Seater • RedBus Verified Partner
          </p>
        </div>

        {/* Center: Timeline */}
        <div className="flex items-center gap-5 text-center">
          <div className="text-left">
            <p className="text-lg font-black text-slate-900">
              {formatTime(bus.route.departureAt)}
            </p>
            <p className="text-xs font-semibold text-slate-500">{bus.route.origin}</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full mb-1">
              {duration(bus.route.departureAt, bus.route.arrivalAt)}
            </span>
            <div className="w-24 h-0.5 bg-slate-300 relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#d84e55]" />
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-black text-slate-900">
              {formatTime(bus.route.arrivalAt)}
            </p>
            <p className="text-xs font-semibold text-slate-500">{bus.route.destination}</p>
          </div>
        </div>

        {/* Right: Pricing & CTA */}
        <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2">
          <div className="text-left md:text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-medium">Starts from</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{bus.route.price.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-xs font-bold ${
                  lowAvail ? "text-red-600 animate-pulse" : "text-emerald-600"
                }`}
              >
                {bus.availableSeats} Seats Left {lowAvail && "🔥"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleInlineSeats}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                showInlineSeats
                  ? "bg-slate-800 text-white hover:bg-slate-900"
                  : "bg-red-50 text-[#d84e55] hover:bg-red-100 border border-red-200"
              }`}
            >
              <span>{showInlineSeats ? "▲ Hide Seats" : "▼ View Seats"}</span>
            </button>

            <Link
              href={`/buses/${bus.id}/seats?date=${searchDate}`}
              className="bg-[#d84e55] hover:bg-[#c03c43] active:scale-95 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md shadow-red-500/20 hover:shadow-red-500/40 transition flex items-center gap-1"
            >
              <span>Book Full</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Inline Collapsible Seat Map */}
      {showInlineSeats && (
        <div className="border-t border-slate-200 bg-slate-50/70 p-6 animate-in slide-in-from-top-3 duration-200">
          {loadingSeats ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <div className="w-6 h-6 border-2 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-600">Loading seat layout…</span>
            </div>
          ) : seats ? (
            <SeatMap
              seats={seats}
              selectedIds={selectedIds}
              onToggle={handleSeatToggle}
              pricePerSeat={bus.route.price}
              busName={bus.name}
            />
          ) : (
            <p className="text-xs text-center text-red-500 py-4">Unable to load seats</p>
          )}
        </div>
      )}
    </div>
  );
}
