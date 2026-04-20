import { createClient } from "@supabase/supabase-js";

export type Service = "linkon" | "vion" | "rion" | "taxon";

const configs: Record<Service, { url: string; key: string }> = {
  linkon: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  vion: {
    url: process.env.VION_SUPABASE_URL!,
    key: process.env.VION_SERVICE_ROLE_KEY!,
  },
  rion: {
    url: process.env.RION_SUPABASE_URL!,
    key: process.env.RION_SERVICE_ROLE_KEY!,
  },
  taxon: {
    url: process.env.TAXON_SUPABASE_URL!,
    key: process.env.TAXON_SERVICE_ROLE_KEY!,
  },
};

/**
 * 서비스별 Supabase admin 클라이언트 생성 (service_role 키 사용)
 * 서버 사이드에서만 사용할 것. 절대 클라이언트로 노출 금지.
 */
export function createAdminClient(service: Service) {
  const { url, key } = configs[service];
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
