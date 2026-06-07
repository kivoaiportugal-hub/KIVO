"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
        setRestaurantName(user.user_metadata?.restaurant_name || "");
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, restaurant_name: restaurantName },
    });

    // Also update restaurants table
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("restaurants")
        .update({ name: restaurantName })
        .eq("user_id", user.id);
    }

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-64 rounded-lg border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerir as definições da tua conta e restaurante.
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Perfil</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="fullName">
              Nome Completo
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="restaurantName">
              Nome do Restaurante
            </label>
            <input
              id="restaurantName"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="flex h-10 w-full rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              O email não pode ser alterado.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "A guardar..." : "Guardar"}
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">
                Guardado!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Conta</h3>
        <div className="space-y-3 max-w-md">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Email</span>
            <span className="text-sm text-muted-foreground">{email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <span className="text-sm">Plano</span>
            <span className="text-sm text-muted-foreground capitalize">
              Start
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <span className="text-sm">Membro desde</span>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-PT")}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Notificações</h3>
        <div className="space-y-3 max-w-md">
          <label className="flex items-center justify-between py-2">
            <span className="text-sm">Alertas por email</span>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between py-2 border-t">
            <span className="text-sm">Relatório semanal</span>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between py-2 border-t">
            <span className="text-sm">Promoções sugeridas</span>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="text-sm font-semibold text-red-800 mb-4">
          Zona de Perigo
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-red-800">
              Terminar sessão
            </div>
            <div className="text-xs text-red-600">
              Sair da tua conta neste dispositivo
            </div>
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
