"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  dashboardGetBalance,
  dashboardHealthCheck,
  dashboardListApiKeys
} from "@/lib/dashboard-api-client";
import { useDashboardAuth } from "@/providers/dashboard-auth-provider";
import { dashboardActivityAdd } from "@/lib/dashboard-activity";

export default function DashboardOverviewPage() {
  const { token, user } = useDashboardAuth();
  const [healthStatus, setHealthStatus] = useState<"ok" | "down" | "loading">("loading");
  const [balance, setBalance] = useState<number | null>(null);
  const [keysCount, setKeysCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = useMemo(() => String(user?.id || user?._id || "not provided"), [user]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function load(activeToken: string) {
      setError(null);

      try {
        const health = await dashboardHealthCheck();
        if (!cancelled) {
          setHealthStatus(health.status === "ok" ? "ok" : "down");
        }
        dashboardActivityAdd({ type: "health", message: `Health check: ${health.status}` });
      } catch {
        if (!cancelled) {
          setHealthStatus("down");
        }
        dashboardActivityAdd({ type: "error", message: "Health check failed" });
      }

      try {
        const [nextBalance, keys] = await Promise.all([
          dashboardGetBalance({ token: activeToken }),
          dashboardListApiKeys(activeToken)
        ]);

        if (cancelled) {
          return;
        }

        setBalance(nextBalance);
        setKeysCount(keys.length);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard overview.");
        }
      }
    }

    void load(token);

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="dash-dashboard-shell">
      <header className="dash-dashboard-top">
        <div className="dash-dashboard-headline">
          <p className="dash-eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p className="dash-muted">Quick snapshot for {user?.email}</p>
          <div className="dash-badge-row">
            <span className={`dash-badge ${healthStatus === "ok" ? "dash-badge-health-ok" : "dash-badge-health-down"}`}>
              Backend {healthStatus === "loading" ? "checking" : healthStatus}
            </span>
            <span className="dash-badge dash-badge-soft">User ID: {userId}</span>
          </div>
        </div>
      </header>

      {error ? <p className="dash-message dash-message-error">{error}</p> : null}

      <section className="dash-dashboard-grid">
        <article className="dash-panel dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">Credits</h2>
          </div>
          <p className="dash-balance-value">{balance === null ? "--" : balance}</p>
          <p className="dash-muted">Current credit balance from <code>GET /api/balance</code>.</p>
          <Link className="dash-btn dash-btn-primary" href="/dashboard/credits">
            Manage credits
          </Link>
        </article>

        <article className="dash-panel dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">API keys</h2>
          </div>
          <p className="dash-balance-value">{keysCount === null ? "--" : keysCount}</p>
          <p className="dash-muted">Keys available for the current user.</p>
          <Link className="dash-btn dash-btn-primary" href="/dashboard/credits">
            Manage keys
          </Link>
        </article>

        <article className="dash-panel dash-card dash-span-2">
          <div className="dash-card-head">
            <h2 className="dash-card-title">Next</h2>
          </div>
          <p className="dash-muted">Visit the other sections to inspect usage events and client-side logs.</p>
          <div className="dash-inline-actions">
            <Link className="dash-btn dash-btn-neutral" href="/dashboard/usage">
              View usage
            </Link>
            <Link className="dash-btn dash-btn-neutral" href="/dashboard/logs">
              View logs
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
