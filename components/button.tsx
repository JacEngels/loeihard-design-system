// LOEI Button — drop-in replacement for shadcn/ui components/ui/button.tsx
// Figma: "Button" (Variant × Size × State) and "Icon Button".
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-fg-disabled disabled:border-line " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-brand hover:bg-primary-hover",
        secondary: "bg-secondary text-on-secondary hover:bg-secondary-hover",
        outline: "border border-line-strong bg-transparent text-fg hover:bg-ghost-hover disabled:bg-transparent",
        ghost: "bg-transparent text-fg hover:bg-ghost-hover disabled:bg-transparent",
        danger: "bg-destructive text-on-aubergine hover:bg-destructive-hover",
        link: "rounded-none px-0 text-link underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 gap-1 text-sm [&_svg]:size-4",
        md: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-[52px] px-6 text-base font-semibold [&_svg]:size-5",
        "icon-sm": "size-8 [&_svg]:size-4",
        icon: "size-10 [&_svg]:size-4",
        "icon-lg": "size-[52px] [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
