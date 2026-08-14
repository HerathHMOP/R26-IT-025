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
import { preGeneralActivities } from "@/lib/preGeneralAptitude";

export default function PreGeneralAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CompleteExamSessionResponse | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [slotsByActivity, setSlotsByActivity] = useState<Record<number, Record<number, string>>>({});
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [matchByActivity, setMatchByActivity] = useState<Record<number, Record<string, string>>>({});
  const [lowercaseByActivity, setLowercaseByActivity] = useState<Record<number, Record<string, string>>>({});
  const [sortGroupByActivity, setSortGroupByActivity] = useState<Record<number, Record<string, string>>>({});

  const activity = preGeneralActivities[currentActivityIndex];

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
        if (dashboard.student.grade !== 0) {
          setError("This aptitude test is only for pre-school students.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }
    loadStudent();
  }, [router, studentId]);

  function isComplete(currentActivity: (typeof preGeneralActivities)[number]) {
    if (currentActivity.type === "drag_number_order") {
      const slots = slotsByActivity[currentActivity.id] || {};
      return currentActivity.dragNumberOrder?.targetOrder.every((slot: number) => Boolean(slots[slot])) ?? false;
    }
    if (currentActivity.type === "match_image_pairs") {
      const rows = currentActivity.matchImagePairs?.leftImages || [];
      const mapped = matchByActivity[currentActivity.id] || {};
      return rows.every((item: { key: string; image: string; label: string }) => Boolean(mapped[item.key]));
    }
    if (currentActivity.type === "match_shapes") {
      const rows = currentActivity.matchShapes?.leftShapes || [];
      const mapped = matchByActivity[currentActivity.id] || {};
      return rows.every((item: { key: string; shape: string; label: string }) => Boolean(mapped[item.key]));
    }
    if (currentActivity.type === "circle_lowercase") {
      const rows = currentActivity.circleLowercaseRows || [];
      const selected = lowercaseByActivity[currentActivity.id] || {};
      return rows.every((row: { key: string; uppercase: string; options: string[]; answer: string }) => Boolean(selected[row.key]));
    }
    if (currentActivity.type === "drag_sort_groups") {
      const items = currentActivity.dragSortGroups?.items || [];
      const mapped = sortGroupByActivity[currentActivity.id] || {};
      return items.every((item: { key: string; image?: string; label: string; answerGroupKey: string }) => Boolean(mapped[item.key]));
    }
    return false;
  }

  function getMark(currentActivity: (typeof preGeneralActivities)[number]): 0 | 1 {
    if (currentActivity.type === "drag_number_order") {
      const slots = slotsByActivity[currentActivity.id] || {};
      const cardsByKey = new Map((currentActivity.dragNumberOrder?.cards || []).map((card: { key: string; number: number; image: string; label: string }) => [card.key, card]));
      const allCorrect = currentActivity.dragNumberOrder?.targetOrder.every((slotNumber: number) => {
        const placedKey = slots[slotNumber];
        if (!placedKey) return false;
        return cardsByKey.get(placedKey)?.number === slotNumber;
      });
      return allCorrect ? 1 : 0;
    }
    if (currentActivity.type === "match_image_pairs") {
      const mapped = matchByActivity[currentActivity.id] || {};
      const answers = currentActivity.matchImagePairs?.answerMap || {};
      const allCorrect = Object.entries(answers).every(([leftKey, rightKey]) => mapped[leftKey] === rightKey);
      return allCorrect ? 1 : 0;
    }
    if (currentActivity.type === "match_shapes") {
      const mapped = matchByActivity[currentActivity.id] || {};
      const answers = currentActivity.matchShapes?.answerMap || {};
      const allCorrect = Object.entries(answers).every(([leftKey, rightKey]) => mapped[leftKey] === rightKey);
      return allCorrect ? 1 : 0;
    }
    if (currentActivity.type === "circle_lowercase") {
      const rows = currentActivity.circleLowercaseRows || [];
      const selected = lowercaseByActivity[currentActivity.id] || {};
      const allCorrect = rows.every((row: { key: string; uppercase: string; options: string[]; answer: string }) => selected[row.key] === row.answer);
      return allCorrect ? 1 : 0;
    }
    if (currentActivity.type === "drag_sort_groups") {
      const items = currentActivity.dragSortGroups?.items || [];
      const mapped = sortGroupByActivity[currentActivity.id] || {};
      const allCorrect = items.every((item: { key: string; image?: string; label: string; answerGroupKey: string }) => mapped[item.key] === item.answerGroupKey);
      return allCorrect ? 1 : 0;
    }
    return 0;
  }

  async function handleSubmit() {
    if (!studentId || grade !== 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const session = await startExamSession(studentId, preGeneralActivities.length);
      const total = preGeneralActivities.length;
      const correctAnswers = preGeneralActivities.reduce((sum, item) => sum + getMark(item), 0);
      const finalResult = await completeExamSession(
        session.exam_session_id,
        correctAnswers,
        undefined,
        total
      );
      setResult(finalResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit aptitude test");
    } finally {
      setSubmitting(false);
    }
  }

  const placedCardKeys = new Set(Object.values(slotsByActivity[activity.id] || {}));
  const remainingCards = activity.type === "drag_number_order"
    ? (activity.dragNumberOrder?.cards || []).filter((card) => !placedCardKeys.has(card.key))
    : [];
  const allPlaced = isComplete(activity);
  const allCorrect = getMark(activity) === 1;

  function placeCardInSlot(slot: number, cardKey: string, fromSlot?: number | null) {
    setSlotsByActivity((prev: Record<number, Record<number, string>>) => {
      const current = { ...(prev[activity.id] || {}) };
      const displaced = current[slot];
      Object.keys(current).forEach((slotKey) => {
        if (current[Number(slotKey)] === cardKey) {
          delete current[Number(slotKey)];
        }
      });
      current[slot] = cardKey;
      if (fromSlot && displaced && displaced !== cardKey) {
        current[fromSlot] = displaced;
      }
      return {
        ...prev,
        [activity.id]: current
      };
    });
  }

  useEffect(() => {
    if (!activity || !isComplete(activity)) return;
    if (currentActivityIndex >= preGeneralActivities.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentActivityIndex((prev: number) => Math.min(prev + 1, preGeneralActivities.length - 1));
    }, 450);
    return () => clearTimeout(timer);
  }, [currentActivityIndex, activity, slotsByActivity, matchByActivity, lowercaseByActivity, sortGroupByActivity]);

  const uiLang: AptitudeUiLang = "english";
  const completedSteps = preGeneralActivities.reduce((n, act) => n + (isComplete(act) ? 1 : 0), 0);
  const answeredLine = playZoneFinishedLine(completedSteps, preGeneralActivities.length, null);

  return (
    <main className={playZoneMainClassNames(uiLang)}>
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">{playZoneEyebrow("general", uiLang)}</p>
          <h1 className="title dashboard-title kid-aptitude-title">{playZoneTitle(0, "general", uiLang)}</h1>
          <p className="kid-aptitude-kicker">{playZoneKicker("general", uiLang)}</p>
          <p className="subtitle kid-aptitude-subtitle">
            {playZoneSubtitle(studentName, preGeneralActivities.length, null)}
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
              <h2 className="dashboard-panel-title kid-result-title">{playZoneDoneTitle(null)}</h2>
              <p className="student-meta">
                Score: {result.correct_answers}/{result.total_activities} ({result.score_percent}%)
              </p>
              <p className="student-meta">Eligible level: {result.eligible_level ?? "—"}</p>
              <p className="student-meta">
                Unlocked levels: {result.eligible_levels?.length ? result.eligible_levels.join(", ") : "—"}
              </p>
              <div className="section-top">
                <Link href={`/dashboard/students/${studentId}`} className="btn">
                  Continue to Student Dashboard
                </Link>
              </div>
            </section>
          ) : null}

          {!result && grade === 0 ? (
            <article className="dashboard-item subject-item pre-kid-activity kid-aptitude-card">
              <div className="subject-item-header pre-kid-header kid-aptitude-card-header">
                <span className="kid-activity-badge" title="Current step">
                  <span className="kid-activity-badge-emoji" aria-hidden>
                    ★
                  </span>
                  {playZoneStepBadge(currentActivityIndex, preGeneralActivities.length, uiLang)}
                </span>
              </div>
              <p className="student-meta kid-aptitude-answered-line section-top">{answeredLine}</p>
              <p className="student-meta aptitude-activity-prompt kid-aptitude-prompt">{activity.prompt}</p>
              {activity.type === "drag_number_order" ? (
                <p className="student-meta section-top">Tap a slot, then tap a picture card (or drag and drop).</p>
              ) : null}
              {activity.type === "match_image_pairs" ? (
                <p className="student-meta section-top">Match each left image with the correct right image.</p>
              ) : null}
              {activity.type === "match_shapes" ? (
                <p className="student-meta section-top">Match each left shape with the same shape on the right.</p>
              ) : null}
              {activity.type === "circle_lowercase" ? (
                <p className="student-meta section-top">Select the lowercase letter in each row.</p>
              ) : null}
              {activity.type === "drag_sort_groups" ? (
                <p className="student-meta section-top">Drag each item to Fruits or Vegetables.</p>
              ) : null}
              {allPlaced ? (
                <p className={`student-meta section-top ${allCorrect ? "success-text" : "error-text"}`}>
                  {allCorrect
                    ? activity.type === "drag_number_order"
                      ? "Great job! All numbers are matched correctly."
                      : "Great job! All picture pairs are matched correctly."
                    : activity.type === "drag_number_order"
                      ? "Good try! Some cards are in the wrong slot."
                      : "Good try! Some picture pairs are incorrect."}
                </p>
              ) : null}

              {activity.type === "drag_number_order" ? (
              <div className="pre-slot-grid section-top">
                {activity.dragNumberOrder?.targetOrder.map((slot: number) => {
                  const cardKey = slotsByActivity[activity.id]?.[slot];
                  const card = activity.dragNumberOrder?.cards.find((item: { key: string; number: number; image: string; label: string }) => item.key === cardKey);
                  const isSelected = selectedSlot === slot;
                  const isSlotCorrect = allPlaced ? card?.number === slot : null;
                  return (
                    <div
                      key={`slot-${slot}`}
                      className={`pre-slot-card ${isSelected ? "pre-slot-selected" : ""} ${isSlotCorrect === true ? "pre-slot-correct" : ""} ${isSlotCorrect === false ? "pre-slot-wrong" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const payloadRaw = e.dataTransfer.getData("application/json");
                        if (payloadRaw) {
                          try {
                            const payload = JSON.parse(payloadRaw) as { key?: string; fromSlot?: number };
                            if (!payload.key) return;
                            placeCardInSlot(slot, payload.key, payload.fromSlot ?? null);
                            setSelectedSlot(slot);
                            return;
                          } catch {
                            // fallback to plain text below
                          }
                        }
                        const droppedKey = e.dataTransfer.getData("text/plain");
                        if (!droppedKey) return;
                        placeCardInSlot(slot, droppedKey, null);
                        setSelectedSlot(slot);
                      }}
                    >
                      <div className="pre-slot-badge">{slot}</div>
                      <div className="pre-slot-title">Drop card here</div>
                      {card ? (
                        <>
                          <img
                            src={card.image}
                            alt={card.label}
                            className="aptitude-image"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                "application/json",
                                JSON.stringify({ key: card.key, fromSlot: slot })
                              );
                              e.dataTransfer.setData("text/plain", card.key);
                            }}
                          />
                          <p className="student-meta">{card.label}</p>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSlotsByActivity((prev) => {
                                const current = { ...(prev[activity.id] || {}) };
                                delete current[slot];
                                return { ...prev, [activity.id]: current };
                              });
                            }}
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <p className="student-meta">Drop card here</p>
                      )}
                    </div>
                  );
                })}
              </div>
              ) : null}

              {activity.type === "drag_number_order" ? (
              <div className="pre-card-grid section-top">
                {remainingCards.map((card: { key: string; number: number; image: string; label: string }) => (
                  <button
                    key={card.key}
                    type="button"
                    className="pre-kid-card"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", card.key)}
                    onClick={() => {
                      const targetSlot =
                        selectedSlot ??
                        activity.dragNumberOrder?.targetOrder.find((slot: number) => !slotsByActivity[activity.id]?.[slot]) ??
                        null;
                      if (!targetSlot) return;
                      placeCardInSlot(targetSlot, card.key, null);
                    }}
                  >
                    <img src={card.image} alt={card.label} style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 18 }} />
                    <span className="pre-kid-card-label">{card.label}</span>
                  </button>
                ))}
              </div>
              ) : null}

              {activity.type === "match_image_pairs" ? (
                <div className="section-top">
                  {(activity.matchImagePairs?.leftImages || []).map((left: { key: string; image: string; label: string }) => {
                    const selectedRight = matchByActivity[activity.id]?.[left.key];
                    const selectedRightImage = (activity.matchImagePairs?.rightImages || []).find((item: { key: string; image?: string; shape?: string; label: string }) => item.key === selectedRight);
                    return (
                      <div key={left.key} className="match-row section-top">
                        <div className="match-left">
                          <img src={left.image} alt={left.label} className="aptitude-image" />
                        </div>
                        <span className="match-arrow">→</span>
                        <div className="choice-pool">
                          {(activity.matchImagePairs?.rightImages || []).map((right: { key: string; image?: string; shape?: string; label: string }) => (
                            <button
                              key={`${left.key}-${right.key}`}
                              type="button"
                              className={`pre-kid-card ${selectedRight === right.key ? "number-option-btn-selected" : ""}`}
                              onClick={() =>
                                setMatchByActivity((prev) => ({
                                  ...prev,
                                  [activity.id]: {
                                    ...(prev[activity.id] || {}),
                                    [left.key]: right.key
                                  }
                                }))
                              }
                            >
                              {right.image ? (
                                <img src={right.image} alt={right.label} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 12 }} />
                              ) : right.shape ? (
                                <div className={`shape-chip shape-${right.shape}`} />
                              ) : (
                                <span className="pre-kid-card-label">{right.label}</span>
                              )}
                              <span className="pre-kid-card-label">{right.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="match-right">
                          {selectedRightImage ? <img src={selectedRightImage.image} alt={selectedRightImage.label} className="aptitude-image" /> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {activity.type === "match_shapes" ? (
                <div className="section-top">
                  {(activity.matchShapes?.leftShapes || []).map((left: { key: string; shape: string; label: string }) => {
                    const selectedRight = matchByActivity[activity.id]?.[left.key];
                    return (
                      <div key={left.key} className="match-row section-top">
                        <div className="match-left">
                          <div className={`shape-chip shape-${left.shape}`} />
                        </div>
                        <span className="match-arrow">→</span>
                        <div className="choice-pool">
                          {(activity.matchShapes?.rightShapes || []).map((right: { key: string; shape: string; label: string }) => (
                            <button
                              key={`${left.key}-${right.key}`}
                              type="button"
                              className={`shape-option-btn ${selectedRight === right.key ? "number-option-btn-selected" : ""}`}
                              onClick={() =>
                                setMatchByActivity((prev) => ({
                                  ...prev,
                                  [activity.id]: {
                                    ...(prev[activity.id] || {}),
                                    [left.key]: right.key
                                  }
                                }))
                              }
                            >
                              <div className={`shape-chip shape-${right.shape}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {activity.type === "circle_lowercase" ? (
                <div className="section-top">
                  {(activity.circleLowercaseRows || []).map((row: { key: string; uppercase: string; options: string[]; answer: string }) => (
                    <div key={row.key} className="match-row section-top">
                      <div className="match-left">
                        <span className="pre-kid-card-label" style={{ fontSize: "2rem" }}>{row.uppercase}</span>
                      </div>
                      <span className="match-arrow">→</span>
                      <div className="choice-pool">
                        {row.options.map((letter: string) => (
                          <button
                            key={`${row.key}-${letter}`}
                            type="button"
                            className={`number-option-btn ${lowercaseByActivity[activity.id]?.[row.key] === letter ? "number-option-btn-selected" : ""}`}
                            onClick={() =>
                              setLowercaseByActivity((prev) => ({
                                ...prev,
                                [activity.id]: {
                                  ...(prev[activity.id] || {}),
                                  [row.key]: letter
                                }
                              }))
                            }
                          >
                            {letter}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {activity.type === "drag_sort_groups" ? (
                <div className="section-top">
                  <div className="choice-pool">
                    {(activity.dragSortGroups?.groups || []).map((group: { key: string; label: string }) => {
                      const groupItems = (activity.dragSortGroups?.items || []).filter(
                        (item: { key: string; image?: string; label: string; answerGroupKey: string }) => sortGroupByActivity[activity.id]?.[item.key] === group.key
                      );
                      return (
                        <div
                          key={group.key}
                          className="group-fruit-basket"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const itemKey = e.dataTransfer.getData("text/plain");
                            if (!itemKey) return;
                            setSortGroupByActivity((prev) => ({
                              ...prev,
                              [activity.id]: {
                                ...(prev[activity.id] || {}),
                                [itemKey]: group.key
                              }
                            }));
                          }}
                        >
                          <strong>{group.label}</strong>
                          <div className="choice-pool section-top">
                            {groupItems.length === 0 ? (
                              <p className="student-meta">Drop items here</p>
                            ) : (
                              groupItems.map((item: { key: string; image?: string; label: string; answerGroupKey: string }) => (
                                <div key={item.key} className="pre-kid-card">
                                  <img src={item.image} alt={item.label} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 12 }} />
                                  <span className="pre-kid-card-label">{item.label}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pre-card-grid section-top">
                    {(activity.dragSortGroups?.items || [])
                      .filter((item: { key: string; image?: string; label: string; answerGroupKey: string }) => !sortGroupByActivity[activity.id]?.[item.key])
                      .map((item: { key: string; image?: string; label: string; answerGroupKey: string }) => (
                        <button
                          key={item.key}
                          type="button"
                          className="pre-kid-card"
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", item.key)}
                        >
                          <img src={item.image} alt={item.label} style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 16 }} />
                          <span className="pre-kid-card-label">{item.label}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ) : null}

              {isComplete(activity) ? (
                <button type="button" className="btn kid-submit-btn section-top" onClick={handleSubmit} disabled={submitting} aria-busy={submitting}>
                  {playZoneSubmitLabel(submitting, null)}
                </button>
              ) : null}
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}
