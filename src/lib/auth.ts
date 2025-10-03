// src/lib/auth.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
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

  // ✅ SAFE: No nested destructuring
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
