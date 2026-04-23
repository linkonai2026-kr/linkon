function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const linkonEnv = {
  appUrl: () => requireEnv("NEXT_PUBLIC_APP_URL"),
  superAdminEmail: () => process.env.LINKON_SUPER_ADMIN_EMAIL?.trim().toLowerCase() ?? "",
};
