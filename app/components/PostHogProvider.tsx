"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let initialized = false;

function init() {
  if (initialized || !key) return;
  posthog.init(key, {
    api_host: host,
    capture_pageview: false, // we track manually for SPA navigations
    persistence: "localStorage",
  });
  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!key) return;
  init();
  posthog.capture(event, properties);
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    init();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!key) return;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname]);

  return <>{children}</>;
}
