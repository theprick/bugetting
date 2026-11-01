# Financial model

## Boundaries

The engine is pure TypeScript: no database, framework, clock, network or locale-dependent input parsing. A ledger is an immutable input snapshot; a scenario is separate from its actual transactions. All examples below are fictional.

The first household operates in EUR. Money utilities also support two-decimal USD and GBP values, but each ledger uses exactly one currency; mixed ledgers, cross-currency arithmetic and transfers are rejected. There is no exchange-rate inference.

Money uses signed `bigint` minor units (100 cents = EUR 1), with an absolute bound of 9,000,000,000,000,000 cents. Inputs are decimal strings, never floats. Parse at most two decimals; intentional rounding uses a separate named operation, half away from zero. Arithmetic is checked against the same bound. JSON/database boundaries will encode minor units as decimal strings, since native JSON does not support bigint. Display does not modify values.

Dates are validated Gregorian `YYYY-MM-DD`, years 0001–9999. They represent household calendar dates, not timestamps or UTC instants. Dates compare lexicographically after validation. Ranges include both endpoints. Daily balances are end-of-day: all same-day movements are netted together; intraday overdrafts cannot be inferred. Tied minimum balances report the earliest date.

## Records and identity

IDs and names/descriptions must be nonblank. Account, category, transaction, scenario and planned-event IDs are stable strings; IDs are unique within their collection. The engine validates inputs at its public boundary; TypeScript types alone are not validation.

| Record | Required fields and rules |
| --- | --- |
| Account | ID, name, current/savings/cash kind, opening date and exact opening balance (may be negative). It represents an available-cash account. |
| Category | ID and name. Expense categories must exist. Treatment is a separate field, not inferred from a category label. |
| Transaction | ID, date, description and its kind-specific fields. Monetary amounts are positive; direction comes from the kind. Optional group ID links splits of one bank payment. |
| Income | Account, amount, source: salary, allowance, dividend or other. Only personal cash received; company revenue/profit is not an income source. |
| Expense | Account, amount, category and treatment. Always a cash payment. Only consumption contributes to lifestyle spending. |
| Transfer | Distinct source/destination cash accounts and amount. One atomic record generates two opposite balance movements. No personal income or spending. |
| Refund | Original expense ID and positive amount. Credited to the original account and reporting treatment. Cumulative unreversed refunds may not exceed the expense. Refund date must be on/after the expense date. |
| Reversal | Original non-reversal transaction ID. Cancels its full effect on the reversal date; never erases the source. At most one reversal per original. Date must be on/after the original. Refunds must be reversed before reversing a refunded expense. |
| Planned event | Stable ID, description, schedule and income/expense/transfer movement. No planned refunds or corrections in this version. |
| Scenario | ID, inclusive start/end dates and planned events. Forecasts require all accounts opened by the horizon start; historical transactions build the opening balance. |

Transactions cannot affect an account before its opening date. Duplicate transaction IDs and nonempty duplicate import references are errors. Opening balances are assets, not income; combined ledger balances include an account only from its opening date.

## Cash versus spending

An expense has one treatment:

- `consumption`: groceries, rent, mortgage interest, insurance, etc. Counts as spending.
- `refundable-deposit`: cash is unavailable, but not consumption. A later linked refund restores cash.
- `pension`: cash contribution, not consumption. Pension valuation is outside this cash ledger.
- `mortgage-principal`: cash repayment, not consumption. Loan liability and home equity are outside this ledger.

Split a EUR 900 mortgage payment, for example, into EUR 600 principal and EUR 300 interest, sharing a group ID. Cash falls EUR 900, consumption is EUR 300. No split is guessed. A EUR 100 deposit payment and EUR 100 refund net to zero cash and zero consumption. Buying investments is deferred; do not classify it as consumption by default.

Reports expose income, consumption and other cash payments separately. Refunds reduce the original expense treatment; refunds are not salary or income. Reversals reverse the original reporting contribution in their own period. Total cash receipts/payments are gross cash directions, while income/spending are classification totals; these are deliberately different measures.

## Corrections and audit history

The engine consumes append-only actual records. Correct an incorrect record with a reversal plus a replacement transaction (linked through the reversed original and a shared group ID if helpful). Original records remain inspectable. Reversals of reversals are rejected; a new replacement is explicit. Refund eligibility is checked in chronological order; an expense cannot be reversed while an unreversed refund remains. For same-day validation, original records precede refunds, refund reversals precede expense reversals. Future invalid records are rejected even for an earlier report cutoff, so a ledger snapshot is either valid or rejected.

Persistence will separately record actor/time and metadata edits. No database audit trail is claimed in this milestone.

## Forecast occurrences and matching

Occurrence identity is `<event ID>@<scheduled YYYY-MM-DD>`; event IDs may not contain `@`. Actual transactions optionally reference one occurrence with `plannedOccurrenceId`. At most one unreversed actual movement may match an occurrence. Refunds/reversals cannot themselves match an occurrence. An actual record supersedes the whole planned occurrence, even if its amount or receipt date differs. Partial matches are not supported: split a planned payment into separately identified events when needed.

Matching verifies that an occurrence exists and that the actual kind, accounts and classification match its template. A changed amount/date is allowed. A fully reversed actual no longer suppresses its planned occurrence; a corrected replacement may use the same occurrence ID. Unmatched actuals never silently suppress a similar-looking plan. Matching considers all actual records supplied, including actual payments dated outside the selected horizon, to avoid rescheduling a payment already recorded elsewhere. Only actual cash flows within the cutoff affect balances.

Monthly recurrence uses a day 1–31; yearly recurrence adds a month 1–12. A day beyond the month's length clamps to the final day (31 January → 28 February; 29 February yearly → 28 February in non-leap years). The original requested day is preserved, so March returns to day 31. Start/end dates are inclusive; a start after this month's scheduled day waits until the next occurrence. One-off events occur exactly once. A forecast spans at most ten calendar years (3,660 days) to bound work; longer projections can be produced in segments.

Monthly output includes partial first/last months, opening cash, receipts, payments, classified income/spending and closing cash. It includes an inspectable daily movement breakdown. The minimum before the next dividend considers end-of-day balances from the horizon start through the day before the next unreversed actual or planned dividend; if the dividend arrives on the first day, use the opening cash at start-of-day and label that timing. If no dividend is in the horizon, return `null` for that dividend-specific measure and still return the horizon minimum.

## Acceptance examples

- EUR 1,000 opening savings and EUR 200 salary yield EUR 1,200 cash and EUR 200 income.
- Moving EUR 50 from current to savings preserves EUR 1,200 combined cash.
- EUR 30 groceries and a EUR 5 refund yield EUR 25 consumption.
- A dividend planned for 15 July appears once; an actual matched receipt on 17 July replaces it.
- December closing cash becomes January opening cash, with no reset at New Year.
