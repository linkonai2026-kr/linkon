type RuntimeEnvironment = "development" | "preview" | "production" | "unknown";

export interface SupabasePublicConfig {
  url: string;
  key: string;
  keySource: "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";
}

export interface ConfigCheck {
  name: string;
  configured: boolean;
  validFormat: boolean;
  source?: string;
}

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

function getRuntimeEnvironment(): RuntimeEnvironment {
  const value = readEnv("VERCEL_ENV") || readEnv("NODE_ENV");

  if (value === "development" || value === "preview" || value === "production") {
    return value;
  }

  return "unknown";
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

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const publishableKey = readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  const key = anonKey || publishableKey;
  const keySource = anonKey
    ? "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    : "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

  if (!isValidSupabaseUrl(url)) {
    throw new Error("SUPABASE_PUBLIC_URL_INVALID");
  }

  if (!isValidSupabaseKey(key)) {
    throw new Error("SUPABASE_PUBLIC_KEY_INVALID");
  }

  return { url, key, keySource };
}

export function getSupabaseServiceRoleKey() {
  const key = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!key.startsWith("eyJ")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY_INVALID");
  }

  return key;
}

export function getConfigHealth() {
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const publishableKey = readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  const publicKey = anonKey || publishableKey;

  const checks: ConfigCheck[] = [
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      configured: Boolean(readEnv("NEXT_PUBLIC_SUPABASE_URL")),
      validFormat: isValidSupabaseUrl(readEnv("NEXT_PUBLIC_SUPABASE_URL")),
    },
    {
      name: "SUPABASE_PUBLIC_KEY",
      configured: Boolean(publicKey),
      validFormat: isValidSupabaseKey(publicKey),
      source: anonKey
        ? "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        : publishableKey
          ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
          : undefined,
    },
    {
      name: "SUPABASE_SERVICE_ROLE_KEY",
      configured: Boolean(readEnv("SUPABASE_SERVICE_ROLE_KEY")),
      validFormat: readEnv("SUPABASE_SERVICE_ROLE_KEY").startsWith("eyJ"),
    },
    {
      name: "NEXT_PUBLIC_APP_URL",
      configured: Boolean(readEnv("NEXT_PUBLIC_APP_URL")),
      validFormat: Boolean(readEnv("NEXT_PUBLIC_APP_URL")),
    },
    {
      name: "LINKON_SUPER_ADMIN_EMAIL",
      configured: Boolean(readEnv("LINKON_SUPER_ADMIN_EMAIL")),
      validFormat: readEnv("LINKON_SUPER_ADMIN_EMAIL").includes("@"),
    },
    {
      name: "LINKON_WEBHOOK_SECRET",
      configured: Boolean(readEnv("LINKON_WEBHOOK_SECRET")),
      validFormat: readEnv("LINKON_WEBHOOK_SECRET").length >= 32,
    },
  ];

  return {
    ok: checks.every((check) => check.configured && check.validFormat),
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
