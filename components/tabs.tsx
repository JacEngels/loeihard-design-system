// LOEI Tabs — three flavours. Figma: "Tab" (Style × State) + "Tab lists" examples.
//   underline : page sections — active gets the yellow slanted dash (like the headline dashes)
//   segmented : view switches / filters — sand track, active = ink outline + pop shadow
//   display   : marketing / service navigation (DISCOVER / CREATE / DEVELOP / DEPLOY)
// Replace shadcn components/ui/tabs.tsx with this file.
"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "underline" | "segmented" | "display";
const VariantContext = React.createContext<Variant>("underline");

export function Tabs({ variant = "underline", ...props }: React.ComponentProps<typeof TabsPrimitive.Root> & { variant?: Variant }) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.Root {...props} />
    </VariantContext.Provider>
  );
}

const list: Record<Variant, string> = {
  underline: "flex gap-6 border-b border-line-subtle",
  segmented: "inline-flex gap-1 rounded-full bg-sand p-1",
  display: "flex flex-col items-start",
};

const trigger: Record<Variant, string> = {
  underline:
    "relative h-11 px-0.5 type-label-md text-fg-secondary transition-colors hover:text-fg " +
    "data-[state=active]:font-semibold data-[state=active]:text-fg " +
    "after:absolute after:inset-x-0 after:-bottom-px after:h-1 after:[clip-path:polygon(3%_0,100%_0,97%_100%,0_100%)] " +
    "hover:after:bg-sand data-[state=active]:after:bg-brand",
  segmented:
    "h-9 rounded-full border-2 border-transparent px-4 type-label-md text-fg-secondary transition-colors " +
    "hover:bg-field hover:text-fg " +
    "data-[state=active]:border-line-strong data-[state=active]:bg-surface data-[state=active]:font-semibold data-[state=active]:text-fg data-[state=active]:shadow-pop",
  display:
    "group flex items-center gap-4 py-3 text-left type-display-md text-transparent transition-colors " +
    "[-webkit-text-stroke:1px_var(--color-text-primary)] hover:text-fg-secondary hover:[-webkit-text-stroke:0] " +
    "data-[state=active]:text-fg data-[state=active]:[-webkit-text-stroke:0]",
};

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const v = React.useContext(VariantContext);
  return <TabsPrimitive.List className={cn(list[v], className)} {...props} />;
}

export function TabsTrigger({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const v = React.useContext(VariantContext);
  return (
    <TabsPrimitive.Trigger
      className={cn(trigger[v], "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-50", className)}
      {...props}
    >
      {children}
      {v === "display" && (
        <span aria-hidden className="hidden size-8 animate-pop place-items-center rounded-full bg-brand text-icon-on-brand group-data-[state=active]:grid">
          <ArrowRight size={18} strokeWidth={1.75} absoluteStrokeWidth />
        </span>
      )}
    </TabsPrimitive.Trigger>
  );
}

export const TabsContent = TabsPrimitive.Content;
