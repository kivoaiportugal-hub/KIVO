"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (sessionId) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="mb-4 text-4xl">...</div>
            <h1 className="text-lg font-bold text-gray-900">A processar...</h1>
            <p className="mt-2 text-sm text-gray-500">A confirmar o teu pagamento.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2CDF0C]/10 mx-auto">
              <span className="text-3xl text-[#187906]">✓</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Pagamento confirmado!</h1>
            <p className="mt-2 text-sm text-gray-500">
              A tua subscrição foi ativada. Podes aceder a todas as funcionalidades do teu plano.
            </p>
            <div className="mt-6 space-y-2">
              <Link
                href="/dashboard/assistant"
                className="block rounded-lg bg-[#2CDF0C] px-6 py-3 text-sm font-medium text-white hover:bg-[#23b80a]"
              >
                Ir para o Dashboard
              </Link>
              <Link
                href="/dashboard/billing"
                className="block rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Ver Subscrição
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto">
              <span className="text-3xl text-red-500">✕</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Algo correu mal</h1>
            <p className="mt-2 text-sm text-gray-500">
              Não conseguimos confirmar o pagamento. Verifica o teu email ou contacta suporte.
            </p>
            <div className="mt-6 space-y-2">
              <Link
                href="/dashboard/billing"
                className="block rounded-lg bg-[#2CDF0C] px-6 py-3 text-sm font-medium text-white hover:bg-[#23b80a]"
              >
                Ver Subscrição
              </Link>
              <Link
                href="/dashboard/support"
                className="block rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Contactar Suporte
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#2CDF0C]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
