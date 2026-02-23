import type { CanonicalEventName, EventMap } from './types';

export type ProviderCategory = 'analytics' | 'marketing';

export interface AnalyticsProvider {
  name: string;
  category: ProviderCategory;
  init(): Promise<void> | void;
  track<E extends CanonicalEventName>(event: E, props: EventMap[E]): void;
}

