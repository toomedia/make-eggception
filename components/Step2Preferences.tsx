import Image from "next/image";
import { Shield, Video, Megaphone } from "lucide-react";
import { ConsentState } from "./types";
import { Locale, t } from "@/constants/consent";

// Map icon identifiers to components
function CategoryIcon({ icon, name }: { icon: string; name: string }) {
  if (icon === "pixel-egg") {
    return <Image src="/egg-pixel.png" alt={name} width={22} height={22} className="object-contain" />;
  }
  if (icon === "shield") return <Shield size={22} strokeWidth={1.8} style={{ color: "hsl(var(--consent-orange))" }} />;
  if (icon === "video") return <Video size={22} strokeWidth={1.8} style={{ color: "hsl(var(--consent-navy))" }} />;
  if (icon === "megaphone") return <Megaphone size={22} strokeWidth={1.8} style={{ color: "hsl(var(--consent-muted-text))" }} />;
  return null;
}

// Toggle switch
function Toggle({ checked, onChange, disabled, id }: {
  checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; id: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className="consent-focus relative flex-shrink-0 rounded-full transition-colors duration-150 focus:outline-none"
      style={{
        width: 42,
        height: 24,
        background: disabled
          ? "hsl(var(--consent-orange))"
          : checked
            ? "hsl(var(--consent-navy))"
            : "hsl(var(--consent-border))",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span
        className="absolute top-[3px] rounded-full bg-white shadow-sm transition-transform duration-150"
        style={{
          width: 18,
          height: 18,
          transform: (disabled || checked) ? "translateX(20px)" : "translateX(3px)",
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
  onBack: () => void;
}

export function Step2Preferences({ locale, state, onChange, onSave, onAllowAll, onNecessaryOnly, onViewDetails, onBack }: Step2Props) {
  const copy = t(locale).step2;

  const getVal = (id: string): boolean => {
    if (id === "necessary") return true;
    if (id === "analytics") return state.analytics;
    if (id === "replay") return state.replay;
    if (id === "marketing") return state.marketing;
    return false;
  };

  const setVal = (id: string, val: boolean) => {
    if (id === "analytics") {
      onChange({
        ...state,
        analytics: val,
        replay: val ? state.replay : false,
      });
      return;
    }

    if (id === "replay") {
      onChange({
        ...state,
        analytics: val ? true : state.analytics,
        replay: val,
      });
      return;
    }

    onChange({
      ...state,
      marketing: id === "marketing" ? val : state.marketing,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={onBack}
          className="consent-focus rounded-lg p-1 -ml-1 transition-colors hover:bg-[hsl(var(--consent-muted))]"
          aria-label="Back to summary"
          style={{ color: "hsl(var(--consent-muted-text))" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-extrabold leading-tight" style={{ color: "hsl(var(--consent-navy))" }}>
            {copy.title}
          </h2>
          <p className="text-[12px]" style={{ color: "hsl(var(--consent-muted-text))" }}>
            {copy.subtitle}
          </p>
        </div>
      </div>

      {/* Category cards */}
      <div className="flex flex-col gap-2.5 mt-3 mb-4">
        {copy.categories.map((cat) => {
          const isOn = getVal(cat.id);
          return (
            <div
              key={cat.id}
              className="flex items-start gap-3 rounded-xl p-3.5 border"
              style={{
                borderColor: isOn && !cat.locked
                  ? "hsl(var(--consent-navy) / 0.2)"
                  : "hsl(var(--consent-border))",
                background: isOn && !cat.locked
                  ? "hsl(var(--consent-navy) / 0.03)"
                  : "transparent",
              }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "hsl(var(--consent-muted))" }}
              >
                <CategoryIcon icon={cat.icon} name={cat.name} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[13px] font-bold" style={{ color: "hsl(var(--consent-navy))" }}>
                    {cat.name}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: cat.locked
                        ? "hsl(var(--consent-orange-soft))"
                        : "hsl(var(--consent-muted))",
                      color: cat.locked
                        ? "hsl(var(--consent-orange))"
                        : "hsl(var(--consent-muted-text))",
                    }}
                  >
                    {cat.badge}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: "hsl(var(--consent-muted-text))" }}>
                  {cat.description}
                </p>
              </div>

              {/* Toggle */}
              <div className="flex-shrink-0 mt-0.5">
                <Toggle
                  id={`toggle-${cat.id}`}
                  checked={isOn}
                  onChange={(v) => setVal(cat.id, v)}
                  disabled={cat.locked}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onSave}
          className="consent-focus w-full rounded-xl py-3 text-[14px] font-bold transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
          style={{
            background: "hsl(var(--consent-navy))",
            color: "#fff",
          }}
        >
          {copy.btnSave}
        </button>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: copy.btnAllowAll, onClick: onAllowAll },
            { label: copy.btnNecessary, onClick: onNecessaryOnly },
          ].map(({ label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="consent-focus rounded-xl py-2.5 text-[13px] font-semibold border-2 transition-all duration-150 hover:bg-[hsl(var(--consent-muted))]"
              style={{
                borderColor: "hsl(var(--consent-border))",
                color: "hsl(var(--consent-navy))",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor link */}
      <div className="text-center mt-3">
        <button
          onClick={onViewDetails}
          className="consent-focus text-[12px] font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "hsl(var(--consent-muted-text))" }}
        >
          {copy.vendorLink}
        </button>
      </div>
    </div>
  );
}
