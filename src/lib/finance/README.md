# Financial engine boundary

Put pure calculations and their unit tests here. Do not import React, Next.js or database clients.

Use integer minor units or an exact decimal library for money. Currency must be explicit. Savings are opening assets, transfers are balance movements, and dividends enter personal cash flow only on the receipt date. Keep actual transactions separate from planned events.

The model and validation contract are specified in `docs/financial-model.md` and `types.ts`. Persistence will serialize bigint minor units as decimal strings.
