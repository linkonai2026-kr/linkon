"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ServiceName = "vion" | "rion" | "taxon";

interface ServiceLaunchBtnProps {
  service: ServiceName;
  label: string;
  loadingLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  /** If provided, navigate directly to this URL without SSO */
  href?: string;
}

export default function ServiceLaunchBtn({
  service,
  label,
  loadingLabel = "연결 중...",
  className,
  style,
  href,
}: ServiceLaunchBtnProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      if (href) {
        window.location.href = href;
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        window.location.href = `/api/auth/token?service=${service}`;
      } else {
        router.push(`/login?redirect=/api/auth/token?service=${service}`);
      }
    } catch {
      router.push("/login?error=service_unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
