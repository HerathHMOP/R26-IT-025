"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  completeExamSession,
  getStoredUser,
  getStudentDashboard,
  startExamSession,
  type CompleteExamSessionResponse
} from "@/lib/api";
import { grade3SinhalaActivities } from "@/lib/grade3SinhalaAptitude";

export default function Grade3SinhalaAptitudePage() {
  const WORD_SEPARATOR = " | ";

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

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<CompleteExamSessionResponse | null>(
      null
    );

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

  function getActivityMark(
    activity:
      (typeof grade3SinhalaActivities)[number]
  ): 0 | 1 {
    if (activity.type === "text_rows") {
      const selectedMap =
        matchAnswers[activity.id] || {};

      const allRowsCorrect =
        (activity.textRows || []).length > 0 &&
        (activity.textRows || []).every(
          (row) =>
            selectedMap[row.key] ===
            row.answer
        );

      return allRowsCorrect ? 1 : 0;
    }

    if (activity.type === "match_letters") {
      const selectedMap =
        matchAnswers[activity.id] || {};

      const expectedMap =
        activity.matchAnswerMap || {};

      const allMatched =
        Object.keys(expectedMap).length > 0 &&
        Object.entries(expectedMap).every(
          ([left, right]) =>
            selectedMap[left] === right
        );

      return allMatched ? 1 : 0;
    }

    if (activity.type === "arrange_words") {
      const selectedMap =
        matchAnswers[activity.id] || {};

      const allRowsCorrect =
        (activity.arrangeWordRows || []).length >
          0 &&
        (activity.arrangeWordRows || []).every(
          (row) => {
            const builtWords = (
              selectedMap[row.key] || ""
            )
              .split(WORD_SEPARATOR)
              .filter(Boolean);

            return (
              builtWords.join(" ") ===
              row.answer
            );
          }
        );

      return allRowsCorrect ? 1 : 0;
    }

    return 0;
  }

  async function handleSubmit() {
    if (!studentId || grade !== 3) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const correctAnswers =
        grade3SinhalaActivities.reduce(
          (count, activity) =>
            count +
            getActivityMark(activity),
          0
        );

      const session =
        await startExamSession(
          studentId,
          grade3SinhalaActivities.length
        );

      const finalResult =
        await completeExamSession(
          session.exam_session_id,
          correctAnswers,
          subjectId ?? undefined,
          grade3SinhalaActivities.length
        );

      setResult(finalResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit aptitude test"
      );
    } finally {
      setSubmitting(false);
    }
  }

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

          {result ? (
            <section className="dashboard-item">
              <h2>
                Aptitude Test Complete
              </h2>

              <p>
                Score:{" "}
                {result.correct_answers}/
                {result.total_activities}
                {" "}
                ({result.score_percent}%)
              </p>
            </section>
          ) : null}

          {!result && grade === 3 ? (
            <article className="dashboard-item">

              <h2>
                Grade 3 Sinhala
              </h2>

              <p>
                Complete all activities
                before submitting.
              </p>

              <button
                type="button"
                className="btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Aptitude Test"}
              </button>

            </article>
          ) : null}

        </section>
      </section>
    </main>
  );
}