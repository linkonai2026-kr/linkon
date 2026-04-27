import { getAppUrl } from "@/lib/supabase/config";

export const linkonEnv = {
  appUrl: getAppUrl,
  superAdminEmail: () => process.env.LINKON_SUPER_ADMIN_EMAIL?.trim().toLowerCase() ?? "",
};
