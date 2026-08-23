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

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [completedActivities, setCompletedActivities] = useState<
    Record<number, boolean>
  >({});

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

  const completedCount = grade3SinhalaActivities.filter(
    (activity) => completedActivities[activity.id]
  ).length;

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

          {!error && grade === 3 ? (
            <article className="dashboard-item subject-item">
              <h2>Grade 3 Sinhala Aptitude</h2>

              <p className="student-meta">
                Completed activities: {completedCount}/
                {grade3SinhalaActivities.length}
              </p>

              <div className="students-grid section-top">
                {grade3SinhalaActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="dashboard-item"
                  >
                    <h3>
                      Activity {index + 1}
                    </h3>

                    <p>
                      {activity.prompt}
                    </p>

                    {activity.type === "mcq" ? (
                      <div className="aptitude-options section-top">
                        {(activity.options || []).map(
                          (option) => (
                            <label
                              key={option}
                              className="aptitude-option"
                            >
                              <input
                                type="radio"
                                name={`activity-${activity.id}`}
                                checked={
                                  mcqAnswers[activity.id] ===
                                  option
                                }
                                onChange={() =>
                                  setMcqAnswers((prev) => ({
                                    ...prev,
                                    [activity.id]: option,
                                  }))
                                }
                              />

                              <span>{option}</span>
                            </label>
                          )
                        )}
                      </div>
                    ) : null}

                    {completedActivities[activity.id] ? (
                      <p className="student-meta section-top">
                        ✓ Activity completed
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}