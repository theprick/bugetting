import type { Currency, Money } from "./types";

export const MAX_MINOR = 9_000_000_000_000_000n;
const currencies: readonly string[] = ["EUR", "USD", "GBP"];

export function assertMoney(value: Money): void {
  if (!value || !currencies.includes(value.currency) || typeof value.minor !== "bigint") {
    throw new TypeError("Money requires a supported currency and bigint minor units");
  }
  if (value.minor > MAX_MINOR || value.minor < -MAX_MINOR) {
    throw new RangeError("Money exceeds supported bounds");
  }
}

export function money(minor: bigint, currency: Currency = "EUR"): Money {
  const result = { minor, currency };
  assertMoney(result);
  return Object.freeze(result);
}

function parse(value: string, currency: Currency, round: boolean): Money {
  if (typeof value !== "string" || value.length > 64 || !/^-?\d+(?:\.\d+)?$/.test(value)) {
    throw new TypeError("Use a decimal string without spaces, separators or exponents");
  }
  const negative = value.startsWith("-");
  const [whole, fraction = ""] = (negative ? value.slice(1) : value).split(".");
  if (!round && fraction.length > 2) throw new RangeError("At most two decimal places are allowed");
  let minor = BigInt(whole) * 100n + BigInt(fraction.slice(0, 2).padEnd(2, "0"));
  if (round && fraction.length > 2 && fraction[2] >= "5") minor += 1n;
  return money(negative ? -minor : minor, currency);
}

export function parseMoney(value: string, currency: Currency = "EUR"): Money {
  return parse(value, currency, false);
}

/** Explicit half-away-from-zero rounding; ordinary parsing never silently rounds. */
export function roundMoney(value: string, currency: Currency = "EUR"): Money {
  return parse(value, currency, true);
}

function compatible(left: Money, right: Money): void {
  assertMoney(left);
  assertMoney(right);
  if (left.currency !== right.currency) throw new TypeError("Currencies must match");
}

export function addMoney(left: Money, right: Money): Money {
  compatible(left, right);
  return money(left.minor + right.minor, left.currency);
}

export function subtractMoney(left: Money, right: Money): Money {
  compatible(left, right);
  return money(left.minor - right.minor, left.currency);
}

export function negateMoney(value: Money): Money {
  assertMoney(value);
  return money(-value.minor, value.currency);
}

export function compareMoney(left: Money, right: Money): -1 | 0 | 1 {
  compatible(left, right);
  return left.minor < right.minor ? -1 : left.minor > right.minor ? 1 : 0;
}

export function formatMoney(value: Money): string {
  assertMoney(value);
  const absolute = value.minor < 0n ? -value.minor : value.minor;
  return `${value.currency} ${value.minor < 0n ? "-" : ""}${absolute / 100n}.${(absolute % 100n).toString().padStart(2, "0")}`;
}
