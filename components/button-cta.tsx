// LOEI signature CTA pill with arrow circle. Figma: "Button CTA" (Tone × Arrow).
// Use max once per section: hero actions, empty states, marketing CTAs. Everyday actions use <Button>.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cta = cva(
  "group inline-flex h-[52px] items-center gap-4 rounded-full pl-6 pr-1.5 text-base font-semibold transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  {
    variants: {
      tone: {
        yellow: "bg-primary text-on-brand hover:bg-primary-hover",
        ink: "bg-secondary text-on-secondary hover:bg-secondary-hover",
        outline: "border-2 border-line-strong text-fg hover:bg-ghost-hover",
      },
    },
    defaultVariants: { tone: "yellow" },
  },
);
const circle = {
  yellow: "bg-static-white text-icon-on-brand",
  ink: "bg-brand text-icon-on-brand",
  outline: "bg-inverse text-icon-inverse",
} as const;

export interface ButtonCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof cta> {
  arrow?: "right" | "down";
  asChild?: boolean;
}

export function ButtonCTA({ tone = "yellow", arrow = "right", asChild, className, children, ...props }: ButtonCTAProps) {
  const Comp = asChild ? Slot : "button";
  const Icon = arrow === "down" ? ArrowDown : ArrowRight;
  return (
    <Comp className={cn(cta({ tone }), className)} {...props}>
      <span>{children}</span>
      <span
        aria-hidden
        className={cn(
          "grid size-10 place-items-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5",
          circle[tone ?? "yellow"],
        )}
      >
        <Icon className="size-5" />
      </span>
    </Comp>
  );
}
