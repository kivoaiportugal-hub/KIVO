"use client";

import { useState } from "react";
import { ChatIcon, InsightsIcon } from "@/components/icons";
import { ChatInterface } from "@/features/assistant/components/chat-interface";
import { InsightsPanel } from "@/features/insights/components/insights-panel";

export default function AssistantPage() {
  const [view, setView] = useState<"chat" | "insights">("chat");

  return (
    <div className="flex h-full flex-col">
      {/* Switcher */}
      <div className="flex items-center gap-1 border-b border-gray-100 px-6 py-3">
        <button
          onClick={() => setView("chat")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === "chat"
              ? "bg-[#2CDF0C]/10 text-[#2CDF0C]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <ChatIcon active={view === "chat"} size={18} />
          Chat
        </button>
        <button
          onClick={() => setView("insights")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === "insights"
              ? "bg-[#2CDF0C]/10 text-[#2CDF0C]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <InsightsIcon active={view === "insights"} size={18} />
          Insights
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "chat" ? <ChatInterface /> : <InsightsPanel />}
      </div>
    </div>
  );
}
