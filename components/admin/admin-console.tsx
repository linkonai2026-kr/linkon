"use client";

import { startTransition, useEffect, useState } from "react";
import { AdminUserDetail, AdminUserListItem } from "@/lib/linkon/admin";
import { ACCOUNT_STATUSES, PLAN_TIERS, USER_ROLES } from "@/lib/linkon/types";

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
        : "The request could not be completed.";
    throw new Error(message);
  }

  if (!data) {
    throw new Error("The server returned an unreadable response.");
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
      setMessage(error instanceof Error ? error.message : "Could not load users.");
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
      setMessage(error instanceof Error ? error.message : "Could not load user detail.");
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
      setMessage("Changes saved and sync requested.");
      await loadUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The action could not be completed.");
    } finally {
      setBusyAction(null);
    }
  }

  const selectedUser = detail;

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div>
          <p className="section-label">Admin Console</p>
          <h1 className="admin-title font-serif">Linkon operations control</h1>
          <p className="admin-subtitle">
            Manage unified identity, plans, suspensions, deletions, and service sync from one place.
          </p>
        </div>
        <div className="admin-chip">Signed in as: {currentAdminEmail}</div>
      </div>

      {message && <div className="admin-banner">{message}</div>}

      <div className="admin-toolbar">
        <input
          className="admin-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or email"
        />
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
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
          <option value="all">All plans</option>
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
          Refresh
        </button>
      </div>

      <div className="admin-grid">
        <section className="admin-card admin-list-card">
          <div className="admin-card__header">
            <h2>Users</h2>
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
                  <strong>{user.name || "No name"}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="admin-user-meta">
                  <span className={`admin-pill admin-pill--${user.account_status}`}>
                    {user.account_status}
                  </span>
                  <span className="admin-pill">{user.plan}</span>
                </div>
              </button>
            ))}
            {users.length === 0 && <p className="admin-empty">No users matched this filter.</p>}
          </div>
        </section>

        <section className="admin-card admin-detail-card" key={selectedUser?.id ?? "empty"}>
          {selectedUser ? (
            <>
              <div className="admin-card__header">
                <div>
                  <h2>{selectedUser.name || "No name"}</h2>
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
                <h3>Account controls</h3>
                <div className="admin-form-grid">
                  <label>
                    Role
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
                    Status
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
                    Plan
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
                    Resync services
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
                            : "Suspended by administrator",
                      })
                    }
                  >
                    {selectedUser.account_status === "suspended" ? "Unsuspend" : "Suspend"}
                  </button>
                  <button
                    type="button"
                    className="btn btn--taxon"
                    disabled={Boolean(busyAction)}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Mark this account as deleted and revoke access across linked services?"
                        )
                      ) {
                        void submitAction(`/api/admin/users/${selectedUser.id}/delete`);
                      }
                    }}
                  >
                    Delete account
                  </button>
                </div>
              </div>

              <div className="admin-section">
                <h3>Service sync status</h3>
                <div className="admin-service-grid">
                  {selectedUser.service_accounts.map((service) => (
                    <article
                      key={`${service.service}-${service.service_uid ?? "empty"}`}
                      className="admin-service-card"
                    >
                      <strong>{service.service.toUpperCase()}</strong>
                      <span>ID: {service.service_uid ?? "Not linked"}</span>
                      <span>Status: {service.sync_status ?? "unknown"}</span>
                      <span>Last sync: {service.last_synced_at ?? "-"}</span>
                      {service.sync_error && (
                        <span className="admin-error-text">{service.sync_error}</span>
                      )}
                    </article>
                  ))}
                  {selectedUser.service_accounts.length === 0 && (
                    <p className="admin-empty">No connected service records exist yet.</p>
                  )}
                </div>
              </div>

              <div className="admin-section">
                <h3>Audit log</h3>
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
                      <p>Actor: {log.actor_uid ?? "system"}</p>
                      {log.sync_result && (
                        <pre className="admin-pre">
                          {JSON.stringify(log.sync_result, null, 2)}
                        </pre>
                      )}
                    </article>
                  ))}
                  {selectedUser.audit_logs.length === 0 && (
                    <p className="admin-empty">No audit entries yet.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="admin-empty-state">
              <h2>Select a user</h2>
              <p>Choose an account from the list to inspect permissions, sync state, and audit history.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
