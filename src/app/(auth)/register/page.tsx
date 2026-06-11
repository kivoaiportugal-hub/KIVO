"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/mock-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signUp(email, password, fullName);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard/onboarding");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-[#2CDF0C]">K</span>ivo
            </h1>
          </Link>
          <p className="text-sm text-gray-500">
            Cria a tua conta e começa a otimizar o teu delivery.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="fullName">
                Nome completo
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="O teu nome"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teu@email.com"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 4 caracteres"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center rounded-md bg-[#2CDF0C] text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#23b80a] disabled:opacity-50"
            >
              {loading ? "A criar conta..." : "Criar Conta"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500">
          Já tens conta?{" "}
          <Link href="/login" className="text-[#187906] hover:underline font-medium">
            Entra
          </Link>
        </p>
      </div>
    </div>
  );
}
