"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import type { AdminOverview, AdminUserDetail, AdminUserListItem } from "@/lib/linkon/admin";
import {
  ACCOUNT_STATUSES,
  PLAN_TIERS,
  SERVICE_NAMES,
  SERVICE_ROLES,
  ServiceName,
  USER_ROLES,
} from "@/lib/linkon/types";
import { createClient } from "@/lib/supabase/client";

interface AdminConsoleProps {
  overview: AdminOverview | null;
  initialUsers: AdminUserListItem[];
  initialDetail: AdminUserDetail | null;
  currentAdminEmail: string;
  initialError?: string | null;
}

type DbStatus = "connected" | "error" | "checking";

async function readJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : "요청을 완료하지 못했습니다.";
    throw new Error(message);
  }

  if (!data) {
    throw new Error("서버 응답을 읽을 수 없습니다.");
  }

  return data as T;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function serviceLabel(service: ServiceName) {
  return service.toUpperCase();
}

export default function AdminConsole({
  overview: initialOverview,
  initialUsers,
  initialDetail,
  currentAdminEmail,
  initialError = null,
}: AdminConsoleProps) {
  const [overview, setOverview] = useState(initialOverview);
  const [users, setUsers] = useState(initialUsers);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialDetail?.id ?? initialUsers[0]?.id ?? null
  );
  const [detail, setDetail] = useState<AdminUserDetail | null>(initialDetail);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [message, setMessage] = useState<string | null>(initialError);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus>(initialOverview ? "connected" : "checking");
  const [realtimeStatus, setRealtimeStatus] = useState<string>("연결 중...");

  // 최신 함수를 ref로 보관해 Realtime 콜백에서 stale closure 방지
  const loadUsersRef = useRef<(() => Promise<void>) | null>(null);
  const loadOverviewRef = useRef<(() => Promise<void>) | null>(null);
  const selectedIdRef = useRef<string | null>(selectedId);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const loadOverview = useCallback(async () => {
    try {
      const data = await readJson<{ overview: AdminOverview }>(
        await fetch("/api/admin/overview", { cache: "no-store" })
      );
      setOverview(data.overview);
      setDbStatus("connected");
    } catch (error) {
      setDbStatus("error");
      setMessage(error instanceof Error ? error.message : "대시보드를 불러오지 못했습니다.");
    }
  }, []);

  const loadDetail = useCallback(async (userId: string | null) => {
    if (!userId) return;
    try {
      const data = await readJson<{ user: AdminUserDetail }>(
        await fetch(`/api/admin/users/${userId}`, { cache: "no-store" })
      );
      setDetail(data.user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "사용자 상세 정보를 불러오지 못했습니다.");
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (planFilter !== "all") params.set("plan", planFilter);

      // 사용자 목록과 대시보드 통계를 동시에 요청해 필터/새로고침 대기 시간을 줄입니다.
      const usersPromise = fetch(`/api/admin/users?${params.toString()}`, {
        cache: "no-store",
      }).then((response) => readJson<{ users: AdminUserListItem[] }>(response));
      const overviewPromise = loadOverview();
      const [usersData] = await Promise.all([usersPromise, overviewPromise]);

      setUsers(usersData.users);
      setDbStatus("connected");

      if (usersData.users.length === 0) {
        setDetail(null);
        setSelectedId(null);
        return;
      }

      const currentSelected = selectedIdRef.current;
      const nextSelected = usersData.users.some((u) => u.id === currentSelected)
        ? currentSelected
        : usersData.users[0].id;

      setSelectedId(nextSelected);
      await loadDetail(nextSelected);
    } catch (error) {
      setDbStatus("error");
      setMessage(error instanceof Error ? error.message : "사용자 목록을 불러오지 못했습니다.");
    }
  }, [query, statusFilter, planFilter, loadOverview, loadDetail]);

  // ref를 항상 최신 함수로 갱신
  useEffect(() => {
    loadUsersRef.current = loadUsers;
  }, [loadUsers]);

  useEffect(() => {
    loadOverviewRef.current = loadOverview;
  }, [loadOverview]);

  useEffect(() => {
    if (!selectedId && users[0]) {
      setSelectedId(users[0].id);
    }
  }, [selectedId, users]);

  // Supabase Realtime 구독 — users / service_accounts / audit_logs 변경 시 자동 갱신
  useEffect(() => {
    let supabase: ReturnType<typeof createClient> | null = null;

    try {
      supabase = createClient();
    } catch {
      // Supabase 설정 오류 시 Realtime 없이 동작
      setRealtimeStatus("실시간 비활성");
      return;
    }

    const channel = supabase
      .channel("admin-realtime-v1")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        () => {
          // 새 사용자 가입 또는 계정 변경 시 목록 갱신
          void loadUsersRef.current?.();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "service_accounts" },
        () => {
          // 서비스 계정 동기화 완료 시 현재 선택된 사용자 상세 갱신
          void loadDetail(selectedIdRef.current);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "admin_audit_logs" },
        () => {
          // 새 감사 로그 발생 시 개요 통계 갱신
          void loadOverviewRef.current?.();
          void loadDetail(selectedIdRef.current);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setRealtimeStatus("실시간 연결됨");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setRealtimeStatus("실시간 오류");
        } else if (status === "CLOSED") {
          setRealtimeStatus("실시간 끊김");
        }
      });

    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [loadDetail]); // loadDetail만 의존 — loadUsers/loadOverview는 ref로 접근

  async function submitAction(path: string, body?: Record<string, unknown>) {
    if (!detail) return;

    setBusyAction(path);
    setMessage(null);

    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : JSON.stringify({}),
      });

      const data = await readJson<{ user: AdminUserDetail }>(response);

      // 응답에서 바로 상태 반영 (Realtime이 없어도 즉시 UI 업데이트)
      setDetail(data.user);
      setMessage("변경 사항을 저장했고 감사 로그를 남겼습니다.");

      // 사용자 목록 갱신은 백그라운드에서 — UI를 차단하지 않음
      void loadUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "작업을 완료하지 못했습니다.");
    } finally {
      setBusyAction(null);
    }
  }

  const selectedUser = detail;
  const getServiceAccount = (service: ServiceName) =>
    selectedUser?.service_accounts.find((account) => account.service === service);

  const dbStatusLabel =
    dbStatus === "connected"
      ? "DB 연결됨"
      : dbStatus === "error"
        ? "DB 오류"
        : "DB 확인 중";

  const dbStatusClass =
    dbStatus === "connected"
      ? "admin-db-badge--ok"
      : dbStatus === "error"
        ? "admin-db-badge--error"
        : "admin-db-badge--checking";

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div>
          <p className="section-label">Admin Console</p>
          <h1 className="admin-title">Linkon 관리자 페이지</h1>
          <p className="admin-subtitle">
            통합 계정, 요금제, 계정 상태, 서비스 접근 권한과 서비스별 관리자 권한을 한곳에서 관리합니다.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-2)" }}>
          <div className="admin-chip">접속 관리자: {currentAdminEmail}</div>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            {/* DB 연결 상태 배지 */}
            <span className={`admin-db-badge ${dbStatusClass}`}>
              <span className="admin-db-badge__dot" />
              {dbStatusLabel}
            </span>
            {/* Realtime 연결 상태 배지 */}
            <span
              className={`admin-db-badge ${
                realtimeStatus === "실시간 연결됨"
                  ? "admin-db-badge--ok"
                  : realtimeStatus === "실시간 비활성"
                    ? "admin-db-badge--checking"
                    : "admin-db-badge--error"
              }`}
            >
              <span className="admin-db-badge__dot" />
              {realtimeStatus}
            </span>
          </div>
        </div>
      </div>

      {message && <div className="admin-banner">{message}</div>}

      <section className="admin-overview" aria-label="Linkon DB 요약">
        <article className="admin-stat-card">
          <span>전체 사용자</span>
          <strong>{overview?.totalUsers ?? "-"}</strong>
          <small>public.users 기준</small>
        </article>
        <article className="admin-stat-card">
          <span>활성 계정</span>
          <strong>{overview?.statusCounts.active ?? "-"}</strong>
          <small>
            정지 {overview?.statusCounts.suspended ?? "-"} · 삭제{" "}
            {overview?.statusCounts.deleted ?? "-"}
          </small>
        </article>
        <article className="admin-stat-card">
          <span>유료/상위 요금제</span>
          <strong>
            {overview
              ? overview.planCounts.standard +
                overview.planCounts.premium +
                overview.planCounts.enterprise
              : "-"}
          </strong>
          <small>free {overview?.planCounts.free ?? "-"}</small>
        </article>
        <article className="admin-stat-card">
          <span>서비스 연결</span>
          <strong>
            {overview
              ? SERVICE_NAMES.reduce(
                  (sum, service) => sum + overview.serviceAccountCounts[service],
                  0
                )
              : "-"}
          </strong>
          <small>
            Vion {overview?.serviceAccountCounts.vion ?? "-"} · Rion{" "}
            {overview?.serviceAccountCounts.rion ?? "-"} · Taxon{" "}
            {overview?.serviceAccountCounts.taxon ?? "-"}
          </small>
        </article>
      </section>

      <section className="admin-card admin-overview-detail">
        <div>
          <h2>최근 가입 사용자</h2>
          <div className="admin-mini-list">
            {overview?.recentUsers.length ? (
              overview.recentUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="admin-mini-row"
                  onClick={() => {
                    setSelectedId(user.id);
                    void loadDetail(user.id);
                  }}
                >
                  <span>
                    <strong>{user.name || "이름 없음"}</strong>
                    {user.email}
                  </span>
                  <small>{formatDate(user.created_at)}</small>
                </button>
              ))
            ) : (
              <p className="admin-empty">
                최근 가입 사용자가 없거나 DB 연결 확인이 필요합니다.
              </p>
            )}
          </div>
        </div>
        <div>
          <h2>최근 감사 로그</h2>
          <div className="admin-mini-list">
            {overview?.recentAuditLogs.length ? (
              overview.recentAuditLogs.map((log) => (
                <div
                  key={log.id ?? `${log.action}-${log.created_at}`}
                  className="admin-mini-row"
                >
                  <span>
                    <strong>{log.action}</strong>
                    대상: {log.target_uid}
                  </span>
                  <small>{formatDate(log.created_at)}</small>
                </div>
              ))
            ) : (
              <p className="admin-empty">아직 감사 로그가 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      <div className="admin-toolbar">
        <input
          className="admin-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름 또는 이메일 검색"
        />
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">전체 상태</option>
          {ACCOUNT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          className="admin-select"
          value={planFilter}
          onChange={(event) => setPlanFilter(event.target.value)}
        >
          <option value="all">전체 요금제</option>
          {PLAN_TIERS.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() =>
            startTransition(() => {
              void loadUsers();
            })
          }
        >
          새로고침
        </button>
      </div>

      <div className="admin-grid">
        <section className="admin-card admin-list-card">
          <div className="admin-card__header">
            <h2>사용자</h2>
            <span>{users.length}</span>
          </div>
          <div className="admin-user-list">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                className={`admin-user-row ${selectedId === user.id ? "is-selected" : ""}`}
                onClick={() => {
                  setSelectedId(user.id);
                  void loadDetail(user.id);
                }}
              >
                <div>
                  <strong>{user.name || "이름 없음"}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="admin-user-meta">
                  <span className={`admin-pill admin-pill--${user.account_status}`}>
                    {user.account_status}
                  </span>
                  <span className="admin-pill">{user.plan}</span>
                  <span className="admin-pill">{user.role}</span>
                  <span className="admin-pill">
                    최근: {user.last_used_service ?? "-"}
                  </span>
                </div>
              </button>
            ))}
            {users.length === 0 && (
              <p className="admin-empty">조건에 맞는 사용자가 없습니다.</p>
            )}
          </div>
        </section>

        <section
          className="admin-card admin-detail-card"
          key={selectedUser?.id ?? "empty"}
        >
          {selectedUser ? (
            <>
              <div className="admin-card__header">
                <div>
                  <h2>{selectedUser.name || "이름 없음"}</h2>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="admin-detail-meta">
                  <span
                    className={`admin-pill admin-pill--${selectedUser.account_status}`}
                  >
                    {selectedUser.account_status}
                  </span>
                  <span className="admin-pill">{selectedUser.role}</span>
                  <span className="admin-pill">{selectedUser.plan}</span>
                </div>
              </div>

              <div className="admin-section">
                <h3>계정 제어</h3>
                <div className="admin-form-grid">
                  <label>
                    전역 역할
                    <select
                      className="admin-select"
                      value={selectedUser.role}
                      onChange={(event) =>
                        void submitAction(
                          `/api/admin/users/${selectedUser.id}/role`,
                          { role: event.target.value }
                        )
                      }
                      disabled={Boolean(busyAction)}
                    >
                      {USER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    계정 상태
                    <select
                      className="admin-select"
                      value={selectedUser.account_status}
                      onChange={(event) =>
                        void submitAction(
                          `/api/admin/users/${selectedUser.id}/status`,
                          { status: event.target.value }
                        )
                      }
                      disabled={Boolean(busyAction)}
                    >
                      {ACCOUNT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    요금제
                    <select
                      className="admin-select"
                      value={selectedUser.plan}
                      onChange={(event) =>
                        void submitAction(
                          `/api/admin/users/${selectedUser.id}/plan`,
                          { plan: event.target.value }
                        )
                      }
                      disabled={Boolean(busyAction)}
                    >
                      {PLAN_TIERS.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="admin-action-row">
                  <button
                    type="button"
                    className="btn btn--outline"
                    disabled={Boolean(busyAction)}
                    onClick={() =>
                      void submitAction(
                        `/api/admin/users/${selectedUser.id}/resync`
                      )
                    }
                  >
                    서비스 재동기화
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline"
                    disabled={Boolean(busyAction)}
                    onClick={() =>
                      void submitAction(
                        `/api/admin/users/${selectedUser.id}/status`,
                        {
                          status:
                            selectedUser.account_status === "suspended"
                              ? "active"
                              : "suspended",
                          suspensionReason:
                            selectedUser.account_status === "suspended"
                              ? null
                              : "관리자에 의해 정지됨",
                        }
                      )
                    }
                  >
                    {selectedUser.account_status === "suspended"
                      ? "정지 해제"
                      : "계정 정지"}
                  </button>
                  <button
                    type="button"
                    className="btn btn--taxon"
                    disabled={Boolean(busyAction)}
                    onClick={() => {
                      if (
                        window.confirm(
                          "이 계정을 삭제 상태로 전환하고 연결 서비스 접근 권한을 회수할까요?"
                        )
                      ) {
                        void submitAction(
                          `/api/admin/users/${selectedUser.id}/delete`
                        );
                      }
                    }}
                  >
                    계정 삭제
                  </button>
                </div>
              </div>

              <div className="admin-section">
                <h3>서비스 이용 요약</h3>
                <div className="admin-detail-meta">
                  <span className="admin-pill">
                    우선 서비스: {selectedUser.primary_service ?? "-"}
                  </span>
                  <span className="admin-pill">
                    최다 이용: {selectedUser.most_used_service ?? "-"}
                  </span>
                  <span className="admin-pill">
                    최근 이용: {selectedUser.last_used_service ?? "-"}
                  </span>
                  <span className="admin-pill">
                    최근 로그인: {formatDate(selectedUser.last_login_at)}
                  </span>
                </div>
              </div>

              <div className="admin-section">
                <h3>서비스 접근 및 역할</h3>
                <div className="admin-service-grid">
                  {SERVICE_NAMES.map((serviceName) => {
                    const service = getServiceAccount(serviceName);
                    const isEnabled = service?.is_enabled !== false;
                    const serviceRole = service?.service_role ?? "user";

                    return (
                      <article key={serviceName} className="admin-service-card">
                        <strong>{serviceLabel(serviceName)}</strong>
                        <span>ID: {service?.service_uid ?? "연결 전"}</span>
                        <span>접근: {isEnabled ? "활성" : "비활성"}</span>
                        <span>역할: {serviceRole}</span>
                        <span>이용 횟수: {service?.usage_count ?? 0}</span>
                        <span>
                          최근 접속: {formatDate(service?.last_accessed_at)}
                        </span>
                        <span>
                          동기화:{" "}
                          <span
                            className={
                              service?.sync_status === "succeeded"
                                ? "admin-sync--ok"
                                : service?.sync_status === "failed"
                                  ? "admin-sync--fail"
                                  : ""
                            }
                          >
                            {service?.sync_status ?? "연결 전"}
                          </span>
                        </span>
                        <span>
                          최근 동기화: {formatDate(service?.last_synced_at)}
                        </span>
                        {service?.sync_error && (
                          <span className="admin-error-text">
                            {service.sync_error}
                          </span>
                        )}

                        <div className="admin-service-actions">
                          <button
                            type="button"
                            className="btn btn--outline btn--sm"
                            disabled={Boolean(busyAction)}
                            onClick={() =>
                              void submitAction(
                                `/api/admin/users/${selectedUser.id}/services/${serviceName}`,
                                { isEnabled: !isEnabled }
                              )
                            }
                          >
                            {isEnabled ? "접근 비활성화" : "접근 활성화"}
                          </button>
                          <select
                            className="admin-select"
                            value={serviceRole}
                            disabled={Boolean(busyAction)}
                            onChange={(event) =>
                              void submitAction(
                                `/api/admin/users/${selectedUser.id}/services/${serviceName}`,
                                { serviceRole: event.target.value }
                              )
                            }
                          >
                            {SERVICE_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="admin-section">
                <h3>감사 로그</h3>
                <div className="admin-log-list">
                  {selectedUser.audit_logs.map((log) => (
                    <article
                      key={log.id ?? `${log.action}-${log.created_at}`}
                      className="admin-log-card"
                    >
                      <div className="admin-log-card__top">
                        <strong>{log.action}</strong>
                        <span>{formatDate(log.created_at)}</span>
                      </div>
                      <p>실행자: {log.actor_uid ?? "system"}</p>
                      {log.sync_result && (
                        <pre className="admin-pre">
                          {JSON.stringify(log.sync_result, null, 2)}
                        </pre>
                      )}
                    </article>
                  ))}
                  {selectedUser.audit_logs.length === 0 && (
                    <p className="admin-empty">아직 감사 로그가 없습니다.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="admin-empty-state">
              <h2>사용자를 선택해 주세요</h2>
              <p>
                목록에서 계정을 선택하면 권한, 동기화 상태, 감사 로그를 확인할
                수 있습니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
