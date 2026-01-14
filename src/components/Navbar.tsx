"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Products",
      href: "/",
      icon: User,
      active: pathname === "/",
    },
    {
      label: "Brand Portal",
      href: "/brand",
      icon: Shield,
      active: pathname === "/brand",
    },
    {
      label: "Track Status",
      href: "/status",
      icon: Activity,
      active: pathname.startsWith("/status"),
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-bold">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SampleFlow</span>
        </div>

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent",
                item.active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
