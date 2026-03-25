import Image from "next/image";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsentState } from "./types";
import { Locale, t } from "@/constants/consent";
import { Step3Details } from "./StepDetails";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
      style={{
        background: checked ? "hsl(var(--consent-primary))" : "hsl(var(--consent-border) / 0.7)",
      }}
    >
      <span
        className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform"
        style={{
          transform: checked ? "translateX(30px)" : "translateX(4px)",
        }}
      />
    </button>
  );
}

interface Step2Props {
  locale: Locale;
  state: ConsentState;
  onChange: (state: ConsentState) => void;
  onSave: () => void;
  onAllowAll: () => void;
  onNecessaryOnly: () => void;
  onViewDetails: () => void;
  detailsOpen: boolean;
  onCloseDetails: () => void;
}

export function Step2Preferences({
  locale,
  state,
  onChange,
  onSave,
  onAllowAll,
  onNecessaryOnly,
  onViewDetails,
  detailsOpen,
  onCloseDetails,
}: Step2Props) {
  const copy = t(locale).step2;

  return (
    <div
      className="relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-[1.5rem] sm:max-h-[90vh] sm:rounded-[2rem]"
      style={{
        background: "var(--consent-surface)",
        border: "1px solid hsl(var(--consent-border))",
        boxShadow: "0 28px 90px hsl(var(--consent-primary) / 0.18)",
      }}
    >
      <div className="shrink-0 flex items-start gap-3 px-4 pb-4 pt-5 sm:items-center sm:gap-4 sm:px-7 sm:pb-5 sm:pt-7">
        <Image src="/logo.png" alt="Eggception" width={56} height={56} className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14" />
        <div className="min-w-0 flex-1">
          <h2 className="text-[1.625rem] font-extrabold leading-tight tracking-[-0.03em] sm:text-[2rem]" style={{ color: "hsl(var(--consent-navy))" }}>
            {copy.title}
          </h2>
          <p className="mt-0.5 text-[13px]" style={{ color: "hsl(var(--consent-muted-text))" }}>
            {copy.subtitle}
          </p>
        </div>
        <div className="flex shrink-0 items-start gap-2">
          {/* Modal language buttons intentionally hidden for now. */}
        </div>
      </div>

      <div className="mx-4 h-px shrink-0 sm:mx-7" style={{ background: "hsl(var(--consent-border))" }} />

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="space-y-3 px-4 py-5 sm:px-7 sm:py-6">
          {copy.categories
            .filter((category) => category.id !== "replay")
            .map((category) => {
              const isLocked = category.locked;
              const isOn = isLocked ? true : category.id === "analytics" ? state.analytics : state.marketing;

              return (
                <div
                  key={category.id}
                  className="flex flex-col gap-3 rounded-[1.25rem] px-4 py-4 sm:flex-row sm:items-start sm:gap-4 sm:rounded-[1.5rem] sm:px-5"
                  style={{
                    background: "hsl(var(--consent-muted))",
                  }}
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-bold" style={{ color: "hsl(var(--consent-navy))" }}>
                        {category.name}
                      </span>
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: isLocked ? "hsl(var(--consent-orange-soft))" : "var(--consent-surface)",
                          borderColor: isLocked ? "hsl(var(--consent-orange) / 0.28)" : "hsl(var(--consent-border))",
                          color: isLocked ? "hsl(var(--consent-orange))" : "hsl(var(--consent-muted-text))",
                        }}
                      >
                        {category.badge}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "hsl(var(--consent-muted-text))" }}>
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-0.5 shrink-0 self-start sm:self-auto">
                    {isLocked ? (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ background: "hsl(var(--consent-orange-soft))", color: "hsl(var(--consent-orange))" }}
                      >
                        <Lock size={14} />
                      </div>
                    ) : (
                      <Toggle
                        checked={isOn}
                        onChange={() =>
                          onChange({
                            ...state,
                            analytics: category.id === "analytics" ? !state.analytics : state.analytics,
                            replay: category.id === "analytics" ? !state.analytics : state.replay,
                            marketing: category.id === "marketing" ? !state.marketing : state.marketing,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              );
            })}

          <div className="text-center pt-1 pb-1">
            <button
              type="button"
              onClick={onViewDetails}
              className="text-[12px] underline underline-offset-2 transition-colors"
              style={{ color: "hsl(var(--consent-muted-text))" }}
            >
              {copy.vendorLink}
            </button>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <div className="mx-4 h-px sm:mx-7" style={{ background: "hsl(var(--consent-border))" }} />
        <div className="space-y-2.5 px-4 py-5 sm:px-7 sm:py-6">
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
              {copy.btnNecessary}
            </Button>
            <Button
              type="button"
              variant="pillSolid"
              size="pill"
              onClick={onSave}
              className="w-full flex-1 font-bold text-white"
              style={{
                background: "hsl(var(--consent-primary))",
                boxShadow: "0 18px 38px hsl(var(--consent-primary) / 0.16)",
              }}
            >
              {copy.btnSave}
            </Button>
          </div>
          <button
            type="button"
            onClick={onAllowAll}
            className="w-full rounded-full py-2.5 text-[13px] font-medium transition-colors"
            style={{ color: "hsl(var(--consent-muted-text))" }}
          >
            {copy.btnAllowAll}
          </button>
        </div>
      </div>

      <Step3Details locale={locale} open={detailsOpen} onClose={onCloseDetails} />
    </div>
  );
}
