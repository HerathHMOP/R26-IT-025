"use client";

import Link from "next/link";

export default function Grade2SinhalaPage() {
  return (
    <main className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <h1>Grade 2 Sinhala Aptitude Test</h1>
          <p>Welcome to the Grade 2 Sinhala aptitude assessment.</p>
        </div>

        <Link href="/dashboard" className="btn btn-secondary">
          Back
        </Link>
      </header>
    </main>
  );
}