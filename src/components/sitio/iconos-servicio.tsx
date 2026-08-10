import {
  BedDouble,
  Car,
  Clock,
  Coffee,
  CookingPot,
  Flame,
  Tv,
  WashingMachine,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

export const iconos: Record<string, LucideIcon> = {
  wifi: Wifi,
  cable: Tv,
  tv: Tv,
  utensilios: CookingPot,
  cafe: Coffee,
  secador: Wind,
  llama: Flame,
  cama: BedDouble,
  auto: Car,
  reloj: Clock,
  lavarropas: WashingMachine,
  parrilla: Flame,
};
