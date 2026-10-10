// LOEI selection controls — playful + clear. Figma: "Checkbox", "Radio", "Switch".
// 2px ink outline, yellow when on, ink mark, hard 2px "pop" shadow, small pop-in animation.
// Replace shadcn components/ui/checkbox.tsx, radio-group.tsx and switch.tsx with these.
"use client";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
const on = "data-[state=checked]:bg-brand data-[state=checked]:shadow-pop";
const off = "border-2 border-line-strong bg-surface transition-[background-color,box-shadow,translate] hover:-translate-y-px";
const disabled = "disabled:cursor-not-allowed disabled:border-line disabled:bg-disabled disabled:shadow-none disabled:translate-y-0";

export function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn("group grid size-[22px] shrink-0 place-items-center rounded-xs", off, on,
        "data-[state=indeterminate]:bg-brand data-[state=indeterminate]:shadow-pop", focus, disabled, className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="animate-pop text-icon-on-brand group-disabled:text-fg-disabled">
        {props.checked === "indeterminate"
          ? <Minus size={16} strokeWidth={2.5} absoluteStrokeWidth />
          : <Check size={16} strokeWidth={2.5} absoluteStrokeWidth />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn("grid size-[22px] shrink-0 place-items-center rounded-full", off, on, focus, disabled, className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 animate-pop rounded-full bg-icon-on-brand" />
    </RadioGroupPrimitive.Item>
  );
}

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn("group inline-flex h-7 w-12 shrink-0 items-center rounded-full", off, on, focus, disabled, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "grid size-[18px] translate-x-px place-items-center rounded-full bg-icon text-icon-brand transition-transform duration-200",
          "data-[state=checked]:translate-x-[25px] group-disabled:bg-line",
        )}
      >
        <Check size={12} strokeWidth={2} absoluteStrokeWidth className="hidden group-data-[state=checked]:block" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}
