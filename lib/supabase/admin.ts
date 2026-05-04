import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig, getSupabaseServiceRoleKey } from "@/lib/supabase/config";

export type Service = "linkon" | "vion" | "rion" | "taxon";

function requireServiceEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing service environment variable: ${name}`);
  }

  return value;
}

function getServiceConfig(service: Service) {
  if (service === "linkon") {
    return {
      url: getSupabasePublicConfig().url,
      key: getSupabaseServiceRoleKey(),
    };
  }

  const prefix = service.toUpperCase();

  return {
    url: requireServiceEnv(`${prefix}_SUPABASE_URL`),
    key: requireServiceEnv(`${prefix}_SERVICE_ROLE_KEY`),
  };
}

/**
 * Creates a service-role Supabase client. Use only from server-side code.
 */
export function createAdminClient(service: Service) {
  const { url, key } = getServiceConfig(service);
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
