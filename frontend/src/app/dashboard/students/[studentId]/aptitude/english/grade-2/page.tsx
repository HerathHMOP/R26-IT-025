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
import { grade2EnglishActivities } from "@/lib/grade2EnglishAptitude";

export default function Grade2EnglishAptitudePage() {
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
        if (dashboard.student.grade !== 2) {
          setError("This aptitude test is currently available only for Grade 2 students.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }

    loadStudent();
  }, [router, studentId]);

  function getActivityMark(activity: (typeof grade2EnglishActivities)[number]): 0 | 1 {
    if (activity.type === "mcq") {
      return mcqAnswers[activity.id] === activity.answer ? 1 : 0;
    }
    if (activity.type === "color_rows") {
      const selectedMap = matchAnswers[activity.id] || {};
      const allRowsCorrect =
        (activity.colorRows || []).length > 0 &&
        (activity.colorRows || []).every((row) => selectedMap[row.key] === row.answer);
      return allRowsCorrect ? 1 : 0;
    }
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
    if (activity.type === "select_images") {
      const selectedMap = matchAnswers[activity.id] || {};
      const selectedKeys = Object.keys(selectedMap).filter((key) => selectedMap[key] === "selected");
      const correctKeys = activity.correctImageKeys || [];
      const allCorrectSelected = correctKeys.every((key) => selectedKeys.includes(key));
      const noWrongSelected = selectedKeys.every((key) => correctKeys.includes(key));
      return allCorrectSelected && noWrongSelected ? 1 : 0;
    }
    if (activity.type === "count_rows") {
      const selectedMap = matchAnswers[activity.id] || {};
      const allRowsCorrect =
        (activity.countRows || []).length > 0 &&
        (activity.countRows || []).every((row) => Number(selectedMap[row.key]) === row.answerCount);
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
    if (!studentId || grade !== 2) return;
    setError(null);
    setSubmitting(true);
    try {
      const correctAnswers = grade2EnglishActivities.reduce((count, activity) => count + getActivityMark(activity), 0);

      const session = await startExamSession(studentId, grade2EnglishActivities.length);
      const finalResult = await completeExamSession(
        session.exam_session_id,
        correctAnswers,
        subjectId ?? undefined,
        grade2EnglishActivities.length
      );
      setResult(finalResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit aptitude test");
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = grade2EnglishActivities.reduce((count, activity) => {
    if (activity.type === "mcq") {
      return count + (mcqAnswers[activity.id] ? 1 : 0);
    }
    if (activity.type === "color_rows") {
      const selections = matchAnswers[activity.id] || {};
      const required = (activity.colorRows || []).length;
      return count + (Object.keys(selections).length === required ? 1 : 0);
    }
    if (activity.type === "number_rows") {
      const selections = matchAnswers[activity.id] || {};
      const required = (activity.numberRows || []).length;
      return count + (Object.keys(selections).length === required ? 1 : 0);
    }
    if (activity.type === "image_rows") {
      const selections = matchAnswers[activity.id] || {};
      const required = (activity.imageRows || []).length;
      return count + (Object.keys(selections).length === required ? 1 : 0);
    }
    if (activity.type === "count_rows") {
      const selections = matchAnswers[activity.id] || {};
      const required = (activity.countRows || []).length;
      return count + (Object.keys(selections).length === required ? 1 : 0);
    }
    if (activity.type === "select_images") {
      const selections = matchAnswers[activity.id] || {};
      const required = (activity.correctImageKeys || []).length;
      const selectedCount = Object.values(selections).filter((v) => v === "selected").length;
      return count + (selectedCount === required ? 1 : 0);
    }
    const selections = matchAnswers[activity.id] || {};
    const required = activity.leftItems?.length || 0;
    return count + (Object.keys(selections).length === required ? 1 : 0);
  }, 0);

  function isActivityComplete(activity: (typeof grade2EnglishActivities)[number]): boolean {
    if (activity.type === "mcq") {
      return Boolean(mcqAnswers[activity.id]);
    }
    if (activity.type === "color_rows") {
      const selections = matchAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.colorRows || []).length;
    }
    if (activity.type === "number_rows") {
      const selections = matchAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.numberRows || []).length;
    }
    if (activity.type === "image_rows") {
      const selections = matchAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.imageRows || []).length;
    }
    if (activity.type === "count_rows") {
      const selections = matchAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.countRows || []).length;
    }
    if (activity.type === "select_images") {
      const selections = matchAnswers[activity.id] || {};
      const required = (activity.correctImageKeys || []).length;
      const selectedCount = Object.values(selections).filter((v) => v === "selected").length;
      return selectedCount === required;
    }
    const selections = matchAnswers[activity.id] || {};
    return Object.keys(selections).length === (activity.leftItems || []).length;
  }

  useEffect(() => {
    const current = grade2EnglishActivities[currentActivityIndex];
    if (!current) return;
    if (!isActivityComplete(current)) return;
    if (currentActivityIndex >= grade2EnglishActivities.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentActivityIndex((prev) => Math.min(prev + 1, grade2EnglishActivities.length - 1));
    }, 350);
    return () => clearTimeout(timer);
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
  const answeredLine = playZoneFinishedLine(answeredCount, grade2EnglishActivities.length, uiLang);

  return (
    <main className={playZoneMainClassNames(uiLang)}>
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">{playZoneEyebrow("english", uiLang)}</p>
          <h1 className="title dashboard-title kid-aptitude-title">{playZoneTitle(2, "english", uiLang)}</h1>
          <p className="kid-aptitude-kicker">{playZoneKicker("english", uiLang)}</p>
          <p className="subtitle kid-aptitude-subtitle">
            {playZoneSubtitle(studentName, grade2EnglishActivities.length, uiLang)}
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

          {!result && grade === 2 ? (
            <article className="dashboard-item subject-item kid-aptitude-card">
              <div className="subject-item-header kid-aptitude-card-header">
                <span className="kid-activity-badge" title="Current step">
                  <span className="kid-activity-badge-emoji" aria-hidden>
                    ★
                  </span>
                  {playZoneStepBadge(currentActivityIndex, grade2EnglishActivities.length, uiLang)}
                </span>
              </div>
              <p className="student-meta kid-aptitude-answered-line section-top">{answeredLine}</p>

              <div className="students-grid section-top">
                {(() => {
                  const activity = grade2EnglishActivities[currentActivityIndex];
                  if (!activity) return null;
                  return (
                    <div key={activity.id}>
                    <p className="student-meta aptitude-activity-prompt kid-aptitude-prompt">{activity.prompt}</p>
                    {activity.image ? (
                      <img
                        src={activity.image}
                        alt={`Activity ${activity.id}`}
                        className="aptitude-image section-top"
                      />
                    ) : null}
                    {activity.type === "mcq" ? (
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
                    ) : activity.type === "color_rows" ? (
                      <div className="color-rows-grid section-top">
                        {(activity.colorRows || []).map((row) => (
                          <div key={row.key} className="color-row-card">
                            <img src={row.image} alt="Color star" className="color-row-star" />
                            <div className="color-options">
                              {row.options.map((option) => {
                                const selected = matchAnswers[activity.id]?.[row.key] === option;
                                return (
                                  <button
                                    key={`${row.key}-${option}`}
                                    type="button"
                                    className={`color-option-btn ${selected ? "color-option-btn-selected" : ""}`}
                                    onClick={() =>
                                      setMatchAnswers((prev) => ({
                                        ...prev,
                                        [activity.id]: {
                                          ...(prev[activity.id] || {}),
                                          [row.key]: option
                                        }
                                      }))
                                    }
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
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
                              {row.image ? (
                                <img src={row.image} alt={`Number ${row.number}`} className="number-badge-image" />
                              ) : (
                                row.number
                              )}
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
                    ) : activity.type === "image_rows" ? (
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
                        <p className="student-meta">Tap a word above, then tap the matching school picture.</p>
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
                    ) : activity.type === "count_rows" ? (
                      <div className="number-rows-grid section-top">
                        {(activity.countRows || []).map((row) => (
                          <div key={row.key} className="number-row-card">
                            <div className="count-label">{row.label}</div>
                            <div className="count-options">
                              {[1, 2, 3, 4, 5].map((count) => {
                                const selected = Number(matchAnswers[activity.id]?.[row.key]) === count;
                                return (
                                  <button
                                    key={`${row.key}-${count}`}
                                    type="button"
                                    className={`count-group-btn ${selected ? "count-group-btn-selected" : ""}`}
                                    onClick={() =>
                                      setMatchAnswers((prev) => ({
                                        ...prev,
                                        [activity.id]: {
                                          ...(prev[activity.id] || {}),
                                          [row.key]: String(count)
                                        }
                                      }))
                                    }
                                  >
                                    {Array.from({ length: count }).map((_, idx) => (
                                      <span key={idx} className="count-dot">🙂</span>
                                    ))}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : activity.type === "select_images" ? (
                      <div className="select-images-grid section-top">
                        {(activity.selectImageRows || []).map((item) => {
                          const selected = matchAnswers[activity.id]?.[item.key] === "selected";
                          return (
                            <button
                              key={item.key}
                              type="button"
                              className={`select-image-card ${selected ? "select-image-card-selected" : ""}`}
                              onClick={() =>
                                setMatchAnswers((prev) => ({
                                  ...prev,
                                  [activity.id]: {
                                    ...(prev[activity.id] || {}),
                                    [item.key]: selected ? "" : "selected"
                                  }
                                }))
                              }
                            >
                              <img src={item.image} alt={item.label} className="select-image-thumb" />
                              <span className="picture-label">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="match-grid section-top">
                        {activity.type === "match_letters" ? (
                          <>
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
                            <p className="student-meta">Tap a choice above, then tap the matching left letter.</p>
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
                          </>
                        ) : null}

                        {activity.type === "match_pictures"
                          ? (activity.leftItems || []).map((left) => (
                              <div key={left} className="match-row">
                                <span className="match-left">{left}</span>
                                <span className="match-arrow">→</span>
                              <div className="letter-picture-options">
                                {(activity.pictureOptions || []).map((pic) => {
                                  const selected = matchAnswers[activity.id]?.[left] === pic.label;
                                  return (
                                    <button
                                      key={`${left}-${pic.label}`}
                                      type="button"
                                      className={`picture-choice ${selected ? "picture-choice-selected" : ""}`}
                                      onClick={() =>
                                        setMatchAnswers((prev) => ({
                                          ...prev,
                                          [activity.id]: {
                                            ...(prev[activity.id] || {}),
                                            [left]: pic.label
                                          }
                                        }))
                                      }
                                    >
                                      <img src={pic.image} alt={pic.label} className="picture-choice-thumb" />
                                    </button>
                                  );
                                })}
                              </div>
                              </div>
                            ))
                          : null}
                      </div>
                    )}
                    </div>
                  );
                })()}
              </div>

              {answeredCount === grade2EnglishActivities.length ? (
                <button
                  type="button"
                  className="btn kid-submit-btn section-top"
                  onClick={handleSubmit}
                  disabled={submitting}
                  aria-busy={submitting}
                >
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
