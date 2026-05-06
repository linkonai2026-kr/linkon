import { ServiceName } from "@/lib/linkon/types";

const SERVICE_URL_FALLBACKS: Partial<Record<ServiceName, string>> = {
  vion: "https://vion-sandy.vercel.app",
};

const SERVICE_ALLOWED_ORIGIN_FALLBACKS: Partial<Record<ServiceName, string[]>> = {
  vion: [
    "https://vion.ai",
    "https://vion-sandy.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
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

function getUrlOrigin(value: string) {
  if (!value) return "";

  try {
    return new URL(normalizeServiceUrl(value)).origin;
  } catch {
    return "";
  }
}

export function getServiceUrl(service: ServiceName) {
  return normalizeServiceUrl(readEnv(SERVICE_ENV_NAMES[service]) || SERVICE_URL_FALLBACKS[service] || "");
}

export function isServiceDownstreamAuthReady(service: ServiceName) {
  const supabaseEnv = SERVICE_SUPABASE_ENV_NAMES[service];
  return Boolean(readEnv(supabaseEnv.url) && readEnv(supabaseEnv.key));
}

export function getAllowedServiceOrigins(service: ServiceName) {
  const origins = new Set<string>();
  const configuredOrigin = getUrlOrigin(getServiceUrl(service));

  if (configuredOrigin) {
    origins.add(configuredOrigin);
  }

  for (const value of SERVICE_ALLOWED_ORIGIN_FALLBACKS[service] ?? []) {
    const origin = getUrlOrigin(value);

    if (origin) {
      origins.add(origin);
    }
  }

  return Array.from(origins);
}

export function isAllowedServiceReturnTo(service: ServiceName, returnTo: string | null | undefined) {
  if (!returnTo) return false;

  try {
    const parsed = new URL(returnTo);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }

    return getAllowedServiceOrigins(service).includes(parsed.origin);
  } catch {
    return false;
  }
}

export function getDefaultServiceReturnTo(service: ServiceName) {
  const serviceUrl = getServiceUrl(service);

  if (!serviceUrl) {
    return "";
  }

  if (service === "vion") {
    const callbackUrl = new URL("/auth/callback", serviceUrl);
    callbackUrl.searchParams.set("next", "/chat");
    return callbackUrl.toString();
  }

  return new URL("/api/auth/linkon-callback", serviceUrl).toString();
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
