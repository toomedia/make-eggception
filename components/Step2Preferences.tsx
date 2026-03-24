import Image from "next/image";
import { Lock, X } from "lucide-react";
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
        background: checked ? "hsl(var(--consent-navy))" : "hsl(var(--consent-border) / 0.7)",
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
  onClose: () => void;
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
  onClose,
  detailsOpen,
  onCloseDetails,
}: Step2Props) {
  const copy = t(locale).step2;

  return (
    <div
      className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[2rem]"
      style={{
        background: "var(--consent-surface)",
        border: "1px solid hsl(var(--consent-border))",
        boxShadow: "0 28px 90px hsl(var(--consent-navy) / 0.18)",
      }}
    >
      <div className="shrink-0 flex items-center gap-4 px-7 pb-5 pt-7">
        <Image src="/logo.png" alt="Eggception" width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
        <div className="min-w-0 flex-1">
          <h2 className="text-[2rem] font-extrabold leading-tight tracking-[-0.03em]" style={{ color: "hsl(var(--consent-navy))" }}>
            {copy.title}
          </h2>
          <p className="mt-0.5 text-[13px]" style={{ color: "hsl(var(--consent-muted-text))" }}>
            {copy.subtitle}
          </p>
        </div>
        <div className="flex shrink-0 items-start gap-2">
          {/* Modal language buttons intentionally hidden for now. */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            style={{ color: "hsl(var(--consent-muted-text))" }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="mx-7 h-px shrink-0" style={{ background: "hsl(var(--consent-border))" }} />

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="space-y-3 px-7 py-6">
          {copy.categories
            .filter((category) => category.id !== "replay")
            .map((category) => {
              const isLocked = category.locked;
              const isOn = isLocked ? true : category.id === "analytics" ? state.analytics : state.marketing;

              return (
                <div
                  key={category.id}
                  className="rounded-[1.5rem] px-5 py-4 flex items-start gap-4"
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

                  <div className="shrink-0 mt-0.5">
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
        <div className="mx-7 h-px" style={{ background: "hsl(var(--consent-border))" }} />
        <div className="space-y-2.5 px-7 py-6">
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
              {copy.btnNecessary}
            </button>
            <button
              type="button"
              onClick={onSave}
              className="flex-1 rounded-full px-4 py-3.5 text-[14px] font-bold text-white transition-opacity"
              style={{
                background: "hsl(var(--consent-navy))",
                boxShadow: "0 18px 38px hsl(var(--consent-navy) / 0.16)",
              }}
            >
              {copy.btnSave}
            </button>
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
