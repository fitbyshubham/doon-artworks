// src/components/layout/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();

  // Only show "Admin Dashboard" link on public pages
  const showAdminLink = !pathname.startsWith("/admin");

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">
          ArtAuction
        </Link>

        <nav className="flex items-center gap-4">
          {showAdminLink ? (
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                Admin Dashboard
              </Button>
            </Link>
          ) : (
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="sm" type="submit">
                Logout
              </Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
