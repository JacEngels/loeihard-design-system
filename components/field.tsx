// LOEI form fields — loeihard.com/contact style. Figma: "Input", "Textarea", "Select", "Form field".
// Warm fill, square corners, 2px bottom border; hover darkens it, focus turns it ink, errors turn it red.
// Drop-in replacements for shadcn components/ui/input.tsx, textarea.tsx and label.tsx.
import * as React from "react";
import { cn } from "@/lib/utils";

export const fieldClasses =
  "w-full rounded-none border-0 border-b-2 border-line-field bg-field px-4 text-fg transition-colors " +
  "placeholder:text-fg-muted hover:border-line-input " +
  "focus-visible:border-line-strong focus-visible:outline-none " +
  "aria-invalid:border-line-danger " +
  "disabled:cursor-not-allowed disabled:border-line-subtle disabled:bg-disabled disabled:text-fg-disabled";

/** Use on shadcn <SelectTrigger> too: className={cn(fieldClasses, fieldSizes.md, "justify-between")} */
export const fieldSizes = { md: "h-13 type-body-md", sm: "h-10 type-body-sm" } as const;

export function Input({ className, fieldSize = "md", ...props }: React.ComponentProps<"input"> & { fieldSize?: keyof typeof fieldSizes }) {
  return <input data-slot="input" className={cn(fieldClasses, fieldSizes[fieldSize], className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(fieldClasses, "min-h-36 py-4 type-body-md", className)} {...props} />;
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label data-slot="label" className={cn("mb-2 block type-label-field text-fg", className)} {...props} />;
}

/** Helper / error line under a field. Pass error to switch to the danger color. */
export function FieldHint({ error, className, ...props }: React.ComponentProps<"p"> & { error?: boolean }) {
  return <p className={cn("mt-2 type-body-sm", error ? "text-danger" : "text-fg-muted", className)} {...props} />;
}
