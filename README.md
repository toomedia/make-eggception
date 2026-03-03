# Eggception Funnel — Make

Landing funnel for the “make” experience (make.eggception.club). This repo is intentionally aligned with the play funnel for infrastructure parity while keeping distinct page content and CTAs.

## What This Repo Is
- Next.js funnel site for the “make” flow
- Owns make-specific copy and CTA routing
- Shares infra conventions with `play.eggception` (analytics, consent, configs)

## Local Development
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables
Required for production analytics and attribution tracking:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Recommended (so analytics is labeled correctly):
- `NEXT_PUBLIC_EGG_APP=make`
- `NEXT_PUBLIC_EGG_VARIANT=funnel_a`

## Analytics + Consent
- Consent is managed via `components/ConsentBanner.tsx` and `components/ConsentContext.tsx`.
- Analytics bootstrap is in `components/AnalyticsBootstrap.tsx`.
- CTA + attribution logic lives in `lib/egg-analytics/*`.

## Deployment
- Netlify build: `npx next build`
- Publish directory: `.next`
- Plugin: `@netlify/plugin-nextjs`

## Infra Parity Notes
This repo is kept in infra parity with `play.eggception` by aligning:
- `package.json` (scripts and dependency set)
- `tsconfig.json`
- `postcss.config.js`
- `lib/egg-analytics/*`

Content, layout, and CTA destinations are intentionally different.

## Useful Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
