"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getStoredUser, getStudentDashboard, type StudentDashboardData, type StudentDashboardSubject } from "@/lib/api";

function isTamilSubjectRow(subject: Pick<StudentDashboardSubject, "code">): boolean {
  return String(subject.code ?? "").toLowerCase() === "tamil";
}

export default function StudentProfilePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StudentDashboardData | null>(null);

  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  /** Coerce API grade (sometimes string from DB/JSON) so strict equality checks match. */
  const studentGradeNum = useMemo(() => (data != null ? Number(data.student.grade) : NaN), [data]);
  const subjectsToShow = useMemo(() => {
    if (!data) return [];
    if (Number(data.student.grade) !== 0) {
      return data.subjects.filter((s) => !isTamilSubjectRow(s));
    }

    const rows = data.subjects.filter((s) => !isTamilSubjectRow(s));
    const totalActivities = rows.reduce((sum, s) => sum + s.progress.total_activities, 0);
    const completedActivities = rows.reduce((sum, s) => sum + s.progress.completed_activities, 0);
    const scores = rows.map((s) => s.progress.average_score).filter((x): x is number => x !== null);
    const averageScore =
      scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)) : null;

    const ref = rows[0];
    const levels = rows.map((r) => r.current_level).filter((x): x is number => x != null);
    const current_level = levels.length > 0 ? Math.max(...levels) : null;
    const mergedEligible = [...new Set(rows.flatMap((r) => r.eligible_levels))].sort((a, b) => a - b);
    const eligible_levels =
      mergedEligible.length > 0
        ? mergedEligible
        : current_level != null && current_level > 0
          ? Array.from({ length: current_level }, (_, i) => i + 1)
          : [];

    const latestUpdate = rows.reduce<string | null>((acc, r) => {
      if (!r.level_updated_at) return acc;
      if (!acc) return r.level_updated_at;
      return r.level_updated_at > acc ? r.level_updated_at : acc;
    }, null);

    return [
      {
        id: ref?.id ?? -1,
        code: "general",
        display_name: "General",
        content_language: data.student.preferred_language,
        current_level,
        eligible_levels,
        level_updated_at: latestUpdate,
        progress: {
          total_activities: totalActivities,
          completed_activities: completedActivities,
          average_score: averageScore
        }
      }
    ];
  }, [data]);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!studentId) {
      setError("Invalid student profile.");
      setLoading(false);
      return;
    }

    async function loadStudentDashboard() {
      setLoading(true);
      setError(null);
      try {
        const dashboard = await getStudentDashboard(studentId);
        setData(dashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      } finally {
        setLoading(false);
      }
    }

    loadStudentDashboard();
  }, [router, studentId]);

  return (
    <main className="dashboard-screen hub-page">
      <header className="dashboard-topbar">
        <div>
          <p className="dashboard-eyebrow">Student profile</p>
          <h1 className="title dashboard-title">{data?.student.full_name || "Student"}</h1>
          <p className="subtitle">
            {data
              ? `Grade ${data.student.grade} | Preferred language: ${data.student.preferred_language}`
              : "Loading student details..."}
          </p>
        </div>
        <div className="dashboard-topbar-actions">
          <Link href="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="dashboard-content dashboard-content-single">
        <section className="dashboard-panel dashboard-main-panel">
          <h2 className="dashboard-panel-title">Subjects &amp; progress</h2>
          <p className="subtitle section-top">
            {data && Number(data.student.grade) === 0
              ? "Pre-school students have one subject: General (levels 1-4 are set by the general aptitude test)."
              : "Subjects shown here are automatically filtered based on the student grade."}
            {data && Number(data.student.grade) !== 0
              ? ` Aptitude test: ${data.aptitude_test.total_activities} activities.`
              : data
                ? ` General aptitude: ${data.aptitude_test.total_activities} activities.`
                : ""}
          </p>
          {loading ? <p className="loading-text section-top">Loading subjects...</p> : null}
          {error ? <p className="error-text section-top">{error}</p> : null}
          {!loading && !error && data && subjectsToShow.length === 0 ? (
            <p className="subtitle section-top">No subjects available for this student yet.</p>
          ) : null}
          {!loading && !error && data ? (
            <div className="students-grid section-top">
              {subjectsToShow.map((subject) => {
                const subjectCode = String(subject.code ?? "").toLowerCase();
                return (
                <article key={subject.id} className="dashboard-item subject-item hub-subject-card">
                  <div className="subject-item-header">
                    <strong>{subject.display_name}</strong>
                    <span className="subject-chip">{subjectCode.toUpperCase()}</span>
                  </div>
                  <p className="student-meta">
                    Language: {subject.content_language} | Current level: {subject.current_level ?? "Not assigned"}
                  </p>
                  <p className="student-meta">
                    Eligible levels:{" "}
                    {subject.current_level == null
                      ? "Locked until aptitude test"
                      : subject.eligible_levels.length > 0
                        ? subject.eligible_levels.join(", ")
                        : "Locked until aptitude test"}
                  </p>
                  <p className="student-meta">
                    Progress: {subject.progress.completed_activities}/{subject.progress.total_activities} completed
                    {subject.progress.average_score !== null ? ` | Avg score: ${subject.progress.average_score}` : ""}
                  </p>
                  {studentGradeNum === 0 && subjectCode === "general" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <Link href={`/dashboard/students/${studentId}/aptitude/general/pre`} className="btn aptitude-start-btn">
                        {subject.current_level == null ? "Start General Aptitude Test" : "Retake General Aptitude Test"}
                      </Link>
                    </div>
                  ) : null}
                  {studentGradeNum === 2 && subjectCode === "english" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <Link href={`/dashboard/students/${studentId}/aptitude/english/grade-2`} className="btn aptitude-start-btn">
                        {subject.current_level == null ? "Start English Aptitude Test" : "Retake English Aptitude Test"}
                      </Link>
                    </div>
                  ) : null}
                  {studentGradeNum === 2 && subjectCode === "sinhala" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <Link href={`/dashboard/students/${studentId}/aptitude/sinhala/grade-2`} className="btn aptitude-start-btn">
                        {subject.current_level == null ? "Start Grade 2 Sinhala Aptitude" : "Retake Grade 2 Sinhala Aptitude"}
                      </Link>
                    </div>
                  ) : null}
                  {studentGradeNum === 2 && subjectCode === "maths" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <div className="section-top level-actions">
                        <Link href={`/dashboard/students/${studentId}/aptitude/maths/grade-2?lang=english`} className="btn aptitude-start-btn">
                          {subject.current_level == null ? "Start Grade 2 Maths Aptitude (English)" : "Retake Grade 2 Maths Aptitude (English)"}
                        </Link>
                        <Link href={`/dashboard/students/${studentId}/aptitude/maths/grade-2?lang=sinhala`} className="btn btn-secondary">
                          {subject.current_level == null ? "Start Grade 2 Maths Aptitude (Sinhala)" : "Retake Grade 2 Maths Aptitude (Sinhala)"}
                        </Link>
                      </div>
                    </div>
                  ) : null}
                  {studentGradeNum === 3 && subjectCode === "english" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <Link href={`/dashboard/students/${studentId}/aptitude/english/grade-3`} className="btn aptitude-start-btn">
                        {subject.current_level == null ? "Start Grade 3 English Aptitude" : "Retake Grade 3 English Aptitude"}
                      </Link>
                    </div>
                  ) : null}
                  {studentGradeNum === 3 && subjectCode === "sinhala" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <Link href={`/dashboard/students/${studentId}/aptitude/sinhala/grade-3`} className="btn aptitude-start-btn">
                        {subject.current_level == null ? "Start Grade 3 Sinhala Aptitude" : "Retake Grade 3 Sinhala Aptitude"}
                      </Link>
                    </div>
                  ) : null}
                  {studentGradeNum === 3 && subjectCode === "maths" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <div className="section-top level-actions">
                        <Link href={`/dashboard/students/${studentId}/aptitude/maths/grade-3?lang=english`} className="btn aptitude-start-btn">
                          {subject.current_level == null ? "Start Grade 3 Maths Aptitude (English)" : "Retake Grade 3 Maths Aptitude (English)"}
                        </Link>
                        <Link href={`/dashboard/students/${studentId}/aptitude/maths/grade-3?lang=sinhala`} className="btn btn-secondary">
                          {subject.current_level == null ? "Start Grade 3 Maths Aptitude (Sinhala)" : "Retake Grade 3 Maths Aptitude (Sinhala)"}
                        </Link>
                      </div>
                    </div>
                  ) : null}
                  {studentGradeNum === 4 && subjectCode === "english" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <Link href={`/dashboard/students/${studentId}/aptitude/english/grade-4`} className="btn aptitude-start-btn">
                        {subject.current_level == null ? "Start Grade 4 English Aptitude" : "Retake Grade 4 English Aptitude"}
                      </Link>
                    </div>
                  ) : null}
                  {studentGradeNum === 4 && subjectCode === "sinhala" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <Link href={`/dashboard/students/${studentId}/aptitude/sinhala/grade-4`} className="btn aptitude-start-btn">
                        {subject.current_level == null ? "Start Grade 4 Sinhala Aptitude" : "Retake Grade 4 Sinhala Aptitude"}
                      </Link>
                    </div>
                  ) : null}
                  {studentGradeNum === 4 && subjectCode === "maths" ? (
                    <div className="section-top english-aptitude-actions">
                      <p className="student-meta">Unlocked learning levels</p>
                      <div className="level-actions">
                        {[1, 2, 3, 4].map((level) => {
                          const isEnabled = subject.eligible_levels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              className="btn btn-secondary level-btn"
                              disabled={!isEnabled}
                              title={isEnabled ? `Level ${level} is unlocked` : `Level ${level} is locked`}
                            >
                              Level {level}
                            </button>
                          );
                        })}
                      </div>
                      <div className="section-top level-actions">
                        <Link href={`/dashboard/students/${studentId}/aptitude/maths/grade-4?lang=english`} className="btn aptitude-start-btn">
                          {subject.current_level == null ? "Start Grade 4 Maths Aptitude (English)" : "Retake Grade 4 Maths Aptitude (English)"}
                        </Link>
                        <Link href={`/dashboard/students/${studentId}/aptitude/maths/grade-4?lang=sinhala`} className="btn btn-secondary">
                          {subject.current_level == null ? "Start Grade 4 Maths Aptitude (Sinhala)" : "Retake Grade 4 Maths Aptitude (Sinhala)"}
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </article>
                );
              })}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
