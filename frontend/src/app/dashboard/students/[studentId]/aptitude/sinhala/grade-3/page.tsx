"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Grade3SinhalaAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();

  const studentId = useMemo(
    () => Number(params?.studentId),
    [params?.studentId]
  );

  const [studentName, setStudentName] =
    useState("Student");

  const [grade, setGrade] =
    useState<number | null>(null);

  const [subjectId, setSubjectId] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  return (
    <main>
      <header className="dashboard-topbar">
        <div>
          <h1>
            Grade 3 Sinhala Aptitude Test
          </h1>

          <p className="subtitle">
            Student:{" "}
            <strong>{studentName}</strong>
          </p>

          <p className="subtitle">
            Grade: {grade ?? "-"}
          </p>
        </div>

        <div className="dashboard-topbar-actions">
          <Link
            href={`/dashboard/students/${studentId}`}
            className="btn btn-secondary"
          >
            Back to Student Profile
          </Link>
        </div>
      </header>

      <section className="dashboard-content dashboard-content-single">
        <section className="dashboard-panel dashboard-main-panel">

          {error ? (
            <p className="error-text">
              {error}
            </p>
          ) : null}

          <h2>Grade 3 Sinhala</h2>

          <p>
            Student profile will be loaded here.
          </p>

          <p>
            Subject ID: {subjectId ?? "-"}
          </p>

        </section>
      </section>
    </main>
  );
}