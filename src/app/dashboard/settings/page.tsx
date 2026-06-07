"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("Meu Restaurante");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({
      data: { restaurant_name: restaurantName },
    });
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerir as definições da tua conta e restaurante.
        </p>
      </div>

      {/* Restaurant Info */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Restaurante</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Restaurante</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Conta</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Email</span>
            <span className="text-sm text-muted-foreground">{email || "Não definido"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Plano</span>
            <span className="text-sm text-muted-foreground">Start</span>
          </div>
          <button className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent">
            Mudar Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="text-sm font-semibold text-red-800 mb-4">Zona de Perigo</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-red-800">Sair da conta</div>
            <div className="text-xs text-red-600">Terminar sessão atual</div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center rounded-md border border-red-300 px-4 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
