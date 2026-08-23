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

    return false;
  }

  useEffect(() => {
    const completed: Record<number, boolean> = {};

    grade3SinhalaActivities.forEach((activity) => {
      completed[activity.id] = isActivityComplete(activity);
    });

    setCompletedActivities(completed);
  }, [mcqAnswers]);

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
  ]);

  const completedCount = grade3SinhalaActivities.filter(
    (activity) => completedActivities[activity.id]
  ).length;

  const currentActivity =
    grade3SinhalaActivities[currentActivityIndex];

  return (
    <main>
      <header className="dashboard-topbar">
        <div>
          <p className="dashboard-eyebrow">
            Grade 3 Sinhala
          </p>

          <h1 className="title dashboard-title">
            Grade 3 Sinhala Aptitude Test
          </h1>

          <p className="subtitle">
            Student : <strong>{studentName}</strong>
          </p>

          <p className="subtitle">
            Grade : {grade ?? "-"}
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
            <article className="dashboard-item subject-item">
              <h2>
                Activity {currentActivityIndex + 1} of{" "}
                {grade3SinhalaActivities.length}
              </h2>

              <p className="student-meta">
                Completed: {completedCount}/
                {grade3SinhalaActivities.length}
              </p>

              <p className="section-top">
                {currentActivity.prompt}
              </p>

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
                            setMcqAnswers((prev) => ({
                              ...prev,
                              [currentActivity.id]: option,
                            }))
                          }
                        />

                        <span>{option}</span>
                      </label>
                    )
                  )}
                </div>
              ) : null}

              {completedActivities[currentActivity.id] ? (
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