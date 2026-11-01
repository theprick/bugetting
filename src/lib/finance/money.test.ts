import { describe, expect, it } from "vitest";
import { addMoney, compareMoney, formatMoney, MAX_MINOR, money, negateMoney, parseMoney, roundMoney, subtractMoney } from "./money";
import type { Currency, Money } from "./types";

describe("exact money", () => {
  it("adds decimal amounts and repeated cents without drift", () => {
    expect(addMoney(parseMoney("0.10"), parseMoney("0.20"))).toEqual(money(30n));
    let total = money(0n);
    for (let i = 0; i < 10_000; i++) total = addMoney(total, parseMoney("0.01"));
    expect(total).toEqual(parseMoney("100.00"));
  });

  it.each([["0", 0n], ["-0.00", 0n], ["-12.3", -1230n], ["0001.01", 101n], ["90000000000000.00", MAX_MINOR]])("parses %s exactly", (value, minor) => {
    expect(parseMoney(value).minor).toBe(minor);
  });

  it.each(["", " 1", "1 ", "+1", ".5", "1.", "1,000", "1e3", "NaN", "1.001", "--1", "9".repeat(65)])("rejects invalid or over-precision input %s", value => {
    expect(() => parseMoney(value)).toThrow();
  });

  it.each([["1.0049", 100n], ["1.005", 101n], ["-1.005", -101n], ["-1.0049", -100n], ["0.005", 1n], ["-0.005", -1n], ["9.999", 1000n]])("rounds %s half away from zero", (value, minor) => {
    expect(roundMoney(value).minor).toBe(minor);
  });

  it("checks bounds for inputs, rounding and arithmetic", () => {
    expect(() => money(MAX_MINOR + 1n)).toThrow(RangeError);
    expect(() => parseMoney("-90000000000000.01")).toThrow(RangeError);
    expect(() => roundMoney("90000000000000.005")).toThrow(RangeError);
    expect(() => addMoney(money(MAX_MINOR), money(1n))).toThrow(RangeError);
    expect(() => subtractMoney(money(-MAX_MINOR), money(1n))).toThrow(RangeError);
    expect(negateMoney(money(-MAX_MINOR))).toEqual(money(MAX_MINOR));
  });

  it("rejects unsupported currency, forged floats and mixed arithmetic", () => {
    expect(() => money(1n, "JPY" as Currency)).toThrow();
    expect(() => formatMoney({ minor: 1.2, currency: "EUR" } as unknown as Money)).toThrow();
    for (const operation of [addMoney, subtractMoney, compareMoney]) {
      expect(() => operation(money(1n), money(1n, "USD"))).toThrow(/Currencies/);
    }
  });

  it("compares and subtracts negative amounts", () => {
    expect(subtractMoney(parseMoney("0.10"), parseMoney("0.20"))).toEqual(money(-10n));
    expect(compareMoney(money(-1n), money(0n))).toBe(-1);
    expect(compareMoney(money(1n), money(1n))).toBe(0);
    expect(compareMoney(money(1n), money(-1n))).toBe(1);
  });

  it("formats even the maximum amount without float conversion or mutation", () => {
    const value = money(-MAX_MINOR, "GBP");
    expect(formatMoney(value)).toBe("GBP -90000000000000.00");
    expect(value.minor).toBe(-MAX_MINOR);
    expect(formatMoney(money(1n, "USD"))).toBe("USD 0.01");
    expect(formatMoney(money(0n))).toBe("EUR 0.00");
    expect(Object.isFrozen(value)).toBe(true);
  });
});
