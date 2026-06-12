export type SupabaseConfig = {
  readonly url: string;
  readonly anonKey: string;
};

export class MissingSupabaseConfigError extends Error {
  constructor() {
    super("Supabase URL and anon key are required for authenticated features.");
    this.name = "MissingSupabaseConfigError";
  }
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function requireSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfig();
  if (!config) {
    throw new MissingSupabaseConfigError();
  }
  return config;
}
