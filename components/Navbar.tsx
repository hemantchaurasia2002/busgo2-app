"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#d84e55] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition transform">
                <span className="text-2xl">🚌</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  Bus<span className="text-yellow-300">GO</span>
                  <span className="text-[10px] bg-red-800 text-yellow-300 px-1.5 py-0.5 rounded font-mono font-bold tracking-normal">
                    2.0
                  </span>
                </span>
                <span className="text-[10px] text-red-100 font-medium tracking-wider uppercase -mt-1">
                  RedBus Style
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/search"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5"
              >
                <span>🎫</span> Bus Tickets
              </Link>
              <Link
                href="/#offers"
                className="px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5"
              >
                <span>🏷️</span> Offers
              </Link>
              <Link
                href="/#why-us"
                className="px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5"
              >
                <span>🛡️</span> Safety & Help
              </Link>
            </nav>
          </div>

          {/* Right: Auth Profile / Login */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="h-9 w-28 bg-white/20 animate-pulse rounded-full" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white text-slate-800 px-3.5 py-1.5 rounded-full font-medium text-sm shadow hover:bg-slate-50 transition border border-red-200"
                >
                  <div className="w-6 h-6 rounded-full bg-[#d84e55] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {session.user.name ? session.user.name[0] : "U"}
                  </div>
                  <span className="hidden sm:inline font-semibold text-slate-800 max-w-[120px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                  <span className="text-xs text-slate-400">▼</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-800"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {session.user.name || "Passenger"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                    </div>

                    <Link
                      href="/search"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#d84e55] transition"
                    >
                      Book Tickets
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        setDropdownOpen(false);
                        await signOut();
                        window.location.reload();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition flex items-center gap-2"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white text-[#d84e55] hover:bg-yellow-300 hover:text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>👤</span>
                <span>Sign In / Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

