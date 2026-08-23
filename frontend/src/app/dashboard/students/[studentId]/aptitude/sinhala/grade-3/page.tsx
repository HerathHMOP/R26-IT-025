"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getStoredUser,
  getStudentDashboard,
} from "@/lib/api";
import { grade3SinhalaActivities } from "@/lib/grade3SinhalaAptitude";

export default function Grade3SinhalaAptitudePage() {
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

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>(
    {}
  );

  const [matchAnswers, setMatchAnswers] = useState<
    Record<number, Record<string, string>>
  >({});

  const [activeChoice, setActiveChoice] = useState<
    Record<number, string | null>
  >({});

  const [completedActivities, setCompletedActivities] =
    useState<Record<number, boolean>>({});

  const [currentActivityIndex, setCurrentActivityIndex] =
    useState(0);

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

  function isActivityComplete(
    activity: (typeof grade3SinhalaActivities)[number]
  ) {
    if (activity.type === "mcq") {
      return Boolean(mcqAnswers[activity.id]);
    }

    if (activity.type === "match_letters") {
      const selections = matchAnswers[activity.id] || {};

      return (
        Object.keys(selections).length ===
        (activity.leftItems || []).length
      );
    }

    if (activity.type === "match_pictures") {
      const selections = matchAnswers[activity.id] || {};

      return (
        Object.keys(selections).length ===
        (activity.leftItems || []).length
      );
    }

    return false;
  }

  useEffect(() => {
    const completed: Record<number, boolean> = {};

    grade3SinhalaActivities.forEach((activity) => {
      completed[activity.id] =
        isActivityComplete(activity);
    });

    setCompletedActivities(completed);
  }, [mcqAnswers, matchAnswers]);

  useEffect(() => {
    const currentActivity =
      grade3SinhalaActivities[currentActivityIndex];

    if (!currentActivity) return;

    if (!isActivityComplete(currentActivity)) return;

    if (
      currentActivityIndex >=
      grade3SinhalaActivities.length - 1
    ) {
      return;
    }

    setCurrentActivityIndex((previous) =>
      Math.min(
        previous + 1,
        grade3SinhalaActivities.length - 1
      )
    );
  }, [
    currentActivityIndex,
    mcqAnswers,
    matchAnswers,
  ]);

  function assignActiveChoice(
    activityId: number,
    key: string
  ) {
    const currentChoice = activeChoice[activityId];

    if (!currentChoice) return;

    setMatchAnswers((previous) => ({
      ...previous,
      [activityId]: {
        ...(previous[activityId] || {}),
        [key]: currentChoice,
      },
    }));

    setActiveChoice((previous) => ({
      ...previous,
      [activityId]: null,
    }));
  }

  const completedCount = grade3SinhalaActivities.filter(
    (activity) => completedActivities[activity.id]
  ).length;

  const totalActivities =
    grade3SinhalaActivities.length;

  const currentActivity =
    grade3SinhalaActivities[currentActivityIndex];

  const progress =
    totalActivities > 0
      ? Math.round(
          (completedCount / totalActivities) * 100
        )
      : 0;

  return (
    <main className="kid-aptitude-page">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">
            Grade 3 Sinhala
          </p>

          <h1 className="title dashboard-title kid-aptitude-title">
            Grade 3 Sinhala Aptitude Test
          </h1>

          <p className="kid-aptitude-kicker">
            Sinhala Aptitude Activities
          </p>

          <p className="subtitle kid-aptitude-subtitle">
            Student : <strong>{studentName}</strong>
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
            <p className="error-text">{error}</p>
          ) : null}

          {!error && grade === 3 && currentActivity ? (
            <article className="dashboard-item subject-item kid-aptitude-card">
              <div className="kid-aptitude-card-header">
                <div>
                  <h2 className="dashboard-panel-title">
                    Activity {currentActivityIndex + 1}
                  </h2>

                  <p className="student-meta">
                    Step {currentActivityIndex + 1} of{" "}
                    {totalActivities}
                  </p>
                </div>

                <span
                  className="kid-activity-badge"
                  title="Current activity"
                >
                  ★ {currentActivityIndex + 1}
                </span>
              </div>

              <div className="section-top">
                <div className="kid-progress-track">
                  <div
                    className="kid-progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="student-meta kid-aptitude-answered-line">
                  Completed {completedCount} of{" "}
                  {totalActivities}
                </p>
              </div>

              <div className="section-top">
                <p className="student-meta aptitude-activity-prompt kid-aptitude-prompt">
                  {currentActivity.prompt}
                </p>
              </div>

              {currentActivity.type === "mcq" ? (
                <div className="aptitude-options section-top">
                  {(currentActivity.options || []).map(
                    (option) => (
                      <label
                        key={option}
                        className="aptitude-option"
                      >
                        <input
                          type="radio"
                          name={`activity-${currentActivity.id}`}
                          checked={
                            mcqAnswers[currentActivity.id] ===
                            option
                          }
                          onChange={() =>
                            setMcqAnswers((previous) => ({
                              ...previous,
                              [currentActivity.id]:
                                option,
                            }))
                          }
                        />

                        <span>{option}</span>
                      </label>
                    )
                  )}
                </div>
              ) : null}

              {currentActivity.type === "match_letters" ? (
                <div className="match-grid section-top">
                  <div className="choice-pool">
                    {(currentActivity.rightItems || []).map(
                      (right) => {
                        const selected =
                          activeChoice[
                            currentActivity.id
                          ] === right;

                        return (
                          <button
                            key={right}
                            type="button"
                            className={`letter-choice ${
                              selected
                                ? "letter-choice-selected"
                                : ""
                            }`}
                            onClick={() =>
                              setActiveChoice(
                                (previous) => ({
                                  ...previous,
                                  [currentActivity.id]:
                                    selected
                                      ? null
                                      : right,
                                })
                              )
                            }
                          >
                            {right}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <p className="student-meta">
                    Select a word, then tap the matching
                    item.
                  </p>

                  {(currentActivity.leftItems || []).map(
                    (left) => (
                      <div
                        key={left}
                        className="match-row"
                      >
                        <span className="match-left">
                          {left}
                        </span>

                        <span className="match-arrow">
                          →
                        </span>

                        <button
                          type="button"
                          className={`match-target ${
                            matchAnswers[
                              currentActivity.id
                            ]?.[left]
                              ? "match-target-filled"
                              : ""
                          }`}
                          onClick={() =>
                            assignActiveChoice(
                              currentActivity.id,
                              left
                            )
                          }
                        >
                          {matchAnswers[
                            currentActivity.id
                          ]?.[left] ||
                            "Select matching word"}
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : null}

              {currentActivity.type ===
              "match_pictures" ? (
                <div className="match-grid section-top">
                  {(currentActivity.leftItems || []).map(
                    (left) => (
                      <div
                        key={left}
                        className="match-row"
                      >
                        <span className="match-left">
                          {left}
                        </span>

                        <span className="match-arrow">
                          →
                        </span>

                        <div className="letter-picture-options">
                          {(
                            currentActivity.pictureOptions ||
                            []
                          ).map((picture) => {
                            const selected =
                              matchAnswers[
                                currentActivity.id
                              ]?.[left] ===
                              picture.label;

                            return (
                              <button
                                key={`${left}-${picture.label}`}
                                type="button"
                                className={`picture-choice ${
                                  selected
                                    ? "picture-choice-selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  setMatchAnswers(
                                    (previous) => ({
                                      ...previous,
                                      [currentActivity.id]:
                                        {
                                          ...(previous[
                                            currentActivity
                                              .id
                                          ] || {}),
                                          [left]:
                                            picture.label,
                                        },
                                    })
                                  )
                                }
                              >
                                <img
                                  src={picture.image}
                                  alt={picture.label}
                                  className="picture-choice-thumb"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : null}

              {completedActivities[
                currentActivity.id
              ] ? (
                <p className="student-meta section-top">
                  ✓ Activity completed
                </p>
              ) : null}
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}