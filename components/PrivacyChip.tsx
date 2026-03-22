import { Settings2 } from "lucide-react";

interface PrivacyChipProps {
  label: string;
  onClick: () => void;
}

export function PrivacyChip({ label, onClick }: PrivacyChipProps) {
  return (
    <button
      onClick={onClick}
      className="consent-focus fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition-all duration-150 hover:scale-105 active:scale-95"
      style={{
        background: "var(--consent-surface)",
        color: "hsl(var(--consent-navy))",
        border: "1px solid hsl(var(--consent-border))",
        boxShadow: "0 4px 20px hsl(var(--consent-navy) / 0.3)",
      }}
      aria-label="Open privacy settings"
    >
      <Settings2 size={15} />
      {label}
    </button>
  );
}
