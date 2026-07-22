import { createElement } from 'react'
import {
  Armchair,
  Baby,
  Bitcoin,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Calendar,
  Camera,
  Car,
  Clapperboard,
  Code,
  Coffee,
  Cpu,
  Factory,
  GraduationCap,
  Hammer,
  HeartPulse,
  Landmark,
  Leaf,
  Lock,
  Newspaper,
  Palette,
  PawPrint,
  Pencil,
  Plane,
  Plug,
  Scale,
  Share2,
  Shirt,
  ShoppingBag,
  Sparkles,
  Spade,
  Trophy,
  Truck,
  Utensils,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { CollectionTheme } from '@/editable/content/global.content'

/*
  Resolver from a CollectionTheme.icon slug to the actual lucide component.
  Kept in its own file so heavy icon imports don't leak into content JSON.
*/
export const COLLECTION_ICONS: Record<CollectionTheme['icon'], LucideIcon> = {
  briefcase: Briefcase,
  'heart-pulse': HeartPulse,
  cpu: Cpu,
  landmark: Landmark,
  hammer: Hammer,
  car: Car,
  plane: Plane,
  pencil: Pencil,
  'shopping-bag': ShoppingBag,
  wrench: Wrench,
  coffee: Coffee,
  sparkles: Sparkles,
  'paw-print': PawPrint,
  utensils: Utensils,
  armchair: Armchair,
  plug: Plug,
  'briefcase-business': BriefcaseBusiness,
  wallet: Wallet,
  bitcoin: Bitcoin,
  spade: Spade,
  leaf: Leaf,
  share2: Share2,
  trophy: Trophy,
  palette: Palette,
  clapperboard: Clapperboard,
  truck: Truck,
  'graduation-cap': GraduationCap,
  baby: Baby,
  scale: Scale,
  shirt: Shirt,
  camera: Camera,
  lock: Lock,
  calendar: Calendar,
  code: Code,
  newspaper: Newspaper,
  factory: Factory,
  'book-open': BookOpen,
}

export function iconForCollection(theme: CollectionTheme): LucideIcon {
  return COLLECTION_ICONS[theme.icon] || BookOpen
}

/**
 * Stable renderer for a collection icon. Using this component (instead of
 * grabbing the LucideIcon inside a render body and JSX-ing it directly)
 * keeps `react-hooks/static-components` happy — no new component type is
 * synthesized per render.
 *
 * Uses `React.createElement` so this file can stay `.ts` (no JSX).
 */
export function CollectionIcon({
  theme,
  className = 'h-4 w-4',
  strokeWidth = 2,
}: {
  theme: CollectionTheme
  className?: string
  strokeWidth?: number
}) {
  const iconComponent = COLLECTION_ICONS[theme.icon] || BookOpen
  return createElement(iconComponent, { className, strokeWidth })
}
