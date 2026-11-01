# Budgetting

A personal cash-flow planner for consultants managing salary, dividends and household spending.

## Run locally

Use Node.js 22.13+ within the Node 22 LTS line and npm. CI reads `.nvmrc` too.

With nvm, `nvm install` selects the latest Node 22 release using `.nvmrc`.
On this Mac, the updated Homebrew runtime can also be selected for the current shell with `export PATH="/opt/homebrew/opt/node@22/bin:$PATH"`.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The skeleton runs without a database or environment variables.

```sh
npm run check
npm test
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

## Automated checks

GitHub Actions runs lint, type checking, Vitest and a production build on PRs and pushes to main using `npm ci`. No database credentials are required. Tests belong alongside the pure financial code as `src/**/*.test.ts`; `npm run test:watch` runs them interactively. The empty skeleton temporarily permits no tests; remove that setting when the first financial tests land. Failed checks fail CI. Branch protection, if desired, must separately require the Checks job before merging.

The dependency audit is documented in [docs/dependencies.md](docs/dependencies.md).
