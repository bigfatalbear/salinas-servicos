import {
  BrickWall,
  Camera,
  Car,
  CarTaxiFront,
  ChefHat,
  Fish,
  Grid2X2,
  Hammer,
  Home,
  MonitorCog,
  Paintbrush,
  PartyPopper,
  Sailboat,
  Scissors,
  ShoppingBasket,
  Sparkles,
  Truck,
  Wine,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  zap: Zap,
  sparkles: Sparkles,
  truck: Truck,
  hammer: Hammer,
  paintbrush: Paintbrush,
  scissors: Scissors,
  car: Car,
  'car-taxi-front': CarTaxiFront,
  fish: Fish,
  'shopping-basket': ShoppingBasket,
  'brick-wall': BrickWall,
  wine: Wine,
  'monitor-cog': MonitorCog,
  'party-popper': PartyPopper,
  home: Home,
  'chef-hat': ChefHat,
  camera: Camera,
  sailboat: Sailboat,
  grid: Grid2X2,
}

export function CategoryIcon({
  name,
  className = 'h-5 w-5',
}: {
  name?: string | null
  className?: string
}) {
  const Icon = (name && icons[name]) || Grid2X2
  return <Icon className={className} />
}
