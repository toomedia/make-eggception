"use client";

import { useEffect } from "react";

interface ConsentToastProps {
  message: string;
  onDone: () => void;
}

export function ConsentToast({ message, onDone }: ConsentToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(timeout);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] -translate-x-1/2">
      <div
        className="rounded-full border px-4 py-2 text-sm font-medium shadow-xl"
        style={{
          background: "var(--consent-surface)",
          color: "hsl(var(--consent-navy))",
          borderColor: "hsl(var(--consent-border))",
          boxShadow: "0 8px 24px hsl(var(--consent-navy) / 0.18)",
        }}
      >
        {message}
      </div>
    </div>
  );
}
