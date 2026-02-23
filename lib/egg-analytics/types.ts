export type EggApp = 'make' | 'play';

export type CanonicalEventName = 'funnel_view' | 'cta_click' | 'consent_update';

export type AttributionFields = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string; // hostname only
};

export type BaseEventProps = AttributionFields & {
  app: EggApp;
  variant: string;
  path: string; // pathname only (no query)
};

export type FunnelViewProps = BaseEventProps;

export type CtaClickProps = BaseEventProps & {
  cta_id: string;
  destination: string; // origin + pathname (no query)
  position?: string;
};

export type ConsentUpdateProps = BaseEventProps & {
  analytics: boolean;
  marketing: boolean;
  source?: string;
};

export type EventMap = {
  funnel_view: FunnelViewProps;
  cta_click: CtaClickProps;
  consent_update: ConsentUpdateProps;
};

export type EventProps<E extends CanonicalEventName> = EventMap[E];

