import {
  Engine,
  EquipmentKey,
  Form,
  Option,
  Transmission,
} from "@/types/types";

export const EQUIPMENT = [
  { key: "AC", label: "AC", iconKey: "ac" },
  { key: "kitchen", label: "Kitchen", iconKey: "kitchen" },
  { key: "bathroom", label: "Bathroom", iconKey: "bathroom" },
  { key: "TV", label: "TV", iconKey: "tv" },
  { key: "refrigerator", label: "Fridge", iconKey: "refrigerator" },
  { key: "microwave", label: "Microwave", iconKey: "microwave" },
  { key: "gas", label: "Gas", iconKey: "gas" },
  { key: "water", label: "Water", iconKey: "water" },
] as const satisfies ReadonlyArray<Option<EquipmentKey>>;

export const TRANSMISSIONS = [
  { key: "automatic", label: "Automatic", iconKey: "automatic" },
  { key: "manual", label: "Manual", iconKey: "manual" },
] as const satisfies ReadonlyArray<Option<Transmission>>;

export const ENGINES = [
  { key: "diesel", label: "Diesel", iconKey: "diesel" },
  { key: "petrol", label: "Petrol", iconKey: "petrol" },
  { key: "hybrid", label: "Hybrid", iconKey: "hybrid" },
] as const satisfies ReadonlyArray<Option<Engine>>;

export const VEHICLE_TYPES = [
  { key: "panelTruck", label: "Van", iconKey: "panelTruck" },
  {
    key: "fullyIntegrated",
    label: "Fully Integrated",
    iconKey: "fullyIntegrated",
  },
  { key: "alcove", label: "Alcove", iconKey: "alcove" },
] as const satisfies ReadonlyArray<Option<Form>>;
