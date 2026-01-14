export function track(name: string, props?: Record<string, any>): void {
  if (typeof window === 'undefined') {
    console.warn('[Track] ⚠️ Window not available, skipping track:', name);
    return;
  }

  // Automatically include hostname for host-based tracking
  const enrichedProps = {
    ...props,
    hostname: window.location.hostname,
  };

  console.log('[Track] 🎯 Tracking event:', name, enrichedProps);

  // Use PostHog if available (initialized globally)
  if ((window as any).posthog) {
    try {
      (window as any).posthog.capture(name, enrichedProps);
      console.log('[Track] ✅ Event sent to PostHog:', name);
    } catch (error) {
      console.error('[Track] ❌ Error sending event to PostHog:', error);
    }
  } else {
    console.warn('[Track] ⚠️ PostHog not initialized, event not sent:', name);
  }
}
