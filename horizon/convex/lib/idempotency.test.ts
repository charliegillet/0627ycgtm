import { describe, it, expect } from "vitest";
import { signalKey } from "./idempotency";

const DAY = 24 * 60 * 60 * 1000;
// A fixed UTC noon so adding hours stays within the same day.
const NOON = Date.UTC(2026, 5, 28, 12, 0, 0);

describe("signalKey", () => {
  it("same-day same-signal => equal key", () => {
    const a = signalKey({
      source: "orangeSlice",
      companyDomain: "acme.com",
      kind: "funding",
      at: NOON,
    });
    const b = signalKey({
      source: "orangeSlice",
      companyDomain: "acme.com",
      kind: "funding",
      at: NOON + 3 * 60 * 60 * 1000, // +3h, still same UTC day
    });
    expect(a).toBe(b);
  });

  it("different day => different key", () => {
    const a = signalKey({
      source: "orangeSlice",
      companyDomain: "acme.com",
      kind: "funding",
      at: NOON,
    });
    const b = signalKey({
      source: "orangeSlice",
      companyDomain: "acme.com",
      kind: "funding",
      at: NOON + DAY, // next UTC day
    });
    expect(a).not.toBe(b);
  });

  it("different signal attributes => different key", () => {
    const base = {
      source: "orangeSlice",
      companyDomain: "acme.com",
      kind: "funding",
      at: NOON,
    };
    expect(signalKey(base)).not.toBe(
      signalKey({ ...base, source: "fiber" })
    );
    expect(signalKey(base)).not.toBe(
      signalKey({ ...base, kind: "hiring" })
    );
    expect(signalKey(base)).not.toBe(
      signalKey({ ...base, companyDomain: "other.com" })
    );
  });

  it("missing companyDomain is handled deterministically", () => {
    const a = signalKey({ source: "orangeSlice", kind: "tech", at: NOON });
    const b = signalKey({ source: "orangeSlice", kind: "tech", at: NOON });
    expect(a).toBe(b);
  });
});
