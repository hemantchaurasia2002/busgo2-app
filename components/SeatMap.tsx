"use client";

import { Seat } from "@/lib/types";
import { useState } from "react";

interface SeatMapProps {
  seats: Seat[];
  selectedIds: string[];
  onToggle: (seatId: string) => void;
  pricePerSeat?: number;
  busName?: string;
  onProceed?: (selectedSeats: Seat[], totalFare: number) => void;
}

export default function SeatMap({
  seats,
  selectedIds,
  onToggle,
  pricePerSeat = 350,
  busName = "Bus",
  onProceed,
}: SeatMapProps) {
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Natural sort: 1A, 1B, 1C, 1D, 2A...
  const sorted = [...seats].sort((a, b) =>
    a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })
  );

  // Split into rows of 4 (A B | Aisle | C D)
  const rows: Seat[][] = [];
  for (let i = 0; i < sorted.length; i += 4) {
    rows.push(sorted.slice(i, i + 4));
  }

  const selectedSeats = seats.filter((s) => selectedIds.includes(s.id));
  const baseFare = selectedSeats.length * pricePerSeat;
  const gst = Math.round(baseFare * 0.05); // 5% GST
  const totalFare = baseFare + gst;

  const availableCount = seats.filter((s) => !s.isBooked).length;
  const bookedCount = seats.length - availableCount;

  function handleProceed() {
    if (selectedSeats.length === 0) return;
    if (onProceed) {
      onProceed(selectedSeats, totalFare);
    } else {
      setBookingSuccess(true);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>💺</span> Select Your Seats
          </h3>
          <p className="text-xs text-slate-500">
            Click on available seats to select or deselect
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-white border-2 border-slate-300 shadow-2xs" />
            <span>Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#d84e55] border-2 border-[#b73b42] shadow-sm flex items-center justify-center text-white text-[10px]">
              ✓
            </div>
            <span className="text-[#d84e55] font-bold">Selected ({selectedIds.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-slate-200 border-2 border-slate-300 cursor-not-allowed" />
            <span>Booked ({bookedCount})</span>
          </div>
        </div>
      </div>

      {/* Main Bus Cabin Layout */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-slate-50 rounded-3xl p-5 border-2 border-slate-200 shadow-inner relative">
          {/* Front of Bus indicator & Steering Wheel */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-slate-300">
            <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ENTRY / DRIVER CABIN</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-lg" title="Steering Wheel">
                🎯
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Front
              </span>
            </div>
          </div>

          {/* Seat Column Labels */}
          <div className="grid grid-cols-5 text-center text-xs font-bold text-slate-400 mb-2 px-1">
            <span>A (Window)</span>
            <span>B</span>
            <span className="text-[10px] text-slate-300 font-normal">AISLE</span>
            <span>C</span>
            <span>D (Window)</span>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3">
            {rows.map((row, rowIdx) => {
              const [sA, sB, sC, sD] = row;
              return (
                <div
                  key={rowIdx}
                  className="grid grid-cols-5 gap-2 items-center text-center group"
                >
                  {/* Seat A */}
                  {sA ? (
                    <SeatUnit
                      seat={sA}
                      isSelected={selectedIds.includes(sA.id)}
                      onToggle={onToggle}
                    />
                  ) : (
                    <div />
                  )}

                  {/* Seat B */}
                  {sB ? (
                    <SeatUnit
                      seat={sB}
                      isSelected={selectedIds.includes(sB.id)}
                      onToggle={onToggle}
                    />
                  ) : (
                    <div />
                  )}

                  {/* Aisle */}
                  <div className="text-[10px] font-mono text-slate-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  </div>

                  {/* Seat C */}
                  {sC ? (
                    <SeatUnit
                      seat={sC}
                      isSelected={selectedIds.includes(sC.id)}
                      onToggle={onToggle}
                    />
                  ) : (
                    <div />
                  )}

                  {/* Seat D */}
                  {sD ? (
                    <SeatUnit
                      seat={sD}
                      isSelected={selectedIds.includes(sD.id)}
                      onToggle={onToggle}
                    />
                  ) : (
                    <div />
                  )}
                </div>
              );
            })}
          </div>

          {/* Back of bus indicator */}
          <div className="mt-5 pt-3 border-t border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              REAR OF BUS
            </span>
          </div>
        </div>
      </div>

      {/* Selected Seats & PROCEED BUTTON Bar (Always visible once seats are picked) */}
      {selectedSeats.length > 0 ? (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Summary */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Selected Seats ({selectedSeats.length}):
                </span>
                {selectedSeats.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 bg-[#d84e55] text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-xs"
                  >
                    {s.seatNumber}
                    <button
                      type="button"
                      onClick={() => onToggle(s.id)}
                      className="hover:text-yellow-200 transition"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* Price Details */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-slate-900">
                  ₹{totalFare.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-500">
                  (₹{pricePerSeat} × {selectedSeats.length} + ₹{gst} GST)
                </span>
              </div>
            </div>

            {/* Right: The PROCEED Button */}
            <button
              type="button"
              onClick={handleProceed}
              className="bg-[#d84e55] hover:bg-[#c03c43] active:scale-98 text-white font-black text-base px-8 py-3.5 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 tracking-wide uppercase cursor-pointer"
            >
              <span>PROCEED TO BOOK</span>
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-500">
            👉 Please click on any available seat above to select and view the booking summary.
          </p>
        </div>
      )}

      {/* Booking Success Confirmation Modal */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h4 className="text-xl font-black text-slate-900">
              Booking Confirmed! 🎉
            </h4>
            <p className="text-sm text-slate-600">
              You have selected seats{" "}
              <strong className="text-slate-900">
                {selectedSeats.map((s) => s.seatNumber).join(", ")}
              </strong>{" "}
              on <span className="font-semibold">{busName}</span>.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 font-mono text-left space-y-1">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold text-slate-900">
                  ₹{totalFare.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Booking Status:</span>
                <span className="text-emerald-600 font-bold">CONFIRMED</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBookingSuccess(false)}
              className="w-full bg-[#d84e55] hover:bg-[#c03c43] text-white font-bold py-2.5 rounded-xl transition shadow"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Individual Seat Unit ─────────────────────────────────────────────────────

function SeatUnit({
  seat,
  isSelected,
  onToggle,
}: {
  seat: Seat;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  const isBooked = seat.isBooked;

  return (
    <button
      type="button"
      disabled={isBooked}
      onClick={() => onToggle(seat.id)}
      className={`relative h-12 w-full rounded-lg transition-all duration-150 flex flex-col items-center justify-center text-xs font-bold border-2 ${
        isBooked
          ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none"
          : isSelected
          ? "bg-[#d84e55] border-[#b73b42] text-white shadow-md shadow-red-500/30 scale-105 cursor-pointer ring-2 ring-red-400"
          : "bg-white border-slate-300 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105 cursor-pointer shadow-xs"
      }`}
      title={
        isBooked
          ? `Seat ${seat.seatNumber} — Already Booked`
          : isSelected
          ? `Seat ${seat.seatNumber} — Selected (Click to deselect)`
          : `Seat ${seat.seatNumber} — Available (Click to select)`
      }
    >
      {/* Headrest accent bar */}
      <div
        className={`w-6 h-1 rounded-full mb-0.5 ${
          isSelected
            ? "bg-white/80"
            : isBooked
            ? "bg-slate-300"
            : "bg-slate-200"
        }`}
      />
      <span>{seat.seatNumber}</span>
      {isSelected && (
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 rounded-full w-4 h-4 text-[9px] flex items-center justify-center shadow font-black">
          ✓
        </span>
      )}
    </button>
  );
}
