import { UberEatsConnector } from "./uber-eats";
import { GlovoConnector } from "./glovo";
import { BoltFoodConnector } from "./bolt-food";
import type { PlatformConnector } from "./types";

export type { PlatformConnector, PlatformToken, PlatformMenuItem, PlatformOrder, PlatformReview, PlatformFinancials } from "./types";

const connectors: Record<string, () => PlatformConnector> = {
  uber_eats: () => new UberEatsConnector(),
  glovo: () => new GlovoConnector(),
  bolt_food: () => new BoltFoodConnector(),
};

export function getConnector(platformId: string): PlatformConnector {
  const factory = connectors[platformId];
  if (!factory) throw new Error(`Unknown platform: ${platformId}`);
  return factory();
}

export function getSupportedPlatforms(): string[] {
  return Object.keys(connectors);
}
