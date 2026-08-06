"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAccount, setSession } from "@/lib/api";
import { signalAppNavigationStart } from "@/lib/navProgressEvents";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginAccount(email.trim(), password);
      setSession(data.token, data.user);
      signalAppNavigationStart();
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="app-shell auth-page">
      <section className="auth-wrap card card--pop auth-card">
        <h1 className="title">Sign in</h1>
        <p className="subtitle">
          New here?{" "}
          <Link href="/register" className="inline-link">
            Create an account
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="input"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="input"
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn btn-glow" aria-busy={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="section-top">
          <Link href="/" className="inline-link">
            ← Home
          </Link>
        </p>
      </section>
    </main>
  );
}
