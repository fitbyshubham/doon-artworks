// src/app/(admin)/layout.tsx
import { requireAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ No need to pass cookies — handled inside requireAdmin
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
