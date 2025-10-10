export const ICON_MAP: Record<string, string> = {
  automatic: "icon-diagram",
  manual: "icon-diagram",
  diesel: "icon-petrol",
  petrol: "icon-petrol",
  hybrid: "icon-petrol",

  ac: "icon-wind",
  tv: "icon-tv",
  kitchen: "icon-cup-hot",
  bathroom: "icon-ph_shower",
  refrigerator: "icon-solar_fridge-outline",
  fridge: "icon-solar_fridge-outline",
  microwave: "icon-lucide_microwave",
  gas: "icon-hugeicons_gas-stove",
  water: "icon-ion_water-outline",
  radio: "icon-radio",
};

export function getIconId(rawKey: string): string {
  const key = rawKey.trim().toLowerCase();
  return ICON_MAP[key] ?? "icon-diagram";
}