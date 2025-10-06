// src/lib/supabase-client.ts
// NOTE: This file must use the @supabase/ssr package for Next.js compatibility.
import { createBrowserClient } from "@supabase/ssr";

// This function creates a client configured to manage cookies correctly
// for the Next.js App Router, ensuring session persistence.
const createSupabaseBrowserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // The `createBrowserClient` helper automatically manages cookies
    // and session storage, resolving your persistence issue.
  );

export { createSupabaseBrowserClient };
