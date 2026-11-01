# Development conventions

- Keep changes scoped to the current milestone in `docs/mvp.md`.
- Use strict TypeScript. Keep financial calculations pure under `src/lib/finance`.
- Represent money exactly, with explicit currency; never use binary floating-point arithmetic for financial totals.
- Test financial behavior: transfers, dividend timing, opening balances, refunds and year boundaries.
- Keep actual records distinct from forecast assumptions. Do not embed personal financial data in fixtures.
- Never modify source spreadsheets during import. Preview imports and reconcile totals before applying them.
- Store database changes as versioned Supabase migrations. Add and test RLS for every user-owned table before exposing it.
- Never commit secrets or service-role keys. Public configuration may contain only the project URL and publishable key.
- Run `npm run check` and `npm run build` after application changes. Add behavioral tests when implementing financial or persistence logic.
