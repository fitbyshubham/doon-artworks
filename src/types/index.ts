export interface User {
  id: string;
  email: string;
  created_at: string;
  // Add other user fields as needed
}

// src/types/index.ts
/**
 * Placeholder for Supabase-generated database types.
 * Run `supabase gen types typescript` to populate this.
 */
export type Database = {
  // This will be replaced by generated types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
