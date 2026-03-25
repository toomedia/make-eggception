import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyChipProps {
  label: string;
  onClick: () => void;
}

export function PrivacyChip({ label, onClick }: PrivacyChipProps) {
  return (
    <Button
      onClick={onClick}
      variant="pillOutline"
      size="pillSm"
      className="consent-focus fixed bottom-5 right-5 z-40 flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
      style={{
        background: "var(--consent-surface)",
        color: "hsl(var(--consent-navy))",
        border: "1px solid hsl(var(--consent-border))",
        boxShadow: "0 4px 20px hsl(var(--consent-primary) / 0.3)",
      }}
      aria-label="Open privacy settings"
    >
      <Settings2 size={15} />
      {label}
    </Button>
  );
}
