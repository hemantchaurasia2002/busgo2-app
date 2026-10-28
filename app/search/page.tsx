"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFrom = searchParams.get("fromCity") || "Mumbai";
  const initialTo = searchParams.get("toCity") || "Pune";
  const initialDate = searchParams.get("date") || "2026-11-01";

  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [date, setDate] = useState(initialDate);

  const [buses, setBuses] = useState<BusSearchResult[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "AC" | "SLEEPER">("ALL");
  const [sortBy, setSortBy] = useState<"PRICE_LOW" | "PRICE_HIGH" | "EARLY">("EARLY");

  useEffect(() => {
    fetchBuses(fromCity, toCity, date);
  }, [fromCity, toCity, date]);

  async function fetchBuses(from: string, to: string, d: string) {
    if (from === to) {
      setError("Origin and destination cannot be the same.");
      setBuses([]);
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({ fromCity: from, toCity: to, date: d });
      const res = await fetch(`/api/buses/search?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Search failed.");
      setBuses(data.buses || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBuses([]);
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?fromCity=${fromCity}&toCity=${toCity}&date=${date}`);
    fetchBuses(fromCity, toCity, date);
  }

  function swapCities() {
    setFromCity(toCity);
    setToCity(fromCity);
  }

  // Filtered and sorted buses
  const displayBuses = useMemo(() => {
    if (!buses) return [];
    let list = [...buses];

    if (selectedFilter === "AC") {
      list = list.filter((b) => b.name.toLowerCase().includes("a/c") || b.name.toLowerCase().includes("ac"));
    } else if (selectedFilter === "SLEEPER") {
      list = list.filter((b) => b.name.toLowerCase().includes("sleeper"));
    }

    if (sortBy === "PRICE_LOW") {
      list.sort((a, b) => a.route.price - b.route.price);
    } else if (sortBy === "PRICE_HIGH") {
      list.sort((a, b) => b.route.price - a.route.price);
    } else {
      list.sort((a, b) => new Date(a.route.departureAt).getTime() - new Date(b.route.departureAt).getTime());
    }

    return list;
  }, [buses, selectedFilter, sortBy]);

  return (
    <main className="min-h-screen bg-slate-100 pb-20">
      {/* ─── Compact Sticky RedBus Header ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#d84e55] to-[#c63a41] text-white py-5 px-4 shadow-md sticky top-16 z-30">
        <form
          onSubmit={handleFormSubmit}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
        >
          {/* From */}
          <div className="md:col-span-3 bg-white text-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-inner">
            <span className="text-sm">📍</span>
            <div className="w-full">
              <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">FROM</span>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={swapCities}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#d84e55] flex items-center justify-center font-bold text-sm transition transform hover:rotate-180"
              title="Swap"
            >
              ⇄
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-3 bg-white text-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-inner">
            <span className="text-sm">🏁</span>
            <div className="w-full">
              <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">TO</span>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="md:col-span-3 bg-white text-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-inner">
            <span className="text-sm">📅</span>
            <div className="w-full">
              <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">DATE</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
            >
              <span>MODIFY</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>

      {/* ─── Search Body & Filters ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>⚡</span> Quick Filters
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter("ALL");
                  setSortBy("EARLY");
                }}
                className="text-[11px] font-bold text-[#d84e55] hover:underline"
              >
                RESET
              </button>
            </div>

            {/* Bus Type Filter Pills */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bus Type</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: "ALL", label: "All Buses" },
                  { id: "AC", label: "❄️ A/C Sleeper" },
                  { id: "SLEEPER", label: "🛏️ Sleeper Berth" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilter(f.id as any)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      selectedFilter === f.id
                        ? "bg-[#d84e55] text-white shadow-sm"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{f.label}</span>
                    {selectedFilter === f.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: "EARLY", label: "Departure Time (Earliest)" },
                  { id: "PRICE_LOW", label: "Price (Low to High)" },
                  { id: "PRICE_HIGH", label: "Price (High to Low)" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSortBy(s.id as any)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      sortBy === s.id
                        ? "bg-slate-800 text-white shadow-sm"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RedBus Promise Card */}
          <div className="bg-red-50 border border-red-200/80 rounded-2xl p-5 text-slate-800 space-y-2">
            <h4 className="font-black text-xs text-[#d84e55] uppercase tracking-wider flex items-center gap-1.5">
              <span>🛡️</span> Zero Booking Fee
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never charge hidden convenience fees. What you see is what you pay.
            </p>
          </div>
        </div>

        {/* Right Bus Cards Stream */}
        <div className="lg:col-span-3 space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 text-sm font-semibold rounded-2xl px-5 py-4">
              {error}
            </div>
          )}

          {/* Result Count Header */}
          <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">
              {loading ? (
                "Searching available buses…"
              ) : (
                <>
                  <strong className="text-[#d84e55] font-black">{displayBuses.length} Buses</strong> available from{" "}
                  <strong>{fromCity}</strong> to <strong>{toCity}</strong> on <strong>{date}</strong>
                </>
              )}
            </span>
            <span className="text-slate-400 font-medium">All timings in IST</span>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 h-36 animate-pulse p-6 space-y-3"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && displayBuses.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="text-6xl">🚏</div>
              <h3 className="text-xl font-black text-slate-800">
                No Buses Found for {fromCity} → {toCity}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try selecting a different date or search our popular routes like <strong>Mumbai → Pune</strong>,{" "}
                <strong>Bangalore → Chennai</strong>, or <strong>Delhi → Jaipur</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFromCity("Mumbai");
                  setToCity("Pune");
                  setDate("2026-11-01");
                }}
                className="bg-[#d84e55] hover:bg-[#c03c43] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow"
              >
                Search Mumbai → Pune
              </button>
            </div>
          )}

          {/* Bus Cards List */}
          {!loading && displayBuses.length > 0 && (
            <div className="space-y-4">
              {displayBuses.map((bus) => (
                <BusCard key={bus.id} bus={bus} searchDate={date} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
