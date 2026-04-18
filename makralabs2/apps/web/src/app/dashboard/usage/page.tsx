"use client";

import { useMemo, useSyncExternalStore } from "react";
import { dashboardActivityGetSnapshot, dashboardActivitySubscribe } from "@/lib/dashboard-activity";

function formatTime(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(ts));
}

export default function DashboardUsagePage() {
  const activities = useSyncExternalStore(dashboardActivitySubscribe, dashboardActivityGetSnapshot, () => []);

  const consumeEvents = useMemo(
    () => activities.filter((item) => item.type === "consume"),
    [activities]
  );

  const totalConsumed = useMemo(() => {
    return consumeEvents.reduce((sum, item) => {
      const amount = typeof item.meta?.amount === "number" ? item.meta.amount : 1;
      return sum + amount;
    }, 0);
  }, [consumeEvents]);

  return (
    <main className="dash-dashboard-shell">
      <header className="dash-dashboard-top">
        <div className="dash-dashboard-headline">
          <p className="dash-eyebrow">Usage</p>
          <h1>Credit usage</h1>
          <p className="dash-muted">
            Backend doesn’t expose usage history yet, so this view is built from dashboard actions (credit consumes).
          </p>
        </div>
      </header>

      <section className="dash-dashboard-grid">
        <article className="dash-panel dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">Total consumed</h2>
          </div>
          <p className="dash-balance-value">{totalConsumed}</p>
          <p className="dash-muted">Sum of all consume events recorded in this browser.</p>
        </article>

        <article className="dash-panel dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">Consume events</h2>
          </div>
          <p className="dash-muted">Events: {consumeEvents.length}</p>
          <p className="dash-muted">Go to <code>/dashboard/credits</code> to consume credits.</p>
        </article>

        <article className="dash-panel dash-card dash-span-2">
          <div className="dash-card-head">
            <h2 className="dash-card-title">History</h2>
          </div>

          {consumeEvents.length === 0 ? (
            <p className="dash-muted">No consume events yet.</p>
          ) : (
            <div className="dash-table">
              <div className="dash-table-row dash-table-head">
                <div>Time</div>
                <div>Amount</div>
                <div>Resulting balance</div>
              </div>
              {consumeEvents.map((event) => (
                <div className="dash-table-row" key={event.id}>
                  <div className="dash-mono-value">{formatTime(event.ts)}</div>
                  <div className="dash-mono-value">{typeof event.meta?.amount === "number" ? event.meta.amount : 1}</div>
                  <div className="dash-mono-value">
                    {typeof event.meta?.resultingBalance === "number" ? event.meta.resultingBalance : "--"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
