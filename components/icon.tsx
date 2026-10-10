// LOEI Icon — Lucide with optically balanced strokes. Figma: Icons page ("Size & stroke scale").
// Smaller icons get thinner strokes so every size carries the same visual weight.
//   <Icon icon={Search} />            16px, 1.5 stroke (default: buttons, inputs, menus, tables)
//   <Icon icon={Bell} size={20} />    20px, 1.75 stroke (nav, alerts, large buttons)
import type { LucideIcon, LucideProps } from "lucide-react";

export type IconSize = 12 | 16 | 20 | 24;
export const ICON_STROKE: Record<IconSize, number> = { 12: 1.25, 16: 1.5, 20: 1.75, 24: 2 };

export function Icon({ icon: Lucide, size = 16, ...props }: { icon: LucideIcon; size?: IconSize } & Omit<LucideProps, "size">) {
  return <Lucide size={size} strokeWidth={ICON_STROKE[size]} absoluteStrokeWidth aria-hidden {...props} />;
}
