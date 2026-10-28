"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import SeatMap from "@/components/SeatMap";
import { BusWithSeats } from "@/lib/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function SeatsPageContent() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const searchParams = useSearchParams();
  const router = useRouter();
  const date = searchParams.get("date") ?? "2026-11-01";

  const [bus, setBus] = useState<BusWithSeats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState("Central Bus Station");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/buses/${id}/seats`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setBus(data.bus);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleSeat(seatId: string) {
    setSelectedIds((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  }

  const selectedSeats = bus?.seats.filter((s) => selectedIds.includes(s.id)) || [];
  const baseFare = selectedSeats.length * (bus?.route.price || 0);
  const gst = Math.round(baseFare * 0.05);
  const totalFare = baseFare + gst;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-700 animate-pulse">
            Loading seat layout & pricing…
          </p>
        </div>
      </main>
    );
  }

  if (error || !bus) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl shadow-md border border-slate-200">
          <div className="text-5xl">🚌💨</div>
          <h2 className="text-xl font-bold text-slate-800">Bus Not Found</h2>
          <p className="text-sm text-slate-500">{error ?? "Unable to load seats for this bus."}</p>
          <button
            onClick={() => router.push("/search")}
            className="w-full bg-[#d84e55] hover:bg-[#c03c43] text-white font-bold py-2.5 rounded-xl transition"
          >
            ← Back to Search Results
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-36">
      {/* RedBus Signature Banner */}
      <div className="bg-gradient-to-r from-[#d84e55] to-[#b73b42] text-white py-8 px-4 shadow-md">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
          >
            ← Back to Results
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black">{bus.name}</h1>
                <span className="bg-white/20 text-yellow-300 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {bus.number}
                </span>
              </div>
              <p className="text-xs text-red-100 mt-1 flex items-center gap-2">
                <span>📍 {bus.route.origin} → {bus.route.destination}</span>
                <span>•</span>
                <span>📅 {date}</span>
                <span>•</span>
                <span>★ 4.6 (1.2k ratings)</span>
              </p>
            </div>

            {/* Time and Price Pill */}
            <div className="bg-white/15 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-6">
              <div>
                <p className="text-[10px] text-red-100 uppercase font-bold tracking-wider">Departure</p>
                <p className="text-lg font-black">{formatTime(bus.route.departureAt)}</p>
              </div>
              <div className="text-white/60 font-mono text-sm">→</div>
              <div>
                <p className="text-[10px] text-red-100 uppercase font-bold tracking-wider">Arrival</p>
                <p className="text-lg font-black">{formatTime(bus.route.arrivalAt)}</p>
              </div>
              <div className="border-l border-white/20 pl-4">
                <p className="text-[10px] text-yellow-300 uppercase font-bold tracking-wider">Fare</p>
                <p className="text-xl font-black text-yellow-300">₹{bus.route.price}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive Seat Map */}
        <div className="lg:col-span-2">
          <SeatMap
            seats={bus.seats}
            selectedIds={selectedIds}
            onToggle={toggleSeat}
            pricePerSeat={bus.route.price}
            busName={bus.name}
            onProceed={() => setBookingConfirmed(true)}
          />
        </div>

        {/* Right 1 Col: Boarding & Trip Info */}
        <div className="space-y-6">
          {/* Boarding Point Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>📍</span> Boarding & Dropping Points
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Boarding Point ({bus.route.origin})
                </label>
                <select
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d84e55]"
                >
                  <option value="Central Bus Station (06:00 AM)">Central Bus Station — {formatTime(bus.route.departureAt)}</option>
                  <option value="Highway Toll Plaza (06:30 AM)">Highway Toll Plaza — 30m after dep</option>
                  <option value="Airport Junction (07:00 AM)">Airport Junction Pickup Point</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Dropping Point ({bus.route.destination})
                </label>
                <div className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700">
                  Main City Terminal — {formatTime(bus.route.arrivalAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Policy & RedBus Guarantee */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>🛡️</span> BusGO Assured
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Free cancellation up to 6 hours before departure
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> 100% refund if bus is delayed over 2 hours
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Sanitized bus & verified professional driver
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Booking Bar (Fixed at bottom when seats are selected) */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t-2 border-red-200 shadow-2xl p-4 z-40 animate-in slide-in-from-bottom duration-200">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d84e55] flex items-center justify-center font-black text-xl border border-red-100">
                {selectedSeats.length}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Seats: {selectedSeats.map((s) => s.seatNumber).join(", ")}
                  </span>
                  <span className="text-[11px] bg-red-100 text-[#d84e55] font-bold px-2 py-0.5 rounded">
                    Boarding: {boardingPoint.split(" ")[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Total Fare: <strong className="text-base text-slate-900">₹{totalFare.toLocaleString("en-IN")}</strong>{" "}
                  <span className="text-[10px] text-slate-400">(incl. 5% GST)</span>
                </p>
              </div>
            </div>

            {/* Giant Prominent Proceed Button */}
            <button
              type="button"
              onClick={() => setBookingConfirmed(true)}
              className="w-full sm:w-auto bg-[#d84e55] hover:bg-[#c03c43] active:scale-95 text-white font-black text-base px-10 py-3.5 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              <span>PROCEED TO BOOK (₹{totalFare.toLocaleString("en-IN")})</span>
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Booking Confirmation Dialog */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-black text-slate-900">Ticket Reserved! 🎉</h3>
            <p className="text-sm text-slate-600">
              Your seats <strong className="text-slate-900">{selectedSeats.map((s) => s.seatNumber).join(", ")}</strong> on{" "}
              <strong>{bus.name}</strong> ({bus.route.origin} → {bus.route.destination}) are confirmed!
            </p>

            <div className="bg-slate-50 rounded-xl p-4 text-left font-mono text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Boarding Date:</span>
                <span className="font-bold text-slate-800">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Boarding Point:</span>
                <span className="font-bold text-slate-800">{boardingPoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-[#d84e55] text-sm">₹{totalFare.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setBookingConfirmed(false);
                router.push("/search");
              }}
              className="w-full bg-[#d84e55] hover:bg-[#c03c43] text-white font-bold py-3 rounded-xl transition shadow"
            >
              Back to Bus Search
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SeatsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SeatsPageContent />
    </Suspense>
  );
}
