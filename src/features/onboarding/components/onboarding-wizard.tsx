"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OnboardingData, OnboardingStep } from "../lib/types";
import {
  ONBOARDING_STEPS,
  STEP_TITLES,
  STEP_ICONS,
  initialOnboardingData,
  calculateMaturityScore,
  getRecommendedPlan,
} from "../lib/types";
import { StepRestaurant } from "./step-restaurant";
import { StepPlatforms } from "./step-platforms";
import { StepVolume } from "./step-volume";
import { StepTeam } from "./step-team";
import { StepChallenges } from "./step-challenges";
import { StepResults } from "./step-results";

export function OnboardingWizard() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialOnboardingData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const step: OnboardingStep = ONBOARDING_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;
  const isResults = step === "results";

  const updateData = useCallback((partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const canNext = (() => {
    switch (step) {
      case "restaurant":
        return data.restaurantName.trim() !== "" && data.cuisineType !== "" && data.city !== "";
      case "platforms":
        return data.platforms.length > 0;
      case "volume":
        return data.dailyOrders !== "";
      case "team":
        return data.teamSize !== "";
      case "challenges":
        return data.challenges.length > 0;
      case "results":
        return true;
      default:
        return true;
    }
  })();

  const handleNext = () => {
    if (isResults) {
      handleComplete();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = async () => {
    setSaving(true);
    setError("");

    try {
      const score = calculateMaturityScore(data);
      const recommendedPlan = getRecommendedPlan(score);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Utilizador não autenticado.");
        setSaving(false);
        return;
      }

      // Save to restaurants table
      const { error: restaurantError } = await supabase.from("restaurants").upsert(
        {
          user_id: user.id,
          name: data.restaurantName,
          cuisine_type: data.cuisineType,
          city: data.city,
          platforms: data.platforms,
          daily_orders: data.dailyOrders,
          monthly_revenue: data.monthlyRevenue ? Number(data.monthlyRevenue) : null,
          avg_ticket: data.avgTicket ? Number(data.avgTicket) : null,
          team_size: data.teamSize,
          has_delivery_manager: data.hasDeliveryManager,
          challenges: data.challenges,
          onboarding_score: score,
          onboarding_plan: recommendedPlan,
          onboarding_completed: true,
        },
        { onConflict: "user_id" }
      );

      if (restaurantError) {
        console.error("Restaurant save error:", restaurantError);
        setError("Erro ao guardar restaurante: " + restaurantError.message);
        setSaving(false);
        return;
      }

      // Also update user metadata for quick access
      await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          onboarding_score: score,
          onboarding_plan: recommendedPlan,
          restaurant_name: data.restaurantName,
        },
      });

      window.location.href = "/dashboard/home";
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Erro ao guardar. Tenta novamente.");
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { onboarding_completed: true },
      });
      window.location.href = "/dashboard/home";
    } catch {
      window.location.href = "/dashboard/home";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-primary">K</span>ivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Vamos personalizar a tua experiência. (1 minuto)
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Passo {currentStep + 1} de {ONBOARDING_STEPS.length}
            </span>
            <span>{STEP_TITLES[step].pt}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between">
            {ONBOARDING_STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  i === currentStep
                    ? "bg-primary text-primary-foreground"
                    : i < currentStep
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < currentStep ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  STEP_ICONS[s]
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-lg border bg-card p-6 shadow-sm min-h-[320px]">
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {step === "restaurant" && (
            <StepRestaurant data={data} onUpdate={updateData} />
          )}
          {step === "platforms" && (
            <StepPlatforms data={data} onUpdate={updateData} />
          )}
          {step === "volume" && (
            <StepVolume data={data} onUpdate={updateData} />
          )}
          {step === "team" && (
            <StepTeam data={data} onUpdate={updateData} />
          )}
          {step === "challenges" && (
            <StepChallenges data={data} onUpdate={updateData} />
          )}
          {step === "results" && <StepResults data={data} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
              >
                Voltar
              </button>
            )}
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Pular
            </button>
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext || saving}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving
              ? "A guardar..."
              : isResults
                ? "Começar"
                : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}
