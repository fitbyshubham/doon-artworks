// In a Server Component (e.g., app/admin-test/page.tsx)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminTestPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // ✅ Step-by-step: no nested destructuring
  const response = await supabase.auth.getUser();
  const user = response.data?.user;
  const error = response.error;

  if (error || !user) {
    redirect("/login");
  }

  // Now `user` is a valid, typed variable
  return <div>Logged in as: {user.email}</div>;
}
