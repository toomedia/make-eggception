import type { CanonicalEventName, EventMap } from './types';

export type AnalyticsCategory = 'analytics' | 'marketing';

export type AnalyticsProvider = {
  name: string;
  category: AnalyticsCategory;
  init: () => void | Promise<void>;
  track: <E extends CanonicalEventName>(event: E, props: EventMap[E]) => void;
};

