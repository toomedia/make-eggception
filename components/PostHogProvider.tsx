'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize PostHog only once
    if (typeof window !== 'undefined' && !(window as any).posthog) {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_rpeCGtM2lHL5Rk1WVdyrVJoEa8foF4R9ysh9bML4snX';
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

      console.log('[PostHog] Initializing...', {
        api_host: posthogHost,
        hostname: window.location.hostname,
      });

      posthog.init(posthogKey, {
        api_host: posthogHost,
        cross_subdomain_cookie: true,
        person_profiles: 'identified_only', // Same as main site
        defaults: '2025-11-30', // Same as main site
        loaded: (posthog) => {
          // Mark PostHog as loaded
          (window as any).posthog = posthog;
          (window as any).posthog.__loaded = true;
          console.log('[PostHog] ✅ Loaded successfully', {
            distinct_id: posthog.get_distinct_id(),
            api_host: posthogHost,
          });
          // Dispatch custom event for components waiting for PostHog
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('posthog:loaded'));
          }
        },
      });
      (window as any).posthog = posthog;
      console.log('[PostHog] Initialization complete');
    } else if ((window as any).posthog) {
      console.log('[PostHog] Already initialized', {
        distinct_id: (window as any).posthog.get_distinct_id(),
      });
    }
  }, []);

  useEffect(() => {
    // Track pageviews automatically
    if (pathname && (window as any).posthog) {
      console.log('[PostHog] 📄 Tracking pageview', {
        pathname,
        searchParams: searchParams.toString(),
        hostname: window.location.hostname,
      });
      (window as any).posthog.capture('$pageview', {
        pathname,
        hostname: window.location.hostname,
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

