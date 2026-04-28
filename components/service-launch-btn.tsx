"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type ServiceName = "vion" | "rion" | "taxon";

interface ServiceLaunchBtnProps {
  service: ServiceName;
  label: string;
  href?: string;
  loadingLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ServiceLaunchBtn({
  service,
  label,
  href,
  loadingLabel = "연결 중...",
  className,
  style,
}: ServiceLaunchBtnProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (href) {
      window.location.href = href;
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const session = (await response.json()) as { authenticated?: boolean };

      if (session.authenticated) {
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
    <button type="button" className={className} style={style} onClick={handleClick} disabled={loading}>
      {loading && !href ? loadingLabel : label}
    </button>
  );
}
