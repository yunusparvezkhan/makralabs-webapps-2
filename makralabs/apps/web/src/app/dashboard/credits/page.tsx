"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  dashboardConsumeCredits,
  dashboardCreateApiKey,
  dashboardDeleteApiKey,
  dashboardGetBalance,
  dashboardHealthCheck,
  dashboardListApiKeys
} from "@/lib/dashboard-api-client";
import { useDashboardAuth } from "@/providers/dashboard-auth-provider";
import { dashboardActivityAdd } from "@/lib/dashboard-activity";
import type { DashboardApiKeyRecord } from "@/types/dashboard-api";

function formatDate(value?: string) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function getKeyId(key: DashboardApiKeyRecord) {
  return String(key.id || key._id || key.keyId || "");
}

export default function DashboardPage() {
  const { token, user } = useDashboardAuth();
  const [healthStatus, setHealthStatus] = useState<"ok" | "down" | "loading">("loading");
  const [balance, setBalance] = useState<number | null>(null);
  const [keys, setKeys] = useState<DashboardApiKeyRecord[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isConsuming, setIsConsuming] = useState(false);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeySecret, setNewKeySecret] = useState<string | null>(null);

  const [consumeAmountInput, setConsumeAmountInput] = useState("1");
  const [apiKeyProbe, setApiKeyProbe] = useState("");
  const [probeBalance, setProbeBalance] = useState<number | null>(null);
  const [probeError, setProbeError] = useState<string | null>(null);
  const [isProbing, setIsProbing] = useState(false);

  const userId = useMemo(() => String(user?.id || user?._id || "not provided"), [user]);

  const refreshBalance = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoadingBalance(true);
    setApiError(null);

    try {
      const nextBalance = await dashboardGetBalance({ token });
      setBalance(nextBalance);
      dashboardActivityAdd({ type: "balance", message: "Fetched balance", meta: { balance: nextBalance } });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to fetch balance.");
      dashboardActivityAdd({
        type: "error",
        message: "Failed to fetch balance",
        meta: { error: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsLoadingBalance(false);
    }
  }, [token]);

  const refreshKeys = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoadingKeys(true);
    setApiError(null);

    try {
      const list = await dashboardListApiKeys(token);
      setKeys(list);
      dashboardActivityAdd({ type: "balance", message: "Fetched API keys", meta: { count: list.length } });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to load API keys.");
      dashboardActivityAdd({
        type: "error",
        message: "Failed to fetch API keys",
        meta: { error: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsLoadingKeys(false);
    }
  }, [token]);

  const refreshHealth = useCallback(async () => {
    try {
      const response = await dashboardHealthCheck();
      setHealthStatus(response.status === "ok" ? "ok" : "down");
      dashboardActivityAdd({ type: "health", message: `Health check: ${response.status}` });
    } catch {
      setHealthStatus("down");
      dashboardActivityAdd({ type: "error", message: "Health check failed" });
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    void refreshHealth();
    void refreshBalance();
    void refreshKeys();
  }, [token, refreshBalance, refreshHealth, refreshKeys]);

  async function handleCreateKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (!newKeyName.trim()) {
      setApiError("Key name is required.");
      return;
    }

    setIsCreatingKey(true);
    setApiError(null);
    setNewKeySecret(null);

    try {
      const response = await dashboardCreateApiKey(token, newKeyName.trim());
      const secret =
        typeof response.key === "string"
          ? response.key
          : typeof response.api_key === "string"
            ? response.api_key
            : typeof response.apiKey === "string"
              ? response.apiKey
              : typeof response.token === "string"
                ? response.token
                : null;

      setNewKeySecret(secret);
      setNewKeyName("");
      dashboardActivityAdd({
        type: "api_key_create",
        message: "Created API key",
        meta: { name: newKeyName.trim(), returnedSecret: Boolean(secret) }
      });
      await refreshKeys();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to create key.");
      dashboardActivityAdd({
        type: "error",
        message: "Failed to create API key",
        meta: { error: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsCreatingKey(false);
    }
  }

  async function handleDeleteKey(key: DashboardApiKeyRecord) {
    if (!token) {
      return;
    }

    const keyId = getKeyId(key);

    if (!keyId) {
      setApiError("Cannot delete this key because its id was missing in the API response.");
      return;
    }

    setApiError(null);

    try {
      await dashboardDeleteApiKey(token, keyId);
      dashboardActivityAdd({ type: "api_key_delete", message: "Deleted API key", meta: { keyId, name: key.name } });
      await refreshKeys();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to delete key.");
      dashboardActivityAdd({
        type: "error",
        message: "Failed to delete API key",
        meta: { error: error instanceof Error ? error.message : String(error), keyId }
      });
    }
  }

  async function handleConsume(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    const parsedAmount = Number.parseInt(consumeAmountInput, 10);

    if (!Number.isInteger(parsedAmount) || parsedAmount < 1) {
      setApiError("Consume amount must be a whole number greater than or equal to 1.");
      return;
    }

    setIsConsuming(true);
    setApiError(null);

    try {
      const nextBalance = await dashboardConsumeCredits({ token }, parsedAmount);
      setBalance(nextBalance);
      dashboardActivityAdd({
        type: "consume",
        message: "Consumed credits",
        meta: { amount: parsedAmount, resultingBalance: nextBalance }
      });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to consume credits.");
      dashboardActivityAdd({
        type: "error",
        message: "Failed to consume credits",
        meta: { error: error instanceof Error ? error.message : String(error), amount: parsedAmount }
      });
    } finally {
      setIsConsuming(false);
    }
  }

  async function handleProbe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProbeError(null);
    setProbeBalance(null);

    if (!apiKeyProbe.trim()) {
      setProbeError("Enter an API key first.");
      return;
    }

    setIsProbing(true);

    try {
      const nextBalance = await dashboardGetBalance({ apiKey: apiKeyProbe.trim() });
      setProbeBalance(nextBalance);
      dashboardActivityAdd({
        type: "api_key_probe",
        message: "Probed balance using API key",
        meta: { resultingBalance: nextBalance }
      });
    } catch (error) {
      setProbeError(error instanceof Error ? error.message : "Unable to fetch balance using API key.");
      dashboardActivityAdd({
        type: "error",
        message: "Failed API key probe",
        meta: { error: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsProbing(false);
    }
  }

  async function handleCopyLatestKey() {
    if (!newKeySecret || typeof window === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(newKeySecret);
  }

  return (
    <main className="dash-dashboard-shell">
      <header className="dash-dashboard-top">
        <div className="dash-dashboard-headline">
          <p className="dash-eyebrow">Credits</p>
          <h1>Credits and API keys</h1>
          <p className="dash-muted">Manage API keys, monitor credits, and test key-based access in real time.</p>
          <div className="dash-badge-row">
            <span className={`dash-badge ${healthStatus === "ok" ? "dash-badge-health-ok" : "dash-badge-health-down"}`}>
              Backend {healthStatus === "loading" ? "checking" : healthStatus}
            </span>
            <span className="dash-badge dash-badge-soft">User ID: {userId}</span>
          </div>
        </div>
        <div className="dash-inline-actions">
          <button type="button" className="dash-btn dash-btn-neutral" onClick={refreshHealth}>
            Check health
          </button>
          <button type="button" className="dash-btn dash-btn-neutral" onClick={refreshBalance}>
            Refresh balance
          </button>
        </div>
      </header>

      {apiError ? <p className="dash-message dash-message-error">{apiError}</p> : null}

      <section className="dash-dashboard-grid">
        <article className="dash-panel dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">Credit balance</h2>
            <button type="button" className="dash-btn dash-btn-neutral" onClick={refreshBalance} disabled={isLoadingBalance}>
              {isLoadingBalance ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <p className="dash-balance-value">{balance === null ? "--" : balance}</p>
          <p className="dash-muted">Current available credits for the authenticated account.</p>
          <form className="dash-form" onSubmit={handleConsume}>
            <div className="dash-form-field">
              <label htmlFor="consume-amount">Credits to consume</label>
              <input
                id="consume-amount"
                className="dash-input"
                type="number"
                min={1}
                step={1}
                value={consumeAmountInput}
                onChange={(event) => setConsumeAmountInput(event.target.value)}
              />
            </div>
            <button type="submit" className="dash-btn dash-btn-primary" disabled={isConsuming}>
              {isConsuming ? "Consuming..." : "Consume credits"}
            </button>
          </form>
        </article>

        <article className="dash-panel dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">API key balance probe</h2>
          </div>
          <p className="dash-muted">
            Use any API key to call <code>GET /api/balance</code> with <code>Api-Key</code> auth.
          </p>
          <form className="dash-form" onSubmit={handleProbe}>
            <div className="dash-form-field">
              <label htmlFor="probe-key">API key</label>
              <input
                id="probe-key"
                className="dash-input"
                type="text"
                value={apiKeyProbe}
                onChange={(event) => setApiKeyProbe(event.target.value)}
                placeholder="Paste API key"
              />
            </div>
            <button type="submit" className="dash-btn dash-btn-primary" disabled={isProbing}>
              {isProbing ? "Checking..." : "Check key balance"}
            </button>
          </form>
          {probeError ? <p className="dash-message dash-message-error">{probeError}</p> : null}
          {probeBalance !== null ? <p className="dash-message dash-message-info">Key balance: {probeBalance}</p> : null}
        </article>

        <article className="dash-panel dash-card dash-span-2">
          <div className="dash-card-head">
            <h2 className="dash-card-title">API keys</h2>
            <button type="button" className="dash-btn dash-btn-neutral" onClick={refreshKeys} disabled={isLoadingKeys}>
              {isLoadingKeys ? "Refreshing..." : "Refresh keys"}
            </button>
          </div>

          <form className="dash-form" onSubmit={handleCreateKey}>
            <div className="dash-form-field">
              <label htmlFor="key-name">Create key</label>
              <input
                id="key-name"
                className="dash-input"
                type="text"
                value={newKeyName}
                onChange={(event) => setNewKeyName(event.target.value)}
                placeholder="Example: Production Worker"
              />
            </div>
            <button type="submit" className="dash-btn dash-btn-primary" disabled={isCreatingKey}>
              {isCreatingKey ? "Creating..." : "Create API key"}
            </button>
          </form>

          {newKeySecret ? (
            <div className="dash-message dash-message-info">
              <p>New key (shown once):</p>
              <p className="dash-mono-value">{newKeySecret}</p>
              <div className="dash-inline-actions" style={{ marginTop: "8px" }}>
                <button type="button" className="dash-btn dash-btn-neutral" onClick={handleCopyLatestKey}>
                  Copy key
                </button>
              </div>
            </div>
          ) : null}

          <div className="dash-key-list">
            {keys.length === 0 ? (
              <p className="dash-muted">No API keys found yet.</p>
            ) : (
              keys.map((key) => {
                const keyId = getKeyId(key);
                return (
                  <div className="dash-key-item" key={keyId || `${key.name}-${key.createdAt}`}>
                    <div className="dash-key-item-row">
                      <strong>{key.name}</strong>
                      <button type="button" className="dash-btn dash-btn-danger" onClick={() => handleDeleteKey(key)}>
                        Delete
                      </button>
                    </div>
                    <p className="dash-mono-value">Key ID: {keyId || "missing in response"}</p>
                    <p className="dash-muted">Created: {formatDate(key.createdAt)}</p>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
