"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStoredUser, getStudentDashboard } from "@/lib/api";

export default function Grade2SinhalaAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();

  const studentId = useMemo(
    () => Number(params?.studentId),
    [params?.studentId]
  );

  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!studentId) {
      setError("Invalid student profile.");
      return;
    }

    async function loadStudent() {
      try {
        const dashboard = await getStudentDashboard(studentId);

        setStudentName(dashboard.student.full_name);
        setGrade(dashboard.student.grade);

        setSubjectId(
          dashboard.subjects.find(
            (subject) => subject.code === "sinhala"
          )?.id ?? null
        );

        if (dashboard.student.grade !== 2) {
          setError(
            "This aptitude test is currently available only for Grade 2 students."
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load student profile"
        );
      }
    }

    loadStudent();
  }, [router, studentId]);

  return (
    <main className="dashboard-shell">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <h1 className="title">Grade 2 Sinhala Aptitude Test</h1>

          <p className="subtitle">
            Student : <strong>{studentName}</strong>
          </p>

          <p className="subtitle">
            Grade : {grade ?? "-"}
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
          {error && <p className="error-text">{error}</p>}

          {!error && (
            <>
              <h2>Grade 2 Sinhala</h2>

              <p>
                Student profile loaded successfully.
              </p>

              <p>Subject ID : {subjectId ?? "-"}</p>

              <div className="section-top">
                <Link
                  href={`/dashboard/students/${studentId}`}
                  className="btn"
                >
                  Student Dashboard
                </Link>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}