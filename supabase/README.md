# Database foundation

PostgreSQL via Supabase is the planned persistence layer. Add versioned SQL migrations under `migrations/` when the account and transaction model is implemented.

No database is provisioned or queried by this skeleton. Authentication, session refresh and row-level security must be implemented and tested together before storing personal records. Every user-owned table must have ownership constraints and RLS policies; test access as two different users.

Use only the public publishable key in browser configuration. Never place a secret or service-role key in a `NEXT_PUBLIC_` variable.
