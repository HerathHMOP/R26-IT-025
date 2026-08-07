"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { getGrade3MathsActivities } from "@/lib/grade3MathsAptitude";

export default function Grade3MathsAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const selectedLanguage = searchParams.get("lang") === "sinhala" ? "sinhala" : "english";
  const uiLang: AptitudeUiLang = selectedLanguage === "sinhala" ? "sinhala" : "english";
  const activities = useMemo(() => getGrade3MathsActivities(selectedLanguage), [selectedLanguage]);

  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompleteExamSessionResponse | null>(null);
  const [matchAnswers, setMatchAnswers] = useState<Record<number, Record<string, string>>>({});
  const [activeChoice, setActiveChoice] = useState<Record<number, string | null>>({});

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
          dashboard.subjects.find((subject: { id: number; code: string }) => subject.code === "maths")?.id ?? null
        );
        if (dashboard.student.grade !== 3) {
          setError("This aptitude test is currently available only for Grade 3 students.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }

    loadStudent();
  }, [router, studentId]);

  function getActivityMark(activity: (typeof activities)[number]): 0 | 1 {
    if (activity.type !== "match_letters" && activity.type !== "match_pictures" && activity.type !== "match_shapes") {
      return 0;
    }
    const selectedMap = matchAnswers[activity.id] || {};
    const expectedMap = activity.type === "match_shapes" ? activity.matchShapes?.answerMap || {} : activity.matchAnswerMap || {};
    const allMatched =
      Object.keys(expectedMap).length > 0 &&
      Object.entries(expectedMap).every(([left, right]) => selectedMap[left] === right);
    return allMatched ? 1 : 0;
  }

  function isActivityComplete(activity: (typeof activities)[number]): boolean {
    if (activity.type !== "match_letters" && activity.type !== "match_pictures" && activity.type !== "match_shapes") {
      return false;
    }
    const selectedMap = matchAnswers[activity.id] || {};
    if (activity.type === "match_shapes") {
      return Object.keys(selectedMap).length === (activity.matchShapes?.leftShapes || []).length;
    }
    return Object.keys(selectedMap).length === (activity.leftItems || []).length;
  }

  async function handleSubmit() {
    if (!studentId || grade !== 3) return;
    setError(null);
    setSubmitting(true);
    try {
      const correctAnswers = activities.reduce((sum, activity) => sum + getActivityMark(activity), 0);
      const session = await startExamSession(studentId, activities.length);
      const finalResult = await completeExamSession(
        session.exam_session_id,
        correctAnswers,
        subjectId ?? undefined,
        activities.length
      );
      setResult(finalResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit aptitude test");
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = activities.reduce((sum, activity) => sum + (isActivityComplete(activity) ? 1 : 0), 0);

  function assignActiveChoice(activityId: number, leftKey: string) {
    const current = activeChoice[activityId];
    if (!current) return;
    setMatchAnswers((prev) => ({
      ...prev,
      [activityId]: {
        ...(prev[activityId] || {}),
        [leftKey]: current
      }
    }));
    setActiveChoice((prev) => ({ ...prev, [activityId]: null }));
  }

  useEffect(() => {
    const current = activities[currentActivityIndex];
    if (!current || !isActivityComplete(current)) return;
    if (currentActivityIndex >= activities.length - 1) return;
    setCurrentActivityIndex((prev) => Math.min(prev + 1, activities.length - 1));
  }, [currentActivityIndex, activities, matchAnswers]);

  const activity = activities[currentActivityIndex];
  const answeredLine = playZoneFinishedLine(answeredCount, activities.length, uiLang);

  return (
    <main className={playZoneMainClassNames(uiLang)}>
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">{playZoneEyebrow("maths", uiLang)}</p>
          <h1 className="title dashboard-title kid-aptitude-title">{playZoneTitle(3, "maths", uiLang)}</h1>
          <p className="kid-aptitude-kicker">{playZoneKicker("maths", uiLang)}</p>
          <p className="subtitle kid-aptitude-subtitle">{playZoneSubtitle(studentName, activities.length, uiLang)}</p>
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

          {!result && grade === 3 && activity ? (
            <article className="dashboard-item subject-item kid-aptitude-card">
              <div className="subject-item-header kid-aptitude-card-header">
                <span className="kid-activity-badge" title={selectedLanguage === "sinhala" ? "වත්මන් පියවර" : "Current step"}>
                  <span className="kid-activity-badge-emoji" aria-hidden>
                    ★
                  </span>
                  {playZoneStepBadge(currentActivityIndex, activities.length, uiLang)}
                </span>
              </div>
              <p className="student-meta kid-aptitude-answered-line section-top">{answeredLine}</p>
              <p className="student-meta aptitude-activity-prompt kid-aptitude-prompt">{activity.prompt}</p>

              {activity.type === "match_letters" ? (
                <div className={`match-grid section-top ${activity.id === 7 ? "grade3-sentence-match" : ""}`}>
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
                  <p className="student-meta">Tap a number word above, then tap the matching number.</p>
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

              {activity.type === "match_pictures" ? (
                <div className="match-grid section-top grade3-picture-match-grid">
                  <div className="choice-pool">
                    {(activity.rightItems || []).map((choice) => {
                      const selected = activeChoice[activity.id] === choice;
                      return (
                        <button
                          key={`pool-${choice}`}
                          type="button"
                          className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                          onClick={() =>
                            setActiveChoice((prev) => ({
                              ...prev,
                              [activity.id]: selected ? null : choice
                            }))
                          }
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                  <p className="student-meta">
                    {((activity.rightItems || []).every((item) => /^\d+$/.test(item)))
                      ? "Tap a number, then tap the matching image row."
                      : "Tap an option, then tap the matching image row."}
                  </p>
                  {(activity.leftItems || []).map((leftKey) => {
                    const picture = (activity.pictureOptions || []).find((item) => item.label === leftKey);
                    return (
                    <div key={leftKey} className="match-row">
                      <span className="match-left">
                        {picture ? <img src={picture.image} alt={picture.label} className="aptitude-image grade3-match-thumb" /> : leftKey}
                      </span>
                      <span className="match-arrow">→</span>
                      <button
                        type="button"
                        className={`match-target ${matchAnswers[activity.id]?.[leftKey] ? "match-target-filled" : ""}`}
                        onClick={() => assignActiveChoice(activity.id, leftKey)}
                      >
                        {matchAnswers[activity.id]?.[leftKey] || "Tap to assign"}
                      </button>
                    </div>
                  )})}
                </div>
              ) : null}

              {activity.type === "match_shapes" ? (
                <div className="match-grid section-top">
                  <div className="choice-pool">
                    {(activity.matchShapes?.rightShapes || []).map((choice) => {
                      const selected = activeChoice[activity.id] === choice.key;
                      return (
                        <button
                          key={choice.key}
                          type="button"
                          className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                          onClick={() =>
                            setActiveChoice((prev) => ({
                              ...prev,
                              [activity.id]: selected ? null : choice.key
                            }))
                          }
                        >
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="student-meta">Tap a shape name, then tap the matching shape row.</p>
                  {(activity.matchShapes?.leftShapes || []).map((left) => (
                    <div key={left.key} className="match-row">
                      <span className="match-left">
                        <span className={`shape-chip shape-${left.shape}`} />
                      </span>
                      <span className="match-arrow">→</span>
                      <button
                        type="button"
                        className={`match-target ${matchAnswers[activity.id]?.[left.key] ? "match-target-filled" : ""}`}
                        onClick={() => assignActiveChoice(activity.id, left.key)}
                      >
                        {activity.matchShapes?.rightShapes.find((item) => item.key === matchAnswers[activity.id]?.[left.key])?.label ||
                          "Tap to assign"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {answeredCount === activities.length ? (
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
