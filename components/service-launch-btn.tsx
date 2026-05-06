"use client";

import React, { useState } from "react";

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
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    window.location.href = href ?? `/api/auth/token?service=${service}`;
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
