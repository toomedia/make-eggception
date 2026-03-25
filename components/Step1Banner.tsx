import Image from "next/image";
import { Button } from "@/components/ui/button";
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
      className="w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]"
      style={{
        background: "var(--consent-surface)",
        border: "1px solid hsl(var(--consent-border))",
        boxShadow: "0 28px 90px hsl(var(--consent-primary) / 0.18)",
      }}
    >
      <div className="flex items-start gap-3 px-4 pb-4 pt-5 sm:items-center sm:gap-4 sm:px-7 sm:pb-5 sm:pt-7">
        <Image
          src="/logo.png"
          alt="Eggception"
          width={56}
          height={56}
          className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
        />
        <div className="min-w-0 flex-1">
          <p
            className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "hsl(var(--consent-orange))" }}
          >
            {copy.eyebrow}
          </p>
          <h2
            className="text-[1.625rem] font-extrabold leading-tight tracking-[-0.03em] text-balance sm:text-[2rem]"
            style={{ color: "hsl(var(--consent-navy))" }}
          >
            {copy.title}
          </h2>
        </div>
        {/* Close button intentionally commented out for now. */}
      </div>

      <div className="mx-4 h-px sm:mx-7" style={{ background: "hsl(var(--consent-border))" }} />

      <div className="space-y-4 px-4 py-5 sm:space-y-5 sm:px-7 sm:py-6">
        <p className="text-[14px] leading-7 sm:text-[15px] sm:leading-8" style={{ color: "hsl(var(--consent-navy))" }}>
          {copy.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={`${chip.label}-${chip.description}`}
              className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold sm:px-3.5 sm:text-[12px]"
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

      <div className="mx-4 h-px sm:mx-7" style={{ background: "hsl(var(--consent-border))" }} />

      <div className="space-y-3 px-4 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="pillOutline"
            size="pill"
            onClick={onNecessaryOnly}
            className="w-full flex-1 border-2"
            style={{
              borderColor: "hsl(var(--consent-border))",
              color: "hsl(var(--consent-navy))",
              background: "transparent",
            }}
          >
            {copy.actions.necessaryOnly}
          </Button>
          <Button
            type="button"
            variant="pillSolid"
            size="pill"
            onClick={onAllowAnalytics}
            className="w-full flex-1 font-bold text-white"
            style={{
              background: "hsl(var(--consent-primary))",
              boxShadow: "0 18px 38px hsl(var(--consent-primary) / 0.16)",
            }}
          >
            {copy.actions.allowAnalytics}
          </Button>
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
