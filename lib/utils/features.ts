import type { Camper, EquipmentKey } from "@/types/types";

export type FeatureKey = EquipmentKey | "transmission" | "engine" | "radio";
export type FeatureFlag = { key: FeatureKey; label: string; value: boolean };

export function buildFeatureFlags(camper: Camper): FeatureFlag[] {
  const flags: FeatureFlag[] = [
    { key: "transmission", label: camper.transmission, value: true },
    { key: "engine", label: camper.engine, value: true },

    { key: "AC", label: "AC", value: !!camper.AC },
    { key: "bathroom", label: "Bathroom", value: !!camper.bathroom },
    { key: "kitchen", label: "Kitchen", value: !!camper.kitchen },
    { key: "TV", label: "TV", value: !!camper.TV },
    { key: "radio", label: "Radio", value: !!camper.radio },
    { key: "refrigerator", label: "Fridge", value: !!camper.refrigerator },
    { key: "microwave", label: "Microwave", value: !!camper.microwave },
    { key: "gas", label: "Gas", value: !!camper.gas },
    { key: "water", label: "Water", value: !!camper.water },
  ];

  return flags.filter((f) => f.value);
}
