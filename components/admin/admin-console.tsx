"use client";

import { startTransition, useEffect, useState } from "react";
import { AdminUserDetail, AdminUserListItem } from "@/lib/linkon/admin";
import {
  ACCOUNT_STATUSES,
  PLAN_TIERS,
  SERVICE_NAMES,
  SERVICE_ROLES,
  ServiceName,
  USER_ROLES,
} from "@/lib/linkon/types";

interface AdminConsoleProps {
  initialUsers: AdminUserListItem[];
  initialDetail: AdminUserDetail | null;
  currentAdminEmail: string;
}

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

export default function AdminConsole({
  initialUsers,
  initialDetail,
  currentAdminEmail,
}: AdminConsoleProps) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialDetail?.id ?? initialUsers[0]?.id ?? null
  );
  const [detail, setDetail] = useState<AdminUserDetail | null>(initialDetail);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [message, setMessage] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  async function loadUsers() {
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (planFilter !== "all") params.set("plan", planFilter);

      const data = await readJson<{ users: AdminUserListItem[] }>(
        await fetch(`/api/admin/users?${params.toString()}`, { cache: "no-store" })
      );

      setUsers(data.users);

      if (data.users.length === 0) {
        setDetail(null);
        setSelectedId(null);
        return;
      }

      const nextSelected = data.users.some((user) => user.id === selectedId)
        ? selectedId
        : data.users[0].id;

      setSelectedId(nextSelected);
      await loadDetail(nextSelected);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "사용자 목록을 불러오지 못했습니다.");
    }
  }

  async function loadDetail(userId: string | null) {
    if (!userId) return;

    try {
      const data = await readJson<{ user: AdminUserDetail }>(
        await fetch(`/api/admin/users/${userId}`, { cache: "no-store" })
      );
      setDetail(data.user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "사용자 상세 정보를 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    if (!selectedId && users[0]) {
      setSelectedId(users[0].id);
    }
  }, [selectedId, users]);

  async function submitAction(path: string, body?: Record<string, unknown>) {
    if (!detail) return;

    setBusyAction(path);
    setMessage(null);

    try {
      const response = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : JSON.stringify({}),
      });

      const data = await readJson<{ user: AdminUserDetail }>(response);
      setDetail(data.user);
      setMessage("변경 사항을 저장하고 서비스 동기화를 요청했습니다.");
      await loadUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "작업을 완료하지 못했습니다.");
    } finally {
      setBusyAction(null);
    }
  }

  const selectedUser = detail;
  const getServiceAccount = (service: ServiceName) =>
    selectedUser?.service_accounts.find((account) => account.service === service);

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div>
          <p className="section-label">Admin Console</p>
          <h1 className="admin-title">Linkon 운영 관제</h1>
          <p className="admin-subtitle">
            통합 계정, 요금제, 계정 상태, 서비스 접근 권한, 서비스별 관리자 권한을 한 화면에서 관리합니다.
          </p>
        </div>
        <div className="admin-chip">접속 관리자: {currentAdminEmail}</div>
      </div>

      {message && <div className="admin-banner">{message}</div>}

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
            {users.length === 0 && <p className="admin-empty">조건에 맞는 사용자가 없습니다.</p>}
          </div>
        </section>

        <section className="admin-card admin-detail-card" key={selectedUser?.id ?? "empty"}>
          {selectedUser ? (
            <>
              <div className="admin-card__header">
                <div>
                  <h2>{selectedUser.name || "이름 없음"}</h2>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="admin-detail-meta">
                  <span className={`admin-pill admin-pill--${selectedUser.account_status}`}>
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
                      defaultValue={selectedUser.role}
                      onChange={(event) =>
                        void submitAction(`/api/admin/users/${selectedUser.id}/role`, {
                          role: event.target.value,
                        })
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
                      defaultValue={selectedUser.account_status}
                      onChange={(event) =>
                        void submitAction(`/api/admin/users/${selectedUser.id}/status`, {
                          status: event.target.value,
                        })
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
                      defaultValue={selectedUser.plan}
                      onChange={(event) =>
                        void submitAction(`/api/admin/users/${selectedUser.id}/plan`, {
                          plan: event.target.value,
                        })
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
                    onClick={() => void submitAction(`/api/admin/users/${selectedUser.id}/resync`)}
                  >
                    서비스 재동기화
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline"
                    disabled={Boolean(busyAction)}
                    onClick={() =>
                      void submitAction(`/api/admin/users/${selectedUser.id}/status`, {
                        status:
                          selectedUser.account_status === "suspended"
                            ? "active"
                            : "suspended",
                        suspensionReason:
                          selectedUser.account_status === "suspended"
                            ? null
                            : "관리자에 의해 정지됨",
                      })
                    }
                  >
                    {selectedUser.account_status === "suspended" ? "정지 해제" : "계정 정지"}
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
                        void submitAction(`/api/admin/users/${selectedUser.id}/delete`);
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
                    최근 로그인: {selectedUser.last_login_at ?? "-"}
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
                      <article
                        key={serviceName}
                        className="admin-service-card"
                      >
                        <strong>{serviceName.toUpperCase()}</strong>
                        <span>ID: {service?.service_uid ?? "연결 안 됨"}</span>
                        <span>접근: {isEnabled ? "활성" : "비활성"}</span>
                        <span>역할: {serviceRole}</span>
                        <span>이용 횟수: {service?.usage_count ?? 0}</span>
                        <span>최근 접속: {service?.last_accessed_at ?? "-"}</span>
                        <span>동기화: {service?.sync_status ?? "연결 안 됨"}</span>
                        <span>최근 동기화: {service?.last_synced_at ?? "-"}</span>
                        {service?.sync_error && (
                          <span className="admin-error-text">{service.sync_error}</span>
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
                        <span>{log.created_at ?? "-"}</span>
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
              <p>목록에서 계정을 선택하면 권한, 동기화 상태, 감사 로그를 확인할 수 있습니다.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
