// src/lib/supabase-client.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ✅ Use a different name: e.g., `createSupabaseBrowserClient`
const createSupabaseBrowserClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export { createSupabaseBrowserClient };
