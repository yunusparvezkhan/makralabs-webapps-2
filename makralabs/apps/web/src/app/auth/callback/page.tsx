"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardAuth } from "@/providers/dashboard-auth-provider";

function readTokenFromHash(hash: string) {
  const cleanedHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(cleanedHash);
  return params.get("access_token") || params.get("token");
}

function AuthCallbackContent() {
  const { setAccessToken } = useDashboardAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(() => searchParams.get("next") || "/dashboard", [searchParams]);
  const queryToken = useMemo(() => searchParams.get("access_token") || searchParams.get("token"), [searchParams]);

  useEffect(() => {
    async function completeAuth() {
      const hashToken = typeof window !== "undefined" ? readTokenFromHash(window.location.hash) : null;
      const token = queryToken || hashToken;

      if (!token) {
        setError("OAuth callback did not include an access token.");
        return;
      }

      try {
        await setAccessToken(token);
        router.replace(nextPath);
      } catch (callbackError) {
        setError(callbackError instanceof Error ? callbackError.message : "OAuth login failed.");
      }
    }

    void completeAuth();
  }, [nextPath, queryToken, router, setAccessToken]);

  return (
    <main className="dash-page-center">
      <section className="dash-panel dash-auth-panel">
        <h1>Completing authentication</h1>
        {error ? (
          <>
            <p className="dash-message dash-message-error">{error}</p>
            <p className="dash-muted">
              <Link href="/login">Back to login</Link>
            </p>
          </>
        ) : (
          <p className="dash-muted">Finalizing your Google sign-in session.</p>
        )}
      </section>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
