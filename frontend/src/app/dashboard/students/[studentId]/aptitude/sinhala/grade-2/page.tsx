"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Grade2SinhalaAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();

  const studentId = useMemo(
    () => Number(params?.studentId),
    [params?.studentId]
  );

  return (
    <main className="dashboard-shell">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <h1 className="title">Grade 2 Sinhala Aptitude Test</h1>

          <p className="subtitle">
            Student ID : {studentId}
          </p>
        </div>

        <div className="dashboard-topbar-actions">
          <button
            className="btn btn-secondary"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </header>

      <section className="dashboard-content dashboard-content-single">
        <section className="dashboard-panel dashboard-main-panel">
          <h2>Grade 2 Sinhala</h2>

          <p>
            Grade 2 Sinhala aptitude activities will be available here.
          </p>

          <div className="section-top">
            <Link
              href={`/dashboard/students/${studentId}`}
              className="btn"
            >
              Student Dashboard
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}