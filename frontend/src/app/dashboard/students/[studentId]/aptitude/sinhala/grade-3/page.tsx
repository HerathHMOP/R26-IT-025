"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getStoredUser,
  getStudentDashboard
} from "@/lib/api";
import {
  grade3SinhalaActivities
} from "@/lib/grade3SinhalaAptitude";

export default function Grade3SinhalaAptitudePage() {
  const WORD_SEPARATOR = " | ";

  const params =
    useParams<{ studentId: string }>();

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

  const [matchAnswers, setMatchAnswers] =
    useState<
      Record<number, Record<string, string>>
    >({});

  const [activeChoice, setActiveChoice] =
    useState<
      Record<number, string | null>
    >({});

  const [currentActivityIndex, setCurrentActivityIndex] =
    useState(0);

  const [error, setError] =
    useState<string | null>(null);

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
        const dashboard =
          await getStudentDashboard(studentId);

        setStudentName(
          dashboard.student.full_name
        );

        setGrade(
          dashboard.student.grade
        );

        setSubjectId(
          dashboard.subjects.find(
            (subject) =>
              subject.code === "sinhala"
          )?.id ?? null
        );

        if (dashboard.student.grade !== 3) {
          setError(
            "This aptitude test is currently available only for Grade 3 students."
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

          {!error && grade === 3 ? (
            <article className="dashboard-item subject-item">

              <p className="student-meta">
                Activity{" "}
                {currentActivityIndex + 1}
                {" "}of{" "}
                {grade3SinhalaActivities.length}
              </p>

            </article>
          ) : null}

        </section>
      </section>
    </main>
  );
}