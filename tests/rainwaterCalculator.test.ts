import assert from "node:assert/strict";
import test from "node:test";
import { calculateRainwaterPlan } from "../src/utils/rainwaterCalculator";

test("calculates annual collection separately from demand-based storage", () => {
  const result = calculateRainwaterPlan({
    roofAreaSqFt: 2_000,
    annualRainfallInches: 32,
    runoffEfficiency: 0.9,
    dailyDemandGallons: 50,
    reserveDays: 30,
  });

  assert.deepEqual(result, {
    annualCollectionGallons: 35_902,
    averageMonthlyCollectionGallons: 2_992,
    storageTargetGallons: 1_500,
  });
});

test("rejects invalid units and percentages", () => {
  assert.throws(() => calculateRainwaterPlan({
    roofAreaSqFt: 2_000,
    annualRainfallInches: 32,
    runoffEfficiency: 90,
    dailyDemandGallons: 50,
    reserveDays: 30,
  }), /between 0 and 1/);
});
