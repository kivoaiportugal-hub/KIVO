"use client";

import { useState } from "react";
import { useRestaurant } from "@/hooks/use-data";

export default function SupportPage() {
  const { restaurant } = useRestaurant();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!subject || !message) return;
    setSending(true);
    try {
      // Store support request
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurant?.id,
          subject,
          message,
        }),
      });
      if (response.ok) {
        setSent(true);
        setSubject("");
        setMessage("");
      }
    } catch {} finally { setSending(false); }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-lg font-bold text-gray-900">Suporte</h1>

        {sent && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            Mensagem enviada! O nosso equipa responderá em breve.
          </div>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Contactar Suporte</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Assunto</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Problema com plataforma"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Descreve o teu problema ou questão..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !subject || !message}
              className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a] disabled:opacity-50"
            >
              {sending ? "A enviar..." : "Enviar Mensagem"}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">FAQ</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium">Como conecto as plataformas?</p>
              <p className="text-gray-500">Vai a Definições → Plataformas e clica em "Conectar". Serás redirecionado para autorizar o acesso.</p>
            </div>
            <div>
              <p className="font-medium">O Kivo pode alterar preços automaticamente?</p>
              <p className="text-gray-500">Sim, no plano Autopilot. O agente analisa dados e sugere ajustes, esperando confirmação tua.</p>
            </div>
            <div>
              <p className="font-medium">Como funciona o WhatsApp?</p>
              <p className="text-gray-500">O Kivo responde automaticamente a mensagens de WhatsApp dos teus clientes, usando AI treinada no teu restaurante.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
