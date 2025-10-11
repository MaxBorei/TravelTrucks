const MAP: Record<string, string> = {
  // трансмісія
  automatic: "icon-diagram",
  manual: "icon-diagram",
  // двигун
  diesel: "icon-petrol",
  petrol: "icon-petrol",
  hybrid: "icon-petrol",
  // тип кузова
  paneltruck: "icon-bi_grid-1x2",
  fullyintegrated: "icon-bi_grid",
  "fully integrated": "icon-bi_grid",
  alcove: "icon-bi_grid-3x3-gap",
  // обладнання
  ac: "icon-wind",
  kitchen: "icon-cup-hot",
  bathroom: "icon-ph_shower",
  tv: "icon-tv",
  refrigerator: "icon-solar_fridge-outline",
  fridge: "icon-solar_fridge-outline",
  microwave: "icon-lucide_microwave",
  gas: "icon-hugeicons_gas-stove",
  water: "icon-ion_water-outline",
  radio: "icon-radio",
  // misc
  map: "icon-Map",
};

export function getIconId(key: string, fallback = "icon-diagram") {
  const k = (key || "").toLowerCase().trim();
  return MAP[k] ?? fallback;
}
