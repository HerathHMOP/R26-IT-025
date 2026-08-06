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
import {
  playZoneDoneTitle,
  playZoneEyebrow,
  playZoneFinishedLine,
  playZoneKicker,
  playZoneMainClassNames,
  playZoneStepBadge,
  playZoneSubmitLabel,
  playZoneSubtitle,
  playZoneTitle,
  type AptitudeUiLang
} from "@/lib/aptitudePlayZone";
import { grade3EnglishActivities } from "@/lib/grade3EnglishAptitude";

export default function Grade3EnglishAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [matchAnswers, setMatchAnswers] = useState<Record<number, Record<string, string>>>({});
  const [activeChoice, setActiveChoice] = useState<Record<number, string | null>>({});
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompleteExamSessionResponse | null>(null);

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
        setSubjectId(dashboard.subjects.find((subject) => subject.code === "english")?.id ?? null);
        if (dashboard.student.grade !== 3) {
          setError("This aptitude test is currently available only for Grade 3 students.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }

    loadStudent();
  }, [router, studentId]);

  function getActivityMark(activity: (typeof grade3EnglishActivities)[number]): 0 | 1 {
    if (activity.type === "mcq") return mcqAnswers[activity.id] === activity.answer ? 1 : 0;
    if (activity.type === "number_rows") {
      const selectedMap = matchAnswers[activity.id] || {};
      const allRowsCorrect =
        (activity.numberRows || []).length > 0 &&
        (activity.numberRows || []).every((row) => selectedMap[row.key] === row.answer);
      return allRowsCorrect ? 1 : 0;
    }
    if (activity.type === "image_rows") {
      const selectedMap = matchAnswers[activity.id] || {};
      const allRowsCorrect =
        (activity.imageRows || []).length > 0 &&
        (activity.imageRows || []).every((row) => selectedMap[row.key] === row.answer);
      return allRowsCorrect ? 1 : 0;
    }
    const selectedMap = matchAnswers[activity.id] || {};
    const expectedMap = activity.matchAnswerMap || {};
    const allMatched =
      Object.keys(expectedMap).length > 0 &&
      Object.entries(expectedMap).every(([left, right]) => selectedMap[left] === right);
    return allMatched ? 1 : 0;
  }

  async function handleSubmit() {
    if (!studentId || grade !== 3) return;
    setError(null);
    setSubmitting(true);
    try {
      const correctAnswers = grade3EnglishActivities.reduce((count, activity) => count + getActivityMark(activity), 0);
      const session = await startExamSession(studentId, grade3EnglishActivities.length);
      const finalResult = await completeExamSession(
        session.exam_session_id,
        correctAnswers,
        subjectId ?? undefined,
        grade3EnglishActivities.length
      );
      setResult(finalResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit aptitude test");
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = grade3EnglishActivities.reduce((count, activity) => {
    if (activity.type === "mcq") return count + (mcqAnswers[activity.id] ? 1 : 0);
    if (activity.type === "number_rows") {
      const selections = matchAnswers[activity.id] || {};
      return count + (Object.keys(selections).length === (activity.numberRows || []).length ? 1 : 0);
    }
    if (activity.type === "image_rows") {
      const selections = matchAnswers[activity.id] || {};
      return count + (Object.keys(selections).length === (activity.imageRows || []).length ? 1 : 0);
    }
    const selections = matchAnswers[activity.id] || {};
    return count + (Object.keys(selections).length === (activity.leftItems || []).length ? 1 : 0);
  }, 0);

  function isActivityComplete(activity: (typeof grade3EnglishActivities)[number]): boolean {
    if (activity.type === "mcq") return Boolean(mcqAnswers[activity.id]);
    if (activity.type === "number_rows") {
      const selections = matchAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.numberRows || []).length;
    }
    if (activity.type === "image_rows") {
      const selections = matchAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.imageRows || []).length;
    }
    const selections = matchAnswers[activity.id] || {};
    return Object.keys(selections).length === (activity.leftItems || []).length;
  }

  useEffect(() => {
    const current = grade3EnglishActivities[currentActivityIndex];
    if (!current || !isActivityComplete(current)) return;
    if (currentActivityIndex >= grade3EnglishActivities.length - 1) return;
    setCurrentActivityIndex((prev) => Math.min(prev + 1, grade3EnglishActivities.length - 1));
  }, [currentActivityIndex, mcqAnswers, matchAnswers]);

  function assignActiveChoice(activityId: number, key: string) {
    const current = activeChoice[activityId];
    if (!current) return;
    setMatchAnswers((prev) => ({
      ...prev,
      [activityId]: {
        ...(prev[activityId] || {}),
        [key]: current
      }
    }));
    setActiveChoice((prev) => ({ ...prev, [activityId]: null }));
  }

  const uiLang: AptitudeUiLang = "english";
  const answeredLine = playZoneFinishedLine(answeredCount, grade3EnglishActivities.length, uiLang);

  return (
    <main className={playZoneMainClassNames(uiLang)}>
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">{playZoneEyebrow("english", uiLang)}</p>
          <h1 className="title dashboard-title kid-aptitude-title">{playZoneTitle(3, "english", uiLang)}</h1>
          <p className="kid-aptitude-kicker">{playZoneKicker("english", uiLang)}</p>
          <p className="subtitle kid-aptitude-subtitle">
            {playZoneSubtitle(studentName, grade3EnglishActivities.length, uiLang)}
          </p>
        </div>
        <div className="dashboard-topbar-actions">
          <Link href={`/dashboard/students/${studentId}`} className="btn btn-secondary">
            Back to Student Profile
          </Link>
        </div>
      </header>

      <section className="dashboard-content dashboard-content-single">
        <section className="dashboard-panel dashboard-main-panel">
          {error ? <p className="error-text">{error}</p> : null}

          {result ? (
            <section className="dashboard-item kid-result-card">
              <h2 className="dashboard-panel-title kid-result-title">{playZoneDoneTitle(uiLang)}</h2>
              <p className="student-meta">
                Score: {result.correct_answers}/{result.total_activities} ({result.score_percent}%)
              </p>
              <p className="student-meta">Eligible level: {result.eligible_level}</p>
              <p className="student-meta">Unlocked levels: {result.eligible_levels.join(", ")}</p>
              <div className="section-top">
                <Link href={`/dashboard/students/${studentId}`} className="btn">
                  Continue to Student Dashboard
                </Link>
              </div>
            </section>
          ) : null}

          {!result && grade === 3 ? (
            <article className="dashboard-item subject-item kid-aptitude-card">
              <div className="subject-item-header kid-aptitude-card-header">
                <span className="kid-activity-badge" title="Current step">
                  <span className="kid-activity-badge-emoji" aria-hidden>
                    ★
                  </span>
                  {playZoneStepBadge(currentActivityIndex, grade3EnglishActivities.length, uiLang)}
                </span>
              </div>
              <p className="student-meta kid-aptitude-answered-line section-top">{answeredLine}</p>

              <div className="students-grid section-top">
                {(() => {
                  const activity = grade3EnglishActivities[currentActivityIndex];
                  if (!activity) return null;
                  return (
                    <div key={activity.id}>
                      <p className="student-meta aptitude-activity-prompt kid-aptitude-prompt">{activity.prompt}</p>

                      {activity.type === "image_rows" ? (
                        <div className="number-rows-grid section-top">
                          <div className="choice-pool">
                            {Array.from(new Set((activity.imageRows || []).flatMap((row) => row.options))).map((word) => {
                              const selected = activeChoice[activity.id] === word;
                              return (
                                <button
                                  key={`img-pool-${word}`}
                                  type="button"
                                  className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                                  onClick={() =>
                                    setActiveChoice((prev) => ({
                                      ...prev,
                                      [activity.id]: selected ? null : word
                                    }))
                                  }
                                >
                                  {word}
                                </button>
                              );
                            })}
                          </div>
                          <p className="student-meta">Tap a word above, then tap the matching picture.</p>
                          {(activity.imageRows || []).map((row) => (
                            <div key={row.key} className="number-row-card">
                              <button type="button" className="number-badge" onClick={() => assignActiveChoice(activity.id, row.key)}>
                                <img src={row.image} alt={row.key} className="number-badge-image" />
                              </button>
                              <button
                                type="button"
                                className={`match-target ${matchAnswers[activity.id]?.[row.key] ? "match-target-filled" : ""}`}
                                onClick={() => assignActiveChoice(activity.id, row.key)}
                              >
                                {matchAnswers[activity.id]?.[row.key] || "Tap to assign word"}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : activity.type === "number_rows" ? (
                        <div className="number-rows-grid section-top">
                          <div className="choice-pool">
                            {Array.from(new Set((activity.numberRows || []).flatMap((row) => row.options))).map((word) => {
                              const selected = activeChoice[activity.id] === word;
                              return (
                                <button
                                  key={`num-pool-${word}`}
                                  type="button"
                                  className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                                  onClick={() =>
                                    setActiveChoice((prev) => ({
                                      ...prev,
                                      [activity.id]: selected ? null : word
                                    }))
                                  }
                                >
                                  {word}
                                </button>
                              );
                            })}
                          </div>
                          <p className="student-meta">Tap a word above, then tap the matching number card.</p>
                          {(activity.numberRows || []).map((row) => (
                            <div key={row.key} className="number-row-card">
                              <button type="button" className="number-badge" onClick={() => assignActiveChoice(activity.id, row.key)}>
                                {row.number}
                              </button>
                              <button
                                type="button"
                                className={`match-target ${matchAnswers[activity.id]?.[row.key] ? "match-target-filled" : ""}`}
                                onClick={() => assignActiveChoice(activity.id, row.key)}
                              >
                                {matchAnswers[activity.id]?.[row.key] || "Tap to assign word"}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : activity.type === "mcq" ? (
                        <div className="aptitude-options section-top">
                          {(activity.options || []).map((option) => (
                            <label key={option} className="aptitude-option">
                              <input
                                type="radio"
                                name={`activity-${activity.id}`}
                                checked={mcqAnswers[activity.id] === option}
                                onChange={() =>
                                  setMcqAnswers((prev) => ({
                                    ...prev,
                                    [activity.id]: option
                                  }))
                                }
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : activity.type === "match_letters" ? (
                        <div className="match-grid section-top">
                          <div className="choice-pool">
                            {(activity.rightItems || []).map((right) => {
                              const selected = activeChoice[activity.id] === right;
                              return (
                                <button
                                  key={`pool-${right}`}
                                  type="button"
                                  className={`letter-choice ${selected ? "letter-choice-selected" : ""}`}
                                  onClick={() =>
                                    setActiveChoice((prev) => ({
                                      ...prev,
                                      [activity.id]: selected ? null : right
                                    }))
                                  }
                                >
                                  {right}
                                </button>
                              );
                            })}
                          </div>
                          <p className="student-meta">Tap a choice above, then tap the matching left word.</p>
                          {(activity.leftItems || []).map((left) => (
                            <div key={left} className="match-row">
                              <span className="match-left">{left}</span>
                              <span className="match-arrow">→</span>
                              <button
                                type="button"
                                className={`match-target ${matchAnswers[activity.id]?.[left] ? "match-target-filled" : ""}`}
                                onClick={() => assignActiveChoice(activity.id, left)}
                              >
                                {matchAnswers[activity.id]?.[left] || "Tap to assign"}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>

              {(() => {
                const activity = grade3EnglishActivities[currentActivityIndex];
                if (!activity || !isActivityComplete(activity)) return null;
                if (currentActivityIndex >= grade3EnglishActivities.length - 1) return null;
                return (
                  <button
                    type="button"
                    className="btn btn-secondary section-top"
                    onClick={() => setCurrentActivityIndex((prev) => Math.min(prev + 1, grade3EnglishActivities.length - 1))}
                  >
                    Next Activity
                  </button>
                );
              })()}

              {answeredCount === grade3EnglishActivities.length ? (
                <button type="button" className="btn kid-submit-btn section-top" onClick={handleSubmit} disabled={submitting} aria-busy={submitting}>
                  {playZoneSubmitLabel(submitting, uiLang)}
                </button>
              ) : null}
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}
