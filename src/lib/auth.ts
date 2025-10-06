// src/lib/auth.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Creates a Supabase server client with async cookie support (Next.js 15).
 * Must be called inside a Server Component or Server Action.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // ✅ Required in Next.js 15

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll();
          } catch {
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // Ignore
          }
        },
      },
    }
  );
}

/**
 * Ensures the current user is authenticated and has the 'admin' role.
 * Redirects to /login if not authorized.
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  const userResponse = await supabase.auth.getUser();
  const user = userResponse.data?.user;
  const authError = userResponse.error;

  if (authError || !user) {
    redirect("/login");
  }

  const profileResponse = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profileRole = profileResponse.data?.role;
  const profileError = profileResponse.error;

  if (profileError || profileRole !== "admin") {
    redirect("/login");
  }

  return { user, profile: { role: profileRole } };
}
