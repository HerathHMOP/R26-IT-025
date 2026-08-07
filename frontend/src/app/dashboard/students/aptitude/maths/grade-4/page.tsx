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
import type {
  Grade4MathsActivity,
  ImageRow,
  PlaceValueRow,
  AdditionRaceRow,
  SubtractionRaceRow,
  MultiplicationMatchRow,
  MoneyActivityRow,
  PatternCompletionRow,
  WeightCompareRow,
  ShapesHuntRow,
  TimeClockRow
} from "@/lib/grade4MathsAptitude";
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
import { getGrade4MathsActivities } from "@/lib/grade4MathsAptitude";

export default function Grade4MathsAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const selectedLanguage = searchParams.get("lang") === "sinhala" ? "sinhala" : "english";
  const uiLang: AptitudeUiLang = selectedLanguage === "sinhala" ? "sinhala" : "english";
  const activities = useMemo<Grade4MathsActivity[]>(() => getGrade4MathsActivities(selectedLanguage), [selectedLanguage]);

  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompleteExamSessionResponse | null>(null);
  const [matchAnswers, setMatchAnswers] = useState<Record<number, Record<string, string | number>>>({});
  const [activeChoice, setActiveChoice] = useState<Record<number, number | null>>({});

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
        if (Number(dashboard.student.grade) !== 4) {
          setError("This aptitude test is currently available only for Grade 4 students.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }

    loadStudent();
  }, [router, studentId]);

  function ensureRows<T>(rows: T[] | undefined): T[] {
    return rows ?? ([] as T[]);
  }

  function getActivityMark(activity: Grade4MathsActivity): 0 | 1 {
    if (activity.type === "image_rows") {
      const selectedMap = matchAnswers[activity.id] || {};
      const imageRows = ensureRows<ImageRow>(activity.imageRows);
      const allRowsCorrect = imageRows.length > 0 && imageRows.every((row) => selectedMap[row.key] === row.answer);
      return allRowsCorrect ? 1 : 0;
    }
    if (activity.type === "place_value") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<PlaceValueRow>(activity.placeValueRows);
      const allCorrect =
        rows.length > 0 &&
        rows.every(
          (row) =>
            m[`${row.key}-h`] === row.hundreds && m[`${row.key}-t`] === row.tens && m[`${row.key}-o`] === row.ones
        );
      return allCorrect ? 1 : 0;
    }
    if (activity.type === "addition_race") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<AdditionRaceRow>(activity.additionRaceRows);
      const allCorrect =
        rows.length > 0 && rows.every((row) => m[row.key] === row.answer);
      return allCorrect ? 1 : 0;
    }
    if (activity.type === "subtraction_race") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<SubtractionRaceRow>(activity.subtractionRaceRows);
      const allCorrect =
        rows.length > 0 && rows.every((row) => m[row.key] === row.answer);
      return allCorrect ? 1 : 0;
    }
    if (activity.type === "multiplication_match") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<MultiplicationMatchRow>(activity.multiplicationMatchRows);
      const allCorrect =
        rows.length > 0 && rows.every((row) => m[row.key] === row.answer);
      return allCorrect ? 1 : 0;
    }
    if (activity.type === "money_activity") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<MoneyActivityRow>(activity.moneyActivityRows);
      const allCorrect =
        rows.length > 0 && rows.every((row) => m[row.key] === row.answer);
      return allCorrect ? 1 : 0;
    }
    if (activity.type === "pattern_completion") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<PatternCompletionRow>(activity.patternCompletionRows);
      const ok =
        rows.length > 0 &&
        rows.every((row) => {
          if (m[`${row.key}-1`] !== row.answer1) return false;
          if (row.blankCount === 2) {
            return row.answer2 !== undefined && m[`${row.key}-2`] === row.answer2;
          }
          return true;
        });
      return ok ? 1 : 0;
    }
    if (activity.type === "weight_compare") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<WeightCompareRow>(activity.weightCompareRows);
      const ok =
        rows.length > 0 && rows.every((row) => m[row.key] === row.heavier);
      return ok ? 1 : 0;
    }
    if (activity.type === "shapes_hunt") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<ShapesHuntRow>(activity.shapesHuntRows);
      const ok = rows.length > 0 && rows.every((row) => m[row.key] === row.answer);
      return ok ? 1 : 0;
    }
    if (activity.type === "time_clock") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<TimeClockRow>(activity.timeClockRows);
      const ok = rows.length > 0 && rows.every((row) => m[row.key] === row.answer);
      return ok ? 1 : 0;
    }
    return 0;
  }

  function isActivityComplete(activity: Grade4MathsActivity): boolean {
    if (activity.type === "image_rows") {
      const selections = matchAnswers[activity.id] || {};
      const imageRows = ensureRows<ImageRow>(activity.imageRows);
      return Object.keys(selections).length === imageRows.length;
    }
    if (activity.type === "place_value") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<PlaceValueRow>(activity.placeValueRows);
      if (rows.length === 0) return false;
      return rows.every((row) => {
        const h = m[`${row.key}-h`];
        const t = m[`${row.key}-t`];
        const o = m[`${row.key}-o`];
        return h !== undefined && h !== "" && t !== undefined && t !== "" && o !== undefined && o !== "";
      });
    }
    if (activity.type === "addition_race") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<AdditionRaceRow>(activity.additionRaceRows);
      return rows.length > 0 && rows.every((row) => m[row.key] !== undefined && m[row.key] !== "");
    }
    if (activity.type === "subtraction_race") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<SubtractionRaceRow>(activity.subtractionRaceRows);
      return rows.length > 0 && rows.every((row) => m[row.key] !== undefined && m[row.key] !== "");
    }
    if (activity.type === "multiplication_match") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<MultiplicationMatchRow>(activity.multiplicationMatchRows);
      return rows.length > 0 && rows.every((row) => m[row.key] !== undefined && m[row.key] !== "");
    }
    if (activity.type === "money_activity") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<MoneyActivityRow>(activity.moneyActivityRows);
      return rows.length > 0 && rows.every((row) => m[row.key] !== undefined && m[row.key] !== "");
    }
    if (activity.type === "pattern_completion") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<PatternCompletionRow>(activity.patternCompletionRows);
      return (
        rows.length > 0 &&
        rows.every((row) => {
          const a1 = m[`${row.key}-1`];
          if (a1 === undefined || a1 === "") return false;
          if (row.blankCount === 2) {
            const a2 = m[`${row.key}-2`];
            return a2 !== undefined && a2 !== "";
          }
          return true;
        })
      );
    }
    if (activity.type === "weight_compare") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<WeightCompareRow>(activity.weightCompareRows);
      return rows.length > 0 && rows.every((row) => m[row.key] === "left" || m[row.key] === "right");
    }
    if (activity.type === "shapes_hunt") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<ShapesHuntRow>(activity.shapesHuntRows);
      return rows.length > 0 && rows.every((row) => m[row.key] !== undefined && m[row.key] !== "");
    }
    if (activity.type === "time_clock") {
      const m = matchAnswers[activity.id] || {};
      const rows = ensureRows<TimeClockRow>(activity.timeClockRows);
      return rows.length > 0 && rows.every((row) => m[row.key] !== undefined && m[row.key] !== "");
    }
    return false;
  }

  async function handleSubmit() {
    if (!studentId || Number(grade) !== 4) return;
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

  function assignActiveChoice(activityId: number, key: string) {
    const current = activeChoice[activityId];
    if (current === null || current === undefined) return;
    setMatchAnswers((prev) => ({
      ...prev,
      [activityId]: {
        ...(prev[activityId] || {}),
        [key]: current
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
  const imageRows = activity?.type === "image_rows" ? ensureRows<ImageRow>(activity.imageRows) : [];
  const placeValueRows = activity?.type === "place_value" ? ensureRows<PlaceValueRow>(activity.placeValueRows) : [];
  const additionRaceRows = activity?.type === "addition_race" ? ensureRows<AdditionRaceRow>(activity.additionRaceRows) : [];
  const subtractionRaceRows = activity?.type === "subtraction_race" ? ensureRows<SubtractionRaceRow>(activity.subtractionRaceRows) : [];
  const multiplicationMatchRows =
    activity?.type === "multiplication_match" ? ensureRows<MultiplicationMatchRow>(activity.multiplicationMatchRows) : [];
  const moneyActivityRows = activity?.type === "money_activity" ? ensureRows<MoneyActivityRow>(activity.moneyActivityRows) : [];
  const patternCompletionRows =
    activity?.type === "pattern_completion" ? ensureRows<PatternCompletionRow>(activity.patternCompletionRows) : [];
  const weightCompareRows =
    activity?.type === "weight_compare" ? ensureRows<WeightCompareRow>(activity.weightCompareRows) : [];
  const shapesHuntRows =
    activity?.type === "shapes_hunt" ? ensureRows<ShapesHuntRow>(activity.shapesHuntRows) : [];
  const timeClockRows = activity?.type === "time_clock" ? ensureRows<TimeClockRow>(activity.timeClockRows) : [];
  const raceAnswerRows =
    activity?.type === "addition_race"
      ? additionRaceRows
      : activity?.type === "subtraction_race"
        ? subtractionRaceRows
        : multiplicationMatchRows;

  const poolHint =
    selectedLanguage === "sinhala"
      ? "ඉහළ අංකයක් තෝරා, ඉන්පසු ගැලපෙන පේළිය මත ටැප් කරන්න."
      : "Tap a number above, then tap the matching row.";

  const weightTapHint =
    selectedLanguage === "sinhala"
      ? "වැඩි බර ඇති චිත්රය තට්ටු කරන්න."
      : "Tap the picture of the heavier object.";

  const shapesTapHint =
    selectedLanguage === "sinhala"
      ? "වස්තුවට ගැලපෙන හැඩ සලකුණ තෝරන්න."
      : "Tap the shape that best matches the picture.";

  const timeClockTapHint =
    selectedLanguage === "sinhala"
      ? "සඳහන් වේලාව පෙන්වන ඔරලෝසුව තට්ටු කරන්න."
      : "Tap the clock that shows the time in the instruction.";

  function setPlaceValueDigit(activityId: number, rowKey: string, place: "h" | "t" | "o", raw: string) {
    const digit = raw.replace(/\D/g, "").slice(0, 1);
    setMatchAnswers((prev) => ({
      ...prev,
      [activityId]: {
        ...(prev[activityId] || {}),
        [`${rowKey}-${place}`]: digit
      }
    }));
  }

  const answeredLine = playZoneFinishedLine(answeredCount, activities.length, uiLang);

  return (
    <main className={playZoneMainClassNames(uiLang)}>
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">{playZoneEyebrow("maths", uiLang)}</p>
          <h1 className="title dashboard-title kid-aptitude-title">{playZoneTitle(4, "maths", uiLang)}</h1>
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
              <p className="student-meta">Eligible level: {result.eligible_level ?? "—"}</p>
              <p className="student-meta">Unlocked levels: {result.eligible_levels.join(", ") || "—"}</p>
              <div className="section-top">
                <Link href={`/dashboard/students/${studentId}`} className="btn">
                  Continue to Student Dashboard
                </Link>
              </div>
            </section>
          ) : null}

          {!result && Number(grade) === 4 && activity ? (
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

              <p className="student-meta aptitude-activity-prompt kid-aptitude-prompt" style={{ whiteSpace: "pre-line" }}>
                {activity.prompt}
              </p>

              {activity.type === "image_rows" ? (
                <div className="number-rows-grid section-top">
                  <div className="choice-pool">
                    {Array.from(new Set(imageRows.flatMap((row) => row.options))).map((num: number) => {
                      const selected = activeChoice[activity.id] === num;
                      return (
                        <button
                          key={`g4-pool-${num}`}
                          type="button"
                          className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                          onClick={() =>
                            setActiveChoice((prev) => ({
                              ...prev,
                              [activity.id]: selected ? null : num
                            }))
                          }
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <p className="student-meta">{poolHint}</p>
                  {imageRows.map((row) => (
                    <div key={row.key} className="number-row-card">
                      {row.label ? (
                        <div
                          className="match-left"
                          style={row.key === "g4m1-emoji" ? { fontSize: "1.75rem", lineHeight: 1.4 } : undefined}
                        >
                          {row.label}
                        </div>
                      ) : null}
                      <button type="button" className="number-badge" onClick={() => assignActiveChoice(activity.id, row.key)}>
                        {row.key === "g4m1-emoji" ? (
                          <span className="number-badge-image" style={{ display: "inline-block", minWidth: 48, minHeight: 48 }} />
                        ) : (
                          <img src={row.image} alt={row.label || row.key} className="number-badge-image" />
                        )}
                      </button>
                      <button
                        type="button"
                        className={`match-target ${matchAnswers[activity.id]?.[row.key] ? "match-target-filled" : ""}`}
                        onClick={() => assignActiveChoice(activity.id, row.key)}
                      >
                        {matchAnswers[activity.id]?.[row.key] || (selectedLanguage === "sinhala" ? "අංකය තෝරන්න" : "Tap to assign number")}
                      </button>
                    </div>
                  ))}
                </div>
              ) : activity.type === "place_value" ? (
                <div className="aptitude-table-wrap section-top">
                  <table className="aptitude-table place-value-table">
                    <thead>
                      <tr>
                        <th scope="col" className="place-value-table-corner" title="Number / අංකය" />
                        <th scope="col">
                          Hundreds
                          <span className="place-value-th-sub">සියය</span>
                        </th>
                        <th scope="col">
                          Tens
                          <span className="place-value-th-sub">දශක</span>
                        </th>
                        <th scope="col">
                          Ones
                          <span className="place-value-th-sub">ඒකක</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {placeValueRows.map((row) => (
                        <tr key={row.key}>
                          <td className="aptitude-place-value-number">{row.value}</td>
                          <td>
                            <input
                              className="aptitude-place-value-digit"
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              autoComplete="off"
                              aria-label={selectedLanguage === "sinhala" ? `${row.value} සියය` : `${row.value} hundreds digit`}
                              value={matchAnswers[activity.id]?.[`${row.key}-h`] ?? ""}
                              onChange={(e) => setPlaceValueDigit(activity.id, row.key, "h", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="aptitude-place-value-digit"
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              autoComplete="off"
                              aria-label={selectedLanguage === "sinhala" ? `${row.value} දශක` : `${row.value} tens digit`}
                              value={matchAnswers[activity.id]?.[`${row.key}-t`] ?? ""}
                              onChange={(e) => setPlaceValueDigit(activity.id, row.key, "t", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="aptitude-place-value-digit"
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              autoComplete="off"
                              aria-label={selectedLanguage === "sinhala" ? `${row.value} ඒකක` : `${row.value} ones digit`}
                              value={matchAnswers[activity.id]?.[`${row.key}-o`] ?? ""}
                              onChange={(e) => setPlaceValueDigit(activity.id, row.key, "o", e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : activity.type === "addition_race" ||
                activity.type === "subtraction_race" ||
                activity.type === "multiplication_match" ||
                activity.type === "money_activity" ? (
                <div className="aptitude-table-wrap section-top">
                  <table
                    className={`aptitude-table addition-race-table${activity.type === "money_activity" ? " money-activity-table" : ""}`}
                  >
                    <thead>
                      <tr>
                        <th scope="col" className="addition-race-th-problem">
                          {activity.type === "money_activity"
                            ? selectedLanguage === "sinhala"
                              ? "මුදල්"
                              : "Money"
                            : activity.type === "subtraction_race"
                              ? selectedLanguage === "sinhala"
                                ? "අඩු කිරීම"
                                : "Subtract"
                              : activity.type === "multiplication_match"
                                ? selectedLanguage === "sinhala"
                                  ? "ගුණ කිරීම"
                                  : "Multiply"
                                : selectedLanguage === "sinhala"
                                  ? "එකතුව"
                                  : "Sum"}
                        </th>
                        <th scope="col" className="addition-race-th-options">
                          {selectedLanguage === "sinhala" ? "පිළිතුර තෝරන්න" : "Choose answer"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.type === "money_activity"
                        ? moneyActivityRows.map((row) => {
                            const chosen = matchAnswers[activity.id]?.[row.key];
                            return (
                              <tr key={row.key}>
                                <td className="addition-race-problem aptitude-money-expression">{row.expression}</td>
                                <td>
                                  <div className="addition-race-options" role="group" aria-label={row.expression}>
                                    {row.options.map((opt: number) => {
                                      const selected = chosen === opt;
                                      return (
                                        <button
                                          key={`${row.key}-${opt}`}
                                          type="button"
                                          className={`addition-race-option ${selected ? "addition-race-option-selected" : ""}`}
                                          onClick={() =>
                                            setMatchAnswers((prev) => ({
                                              ...prev,
                                              [activity.id]: {
                                                ...(prev[activity.id] || {}),
                                                [row.key]: opt
                                              }
                                            }))
                                          }
                                        >
                                          Rs.{opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : raceAnswerRows.map((row) => {
                            const chosen = matchAnswers[activity.id]?.[row.key];
                            const isSub = activity.type === "subtraction_race";
                            const isMul = activity.type === "multiplication_match";
                            const op = isSub ? "−" : isMul ? "×" : "+";
                            const expr = `${row.a} ${op} ${row.b}`;
                            return (
                              <tr key={row.key}>
                                <td className="addition-race-problem">
                                  {row.a} {op} {row.b}
                                </td>
                                <td>
                                  <div className="addition-race-options" role="group" aria-label={expr}>
                                    {row.options.map((opt: number) => {
                                      const selected = chosen === opt;
                                      return (
                                        <button
                                          key={`${row.key}-${opt}`}
                                          type="button"
                                          className={`addition-race-option ${selected ? "addition-race-option-selected" : ""}`}
                                          onClick={() =>
                                            setMatchAnswers((prev) => ({
                                              ...prev,
                                              [activity.id]: {
                                                ...(prev[activity.id] || {}),
                                                [row.key]: opt
                                              }
                                            }))
                                          }
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                    </tbody>
                  </table>
                </div>
              ) : activity.type === "pattern_completion" ? (
                <div className="pattern-completion-section section-top">
                  {patternCompletionRows.map((row, rowIdx) => {
                    const m = matchAnswers[activity.id] || {};
                    const c1 = m[`${row.key}-1`];
                    const c2 = m[`${row.key}-2`];
                    const firstLabel =
                      selectedLanguage === "sinhala" ? "පළමුව හිස් තැන:" : "First missing:";
                    const secondLabel = selectedLanguage === "sinhala" ? "ඊට පසුව:" : "Then:";
                    return (
                      <div key={row.key} className="pattern-completion-row">
                        <p className="student-meta pattern-completion-row-label">
                          {selectedLanguage === "sinhala" ? `රටාව ${rowIdx + 1}` : `Pattern ${rowIdx + 1}`}
                        </p>
                        <div className="pattern-token-seq" role="img" aria-label="Pattern sequence">
                          {row.shownTokens.map((tok: string, i: number) => (
                            <span key={`${row.key}-t-${i}`} className={/^\d$/.test(tok) ? "pattern-num" : undefined}>
                              {tok}
                            </span>
                          ))}
                          {row.blankCount === 1 ? (
                            <span className="pattern-placeholder" aria-hidden>
                              ?
                            </span>
                          ) : (
                            <>
                              <span className="pattern-placeholder" aria-hidden>
                                ?
                              </span>
                              <span className="pattern-placeholder" aria-hidden>
                                ?
                              </span>
                            </>
                          )}
                        </div>
                        <p className="student-meta pattern-slot-label">{firstLabel}</p>
                        <div className="addition-race-options">
                          {row.options1.map((opt: string) => {
                            const selected = c1 === opt;
                            return (
                              <button
                                key={`${row.key}-1-${opt}`}
                                type="button"
                                className={`addition-race-option ${selected ? "addition-race-option-selected" : ""}`}
                                onClick={() =>
                                  setMatchAnswers((prev) => ({
                                    ...prev,
                                    [activity.id]: {
                                      ...(prev[activity.id] || {}),
                                      [`${row.key}-1`]: opt
                                    }
                                  }))
                                }
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {row.blankCount === 2 && row.options2 ? (
                          <>
                            <p className="student-meta pattern-slot-label">{secondLabel}</p>
                            <div className="addition-race-options">
                              {row.options2.map((opt: string) => {
                                const selected = c2 === opt;
                                return (
                                  <button
                                    key={`${row.key}-2-${opt}`}
                                    type="button"
                                    className={`addition-race-option ${selected ? "addition-race-option-selected" : ""}`}
                                    onClick={() =>
                                      setMatchAnswers((prev) => ({
                                        ...prev,
                                        [activity.id]: {
                                          ...(prev[activity.id] || {}),
                                          [`${row.key}-2`]: opt
                                        }
                                      }))
                                    }
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : activity.type === "weight_compare" ? (
                <div className="weight-compare-section section-top">
                  <p className="student-meta">{weightTapHint}</p>
                  {weightCompareRows.map((row, idx) => {
                    const m = matchAnswers[activity.id] || {};
                    const pick = m[row.key];
                    return (
                      <div key={row.key} className="weight-compare-row">
                        <p className="student-meta weight-compare-row-num">
                          {selectedLanguage === "sinhala" ? `සංසන්දනය ${idx + 1}` : `Comparison ${idx + 1}`}
                        </p>
                        <div className="weight-compare-pair">
                          <button
                            type="button"
                            className={`weight-compare-card ${pick === "left" ? "weight-compare-card-selected" : ""}`}
                            onClick={() =>
                              setMatchAnswers((prev) => ({
                                ...prev,
                                [activity.id]: {
                                  ...(prev[activity.id] || {}),
                                  [row.key]: "left"
                                }
                              }))
                            }
                          >
                            <img src={row.leftImage} alt={row.leftTitle} className="weight-compare-img" />
                            <span className="weight-compare-caption">{row.leftTitle}</span>
                          </button>
                          <button
                            type="button"
                            className={`weight-compare-card ${pick === "right" ? "weight-compare-card-selected" : ""}`}
                            onClick={() =>
                              setMatchAnswers((prev) => ({
                                ...prev,
                                [activity.id]: {
                                  ...(prev[activity.id] || {}),
                                  [row.key]: "right"
                                }
                              }))
                            }
                          >
                            <img src={row.rightImage} alt={row.rightTitle} className="weight-compare-img" />
                            <span className="weight-compare-caption">{row.rightTitle}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : activity.type === "shapes_hunt" ? (
                <div className="shapes-hunt-section section-top">
                  <p className="student-meta">{shapesTapHint}</p>
                  {shapesHuntRows.map((row, idx) => {
                    const m = matchAnswers[activity.id] || {};
                    const chosen = m[row.key];
                    return (
                      <div key={row.key} className="shapes-hunt-row">
                        <p className="student-meta shapes-hunt-row-num">
                          {selectedLanguage === "sinhala" ? `වස්තුව ${idx + 1}` : `Object ${idx + 1}`}
                        </p>
                        <div className="shapes-hunt-object-wrap">
                          <img src={row.objectImage} alt={row.objectLabel} className="shapes-hunt-object-img" />
                          <span className="shapes-hunt-object-caption">{row.objectLabel}</span>
                        </div>
                        <div className="shapes-hunt-options" role="group" aria-label={row.objectLabel}>
                          {row.options.map((opt: string) => {
                            const selected = chosen === opt;
                            return (
                              <button
                                key={`${row.key}-${opt}`}
                                type="button"
                                className={`shapes-hunt-emoji-btn ${selected ? "shapes-hunt-emoji-btn-selected" : ""}`}
                                aria-label={opt}
                                onClick={() =>
                                  setMatchAnswers((prev) => ({
                                    ...prev,
                                    [activity.id]: {
                                      ...(prev[activity.id] || {}),
                                      [row.key]: opt
                                    }
                                  }))
                                }
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : activity.type === "time_clock" ? (
                <div className="time-clock-section section-top">
                  <p className="student-meta">{timeClockTapHint}</p>
                  {timeClockRows.map((row, idx) => {
                    const m = matchAnswers[activity.id] || {};
                    const chosen = m[row.key];
                    return (
                      <div key={row.key} className="time-clock-row">
                        <p className="student-meta time-clock-instruction">
                          <strong>{selectedLanguage === "sinhala" ? `වේලාව ${idx + 1}` : `Time ${idx + 1}`}:</strong>{" "}
                          {row.instruction}
                        </p>
                        <div className="time-clock-options" role="group" aria-label={row.instruction}>
                          {row.options.map((src: string, i: number) => {
                            const selected = chosen === src;
                            return (
                              <button
                                key={`${row.key}-opt-${i}`}
                                type="button"
                                className={`time-clock-pick ${selected ? "time-clock-pick-selected" : ""}`}
                                onClick={() =>
                                  setMatchAnswers((prev) => ({
                                    ...prev,
                                    [activity.id]: {
                                      ...(prev[activity.id] || {}),
                                      [row.key]: src
                                    }
                                  }))
                                }
                              >
                                <img
                                  src={src}
                                  alt={`${row.instruction} — option ${i + 1}`}
                                  className="time-clock-pick-img"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
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
