import { ServiceName } from "@/lib/linkon/types";

const SERVICE_URL_FALLBACKS: Partial<Record<ServiceName, string>> = {
  vion: "https://vion-sandy.vercel.app",
};

const SERVICE_ENV_NAMES: Record<ServiceName, string> = {
  vion: "NEXT_PUBLIC_VION_URL",
  rion: "NEXT_PUBLIC_RION_URL",
  taxon: "NEXT_PUBLIC_TAXON_URL",
};

const SERVICE_SUPABASE_ENV_NAMES: Record<ServiceName, { url: string; key: string }> = {
  vion: { url: "VION_SUPABASE_URL", key: "VION_SERVICE_ROLE_KEY" },
  rion: { url: "RION_SUPABASE_URL", key: "RION_SERVICE_ROLE_KEY" },
  taxon: { url: "TAXON_SUPABASE_URL", key: "TAXON_SERVICE_ROLE_KEY" },
};

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

function isValidUrl(value: string) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeServiceUrl(value: string) {
  if (!value) return "";
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;
}

export function getServiceUrl(service: ServiceName) {
  return normalizeServiceUrl(readEnv(SERVICE_ENV_NAMES[service]) || SERVICE_URL_FALLBACKS[service] || "");
}

export function isServiceDownstreamAuthReady(service: ServiceName) {
  const supabaseEnv = SERVICE_SUPABASE_ENV_NAMES[service];
  return Boolean(readEnv(supabaseEnv.url) && readEnv(supabaseEnv.key));
}

export function getServiceHealth() {
  return (["vion", "rion", "taxon"] as ServiceName[]).map((service) => {
    const configuredUrl = readEnv(SERVICE_ENV_NAMES[service]);
    const resolvedUrl = getServiceUrl(service);
    const supabaseEnv = SERVICE_SUPABASE_ENV_NAMES[service];
    const hasServiceSupabaseUrl = Boolean(readEnv(supabaseEnv.url));
    const hasServiceRoleKey = Boolean(readEnv(supabaseEnv.key));

    return {
      service,
      urlConfigured: Boolean(configuredUrl),
      urlUsesFallback: !configuredUrl && Boolean(SERVICE_URL_FALLBACKS[service]),
      urlReady: isValidUrl(resolvedUrl),
      downstreamAuthReady: isServiceDownstreamAuthReady(service),
    };
  });
}
