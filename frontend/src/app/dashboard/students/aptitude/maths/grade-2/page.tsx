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
import { getGrade2MathsActivities, type Grade2MathsActivity } from "@/lib/grade2MathsAptitude";

type ModeKey = "1s" | "2s" | "5s" | "10s";

export default function Grade2MathsAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const selectedLanguage = searchParams.get("lang") === "sinhala" ? "sinhala" : "english";
  const uiLang: AptitudeUiLang = selectedLanguage === "sinhala" ? "sinhala" : "english";
  const activities = useMemo<Grade2MathsActivity[]>(() => getGrade2MathsActivities(selectedLanguage), [selectedLanguage]);
  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompleteExamSessionResponse | null>(null);

  const [activeMode, setActiveMode] = useState<ModeKey>("1s");
  const [valuesByMode, setValuesByMode] = useState<Record<ModeKey, number[]>>({
    "1s": [],
    "2s": [],
    "5s": [],
    "10s": []
  });
  const [balloonChoiceByActivity, setBalloonChoiceByActivity] = useState<Record<number, number | null>>({});
  const [fedCountByActivity, setFedCountByActivity] = useState<Record<number, number>>({});
  const [takeAwayChoiceByActivity, setTakeAwayChoiceByActivity] = useState<Record<number, number | null>>({});
  const [shapePlacementByActivity, setShapePlacementByActivity] = useState<Record<number, Record<string, string>>>({});
  const [longShortChoiceByActivity, setLongShortChoiceByActivity] = useState<
    Record<number, { longer?: "A" | "B"; shorter?: "A" | "B" }>
  >({});
  const [weightScaleByActivity, setWeightScaleByActivity] = useState<
    Record<number, { left?: string; right?: string; selectedHeavier?: "left" | "right" }>
  >({});
  const [dailyRoutineByActivity, setDailyRoutineByActivity] = useState<Record<number, Record<string, string>>>({});
  const [groupFruitsByActivity, setGroupFruitsByActivity] = useState<Record<number, Record<string, number>>>({});
  const [missingNumberByActivity, setMissingNumberByActivity] = useState<Record<number, number | null>>({});

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
        setSubjectId(dashboard.subjects.find((subject: { code: string; id: number }) => subject.code === "maths")?.id ?? null);
        if (dashboard.student.grade !== 2) {
          setError("This aptitude test is currently available only for Grade 2 students.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }

    loadStudent();
  }, [router, studentId]);

  const activity = activities[currentActivityIndex] as Grade2MathsActivity | undefined;
  const fruitCfg = activity?.type === "fruit_basket" ? activity.fruitBasket : undefined;
  const step = Number(activeMode.replace("s", "")) || 1;
  const targetTotal = (fruitCfg?.targetBaseTotal || 15) * step;
  const currentValues = valuesByMode[activeMode];
  const currentTotal = currentValues.reduce((sum, v) => sum + v, 0);
  const sequenceText = currentValues.length > 0 ? currentValues.join(" + ") : "—";

  function addFruitValue(value: number) {
    setValuesByMode((prev) => ({
      ...prev,
      [activeMode]: [...prev[activeMode], value]
    }));
  }

  function anyModeSolvedForActivity(currentActivity: Grade2MathsActivity) {
    if (currentActivity.type !== "fruit_basket") return false;
    const cfg = currentActivity.fruitBasket;
    return cfg.modeSteps.some((s) => {
      const key = `${s}s` as ModeKey;
      const total = (valuesByMode[key] || []).reduce((acc, v) => acc + v, 0);
      return total === (cfg.targetBaseTotal || 15) * s;
    });
  }

  function getActivityMark(currentActivity: Grade2MathsActivity): 0 | 1 {
    if (currentActivity.type === "fruit_basket") {
      return anyModeSolvedForActivity(currentActivity) ? 1 : 0;
    }
    if (currentActivity.type === "balloon_pop") {
      const target = currentActivity.balloonPop?.targetNumber;
      const picked = balloonChoiceByActivity[currentActivity.id];
      return target != null && picked === target ? 1 : 0;
    }
    if (currentActivity.type === "feed_animal") {
      const target = currentActivity.feedAnimal?.targetCount || 0;
      const fed = fedCountByActivity[currentActivity.id] || 0;
      return fed === target ? 1 : 0;
    }
    if (currentActivity.type === "take_away") {
      const start = currentActivity.takeAway?.startCount || 0;
      const removed = currentActivity.takeAway?.removeCount || 0;
      const answer = takeAwayChoiceByActivity[currentActivity.id];
      return answer === start - removed ? 1 : 0;
    }
    if (currentActivity.type === "shape_sort") {
      const placements = shapePlacementByActivity[currentActivity.id] || {};
      const shapes = currentActivity.shapeSort?.shapes || [];
      const allCorrect =
        shapes.length > 0 &&
        shapes.every((shape) => placements[shape] === shape);
      return allCorrect ? 1 : 0;
    }
    if (currentActivity.type === "long_short") {
      const left = currentActivity.longShort?.leftSize;
      const right = currentActivity.longShort?.rightSize;
      const ans = longShortChoiceByActivity[currentActivity.id] || {};
      const correctLonger = left === "long" ? "A" : "B";
      const correctShorter = right === "short" ? "B" : "A";
      return ans.longer === correctLonger && ans.shorter === correctShorter ? 1 : 0;
    }
    if (currentActivity.type === "weight_scale") {
      const cfg = currentActivity.weightScale;
      const state = weightScaleByActivity[currentActivity.id] || {};
      if (!cfg || !state.left || !state.right || !state.selectedHeavier) return 0;
      const leftWeight = cfg.objects.find((item) => item.key === state.left)?.weight || 0;
      const rightWeight = cfg.objects.find((item) => item.key === state.right)?.weight || 0;
      const correctHeavier = leftWeight > rightWeight ? "left" : "right";
      return state.selectedHeavier === correctHeavier ? 1 : 0;
    }
    if (currentActivity.type === "daily_routine") {
      const cfg = currentActivity.dailyRoutine;
      const placements = dailyRoutineByActivity[currentActivity.id] || {};
      if (!cfg) return 0;
      const allCorrect = cfg.tasks.every((task) => placements[task.key] === task.answerSlotKey);
      return allCorrect ? 1 : 0;
    }
    if (currentActivity.type === "group_fruits") {
      const cfg = currentActivity.groupFruits;
      const counters = groupFruitsByActivity[currentActivity.id] || {};
      if (!cfg) return 0;
      const allCorrect = cfg.groups.every((group) => (counters[group.key] || 0) === group.targetCount);
      return allCorrect ? 1 : 0;
    }
    if (currentActivity.type === "missing_number_train") {
      const picked = missingNumberByActivity[currentActivity.id];
      return picked === currentActivity.missingNumberTrain?.answer ? 1 : 0;
    }
    return 0;
  }

  function isActivityComplete(currentActivity: Grade2MathsActivity): boolean {
    if (currentActivity.type === "fruit_basket") {
      return anyModeSolvedForActivity(currentActivity);
    }
    if (currentActivity.type === "balloon_pop") {
      return balloonChoiceByActivity[currentActivity.id] != null;
    }
    if (currentActivity.type === "feed_animal") {
      const target = currentActivity.feedAnimal?.targetCount || 0;
      const fed = fedCountByActivity[currentActivity.id] || 0;
      return fed >= target;
    }
    if (currentActivity.type === "take_away") {
      return takeAwayChoiceByActivity[currentActivity.id] != null;
    }
    if (currentActivity.type === "shape_sort") {
      const placements = shapePlacementByActivity[currentActivity.id] || {};
      const shapes = currentActivity.shapeSort?.shapes || [];
      return shapes.length > 0 && shapes.every((shape) => Boolean(placements[shape]));
    }
    if (currentActivity.type === "long_short") {
      const ans = longShortChoiceByActivity[currentActivity.id] || {};
      return Boolean(ans.longer && ans.shorter);
    }
    if (currentActivity.type === "weight_scale") {
      const state = weightScaleByActivity[currentActivity.id] || {};
      return Boolean(state.left && state.right && state.selectedHeavier);
    }
    if (currentActivity.type === "daily_routine") {
      const cfg = currentActivity.dailyRoutine;
      const placements = dailyRoutineByActivity[currentActivity.id] || {};
      if (!cfg) return false;
      return cfg.tasks.every((task) => Boolean(placements[task.key]));
    }
    if (currentActivity.type === "group_fruits") {
      const cfg = currentActivity.groupFruits;
      const counters = groupFruitsByActivity[currentActivity.id] || {};
      if (!cfg) return false;
      return cfg.groups.every((group) => (counters[group.key] || 0) >= group.targetCount);
    }
    if (currentActivity.type === "missing_number_train") {
      return missingNumberByActivity[currentActivity.id] != null;
    }
    return false;
  }

  async function handleSubmit() {
    if (!studentId || grade !== 2) return;
    setError(null);
    setSubmitting(true);
    try {
      const correctAnswers = activities.reduce((sum, currentActivity) => sum + getActivityMark(currentActivity), 0);
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

  const answeredCount = activities.reduce(
    (sum, currentActivity) => sum + (isActivityComplete(currentActivity) ? 1 : 0),
    0
  );

  useEffect(() => {
    const current = activities[currentActivityIndex];
    if (!current || !isActivityComplete(current)) return;
    if (currentActivityIndex >= activities.length - 1) return;
    setCurrentActivityIndex((prev) => Math.min(prev + 1, activities.length - 1));
  }, [
    currentActivityIndex,
    activities,
    valuesByMode,
    balloonChoiceByActivity,
    fedCountByActivity,
    takeAwayChoiceByActivity,
    shapePlacementByActivity,
    longShortChoiceByActivity,
    weightScaleByActivity,
    dailyRoutineByActivity,
    groupFruitsByActivity,
    missingNumberByActivity
  ]);

  const answeredLine = playZoneFinishedLine(answeredCount, activities.length, uiLang);

  return (
    <main className={playZoneMainClassNames(uiLang)}>
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">{playZoneEyebrow("maths", uiLang)}</p>
          <h1 className="title dashboard-title kid-aptitude-title">{playZoneTitle(2, "maths", uiLang)}</h1>
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

          {!result && grade === 2 && activity ? (
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
              {activity.image ? (
                <img src={activity.image} alt="Maths activity sample" className="aptitude-image section-top" />
              ) : null}

              {activity.type === "fruit_basket" && fruitCfg ? (
                <>
                  <div className="section-top level-actions">
                    {fruitCfg.modeSteps.map((s) => {
                      const mode = `${s}s` as ModeKey;
                      const selected = mode === activeMode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          className={`btn btn-secondary level-btn ${selected ? "number-option-btn-selected" : ""}`}
                          onClick={() => setActiveMode(mode)}
                        >
                          Count by {mode}
                        </button>
                      );
                    })}
                  </div>

                  <p className="student-meta">
                    Mode: <strong>{activeMode}</strong> | Target: <strong>{targetTotal}</strong> | Basket total:{" "}
                    <strong>{currentTotal}</strong>
                  </p>
                  <p className="student-meta">Count trail: {sequenceText}</p>

                  <div
                    className="fruit-basket-dropzone section-top"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const indexRaw = e.dataTransfer.getData("text/plain");
                      const index = Number(indexRaw);
                      if (Number.isNaN(index) || !fruitCfg.fruits[index]) return;
                      const value = (fruitCfg.baseValues[index % fruitCfg.baseValues.length] || 1) * step;
                      addFruitValue(value);
                    }}
                  >
                    <div className="fruit-basket-icon">🧺</div>
                    <div>
                      <strong>Drop fruits into basket</strong>
                      <p className="student-meta">Drag a fruit card here, or tap it to add.</p>
                    </div>
                  </div>

                  <div className="choice-pool section-top">
                    {fruitCfg.fruits.map((fruit, idx) => {
                      const value = (fruitCfg.baseValues[idx % fruitCfg.baseValues.length] || 1) * step;
                      return (
                        <button
                          key={fruit.key}
                          type="button"
                          className="number-option-btn fruit-card-btn"
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", String(idx))}
                          onClick={() => addFruitValue(value)}
                        >
                          <span>{fruit.emoji} {fruit.label}</span>
                          <span>+{value}</span>
                        </button>
                      );
                    })}
                  </div>

                  {currentValues.length > 0 ? (
                    <div className="choice-pool section-top">
                      {currentValues.map((v, i) => (
                        <span key={`${v}-${i}`} className="number-option-btn number-option-btn-selected">
                          #{i + 1}: {v}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="section-top">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        setValuesByMode((prev) => ({
                          ...prev,
                          [activeMode]: prev[activeMode].slice(0, -1)
                        }))
                      }
                      disabled={currentValues.length === 0}
                    >
                      Undo Last Fruit
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginLeft: 8 }}
                      onClick={() =>
                        setValuesByMode((prev) => ({
                          ...prev,
                          [activeMode]: []
                        }))
                      }
                      disabled={currentValues.length === 0}
                    >
                      Clear Basket
                    </button>
                  </div>

                  <p className="student-meta section-top">
                    {anyModeSolvedForActivity(activity)
                      ? "Great! You reached the target in at least one mode."
                      : "Add fruits until basket total equals the target number."}
                  </p>
                </>
              ) : null}

              {activity.type === "balloon_pop" ? (
                <>
                  <p className="student-meta section-top">
                    🔊 Voice: “Find {activity.balloonPop?.targetNumber}”
                  </p>
                  <div className="choice-pool section-top">
                    {(activity.balloonPop?.balloonNumbers || []).map((num, idx) => {
                      const selected = balloonChoiceByActivity[activity.id] === num;
                      return (
                        <button
                          key={`balloon-${idx}-${num}`}
                          type="button"
                          className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                          onClick={() =>
                            setBalloonChoiceByActivity((prev) => ({
                              ...prev,
                              [activity.id]: num
                            }))
                          }
                        >
                          🎈 {num}
                        </button>
                      );
                    })}
                  </div>
                  <p className="student-meta section-top">
                    Selected balloon: <strong>{balloonChoiceByActivity[activity.id] ?? "None"}</strong>
                  </p>
                </>
              ) : null}

              {activity.type === "feed_animal" ? (
                <>
                  <p className="student-meta section-top">
                    🐵 Monkey asks: <strong>{activity.feedAnimal?.promptMath}</strong>
                  </p>
                  <div
                    className="fruit-basket-dropzone section-top"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const token = e.dataTransfer.getData("text/plain");
                      if (!token.startsWith("banana-")) return;
                      setFedCountByActivity((prev) => {
                        const next = (prev[activity.id] || 0) + 1;
                        return { ...prev, [activity.id]: Math.min(next, activity.feedAnimal?.targetCount || 0) };
                      });
                    }}
                  >
                    <div className="fruit-basket-icon">🐵</div>
                    <div>
                      <strong>Drop bananas to monkey mouth</strong>
                      <p className="student-meta">Drag or tap bananas to feed the monkey.</p>
                    </div>
                  </div>

                  <div className="choice-pool section-top">
                    {Array.from({ length: activity.feedAnimal?.targetCount || 0 }).map((_, idx) => (
                      <button
                        key={`banana-${idx}`}
                        type="button"
                        className="number-option-btn fruit-card-btn"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", `banana-${idx}`)}
                        onClick={() =>
                          setFedCountByActivity((prev) => {
                            const next = (prev[activity.id] || 0) + 1;
                            return { ...prev, [activity.id]: Math.min(next, activity.feedAnimal?.targetCount || 0) };
                          })
                        }
                      >
                        <span>{activity.feedAnimal?.itemEmoji} {activity.feedAnimal?.itemLabel}</span>
                      </button>
                    ))}
                  </div>

                  <p className="student-meta section-top">
                    Fed bananas: <strong>{fedCountByActivity[activity.id] || 0}</strong> /{" "}
                    <strong>{activity.feedAnimal?.targetCount}</strong>
                  </p>
                  <p className="student-meta">
                    {(fedCountByActivity[activity.id] || 0) >= (activity.feedAnimal?.targetCount || 0)
                      ? "Great! Correct feeding count."
                      : "Feed exactly 5 bananas for 3 + 2."}
                  </p>
                </>
              ) : null}

              {activity.type === "take_away" ? (
                <>
                  <p className="student-meta section-top">
                    Visual subtraction: start with <strong>{activity.takeAway?.startCount}</strong> apples, remove{" "}
                    <strong>{activity.takeAway?.removeCount}</strong> apples (bird takes them).
                  </p>
                  <div className="choice-pool section-top">
                    {Array.from({ length: activity.takeAway?.startCount || 0 }).map((_, idx) => {
                      const removed = idx < (activity.takeAway?.removeCount || 0);
                      return (
                        <span
                          key={`apple-${idx}`}
                          className={`number-option-btn ${removed ? "fruit-removed" : "number-option-btn-selected"}`}
                        >
                          {removed ? "🐦🍎" : "🍎"}
                        </span>
                      );
                    })}
                  </div>
                  <p className="student-meta section-top">
                    How many apples are remaining now?
                  </p>
                  <div className="choice-pool section-top">
                    {(activity.takeAway?.answerOptions || []).map((opt) => {
                      const selected = takeAwayChoiceByActivity[activity.id] === opt;
                      return (
                        <button
                          key={`takeaway-${opt}`}
                          type="button"
                          className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                          onClick={() =>
                            setTakeAwayChoiceByActivity((prev) => ({
                              ...prev,
                              [activity.id]: opt
                            }))
                          }
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <p className="student-meta section-top">
                    Selected answer: <strong>{takeAwayChoiceByActivity[activity.id] ?? "None"}</strong>
                  </p>
                </>
              ) : null}

              {activity.type === "shape_sort" ? (
                <>
                  <p className="student-meta section-top">
                    {selectedLanguage === "sinhala"
                      ? "හැඩතල එකින් එක නිවැරදි ස්ථානයට දමන්න: වෘත්තය, චතුරස්‍රය, ත්‍රිකෝණය."
                      : "Sort each shape into the matching slot: Circle, Square, Triangle."}
                  </p>
                  <div className="choice-pool section-top">
                    {(activity.shapeSort?.shapes || []).map((shape) => {
                      const selected = (shapePlacementByActivity[activity.id] || {})[shape];
                      return (
                        <button
                          key={`shape-${shape}`}
                          type="button"
                          className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", shape)}
                        >
                          {shape}
                        </button>
                      );
                    })}
                  </div>

                  <div className="choice-pool section-top">
                    {(activity.shapeSort?.shapes || []).map((slot) => {
                      const current = (shapePlacementByActivity[activity.id] || {})[slot];
                      return (
                        <div
                          key={`slot-${slot}`}
                          className="fruit-basket-dropzone"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const shape = e.dataTransfer.getData("text/plain");
                            if (!shape) return;
                            setShapePlacementByActivity((prev) => ({
                              ...prev,
                              [activity.id]: {
                                ...(prev[activity.id] || {}),
                                [shape]: slot
                              }
                            }));
                          }}
                        >
                          <strong>{slot} Slot</strong>
                          <p className="student-meta">
                            {current
                              ? `Placed: ${Object.entries(shapePlacementByActivity[activity.id] || {}).find(([, val]) => val === slot)?.[0] || "—"}`
                              : "Drop matching shape here"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {activity.type === "long_short" ? (
                <>
                  <p className="student-meta section-top">
                    Compare the two objects and pick which one is <strong>Longer</strong> and which one is <strong>Shorter</strong>.
                  </p>
                  <div className="choice-pool section-top">
                    <div className="fruit-basket-dropzone">
                      <strong>{activity.longShort?.leftLabel}</strong>
                      <div className={`measure-bar ${activity.longShort?.leftSize === "long" ? "measure-bar-long" : "measure-bar-short"}`} />
                    </div>
                    <div className="fruit-basket-dropzone">
                      <strong>{activity.longShort?.rightLabel}</strong>
                      <div className={`measure-bar ${activity.longShort?.rightSize === "long" ? "measure-bar-long" : "measure-bar-short"}`} />
                    </div>
                  </div>

                  <div className="section-top">
                    <p className="student-meta">Which is Longer?</p>
                    <div className="choice-pool">
                      {(["A", "B"] as const).map((pick) => (
                        <button
                          key={`longer-${pick}`}
                          type="button"
                          className={`number-option-btn ${longShortChoiceByActivity[activity.id]?.longer === pick ? "number-option-btn-selected" : ""}`}
                          onClick={() =>
                            setLongShortChoiceByActivity((prev) => ({
                              ...prev,
                              [activity.id]: {
                                ...(prev[activity.id] || {}),
                                longer: pick
                              }
                            }))
                          }
                        >
                          {pick}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="section-top">
                    <p className="student-meta">Which is Shorter?</p>
                    <div className="choice-pool">
                      {(["A", "B"] as const).map((pick) => (
                        <button
                          key={`shorter-${pick}`}
                          type="button"
                          className={`number-option-btn ${longShortChoiceByActivity[activity.id]?.shorter === pick ? "number-option-btn-selected" : ""}`}
                          onClick={() =>
                            setLongShortChoiceByActivity((prev) => ({
                              ...prev,
                              [activity.id]: {
                                ...(prev[activity.id] || {}),
                                shorter: pick
                              }
                            }))
                          }
                        >
                          {pick}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              {activity.type === "weight_scale" ? (
                <>
                  <p className="student-meta section-top">
                    Drag one object to each pan. Then choose which side is heavier.
                  </p>
                  <div className="choice-pool section-top">
                    {(activity.weightScale?.objects || []).map((obj) => (
                      <button
                        key={obj.key}
                        type="button"
                        className="number-option-btn fruit-card-btn"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", obj.key)}
                      >
                        <span>{obj.emoji} {obj.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="weight-scale-board section-top">
                    {(["left", "right"] as const).map((side) => {
                      const placedKey = weightScaleByActivity[activity.id]?.[side];
                      const placed = (activity.weightScale?.objects || []).find((obj) => obj.key === placedKey);
                      const leftKey = weightScaleByActivity[activity.id]?.left;
                      const rightKey = weightScaleByActivity[activity.id]?.right;
                      const leftWeight =
                        (activity.weightScale?.objects || []).find((obj) => obj.key === leftKey)?.weight || 0;
                      const rightWeight =
                        (activity.weightScale?.objects || []).find((obj) => obj.key === rightKey)?.weight || 0;
                      const downSide = leftWeight === rightWeight ? null : leftWeight > rightWeight ? "left" : "right";
                      return (
                        <div
                          key={`weight-${side}`}
                          className={`weight-pan ${downSide === side ? "weight-pan-down" : "weight-pan-up"}`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const objectKey = e.dataTransfer.getData("text/plain");
                            if (!objectKey) return;
                            setWeightScaleByActivity((prev) => ({
                              ...prev,
                              [activity.id]: {
                                ...(prev[activity.id] || {}),
                                [side]: objectKey
                              }
                            }));
                          }}
                        >
                          <strong>{side === "left" ? activity.weightScale?.leftLabel : activity.weightScale?.rightLabel}</strong>
                          <p className="student-meta">
                            {placed ? `${placed.emoji} ${placed.label}` : "Drop object here"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="student-meta section-top">Which side is heavier?</p>
                  <div className="choice-pool">
                    {([
                      { key: "left", label: "Left side" },
                      { key: "right", label: "Right side" }
                    ] as const).map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        className={`number-option-btn ${weightScaleByActivity[activity.id]?.selectedHeavier === option.key ? "number-option-btn-selected" : ""}`}
                        onClick={() =>
                          setWeightScaleByActivity((prev) => ({
                            ...prev,
                            [activity.id]: {
                              ...(prev[activity.id] || {}),
                              selectedHeavier: option.key
                            }
                          }))
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}

              {activity.type === "daily_routine" ? (
                <>
                  <p className="student-meta section-top">
                    Drag each task card to the correct time: Morning or Night.
                  </p>

                  <div className="choice-pool section-top">
                    {(activity.dailyRoutine?.tasks || []).map((task) => (
                      <button
                        key={task.key}
                        type="button"
                        className="number-option-btn fruit-card-btn"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", task.key)}
                      >
                        <span>{task.emoji} {task.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="weight-scale-board section-top">
                    {(activity.dailyRoutine?.timeSlots || []).map((slot) => {
                      const taskInSlot = (activity.dailyRoutine?.tasks || []).find(
                        (task) => dailyRoutineByActivity[activity.id]?.[task.key] === slot.key
                      );
                      return (
                        <div
                          key={slot.key}
                          className="fruit-basket-dropzone"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const taskKey = e.dataTransfer.getData("text/plain");
                            if (!taskKey) return;
                            setDailyRoutineByActivity((prev) => ({
                              ...prev,
                              [activity.id]: {
                                ...(prev[activity.id] || {}),
                                [taskKey]: slot.key
                              }
                            }));
                          }}
                        >
                          <strong>{slot.label}</strong>
                          <p className="student-meta">{taskInSlot ? `${taskInSlot.emoji} ${taskInSlot.label}` : "Drop a task here"}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {activity.type === "group_fruits" ? (
                <>
                  <p className="student-meta section-top">
                    Drag fruits into baskets. System will auto-count each group.
                  </p>
                  <div className="choice-pool section-top">
                    {(activity.groupFruits?.fruits || []).map((fruit) => (
                      <button
                        key={fruit.key}
                        type="button"
                        className="number-option-btn fruit-card-btn"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", fruit.key)}
                      >
                        <span>{fruit.emoji} {fruit.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="weight-scale-board section-top">
                    {(activity.groupFruits?.groups || []).map((group) => {
                      const count = groupFruitsByActivity[activity.id]?.[group.key] || 0;
                      return (
                        <div
                          key={group.key}
                          className="group-fruit-basket"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const fruitKey = e.dataTransfer.getData("text/plain");
                            if (!fruitKey) return;
                            setGroupFruitsByActivity((prev) => ({
                              ...prev,
                              [activity.id]: {
                                ...(prev[activity.id] || {}),
                                [group.key]: (prev[activity.id]?.[group.key] || 0) + 1
                              }
                            }));
                          }}
                        >
                          <strong>{group.label}</strong>
                          <p className="student-meta">Target: {group.targetCount}</p>
                          <p className="student-meta">
                            Total: <strong>{count}</strong>
                          </p>
                          <p className="student-meta">
                            Skip count by {group.size}:{" "}
                            {count > 0
                              ? Array.from({ length: count }, (_, i) => String((i + 1) * group.size)).join(", ")
                              : "—"}
                          </p>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                              setGroupFruitsByActivity((prev) => ({
                                ...prev,
                                [activity.id]: {
                                  ...(prev[activity.id] || {}),
                                  [group.key]: 0
                                }
                              }))
                            }
                          >
                            Clear Basket
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {activity.type === "missing_number_train" ? (
                <>
                  <p className="student-meta section-top">
                    Fill the missing number in the train sequence.
                  </p>
                  <div className="choice-pool section-top">
                    {(activity.missingNumberTrain?.sequence || []).map((num, idx) => (
                      <div key={`train-cell-${idx}`} className="number-option-btn number-option-btn-selected">
                        {num == null ? (missingNumberByActivity[activity.id] ?? "?") : num}
                      </div>
                    ))}
                  </div>

                  <div className="choice-pool section-top">
                    {(activity.missingNumberTrain?.options || []).map((opt) => {
                      const selected = missingNumberByActivity[activity.id] === opt;
                      return (
                        <button
                          key={`missing-opt-${opt}`}
                          type="button"
                          className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                          onClick={() =>
                            setMissingNumberByActivity((prev) => ({
                              ...prev,
                              [activity.id]: opt
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
