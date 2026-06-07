"use client";

import { ChatInterface } from "@/features/assistant/components/chat-interface";

export default function AssistantPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Fala com o Kivo sobre o teu restaurante.
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
