"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/lib/features";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // Lesson pages belong to the library section.
  if (href === "/library" && pathname.startsWith("/lessons/")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-6 overflow-x-auto [scrollbar-width:none] sm:gap-8">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "label-caps flex items-center gap-2 py-2 transition-colors",
                active ? "font-semibold text-ink" : "text-muted hover:text-ink",
              )}
            >
              <span aria-hidden className={cn("size-1.5 bg-accent", !active && "invisible")} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
