// src/components/layout/sidebar.tsx
export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <nav className="space-y-2">
        <a
          href="/admin/dashboard"
          className="block py-2 text-gray-700 hover:bg-gray-100 rounded px-2"
        >
          Dashboard
        </a>
        <a
          href="/admin/users"
          className="block py-2 text-gray-700 hover:bg-gray-100 rounded px-2"
        >
          Users
        </a>
        <a
          href="/admin/settings"
          className="block py-2 text-gray-700 hover:bg-gray-100 rounded px-2"
        >
          Settings
        </a>
      </nav>
    </aside>
  );
}
