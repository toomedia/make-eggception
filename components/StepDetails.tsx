import { X, ExternalLink } from "lucide-react";
import { Locale, t } from "@/constants/consent";

interface Step3DetailsProps {
  locale: Locale;
  onClose: () => void;
}

export function Step3Details({ locale, onClose }: Step3DetailsProps) {
  const copy = t(locale).step3;

  return (
    /* Drawer overlay */
    <div
      className="fixed inset-0 z-[60] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Vendor details"
    >
      {/* Scrim */}
      <button
        className="absolute inset-0 bg-black/30 cursor-default"
        onClick={onClose}
        aria-label="Close vendor details"
        tabIndex={-1}
      />

      {/* Drawer panel */}
      <div
        className="animate-drawer-in relative flex h-full w-full max-w-sm flex-col overflow-y-auto shadow-2xl"
        style={{
          borderRadius: "1.25rem 0 0 1.25rem",
          background: "var(--consent-surface)",
          borderLeft: "1px solid hsl(var(--consent-border))",
        }}
      >
        {/* Drawer header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{
            background: "var(--consent-surface)",
            backdropFilter: "blur(8px)",
            borderColor: "hsl(var(--consent-border))",
          }}
        >
          <h3 className="text-base font-extrabold" style={{ color: "hsl(var(--consent-navy))" }}>
            {copy.title}
          </h3>
          <button
            onClick={onClose}
            className="consent-focus rounded-full p-1.5 transition-colors hover:bg-[hsl(var(--consent-muted))]"
            aria-label="Close"
          >
            <X size={18} style={{ color: "hsl(var(--consent-muted-text))" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5">
          {copy.vendors.map((vendor) => (
            <div
              key={vendor.name}
              className="rounded-xl border p-4"
              style={{
                borderColor: "hsl(var(--consent-border))",
                background: "var(--consent-surface-elevated)",
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-[14px]" style={{ color: "hsl(var(--consent-navy))" }}>
                  {vendor.name}
                </h4>
                <a
                  href={vendor.privacy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="consent-focus flex items-center gap-1 text-[11px] font-medium underline underline-offset-2 flex-shrink-0"
                  style={{ color: "hsl(var(--consent-orange))" }}
                >
                  Privacy policy
                  <ExternalLink size={11} />
                </a>
              </div>

              <dl className="flex flex-col gap-1.5 text-[12px]">
                <div className="flex gap-2">
                  <dt className="font-semibold w-20 flex-shrink-0" style={{ color: "hsl(var(--consent-navy))" }}>
                    {copy.purposesLabel}
                  </dt>
                  <dd style={{ color: "hsl(var(--consent-muted-text))" }}>
                    {vendor.purposes.join(", ")}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold w-20 flex-shrink-0" style={{ color: "hsl(var(--consent-navy))" }}>
                    {copy.retentionLabel}
                  </dt>
                  <dd style={{ color: "hsl(var(--consent-muted-text))" }}>
                    {vendor.retention}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold w-20 flex-shrink-0" style={{ color: "hsl(var(--consent-navy))" }}>
                    {copy.transferLabel}
                  </dt>
                  <dd style={{ color: "hsl(var(--consent-muted-text))" }}>
                    {vendor.country}
                  </dd>
                </div>
              </dl>
            </div>
          ))}

          {/* Change anytime note */}
          <p
            className="text-[12px] leading-relaxed rounded-xl p-3.5"
            style={{
              background: "hsl(var(--consent-muted))",
              color: "hsl(var(--consent-muted-text))",
            }}
          >
            {copy.changeAnytime}
          </p>
        </div>
      </div>
    </div>
  );
}
