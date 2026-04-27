"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type LaunchService = "rion" | "taxon";

const SERVICES: Record<
  LaunchService,
  {
    name: string;
    tabLabel: string;
    tagline: string;
    description: string;
    logo: string;
    buttonClass: string;
    accent: string;
  }
> = {
  rion: {
    name: "Rion",
    tabLabel: "Rion",
    tagline: "법률 비서 AI",
    description:
      "복잡한 계약서와 법률 절차를 이해하기 쉬운 언어로 정리하고, 다음 행동까지 안내하는 AI 법률 비서입니다.",
    logo: "/assets/rion-no.png",
    buttonClass: "btn--rion",
    accent: "var(--rion-primary)",
  },
  taxon: {
    name: "Taxon",
    tabLabel: "Taxon",
    tagline: "재무 관리 AI",
    description:
      "사업 운영에 필요한 숫자, 반복 보고, 세무 준비 흐름을 더 명확하게 볼 수 있도록 돕는 AI 재무 관리 서비스입니다.",
    logo: "/assets/taxon-no.png",
    buttonClass: "btn--taxon",
    accent: "var(--taxon-primary)",
  },
};

export default function LaunchNotificationTabs() {
  const baseId = useId();
  const [activeService, setActiveService] = useState<LaunchService>("rion");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const tabRefs = useRef<Record<LaunchService, HTMLButtonElement | null>>({
    rion: null,
    taxon: null,
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveService((current) => (current === "rion" ? "taxon" : "rion"));
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const service = SERVICES[activeService];

  const selectService = (nextService: LaunchService, shouldFocus = false) => {
    setActiveService(nextService);
    setMessage("");
    setMessageType("");

    if (shouldFocus) {
      window.requestAnimationFrame(() => tabRefs.current[nextService]?.focus());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    selectService(activeService === "rion" ? "taxon" : "rion", true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("올바른 이메일 주소를 입력해 주세요.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/launch-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          service: activeService,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "출시 알림 신청에 실패했습니다.");
      }

      setEmail("");
      setMessage(`${service.name} 출시 알림 신청이 완료되었습니다.`);
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "출시 알림 신청 중 오류가 발생했습니다."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="launch-notify" data-active-service={activeService}>
      <div
        className="launch-notify__tabs"
        role="tablist"
        aria-label="출시 예정 서비스 선택"
      >
        {(Object.keys(SERVICES) as LaunchService[]).map((key) => {
          const item = SERVICES[key];
          const selected = activeService === key;

          return (
            <button
              key={key}
              ref={(node) => {
                tabRefs.current[key] = node;
              }}
              id={`${baseId}-${key}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-${key}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`launch-notify__tab launch-notify__tab--${key} ${
                selected ? "is-active" : ""
              }`}
              onClick={() => selectService(key)}
              onKeyDown={handleKeyDown}
            >
              {item.tabLabel}
            </button>
          );
        })}
      </div>

      <section
        id={`${baseId}-${activeService}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${activeService}-tab`}
        className="launch-notify__panel"
        style={{ ["--launch-accent" as string]: service.accent }}
      >
        <div className="launch-notify__logo">
          <Image src={service.logo} alt={`${service.name} logo`} width={160} height={52} />
        </div>
        <p className="launch-notify__eyebrow">출시 예정</p>
        <h3 className="launch-notify__title">
          {service.name} <span>{service.tagline}</span>
        </h3>
        <p className="launch-notify__desc">{service.description}</p>

        <form className="launch-notify__form" onSubmit={handleSubmit}>
          <div className="launch-notify__row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일 주소를 입력해 주세요"
              aria-label={`${service.name} 출시 알림 이메일`}
              disabled={loading}
            />
            <button
              type="submit"
              className={`btn ${service.buttonClass}`}
              disabled={loading}
            >
              {loading ? "신청 중..." : "출시 알림 받기"}
            </button>
          </div>
          {message && (
            <p
              className={`launch-notify__message launch-notify__message--${messageType}`}
              role={messageType === "error" ? "alert" : "status"}
            >
              {message}
            </p>
          )}
        </form>

        <Link href="/register" className="launch-notify__account-link">
          Linkon 계정을 먼저 만들어두면 출시 후 더 빠르게 시작할 수 있습니다.
        </Link>
      </section>
    </div>
  );
}
