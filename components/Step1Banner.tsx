import Image from "next/image";
import { t, Locale } from "@/constants/consent";

interface Step1Props {
  locale: Locale;
  onAllowAnalytics: () => void;
  onNecessaryOnly: () => void;
  onCustomize: () => void;
}

function parseChip(raw: string) {
  const colonIndex = raw.indexOf(":");
  if (colonIndex === -1) {
    return { label: raw, description: "" };
  }

  return {
    label: raw.slice(0, colonIndex).trim(),
    description: raw.slice(colonIndex + 1).trim(),
  };
}

export function Step1Banner({
  locale,
  onAllowAnalytics,
  onNecessaryOnly,
  onCustomize,
}: Step1Props) {
  const copy = t(locale).step1;
  const chips = [
    { ...parseChip(copy.chips.alwaysOn), required: true },
    { ...parseChip(copy.chips.analytics), required: false },
    { ...parseChip(copy.chips.marketing), required: false },
  ];

  return (
    <div
      className="w-full overflow-hidden rounded-[2rem]"
      style={{
        background: "var(--consent-surface)",
        border: "1px solid hsl(var(--consent-border))",
        boxShadow: "0 28px 90px hsl(var(--consent-navy) / 0.18)",
      }}
    >
      <div className="px-7 pb-5 pt-7 flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="Eggception"
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <p
            className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "hsl(var(--consent-orange))" }}
          >
            {copy.eyebrow}
          </p>
          <h2
            className="text-[2rem] font-extrabold leading-tight tracking-[-0.03em] text-balance"
            style={{ color: "hsl(var(--consent-navy))" }}
          >
            {copy.title}
          </h2>
        </div>
        {/* Close button intentionally commented out for now. */}
      </div>

      <div className="mx-7 h-px" style={{ background: "hsl(var(--consent-border))" }} />

      <div className="px-7 py-6 space-y-5">
        <p className="text-[15px] leading-8" style={{ color: "hsl(var(--consent-navy))" }}>
          {copy.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={`${chip.label}-${chip.description}`}
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold"
              style={{
                borderColor: chip.required ? "hsl(var(--consent-orange) / 0.28)" : "hsl(var(--consent-border))",
                background: chip.required ? "hsl(var(--consent-orange-soft))" : "hsl(var(--consent-muted))",
                color: chip.required ? "hsl(var(--consent-orange))" : "hsl(var(--consent-muted-text))",
              }}
            >
              <span>{chip.label}</span>
              <span className="opacity-60">·</span>
              <span>{chip.description}</span>
            </span>
          ))}
        </div>

        <p className="text-[12px] italic leading-relaxed" style={{ color: "hsl(var(--consent-muted-text))" }}>
          {copy.reassurance}
        </p>
      </div>

      <div className="mx-7 h-px" style={{ background: "hsl(var(--consent-border))" }} />

      <div className="px-7 py-6 space-y-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onNecessaryOnly}
            className="flex-1 rounded-full border-2 px-4 py-3.5 text-[14px] font-semibold transition-colors"
            style={{
              borderColor: "hsl(var(--consent-border))",
              color: "hsl(var(--consent-navy))",
              background: "transparent",
            }}
          >
            {copy.actions.necessaryOnly}
          </button>
          <button
            type="button"
            onClick={onAllowAnalytics}
            className="flex-1 rounded-full px-4 py-3.5 text-[14px] font-bold text-white transition-opacity"
            style={{
              background: "hsl(var(--consent-navy))",
              boxShadow: "0 18px 38px hsl(var(--consent-navy) / 0.16)",
            }}
          >
            {copy.actions.allowAnalytics}
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={onCustomize}
            className="text-[12px] underline underline-offset-2 transition-colors"
            style={{ color: "hsl(var(--consent-muted-text))" }}
          >
            {copy.actions.customize}
          </button>
        </div>
      </div>
    </div>
  );
}
