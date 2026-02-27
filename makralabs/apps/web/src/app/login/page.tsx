"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { DashboardAuthPageShell } from "@/components/dashboard-auth-page-shell";
import { env } from "@/lib/env";
import { useDashboardAuth } from "@/providers/dashboard-auth-provider";

export default function LoginPage() {
  const { login, isAuthenticated, isReady } = useDashboardAuth();
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

    setIsSubmitting(true);

    try {
      await login(email, password);
      router.replace(nextPath);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardAuthPageShell
      title="Sign in"
      subtitle="Use your email/password credentials to access the dashboard."
      footer={
        <p className="dash-muted">
          New here? <Link href="/register">Create an account</Link>
        </p>
      }
    >
      <form className="dash-form" onSubmit={handleSubmit}>
        <div className="dash-form-field">
          <label htmlFor="email">Email</label>
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
            autoComplete="current-password"
            className="dash-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        {error ? <p className="dash-message dash-message-error">{error}</p> : null}

        <button type="submit" className="dash-btn dash-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <a className="dash-btn dash-btn-neutral" href={`${env.NEXT_PUBLIC_API_ORIGIN}/auth/google`}>
          Continue with Google
        </a>
      </form>
    </DashboardAuthPageShell>
  );
}
