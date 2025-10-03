// src/app/admin/dashboard/page.tsx
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboard() {
  // ✅ This will either:
  // - Redirect to /login (if unauthorized), or
  // - Return { user, profile }
  const { user } = await requireAdmin();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>
    </div>
  );
}
