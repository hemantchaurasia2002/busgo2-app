import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "BusGO 2.0 — India's Favourite Bus Ticket Booking Platform",
  description: "Book bus tickets online across India with zero booking fees, verified operators, and instant seat selection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
        <Navbar />
        <div className="flex-1">{children}</div>

        {/* RedBus Style Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚌</span>
                <span className="text-xl font-black text-white">
                  Bus<span className="text-[#d84e55]">GO</span> 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                BusGO is India&apos;s leading online bus ticket booking service trusted by millions of happy commuters across 100,000+ routes.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[11px] text-yellow-400 font-semibold">
                  ★ 4.6 / 5
                </span>
                <span className="text-xs text-slate-400">Over 10M+ bookings</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Top Bus Routes
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><a href="/search?fromCity=Mumbai&toCity=Pune&date=2026-11-01" className="hover:text-white transition">Mumbai → Pune Bus</a></li>
                <li><a href="/search?fromCity=Pune&toCity=Delhi&date=2026-11-01" className="hover:text-white transition">Pune → Delhi Bus</a></li>
                <li><a href="/search?fromCity=Bangalore&toCity=Chennai&date=2026-11-01" className="hover:text-white transition">Bangalore → Chennai Bus</a></li>
                <li><a href="/search?fromCity=Delhi&toCity=Jaipur&date=2026-11-01" className="hover:text-white transition">Delhi → Jaipur Bus</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Top Bus Operators
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><span className="hover:text-white cursor-pointer">Volvo A/C Sleeper</span></li>
                <li><span className="hover:text-white cursor-pointer">Shivneri Express (MSRTC)</span></li>
                <li><span className="hover:text-white cursor-pointer">VRL Travels Luxury</span></li>
                <li><span className="hover:text-white cursor-pointer">SRS Travels</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Customer Support
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>24x7 Customer Care</li>
                <li>Instant Refund Guarantee</li>
                <li>Free Cancellation Protection</li>
                <li>Live Bus Tracking</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                © 2026 BusGO Technologies Inc. Built with Next.js, Tailwind & Prisma.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
