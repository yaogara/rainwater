export interface RainwaterPlanInput {
  roofAreaSqFt: number;
  annualRainfallInches: number;
  runoffEfficiency: number;
  dailyDemandGallons: number;
  reserveDays: number;
}

export interface RainwaterPlan {
  annualCollectionGallons: number;
  averageMonthlyCollectionGallons: number;
  storageTargetGallons: number;
}

const GALLONS_PER_SQUARE_FOOT_INCH = 0.6233;

export function calculateRainwaterPlan(input: RainwaterPlanInput): RainwaterPlan {
  const values = Object.values(input);
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new RangeError("All planning inputs must be positive finite numbers.");
  }
  if (input.runoffEfficiency > 1) {
    throw new RangeError("Runoff efficiency must be expressed as a decimal between 0 and 1.");
  }

  const annualCollectionGallons = Math.round(
    input.roofAreaSqFt * input.annualRainfallInches * GALLONS_PER_SQUARE_FOOT_INCH * input.runoffEfficiency,
  );

  return {
    annualCollectionGallons,
    averageMonthlyCollectionGallons: Math.round(annualCollectionGallons / 12),
    storageTargetGallons: Math.round(input.dailyDemandGallons * input.reserveDays),
  };
}
