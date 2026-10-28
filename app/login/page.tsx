"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await signIn.email({ email, password });

      if (authError) {
        setError(authError.message ?? "Login failed. Please verify your credentials.");
        setLoading(false);
        return;
      }

      router.push("/search");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("demo@busgo.app");
    setPassword("demo1234");
    setError(null);
  }

  return (
    <main className="min-h-[85vh] flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-red-50 text-3xl rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-2xs">
            🚌
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bus<span className="text-[#d84e55]">GO</span> Account
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to manage bookings, track buses, and access exclusive fares
          </p>
        </div>

        {/* If already signed in */}
        {!isPending && session?.user ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Currently Signed In
              </p>
              <h3 className="text-base font-black text-slate-900 mt-1">
                {session.user.name || "Passenger"}
              </h3>
              <p className="text-xs text-slate-500">{session.user.email}</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/search"
                className="w-full bg-[#d84e55] hover:bg-[#c03c43] text-white font-bold text-xs py-2.5 rounded-xl transition shadow"
              >
                Go to Bus Search →
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  window.location.reload();
                }}
                className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs py-2 rounded-xl transition"
              >
                Sign Out from this Account
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Form */
          <>
            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d84e55] focus:border-transparent transition bg-slate-50/50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d84e55] focus:border-transparent transition bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#d84e55] hover:bg-[#c03c43] active:scale-98 px-4 py-3 text-sm font-black text-white shadow-md shadow-red-500/20 hover:shadow-red-500/40 disabled:opacity-50 transition cursor-pointer tracking-wide uppercase"
              >
                {loading ? "Signing in…" : "Sign In to BusGO"}
              </button>
            </form>

            {/* Quick Demo Fill Pill */}
            <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={fillDemo}
                className="w-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>⚡</span> Autofill Demo Account (demo@busgo.app)
              </button>
              <p className="text-[11px] text-slate-400">
                Demo Password: <span className="font-mono font-bold">demo1234</span>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
