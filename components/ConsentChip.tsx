interface ConsentChipProps {
    label: string;
    detail: string;
    variant?: "required" | "optional";
  }
  
  export function ConsentChip({ label, detail, variant = "optional" }: ConsentChipProps) {
    const isRequired = variant === "required";
  
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium"
        style={{
          borderColor: isRequired ? "hsl(var(--consent-orange) / 0.24)" : "hsl(var(--consent-border))",
          background: isRequired ? "hsl(var(--consent-orange-soft))" : "hsl(var(--consent-muted))",
          color: isRequired ? "hsl(var(--consent-orange))" : "hsl(var(--consent-muted-text))",
        }}
      >
        <span className="font-semibold">{label}</span>
        <span>{detail}</span>
      </span>
    );
  }
  