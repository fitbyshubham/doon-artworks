// src/app/admin/layout.tsx
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, FilePlus, FileText, LogOut } from "lucide-react";

// ✅ Move Server Action to top level
async function handleLogout() {
  "use server";
  const { createSupabaseServerClient } = await import("@/lib/auth");
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce admin auth
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Link
            href="/admin/artworks"
            className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            All Artworks
          </Link>
          <Link
            href="/admin/artworks/add"
            className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <FilePlus className="h-5 w-5 mr-3" />
            Add Artwork
          </Link>
          <Link
            href="/admin/submissions"
            className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <FileText className="h-5 w-5 mr-3" />
            Submissions
          </Link>
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
