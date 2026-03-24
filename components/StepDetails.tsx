import { X, Globe, Clock, Layers, ExternalLink } from "lucide-react";
import { Locale, t } from "@/constants/consent";

interface Step3DetailsProps {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}

export function Step3Details({ locale, open, onClose }: Step3DetailsProps) {
  const copy = t(locale).step3;

  return (
    <>
      <div
        className={`absolute inset-0 rounded-[2rem] transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "hsl(220 30% 10% / 0.45)" }}
        onClick={onClose}
      />

      <div
        className={`absolute inset-x-0 bottom-0 flex max-h-[82%] flex-col rounded-b-[2rem] rounded-t-[1.5rem] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          background: "var(--consent-surface)",
          boxShadow: "0 -18px 40px hsl(var(--consent-navy) / 0.2)",
        }}
      >
        <div className="flex justify-center pb-1 pt-3 shrink-0">
          <div className="h-1 w-10 rounded-full" style={{ background: "hsl(var(--consent-border))" }} />
        </div>

        <div
          className="flex items-center justify-between px-7 pb-4 pt-2 shrink-0"
          style={{
            color: "hsl(var(--consent-navy))",
          }}
        >
          <h3 className="text-[15px] font-bold" style={{ color: "hsl(var(--consent-navy))" }}>
            {copy.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-[13px] font-medium transition-colors"
            style={{ color: "hsl(var(--consent-muted-text))" }}
          >
            <X size={15} />
            {copy.close}
          </button>
        </div>

        <div className="mx-7 h-px shrink-0" style={{ background: "hsl(var(--consent-border))" }} />

        <div className="flex-1 overflow-y-auto overscroll-contain px-7 py-5 space-y-3">
          {copy.vendors.map((vendor) => (
            <div
              key={vendor.name}
              className="space-y-3 rounded-[1.5rem] px-5 py-4"
              style={{ background: "hsl(var(--consent-muted))" }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-bold" style={{ color: "hsl(var(--consent-navy))" }}>
                  {vendor.name}
                </p>
                <a
                  href={vendor.privacy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-medium underline underline-offset-2"
                  style={{ color: "hsl(var(--consent-orange))" }}
                >
                  Privacy
                  <ExternalLink size={11} />
                </a>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <Layers size={11} className="mt-0.5 shrink-0" style={{ color: "hsl(var(--consent-orange))" }} />
                  <p className="text-[11px] leading-snug" style={{ color: "hsl(var(--consent-muted-text))" }}>
                    <span className="font-semibold" style={{ color: "hsl(var(--consent-navy))" }}>
                      {copy.purposesLabel}:{" "}
                    </span>
                    {vendor.purposes.join(", ")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={11} className="mt-0.5 shrink-0" style={{ color: "hsl(var(--consent-orange))" }} />
                  <p className="text-[11px] leading-snug" style={{ color: "hsl(var(--consent-muted-text))" }}>
                    <span className="font-semibold" style={{ color: "hsl(var(--consent-navy))" }}>
                      {copy.retentionLabel}:{" "}
                    </span>
                    {vendor.retention}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Globe size={11} className="mt-0.5 shrink-0" style={{ color: "hsl(var(--consent-orange))" }} />
                  <p className="text-[11px] leading-snug" style={{ color: "hsl(var(--consent-muted-text))" }}>
                    <span className="font-semibold" style={{ color: "hsl(var(--consent-navy))" }}>
                      {copy.transferLabel}:{" "}
                    </span>
                    {vendor.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="shrink-0 border-t px-7 py-4" style={{ borderColor: "hsl(var(--consent-border))" }}>
          <p
            className="text-[11px] italic leading-relaxed"
            style={{ color: "hsl(var(--consent-muted-text))" }}
          >
            {copy.changeAnytime}
          </p>
        </div>
      </div>
    </>
  );
}
