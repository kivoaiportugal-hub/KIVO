"use client";

import type { OnboardingData } from "../lib/types";
import { CHALLENGES } from "../lib/types";

interface StepChallengesProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export function StepChallenges({ data, onUpdate }: StepChallengesProps) {
  const toggleChallenge = (challengeId: string) => {
    const challenges = data.challenges.includes(challengeId)
      ? data.challenges.filter((c) => c !== challengeId)
      : [...data.challenges, challengeId];
    onUpdate({ challenges });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Seleciona os teus principais desafios (podes escolher vários).
      </p>
      <div className="grid grid-cols-2 gap-3">
        {CHALLENGES.map((challenge) => (
          <button
            key={challenge.id}
            type="button"
            onClick={() => toggleChallenge(challenge.id)}
            className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
              data.challenges.includes(challenge.id)
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/50 hover:bg-accent"
            }`}
          >
            <span className="text-lg">{challenge.icon}</span>
            <span className="text-sm font-medium">{challenge.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
