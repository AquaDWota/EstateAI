import { describe, expect, it } from "vitest";
import { generateProperties } from "./property-generator";

describe("generateProperties", () => {
  it("returns deterministic-sized collections", () => {
    const rows = generateProperties(10);
    expect(rows).toHaveLength(10);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("city");
    expect(rows[0]).toHaveProperty("estimatedRoi");
  });
});
