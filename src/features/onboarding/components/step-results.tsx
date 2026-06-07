"use client";

import type { OnboardingData } from "../lib/types";
import { calculateMaturityScore, getRecommendedPlan } from "../lib/types";
import { PLANS } from "@/lib/constants";

interface StepResultsProps {
  data: OnboardingData;
}

export function StepResults({ data }: StepResultsProps) {
  const score = calculateMaturityScore(data);
  const planId = getRecommendedPlan(score);
  const plan = PLANS[planId];

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreLabel =
    score >= 66
      ? "Avançado"
      : score >= 31
        ? "Intermédio"
        : "Iniciante";

  const scoreColor =
    score >= 66
      ? "text-primary"
      : score >= 31
        ? "text-yellow-600"
        : "text-orange-500";

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-primary transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <div>
          <div className={`text-lg font-bold ${scoreColor}`}>{scoreLabel}</div>
          <p className="text-sm text-muted-foreground">
            Nível de maturidade do teu delivery
          </p>
        </div>
      </div>

      <div className="rounded-lg border-2 border-primary bg-primary/5 p-6">
        <div className="text-sm font-medium text-primary mb-1">
          Plano Recomendado
        </div>
        <div className="text-2xl font-bold">{plan.name}</div>
        <div className="text-sm text-muted-foreground mt-1">
          {plan.tagline}
        </div>
        <div className="mt-3 text-3xl font-bold">
          €{plan.price}
          <span className="text-sm font-normal text-muted-foreground">
            /mês
          </span>
        </div>
        <ul className="mt-4 space-y-2 text-left text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground">
        Podes alterar de plano a qualquer momento nas configurações.
      </p>
    </div>
  );
}
