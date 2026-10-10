// LOEI Button Expand — expressive secondary CTA. Figma: "Button Expand" (Theme × State).
// Outlined pill + ink arrow circle. On hover the circle floods out to fill the whole pill with yellow
// and the arrow tilts to ↗. Pair it with a ButtonCTA ("Start gesprek" + "Bekijk ons werk"), or use it on its own
// for "explore / see more" moments. Works on light and dark backgrounds (tokens flip automatically).
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonExpandProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function ButtonExpand({ asChild, className, children, ...props }: ButtonExpandProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "group relative isolate inline-flex h-[52px] items-center gap-4 overflow-hidden rounded-full border-2 border-line-strong",
        "pl-6 pr-1.5 type-label-lg text-fg transition-colors duration-300 hover:border-on-brand hover:text-on-brand",
        // the flood: a yellow circle that starts behind the arrow circle and grows to cover the pill
        "before:absolute before:inset-0 before:-z-10 before:bg-brand before:transition-[clip-path] before:duration-[400ms] before:ease-out",
        "before:[clip-path:circle(0px_at_calc(100%-26px)_50%)] hover:before:[clip-path:circle(150%_at_calc(100%-26px)_50%)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="grid size-10 place-items-center rounded-full bg-line-strong text-icon-inverse transition-colors duration-300 group-hover:bg-on-brand group-hover:text-icon-brand"
      >
        <ArrowRight size={20} strokeWidth={1.75} absoluteStrokeWidth className="transition-transform duration-300 group-hover:-rotate-45" />
      </span>
    </Comp>
  );
}
