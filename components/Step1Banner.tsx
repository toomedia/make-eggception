import Image from "next/image";
import { ConsentChip } from "./ConsentChip";
import { t, Locale } from "@/constants/consent";

interface Step1Props {
  locale: Locale;
  onAllowAnalytics: () => void;
  onNecessaryOnly: () => void;
}

export function Step1Banner({ locale, onAllowAnalytics, onNecessaryOnly }: Step1Props) {
  const copy = t(locale).step1;

  // Parse chip strings: "Label: detail" → split on first ":"
  const chips = [
    { raw: copy.chips.alwaysOn, variant: "required" as const },
    { raw: copy.chips.analytics, variant: "optional" as const },
    { raw: copy.chips.marketing, variant: "optional" as const },
  ].map(({ raw, variant }) => {
    const colonIdx = raw.indexOf(":");
    return {
      label: raw.slice(0, colonIdx).trim(),
      detail: raw.slice(colonIdx + 1).trim(),
      variant,
    };
  });

  return (
    <div className="flex flex-col">
      {/* Eyebrow */}
      <p
        className="text-[11px] font-bold tracking-widest uppercase mb-3"
        style={{ color: "hsl(var(--consent-orange))" }}
      >
        {copy.eyebrow}
      </p>

      {/* Hero row */}
      <div className="flex items-start gap-4 mb-4">
        <Image
          src="/logo.png"
          alt="Eggception mascot with orange sunglasses"
          width={80}
          height={80}
          className="animate-egg-float w-20 h-20 flex-shrink-0 object-contain drop-shadow-md"
          draggable={false}
        />
        <div>
          <h2
            className="text-xl font-extrabold leading-snug mb-2"
            style={{ color: "hsl(var(--consent-navy))" }}
          >
            {copy.title}
          </h2>
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "hsl(var(--consent-muted-text))" }}
          >
            {copy.description}
          </p>
        </div>
      </div>

      {/* Trust line */}
      <p
        className="text-[12px] font-medium mb-3 flex items-center gap-1.5"
        style={{ color: "hsl(var(--consent-green))" }}
      >
        <span className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: "hsl(var(--consent-green))" }} />
        {copy.reassurance}
      </p>

      {/* Info chips */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {chips.map((chip) => (
          <ConsentChip key={chip.detail} {...chip} />
        ))}
      </div>

      {/* ── Equal-weight action buttons ───────────────────────────────── */}
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        role="group"
        aria-label="Consent options"
      >
        {[
          { label: copy.actions.allowAnalytics, onClick: onAllowAnalytics, id: "btn-allow-analytics" },
          { label: copy.actions.necessaryOnly, onClick: onNecessaryOnly, id: "btn-necessary" },
        ].map(({ label, onClick, id }) => (
          <button
            key={id}
            id={id}
            onClick={onClick}
            className="consent-focus rounded-xl px-3 py-3 text-[13px] font-semibold border-2 leading-tight text-center transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              borderColor: "hsl(var(--consent-navy))",
              color: "hsl(var(--consent-navy))",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--consent-navy))";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--consent-navy))";
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
