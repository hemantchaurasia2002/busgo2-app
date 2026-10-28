"use client";

import { useState } from "react";
import BusCard from "@/components/BusCard";
import { BusSearchResult } from "@/lib/types";

const CITIES = [
  "Mumbai",
  "Pune",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Ahmedabad",
  "Jaipur",
  "Kolkata",
  "Surat",
];

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function SearchPage() {
  const [fromCity, setFromCity] = useState("Mumbai");
  const [toCity, setToCity] = useState("Pune");
  const [date, setDate] = useState(today());
  const [buses, setBuses] = useState<BusSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (fromCity === toCity) {
      setError("Origin and destination cannot be the same.");
      return;
    }
    setError(null);
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams({ fromCity, toCity, date });
      const res = await fetch(`/api/buses/search?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Search failed.");
      setBuses(data.buses);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBuses(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero / search bar */}
      <div className="bg-blue-600 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl font-bold text-white text-center">🚌 BusGO 2.0</h1>
          <p className="text-blue-100 text-center text-sm">
            Search and book bus seats across India
          </p>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-lg p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            {/* From */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                From
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Swap button */}
            <div className="flex justify-center sm:pb-1">
              <button
                type="button"
                onClick={() => {
                  setFromCity(toCity);
                  setToCity(fromCity);
                }}
                className="rounded-full w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 text-lg transition"
                title="Swap cities"
              >
                ⇄
              </button>
            </div>

            {/* To */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                To
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                min={today()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit — full-width on mobile */}
            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Searching…" : "Search Buses"}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && buses !== null && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                {buses.length > 0
                  ? `${buses.length} bus${buses.length !== 1 ? "es" : ""} found · ${fromCity} → ${toCity}`
                  : `No buses found for ${fromCity} → ${toCity} on ${date}`}
              </h2>
              {buses.length > 0 && (
                <span className="text-xs text-gray-400">{date}</span>
              )}
            </div>

            {buses.length === 0 ? (
              <div className="text-center py-16 text-gray-400 space-y-2">
                <div className="text-4xl">🚏</div>
                <p className="text-sm">
                  No buses scheduled for this route on this date.
                </p>
                <p className="text-xs">Try a different date or route.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {buses.map((bus) => (
                  <BusCard key={bus.id} bus={bus} searchDate={date} />
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !searched && (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <div className="text-4xl">🗺️</div>
            <p className="text-sm">Enter your journey details above to find buses.</p>
          </div>
        )}
      </div>
    </main>
  );
}
