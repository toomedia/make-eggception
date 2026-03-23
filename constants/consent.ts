export const CONSENT_COPY = {
  en: {
    step1: {
      eyebrow: "PRIVACY SETTINGS",
      title: "Help us improve Eggception",
      description:
        "If you agree, we may check how the game is running. This helps us spot when games end early, technical problems happen, or opponents are not matched fairly. That lets us fix issues faster and improve the game. Advertising stays separate and optional.",
      reassurance: "You can still play normally without agreeing to this.",
      chips: {
        alwaysOn: "Always on: Security, sign-in, finding opponents",
        analytics: "Optional: Game analysis",
        marketing: "Optional: Advertising",
      },
      actions: {
        allowAll: "Allow all",
        allowAnalytics: "Allow game analysis",
        necessaryOnly: "Continue without analysis",
        customize: "Customize choices",
      },
    },
    step2: {
      title: "Privacy Preferences",
      subtitle: "Choose what you're comfortable sharing with us.",
      categories: [
        {
          id: "necessary",
          icon: "shield",
          name: "Security & gameplay",
          badge: "Always on",
          locked: true,
          description:
            "Login state, matchmaking integrity, fraud protection, and core session state.",
        },
        {
          id: "analytics",
          icon: "pixel-egg",
          name: "Game Analytics",
          badge: "Help us improve",
          locked: false,
          description:
            "Match duration, rematch rate, drop-offs, device/browser issues, balance signals, and AI matchmaking tuning.",
        },
        {
          id: "replay",
          icon: "video",
          name: "Replay & diagnostics",
          badge: "Find broken flows faster",
          locked: false,
          description: "Short-lived session diagnostics for bug fixing. Never used for ads.",
        },
        {
          id: "marketing",
          icon: "megaphone",
          name: "Marketing",
          badge: "Grow the player base",
          locked: false,
          description: "Campaign attribution and traffic measurement. No impact on gameplay.",
        },
      ],
      btnSave: "Save choices",
      btnAllowAll: "Allow all",
      btnNecessary: "Only necessary",
      vendorLink: "View vendors & details",
    },
    step3: {
      title: "Vendors & Details",
      close: "Close",
      vendors: [
        {
          name: "PostHog",
          purposes: ["Game Analytics", "Session Replay & Diagnostics"],
          retention: "12 months",
          country: "EU (Frankfurt, AWS) — no third-country transfer",
          privacy: "https://posthog.com/privacy",
        },
        {
          name: "Google Analytics 4",
          purposes: ["Game Analytics"],
          retention: "14 months",
          country: "USA — EU-US Data Privacy Framework",
          privacy: "https://policies.google.com/privacy",
        },
        {
          name: "Google Ads",
          purposes: ["Marketing / Campaign attribution"],
          retention: "30 days",
          country: "USA — EU-US Data Privacy Framework",
          privacy: "https://policies.google.com/privacy",
        },
        {
          name: "Meta Ads",
          purposes: ["Marketing / Traffic measurement"],
          retention: "30 days",
          country: "USA — Standard Contractual Clauses",
          privacy: "https://www.facebook.com/privacy/policy",
        },
      ],
      changeAnytime:
        "You can change your preferences at any time via the “Privacy settings” link at the bottom of the page.",
      retentionLabel: "Retention",
      transferLabel: "Transfer",
      purposesLabel: "Purposes",
    },
    toast: {
      saved: "Saved",
      analyticsOn: "Game Analytics on",
      analyticsOff: "Game Analytics off",
      marketingOn: "Marketing on",
      marketingOff: "Marketing off",
    },
    privacyChip: "Privacy settings",
  },
  de: {
    step1: {
      eyebrow: "DATENSCHUTZEINSTELLUNGEN",
      title: "Hilf uns, Eggception besser zu machen",
      description:
        "Wenn du zustimmst, dürfen wir prüfen, wie das Spiel läuft. So erkennen wir schneller, wenn Spiele abgebrochen werden, technische Probleme auftreten oder Gegner nicht gut zusammenpassen. So können wir Fehler schneller beheben und das Spiel verbessern. Werbung bleibt freiwillig und getrennt.",
      reassurance: "Du kannst auch ohne diese Zustimmung ganz normal spielen.",
      chips: {
        alwaysOn: "Immer aktiv: Sicherheit, Anmeldung, Gegnersuche",
        analytics: "Freiwillig: Spielanalyse",
        marketing: "Freiwillig: Werbung",
      },
      actions: {
        allowAll: "Alles erlauben",
        allowAnalytics: "Spielanalyse erlauben",
        necessaryOnly: "Ohne Analyse weiterspielen",
        customize: "Auswahl anpassen",
      },
    },
    step2: {
      title: "Datenschutz-Einstellungen",
      subtitle: "Wähle, was du mit uns teilen möchtest.",
      categories: [
        {
          id: "necessary",
          icon: "shield",
          name: "Sicherheit & Gameplay",
          badge: "Immer aktiv",
          locked: true,
          description:
            "Login-Status, Matchmaking-Integrität, Betrugsschutz und grundlegender Sitzungsstatus.",
        },
        {
          id: "analytics",
          icon: "pixel-egg",
          name: "Spielanalyse",
          badge: "Hilf uns zu verbessern",
          locked: false,
          description:
            "Match-Dauer, Rematch-Rate, Abbrüche, Geräte-/Browser-Probleme, Balance-Signale und KI-Matchmaking-Optimierung.",
        },
        {
          id: "replay",
          icon: "video",
          name: "Replay & Diagnose",
          badge: "Fehler schneller finden",
          locked: false,
          description:
            "Kurzlebige Sitzungsdiagnosen zur Fehlerbehebung. Nie für Werbezwecke verwendet.",
        },
        {
          id: "marketing",
          icon: "megaphone",
          name: "Marketing",
          badge: "Spielerbasis ausbauen",
          locked: false,
          description:
            "Kampagnenzuordnung und Traffic-Messung. Kein Einfluss auf das Gameplay.",
        },
      ],
      btnSave: "Auswahl speichern",
      btnAllowAll: "Alles erlauben",
      btnNecessary: "Nur notwendige Funktionen",
      vendorLink: "Anbieter & Details anzeigen",
    },
    step3: {
      title: "Anbieter & Details",
      close: "Schließen",
      vendors: [
        {
          name: "PostHog",
          purposes: ["Spielanalyse", "Session Replay & Diagnose"],
          retention: "12 Monate",
          country: "EU (Frankfurt, AWS) — kein Drittlandstransfer",
          privacy: "https://posthog.com/privacy",
        },
        {
          name: "Google Analytics 4",
          purposes: ["Spielanalyse"],
          retention: "14 Monate",
          country: "USA — EU-US Data Privacy Framework",
          privacy: "https://policies.google.com/privacy",
        },
        {
          name: "Google Ads",
          purposes: ["Marketing / Kampagnenzuordnung"],
          retention: "30 Tage",
          country: "USA — EU-US Data Privacy Framework",
          privacy: "https://policies.google.com/privacy",
        },
        {
          name: "Meta Ads",
          purposes: ["Marketing / Traffic-Messung"],
          retention: "30 Tage",
          country: "USA — Standardvertragsklauseln",
          privacy: "https://www.facebook.com/privacy/policy",
        },
      ],
      changeAnytime:
        "Du kannst deine Einstellungen jederzeit über den Link „Datenschutz-Einstellungen“ am unteren Seitenrand ändern.",
      retentionLabel: "Speicherdauer",
      transferLabel: "Drittlandtransfer",
      purposesLabel: "Zwecke",
    },
    toast: {
      saved: "Gespeichert",
      analyticsOn: "Spielanalyse aktiv",
      analyticsOff: "Spielanalyse deaktiviert",
      marketingOn: "Marketing aktiv",
      marketingOff: "Marketing deaktiviert",
    },
    privacyChip: "Datenschutz-Einstellungen",
  },
} as const;

export type Locale = keyof typeof CONSENT_COPY;
export const t = (locale: Locale = "en") => CONSENT_COPY[locale];
