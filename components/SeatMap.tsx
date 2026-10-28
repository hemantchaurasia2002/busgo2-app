"use client";

import { Seat } from "@/lib/types";

interface SeatMapProps {
  seats: Seat[];
  selectedIds: string[];
  onToggle: (seatId: string) => void;
}

/**
 * Renders a 4-column bus seat grid (A B  |aisle|  C D layout).
 * Booked seats are grey + disabled; selected seats are blue; available are white.
 */
export default function SeatMap({ seats, selectedIds, onToggle }: SeatMapProps) {
  // Sort seats naturally: "1A" < "1B" < "2A" ...
  const sorted = [...seats].sort((a, b) =>
    a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })
  );

  // Group into rows of 4 for the grid
  const rows: Seat[][] = [];
  for (let i = 0; i < sorted.length; i += 4) {
    rows.push(sorted.slice(i, i + 4));
  }

  const available = seats.filter((s) => !s.isBooked).length;
  const booked = seats.length - available;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white border-2 border-gray-300" />
          <span>Available ({available})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500 border-2 border-blue-600" />
          <span>Selected ({selectedIds.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-200 border-2 border-gray-300" />
          <span>Booked ({booked})</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex gap-2 pl-10 text-xs font-semibold text-gray-400 uppercase tracking-widest">
        <span className="w-10 text-center">A</span>
        <span className="w-10 text-center">B</span>
        <span className="w-6" /> {/* aisle gap */}
        <span className="w-10 text-center">C</span>
        <span className="w-10 text-center">D</span>
      </div>

      {/* Seat rows */}
      <div className="space-y-2">
        {rows.map((row, rowIdx) => {
          const rowNumber = rowIdx + 1;
          const [sA, sB, sC, sD] = row;
          return (
            <div key={rowIdx} className="flex items-center gap-2">
              {/* Row number */}
              <span className="w-8 text-xs text-gray-400 text-right font-mono">
                {rowNumber}
              </span>

              {/* Seats A & B (left window/middle) */}
              <div className="flex gap-1">
                {[sA, sB].map((seat) =>
                  seat ? (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      selected={selectedIds.includes(seat.id)}
                      onToggle={onToggle}
                    />
                  ) : (
                    <div key="empty-l" className="w-10 h-10" />
                  )
                )}
              </div>

              {/* Aisle */}
              <div className="w-6" />

              {/* Seats C & D (right middle/window) */}
              <div className="flex gap-1">
                {[sC, sD].map((seat) =>
                  seat ? (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      selected={selectedIds.includes(seat.id)}
                      onToggle={onToggle}
                    />
                  ) : (
                    <div key="empty-r" className="w-10 h-10" />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Driver area */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-end">
        <span className="text-xs text-gray-400 italic">🚌 Front of bus →</span>
      </div>
    </div>
  );
}

// ─── Single seat button ───────────────────────────────────────────────────────

interface SeatButtonProps {
  seat: Seat;
  selected: boolean;
  onToggle: (seatId: string) => void;
}

function SeatButton({ seat, selected, onToggle }: SeatButtonProps) {
  const booked = seat.isBooked;

  const base =
    "w-10 h-10 rounded-t-xl border-2 text-xs font-semibold transition-all duration-150 flex items-center justify-center";

  const styles = booked
    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
    : selected
    ? "bg-blue-500 border-blue-600 text-white shadow-md scale-105 cursor-pointer"
    : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 cursor-pointer";

  return (
    <button
      type="button"
      disabled={booked}
      onClick={() => !booked && onToggle(seat.id)}
      className={`${base} ${styles}`}
      title={booked ? `Seat ${seat.seatNumber} — Booked` : `Seat ${seat.seatNumber}`}
      aria-label={`Seat ${seat.seatNumber}${booked ? " (booked)" : selected ? " (selected)" : " (available)"}`}
      aria-pressed={!booked ? selected : undefined}
    >
      {seat.seatNumber}
    </button>
  );
}
