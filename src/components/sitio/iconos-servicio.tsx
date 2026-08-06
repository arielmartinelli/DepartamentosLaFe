import {
  BedDouble,
  Car,
  Clock,
  CookingPot,
  Flame,
  Tv,
  WashingMachine,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export const iconos: Record<string, LucideIcon> = {
  wifi: Wifi,
  utensilios: CookingPot,
  llama: Flame,
  tv: Tv,
  auto: Car,
  cama: BedDouble,
  reloj: Clock,
  lavarropas: WashingMachine,
  parrilla: Flame,
};
