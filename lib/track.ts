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
  const posthog = (window as any).posthog;
  if (posthog) {
    try {
      // Check if PostHog is ready
      if (posthog.__loaded || posthog.get_distinct_id) {
        posthog.capture(name, enrichedProps);
        console.log('[Track] ✅ Event sent to PostHog:', name, enrichedProps);
      } else {
        console.warn('[Track] ⚠️ PostHog not fully loaded yet, queuing event:', name);
        // Wait a bit and try again
        setTimeout(() => {
          if ((window as any).posthog) {
            (window as any).posthog.capture(name, enrichedProps);
            console.log('[Track] ✅ Event sent to PostHog (retry):', name);
          }
        }, 200);
      }
    } catch (error) {
      console.error('[Track] ❌ Error sending event to PostHog:', error, name);
    }
  } else {
    console.warn('[Track] ⚠️ PostHog not initialized, event not sent:', name);
    console.warn('[Track] Available on window:', Object.keys(window).filter(k => k.includes('posthog')));
  }
}
