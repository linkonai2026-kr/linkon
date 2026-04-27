type RuntimeEnvironment = "development" | "preview" | "production" | "unknown";

const LINKON_PRODUCTION_SUPABASE_URL = "https://hethmddgjmupatsnxszz.supabase.co";

type PublicKeySource =
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  | "SUPABASE_ANON_KEY"
  | "SUPABASE_PUBLISHABLE_KEY";

type UrlSource =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "SUPABASE_URL"
  | "LINKON_SUPABASE_URL"
  | "derived_from_public_key"
  | "derived_from_service_role_key"
  | "production_fallback";

export interface SupabasePublicConfig {
  url: string;
  key: string;
  keySource: PublicKeySource;
  urlSource: UrlSource;
}

export interface ConfigCheck {
  name: string;
  configured: boolean;
  validFormat: boolean;
  required: boolean;
  source?: string;
}

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

function readFirstEnv<T extends string>(names: readonly T[]) {
  for (const name of names) {
    const value = readEnv(name);

    if (value) {
      return { value, source: name };
    }
  }

  return { value: "", source: names[0] };
}

function getRuntimeEnvironment(): RuntimeEnvironment {
  const value = readEnv("VERCEL_ENV") || readEnv("NODE_ENV");

  if (value === "development" || value === "preview" || value === "production") {
    return value;
  }

  return "unknown";
}

function normalizeAppUrl(value: string) {
  if (!value) return "";
  return value.startsWith("http") ? value : `https://${value}`;
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  if (typeof globalThis.atob === "function") {
    return globalThis.atob(padded);
  }

  return Buffer.from(padded, "base64").toString("utf8");
}

function deriveSupabaseUrlFromJwtKey(key: string) {
  if (!key.startsWith("eyJ")) return "";

  try {
    const payload = JSON.parse(decodeBase64Url(key.split(".")[1] ?? ""));
    const issuer = typeof payload.iss === "string" ? payload.iss : "";
    const issuerUrl = new URL(issuer);

    if (issuerUrl.protocol !== "https:" || !issuerUrl.hostname.endsWith(".supabase.co")) {
      return "";
    }

    return issuerUrl.origin;
  } catch {
    return "";
  }
}

function isValidSupabaseUrl(value: string) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function isValidSupabaseKey(value: string) {
  if (!value) return false;

  return value.startsWith("eyJ") || value.startsWith("sb_publishable_");
}

function getPublicKey() {
  return readFirstEnv([
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
  ] as const);
}

function getServiceRoleKeyValue() {
  return readFirstEnv([
    "SUPABASE_SERVICE_ROLE_KEY",
    "LINKON_SUPABASE_SERVICE_ROLE_KEY",
  ] as const);
}

function getPublicUrl(publicKey: string) {
  const configured = readFirstEnv([
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL",
    "LINKON_SUPABASE_URL",
  ] as const);

  if (configured.value) {
    return configured;
  }

  const derivedFromPublicKey = deriveSupabaseUrlFromJwtKey(publicKey);

  if (derivedFromPublicKey) {
    return {
      value: derivedFromPublicKey,
      source: "derived_from_public_key" as const,
    };
  }

  const serviceRoleKey = getServiceRoleKeyValue();

  const derivedFromServiceRole = deriveSupabaseUrlFromJwtKey(serviceRoleKey.value);

  if (derivedFromServiceRole) {
    return {
      value: derivedFromServiceRole,
      source: "derived_from_service_role_key" as const,
    };
  }

  return {
    value: LINKON_PRODUCTION_SUPABASE_URL,
    source: "production_fallback" as const,
  };
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const publicKey = getPublicKey();
  const publicUrl = getPublicUrl(publicKey.value);

  if (!isValidSupabaseUrl(publicUrl.value)) {
    throw new Error("SUPABASE_PUBLIC_URL_INVALID");
  }

  if (!isValidSupabaseKey(publicKey.value)) {
    throw new Error("SUPABASE_PUBLIC_KEY_INVALID");
  }

  return {
    url: publicUrl.value,
    key: publicKey.value,
    keySource: publicKey.source,
    urlSource: publicUrl.source,
  };
}

export function getSupabaseServiceRoleKey() {
  const { value } = getServiceRoleKeyValue();

  if (!value.startsWith("eyJ")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY_INVALID");
  }

  return value;
}

export function getAppUrl() {
  return (
    normalizeAppUrl(readEnv("NEXT_PUBLIC_APP_URL")) ||
    normalizeAppUrl(readEnv("APP_URL")) ||
    normalizeAppUrl(readEnv("VERCEL_PROJECT_PRODUCTION_URL")) ||
    normalizeAppUrl(readEnv("VERCEL_URL")) ||
    "https://linkon-xi.vercel.app"
  );
}

export function getConfigHealth() {
  const publicKey = getPublicKey();
  const publicUrl = getPublicUrl(publicKey.value);
  const serviceRoleKey = getServiceRoleKeyValue();
  const appUrl = getAppUrl();
  const webhookSecret = readEnv("LINKON_WEBHOOK_SECRET");

  const checks: ConfigCheck[] = [
    {
      name: "SUPABASE_URL",
      configured: Boolean(publicUrl.value),
      validFormat: isValidSupabaseUrl(publicUrl.value),
      required: true,
      source: publicUrl.source,
    },
    {
      name: "SUPABASE_PUBLIC_KEY",
      configured: Boolean(publicKey.value),
      validFormat: isValidSupabaseKey(publicKey.value),
      required: true,
      source: publicKey.value ? publicKey.source : undefined,
    },
    {
      name: "SUPABASE_SERVICE_ROLE_KEY",
      configured: Boolean(serviceRoleKey.value),
      validFormat: serviceRoleKey.value.startsWith("eyJ"),
      required: true,
      source: serviceRoleKey.value ? serviceRoleKey.source : undefined,
    },
    {
      name: "APP_URL",
      configured: Boolean(appUrl),
      validFormat: appUrl.startsWith("https://"),
      required: true,
      source: readEnv("NEXT_PUBLIC_APP_URL")
        ? "NEXT_PUBLIC_APP_URL"
        : readEnv("APP_URL")
          ? "APP_URL"
          : readEnv("VERCEL_PROJECT_PRODUCTION_URL")
            ? "VERCEL_PROJECT_PRODUCTION_URL"
            : readEnv("VERCEL_URL")
              ? "VERCEL_URL"
              : "default",
    },
    {
      name: "LINKON_SUPER_ADMIN_EMAIL",
      configured: Boolean(readEnv("LINKON_SUPER_ADMIN_EMAIL")),
      validFormat: readEnv("LINKON_SUPER_ADMIN_EMAIL").includes("@"),
      required: true,
    },
    {
      name: "LINKON_WEBHOOK_SECRET",
      configured: Boolean(webhookSecret),
      validFormat: webhookSecret.length >= 32,
      required: false,
    },
  ];

  return {
    ok: checks
      .filter((check) => check.required)
      .every((check) => check.configured && check.validFormat),
    authOk: checks
      .filter((check) => check.name === "SUPABASE_URL" || check.name === "SUPABASE_PUBLIC_KEY")
      .every((check) => check.configured && check.validFormat),
    environment: getRuntimeEnvironment(),
    checks,
  };
}

export function isSupabaseConfigError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message === "SUPABASE_PUBLIC_URL_INVALID" ||
      error.message === "SUPABASE_PUBLIC_KEY_INVALID" ||
      error.message === "SUPABASE_SERVICE_ROLE_KEY_INVALID")
  );
}

export function isInvalidApiKeyError(errorMessage: string) {
  return /invalid api key/i.test(errorMessage);
}
