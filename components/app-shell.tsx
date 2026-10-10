// LOEI App shell — the frame around every page. Figma: "Layout & Grid" → shells A–C, Sidebar, App header, Topbar.
// Built on shadcn/ui Sidebar (npx shadcn@latest add sidebar).
//
//   shell="sidebar"  + sidebarStyle="docked"   → A: internal tools / dashboards
//   shell="sidebar"  + sidebarStyle="floating" → B: client-facing apps
//   shell="topbar"                             → C: ≤5 sections, portals, simple tools
//   (Shell D — focus flows — use <FocusLayout> from layout.tsx instead)
//
// Responsive: ≥1024 full sidebar (256) · 768–1023 icon rail (72) · <768 sheet behind the menu button.
"use client";
import * as React from "react";
import { Menu } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; href: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; absoluteStrokeWidth?: boolean }>; active?: boolean };

function useIsDesktop() {
  const [desktop, setDesktop] = React.useState(true);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

export function AppShell({
  shell = "sidebar",
  sidebarStyle = "docked",
  darkSidebar = false,
  logo,
  nav,
  user,
  title,
  headerActions,
  children,
}: {
  shell?: "sidebar" | "topbar";
  sidebarStyle?: "docked" | "floating";
  darkSidebar?: boolean; // ink sidebar on a light page
  logo: React.ReactNode;
  nav: NavItem[];
  user?: React.ReactNode; // avatar + name + menu
  title?: string; // shown in the header (sidebar shell)
  headerActions?: React.ReactNode; // search (⌘K), notifications, avatar
  children: React.ReactNode;
}) {
  const floating = sidebarStyle === "floating";
  const isDesktop = useIsDesktop();
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => setOpen(isDesktop), [isDesktop]); // tablet → rail, desktop → full

  if (shell === "topbar") {
    return (
      <div className="min-h-dvh bg-canvas">
        <header className="sticky top-0 z-30 flex h-[var(--header-height)] items-center gap-8 border-b border-line-subtle bg-surface px-[var(--grid-margin)]">
          {logo}
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} aria-current={item.active ? "page" : undefined}
                className={cn("flex h-9 items-center rounded-full px-3.5 type-label-md transition-colors",
                  item.active ? "bg-sand font-semibold text-fg" : "text-fg-secondary hover:bg-subtle hover:text-fg")}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">{headerActions}</div>
          {/* below 1024px: put the nav links in a <Sheet> behind this button */}
          <button className="grid size-10 place-items-center rounded-full hover:bg-ghost-hover lg:hidden" aria-label="Menu">
            <Menu size={20} strokeWidth={1.75} absoluteStrokeWidth />
          </button>
        </header>
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "4.5rem" } as React.CSSProperties}
      className={cn("bg-canvas", floating && "lg:p-3 lg:gap-3")}
    >
      <Sidebar collapsible="icon" variant={floating ? "floating" : "sidebar"} className={cn(darkSidebar && "dark")}>
        <SidebarHeader className="px-4 py-6">{logo}</SidebarHeader>
        <SidebarContent className="px-4">
          <SidebarMenu className="gap-1">
            {nav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={item.active} tooltip={item.label}
                  className="h-10 gap-3 rounded-sm type-label-md text-fg-secondary data-[active=true]:bg-sand data-[active=true]:font-semibold data-[active=true]:text-fg">
                  <a href={item.href}>
                    <item.icon size={20} strokeWidth={1.75} absoluteStrokeWidth />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {user && <SidebarFooter className="p-4">{user}</SidebarFooter>}
      </Sidebar>
      <SidebarInset className="bg-canvas">
        <header
          className={cn(
            "sticky top-0 z-20 flex h-[var(--header-height)] items-center gap-4 bg-surface px-[var(--grid-margin)]",
            floating ? "lg:top-3 lg:rounded-lg lg:border lg:border-line-subtle lg:shadow-md" : "border-b border-line-subtle",
          )}
        >
          <SidebarTrigger className="-ml-2 md:hidden" aria-label="Menu" />
          {title && <h2 className="truncate type-heading-md text-fg">{title}</h2>}
          <div className="ml-auto flex items-center gap-2">{headerActions}</div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
