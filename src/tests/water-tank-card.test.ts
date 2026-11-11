import { describe, it, expect } from "vitest";
import { computePct, computeLiters, formatRelTime, formatNum } from "../water-tank-card.js";

describe("computePct", () => {
  it("parses a numeric string", () => {
    expect(computePct("65")).toBe(65);
  });

  it("clamps above 100 to 100", () => {
    expect(computePct("120")).toBe(100);
  });

  it("clamps below 0 to 0", () => {
    expect(computePct("-5")).toBe(0);
  });

  it("returns 0 for unavailable", () => {
    expect(computePct("unavailable")).toBe(0);
  });

  it("returns 0 for unknown", () => {
    expect(computePct("unknown")).toBe(0);
  });

  it("returns 0 for NaN", () => {
    expect(computePct("abc")).toBe(0);
  });
});

describe("computeLiters", () => {
  it("computes liters from pct and capacity", () => {
    expect(computeLiters(100, 5000)).toBe(5000);
    expect(computeLiters(50, 5000)).toBe(2500);
    expect(computeLiters(0, 5000)).toBe(0);
  });

  it("rounds to integer", () => {
    expect(computeLiters(33, 1000)).toBe(330);
    expect(computeLiters(66, 1000)).toBe(660);
  });
});

describe("formatRelTime", () => {
  it("formats seconds ago", () => {
    const iso = new Date(Date.now() - 30000).toISOString();
    expect(formatRelTime(iso)).toBe("mis à jour il y a quelques secondes");
  });

  it("formats minutes ago", () => {
    const iso = new Date(Date.now() - 5 * 60000).toISOString();
    expect(formatRelTime(iso)).toBe("mis à jour il y a 5 min");
  });

  it("formats hours ago", () => {
    const iso = new Date(Date.now() - 2 * 3600000).toISOString();
    expect(formatRelTime(iso)).toBe("mis à jour il y a 2 h");
  });

  it("formats days ago", () => {
    const iso = new Date(Date.now() - 3 * 86400000).toISOString();
    expect(formatRelTime(iso)).toBe("mis à jour il y a 3 j");
  });
});

describe("formatNum", () => {
  it("formats a float with 2 decimals and French comma", () => {
    expect(formatNum("1.5")).toBe("1,50");
    expect(formatNum("0")).toBe("0,00");
  });

  it("returns em dash for unavailable", () => {
    expect(formatNum("unavailable")).toBe("—");
    expect(formatNum("unknown")).toBe("—");
    expect(formatNum(undefined)).toBe("—");
  });

  it("returns raw string for non-numeric", () => {
    expect(formatNum("abc")).toBe("abc");
  });
});
