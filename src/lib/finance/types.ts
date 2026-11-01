/** Pure domain contracts. See docs/financial-model.md for validation rules. */
export type Currency = "EUR" | "USD" | "GBP";
export type DateOnly = string;
export type Money = Readonly<{ minor: bigint; currency: Currency }>;

export type Account = Readonly<{
  id: string;
  name: string;
  kind: "current" | "savings" | "cash";
  openingDate: DateOnly;
  openingBalance: Money;
}>;

export type Category = Readonly<{ id: string; name: string }>;
export type ExpenseTreatment =
  | "consumption"
  | "refundable-deposit"
  | "pension"
  | "mortgage-principal";

export type Movement =
  | Readonly<{ kind: "income"; accountId: string; amount: Money; source: "salary" | "allowance" | "dividend" | "other" }>
  | Readonly<{ kind: "expense"; accountId: string; amount: Money; categoryId: string; treatment: ExpenseTreatment }>
  | Readonly<{ kind: "transfer"; fromAccountId: string; toAccountId: string; amount: Money }>;

export type Transaction = Readonly<{
  id: string;
  date: DateOnly;
  description: string;
  importReference?: string;
  plannedOccurrenceId?: string;
  groupId?: string;
}> & (Movement
  | Readonly<{ kind: "refund"; originalId: string; amount: Money }>
  | Readonly<{ kind: "reversal"; originalId: string }>);

export type Schedule =
  | Readonly<{ kind: "once"; date: DateOnly }>
  | Readonly<{ kind: "monthly"; start: DateOnly; end?: DateOnly; day: number }>
  | Readonly<{ kind: "yearly"; start: DateOnly; end?: DateOnly; month: number; day: number }>;

export type PlannedEvent = Readonly<{
  id: string;
  description: string;
  schedule: Schedule;
  movement: Movement;
}>;

export type Ledger = Readonly<{
  accounts: readonly Account[];
  categories: readonly Category[];
  transactions: readonly Transaction[];
}>;

export type ForecastScenario = Readonly<{
  id: string;
  start: DateOnly;
  end: DateOnly;
  events: readonly PlannedEvent[];
}>;
