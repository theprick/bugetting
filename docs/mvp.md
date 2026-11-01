# MVP scope

Audience: consultants who receive salary and occasional company dividends and need to plan household cash flow.

Start with one household and fictional fixtures. Primary question: what is the lowest projected cash balance before the next dividend?

## Delivery milestones

1. Project skeleton: runnable Next.js application, strict TypeScript, navigation, checks and setup documentation.
2. Financial core: accounts, exact money representation, transaction types, opening balances, transfers and recurring events, with unit tests.
3. Persistence and entry: Supabase schema, authentication, user isolation, account and transaction forms, edit history.
4. Planning: monthly budgets, reconciliation and forecasts with editable assumptions.
5. Import/export: read-only CSV/Excel migration with preview, duplicate detection and reconciled totals; full export.
6. Private pilot: backup/restore verification, deletion, error monitoring and security review.

Bank connections, receipt scanning, AI categorisation, automatic tax advice, native mobile applications and subscriptions are deferred. Company revenue and estimated profit remain separate from personal receipts. Tax rates are explicit scenario inputs.

## Financial acceptance cases for the next milestone

- Opening savings increase available cash, never income.
- Transfers preserve combined account balances and do not create spending.
- July dividends appear once, in the receipt month.
- December closing cash becomes January opening cash.
- Actual and planned transactions cannot be silently double-counted.
- Refunds, refundable deposits, pension contributions and mortgage principal have explicit treatment.
- Monetary calculations and reconciliation preserve cents exactly.

## Skeleton acceptance

The four routes render without Supabase credentials. Lint, type checking and a production build pass. No personal financial records or credentials are included.
