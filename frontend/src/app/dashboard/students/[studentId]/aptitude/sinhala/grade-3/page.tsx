"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getStoredUser,
  getStudentDashboard
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

  const currentActivity =
    grade3SinhalaActivities[
      currentActivityIndex
    ];

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

          {!error &&
          grade === 3 &&
          currentActivity ? (
            <article className="dashboard-item subject-item">

              <p className="student-meta">
                Activity{" "}
                {currentActivityIndex + 1}
                {" "}of{" "}
                {grade3SinhalaActivities.length}
              </p>

              <h2>
                {currentActivity.prompt}
              </h2>

              {currentActivity.type ===
              "text_rows" ? (
                <div className="number-rows-grid section-top">
                  {(
                    currentActivity.textRows ||
                    []
                  ).map((row) => (
                    <div
                      key={row.key}
                      className="number-row-card"
                    >
                      <div className="match-left">
                        {row.prompt}
                      </div>

                      <div className="choice-pool">
                        {row.options.map(
                          (option) => (
                            <button
                              key={`${row.key}-${option}`}
                              type="button"
                              className={`number-option-btn ${
                                matchAnswers[
                                  currentActivity.id
                                ]?.[row.key] ===
                                option
                                  ? "number-option-btn-selected"
                                  : ""
                              }`}
                              onClick={() =>
                                setMatchAnswers(
                                  (prev) => ({
                                    ...prev,
                                    [currentActivity.id]:
                                      {
                                        ...(prev[
                                          currentActivity.id
                                        ] || {}),
                                        [row.key]:
                                          option
                                      }
                                  })
                                )
                              }
                            >
                              {option}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

            </article>
          ) : null}

        </section>
      </section>
    </main>
  );
}