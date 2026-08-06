"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAccount, setSession } from "@/lib/api";
import { signalAppNavigationStart } from "@/lib/navProgressEvents";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"parent" | "teacher">("parent");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await registerAccount({
        account_type: accountType,
        full_name: fullName.trim(),
        email: email.trim(),
        password
      });
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
        <h1 className="title">Create account</h1>
        <p className="subtitle">
          Already have an account?{" "}
          <Link href="/login" className="inline-link">
            Sign in
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>Account type</span>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as "parent" | "teacher")}
              className="select"
            >
              <option value="parent">Parent / Guardian</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>
          <label className="field">
            <span>Full name</span>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" className="input" />
          </label>
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
            <span>Password (min 8 characters)</span>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="input"
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn btn-glow" aria-busy={loading}>
            {loading ? "Creating..." : "Register"}
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
