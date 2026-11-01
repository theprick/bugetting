# Budgetting

A personal cash-flow planner for consultants managing salary, dividends and household spending.

## Run locally

Use Node.js 22.13+ (or a newer supported LTS) and npm.

With nvm, `nvm install` selects the latest Node 22 release using `.nvmrc`.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The skeleton runs without a database or environment variables.

```sh
npm run check
npm run build
npm start
```

## Stack and structure

- Next.js App Router, React and strict TypeScript.
- Plain CSS for the initial responsive shell.
- PostgreSQL/Supabase for the planned database and authentication layer.
- `src/app/`: overview, transactions, accounts and forecasts routes.
- `src/components/`: shared interface components.
- `src/lib/finance/`: future pure financial engine and unit tests.
- `supabase/migrations/`: future versioned database migrations.
- `docs/mvp.md`: scope, milestones and acceptance cases.

## Supabase setup (later milestone)

Copy `.env.example` to `.env.local` and set the project URL and publishable key when implementing persistence. These variables are currently placeholders; there is no database connection or sign-in flow yet. Keep credentials out of Git. Implement and test user isolation before loading real financial data.

## Current status

Navigation and empty states only. No financial calculations, data entry, imports, persistence or authentication are implemented. The original spreadsheet remains the read-only migration source.

Framework references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation) and [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side/creating-a-client).

## Initial verification notes

Lint, TypeScript checks and the production build passed with the installed Node 22.2.0. Use Node 22.13+ for the supported engine range of the lint tooling.

The initial npm audit reports 16 moderate findings propagated from a `minimatch` advisory in development-only lint dependencies. The application runtime dependency tree is unaffected by these findings. npm's suggested major downgrades were not applied; review compatible upstream lint dependency updates before establishing CI.
