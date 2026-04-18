"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardAuthPageShell } from "@/components/dashboard-auth-page-shell";
import { useDashboardAuth } from "@/providers/dashboard-auth-provider";

function RegisterContent() {
  const { register, isAuthenticated, isReady } = useDashboardAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(() => searchParams.get("next") || "/dashboard", [searchParams]);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isReady, isAuthenticated, nextPath, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password);
      router.replace(nextPath);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to register.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardAuthPageShell
      title="Create account"
      subtitle="Sign up with your email and password to get your API access token."
      footer={
        <p className="dash-muted">
          Already have an account?{" "}
          <a href="/login" style={{ color: "var(--makra-primary-green)", fontWeight: 600 }}>
            Sign in
          </a>
        </p>
      }
    >
      <form className="dash-form" onSubmit={handleSubmit}>
        <div className="dash-form-field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="dash-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <div className="dash-form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="dash-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        {error ? <p className="dash-message dash-message-error">{error}</p> : null}

        <button type="submit" className="dash-btn dash-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </DashboardAuthPageShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
