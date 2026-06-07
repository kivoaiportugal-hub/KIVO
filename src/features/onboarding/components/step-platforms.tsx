"use client";

import type { OnboardingData } from "../lib/types";
import { DELIVERY_PLATFORMS } from "../lib/types";

interface StepPlatformsProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export function StepPlatforms({ data, onUpdate }: StepPlatformsProps) {
  const togglePlatform = (platformId: string) => {
    const platforms = data.platforms.includes(platformId)
      ? data.platforms.filter((p) => p !== platformId)
      : [...data.platforms, platformId];
    onUpdate({ platforms });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Seleciona as plataformas de delivery onde o teu restaurante está presente.
      </p>
      <div className="grid gap-3">
        {DELIVERY_PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => togglePlatform(platform.id)}
            className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${
              data.platforms.includes(platform.id)
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/50 hover:bg-accent"
            }`}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white"
              style={{ backgroundColor: platform.color }}
            >
              {platform.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-medium">{platform.name}</div>
            </div>
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                data.platforms.includes(platform.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              }`}
            >
              {data.platforms.includes(platform.id) && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
