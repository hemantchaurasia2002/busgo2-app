"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function HomePage() {
  const router = useRouter();
  const [fromCity, setFromCity] = useState("Mumbai");
  const [toCity, setToCity] = useState("Pune");
  const [date, setDate] = useState("2026-11-01");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?fromCity=${fromCity}&toCity=${toCity}&date=${date}`);
  }

  function swapCities() {
    setFromCity(toCity);
    setToCity(fromCity);
  }

  function copyCoupon(code: string) {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#d84e55] via-[#c63a41] to-[#a32229] text-white pt-16 pb-28 px-4 overflow-hidden shadow-lg">
        {/* Decorative background bus silhouettes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-around text-9xl select-none">
          <span>🚌</span>
          <span>🛣️</span>
          <span>🚌</span>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-yellow-300 border border-white/20">
            <span>✨</span> India&apos;s No. 1 Online Bus Booking Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Book Bus Tickets Online
          </h1>

          <p className="text-base sm:text-lg text-red-100 max-w-2xl mx-auto font-medium">
            Over 3,500+ bus operators, 100,000+ routes, live seat selection, and 24x7 customer support.
          </p>
        </div>

        {/* ─── Floating Search Box ────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mt-10 relative z-20">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 border border-red-100 grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-slate-800"
          >
            {/* From City */}
            <div className="md:col-span-2 relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                From City
              </label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 focus-within:border-[#d84e55] focus-within:bg-white transition">
                <span className="text-lg">📍</span>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-800 focus:outline-none cursor-pointer"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={swapCities}
                className="w-10 h-10 rounded-full bg-red-50 hover:bg-[#d84e55] text-[#d84e55] hover:text-white border border-red-200 shadow-sm flex items-center justify-center text-lg font-bold transition transform hover:rotate-180 duration-200 cursor-pointer"
                title="Swap origin and destination"
              >
                ⇄
              </button>
            </div>

            {/* To City */}
            <div className="md:col-span-2 relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                To City
              </label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 focus-within:border-[#d84e55] focus-within:bg-white transition">
                <span className="text-lg">🏁</span>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-800 focus:outline-none cursor-pointer"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Journey Date
              </label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 focus-within:border-[#d84e55] focus-within:bg-white transition">
                <span className="text-lg">📅</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Search Button (Full row on bottom or side) */}
            <div className="md:col-span-7 pt-2">
              <button
                type="submit"
                className="w-full bg-[#d84e55] hover:bg-[#c03c43] active:scale-98 text-white font-black text-base py-3.5 rounded-2xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <span>🔍 SEARCH BUSES</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ─── Trending Promo Offers Section ───────────────────────────────────── */}
      <section id="offers" className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🏷️</span> Trending Offers & Discounts
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Apply code at checkout to save extra on your bus ticket booking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coupon 1 */}
          <div className="bg-gradient-to-br from-red-50 to-white border-2 border-dashed border-red-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-2">
              <span className="bg-[#d84e55] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                FIRST RIDE
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Flat ₹250 OFF on First Booking
              </h3>
              <p className="text-xs text-slate-500">
                Valid on private AC sleepers and luxury interstate bus tickets.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-red-100">
              <span className="font-mono font-bold text-sm bg-white border border-red-200 text-[#d84e55] px-3 py-1 rounded-lg">
                FIRSTBUS
              </span>
              <button
                type="button"
                onClick={() => copyCoupon("FIRSTBUS")}
                className="text-xs font-bold text-slate-600 hover:text-[#d84e55] transition"
              >
                {copiedCode === "FIRSTBUS" ? "Copied! ✓" : "Copy Code"}
              </button>
            </div>
          </div>

          {/* Coupon 2 */}
          <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-dashed border-amber-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-2">
              <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                WEEKEND SPECIAL
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Save 15% on Round Trips
              </h3>
              <p className="text-xs text-slate-500">
                Book your return ticket together and save up to ₹500 instantly.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-amber-100">
              <span className="font-mono font-bold text-sm bg-white border border-amber-200 text-amber-600 px-3 py-1 rounded-lg">
                RETURN15
              </span>
              <button
                type="button"
                onClick={() => copyCoupon("RETURN15")}
                className="text-xs font-bold text-slate-600 hover:text-amber-600 transition"
              >
                {copiedCode === "RETURN15" ? "Copied! ✓" : "Copy Code"}
              </button>
            </div>
          </div>

          {/* Coupon 3 */}
          <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-dashed border-emerald-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-2">
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                ZERO RISK
              </span>
              <h3 className="text-lg font-black text-slate-900">
                100% Free Cancellation
              </h3>
              <p className="text-xs text-slate-500">
                Cancel up to 2 hours before trip and get an instant full refund.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-emerald-100">
              <span className="font-mono font-bold text-sm bg-white border border-emerald-200 text-emerald-600 px-3 py-1 rounded-lg">
                FLEXIFREE
              </span>
              <button
                type="button"
                onClick={() => copyCoupon("FLEXIFREE")}
                className="text-xs font-bold text-slate-600 hover:text-emerald-600 transition"
              >
                {copiedCode === "FLEXIFREE" ? "Copied! ✓" : "Copy Code"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Popular Bus Routes ──────────────────────────────────────────────── */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              Popular Bus Routes
            </h2>
            <p className="text-xs text-slate-500">
              Explore top trending bus journeys with daily frequency and verified coaches
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { from: "Mumbai", to: "Pune", price: 320, time: "3h 30m" },
              { from: "Pune", to: "Delhi", price: 1800, time: "18h 30m" },
              { from: "Bangalore", to: "Chennai", price: 750, time: "5h 30m" },
              { from: "Delhi", to: "Jaipur", price: 500, time: "4h 30m" },
            ].map((r, i) => (
              <Link
                key={i}
                href={`/search?fromCity=${r.from}&toCity=${r.to}&date=2026-11-01`}
                className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-[#d84e55] hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                  <span>{r.time}</span>
                  <span className="text-[#d84e55]">★ 4.6</span>
                </div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-[#d84e55] transition">
                  {r.from} → {r.to}
                </h4>
                <div className="mt-3 flex items-baseline justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Starting at</span>
                  <span className="text-lg font-black text-slate-900">₹{r.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Book With Us ────────────────────────────────────────────────── */}
      <section id="why-us" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-black text-slate-900">
            Why Millions Trust BusGO 2.0
          </h2>
          <p className="text-sm text-slate-500">
            Engineered with modern speed, real-time safety, and guaranteed seat booking
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-14 h-14 bg-red-50 text-[#d84e55] rounded-2xl flex items-center justify-center text-3xl mx-auto">
              💺
            </div>
            <h4 className="font-bold text-slate-900 text-base">Live Seat Layout</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time cabin layout. Pick your preferred window, aisle, or sleeper berth.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              🛡️
            </div>
            <h4 className="font-bold text-slate-900 text-base">Free Cancellation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Plans changed? Cancel in 1-click and get full refunds credited directly.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              📍
            </div>
            <h4 className="font-bold text-slate-900 text-base">Live Bus Tracking</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track bus location in real time and never miss your boarding time.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              🎧
            </div>
            <h4 className="font-bold text-slate-900 text-base">24/7 Red Support</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Friendly helpline available anytime before, during, or after your journey.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
