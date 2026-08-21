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
import { grade5EnglishActivities } from "@/lib/grade5EnglishAptitude";
import { MapLabelDropBoard } from "@/components/aptitude/MapLabelDropBoard";

export default function Grade5EnglishAptitudePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [mapLabelAnswers, setMapLabelAnswers] = useState<Record<number, Record<string, string>>>({});
  const [matchAnswers, setMatchAnswers] = useState<Record<number, Record<string, string>>>({});
  const [orderSlots, setOrderSlots] = useState<Record<number, Record<number, string>>>({});
  const [sortGroupByActivity, setSortGroupByActivity] = useState<Record<number, Record<string, string>>>({});
  const [selectedOrderSlot, setSelectedOrderSlot] = useState<number | null>(null);
  const [activeLabel, setActiveLabel] = useState<Record<number, string | null>>({});
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
        if (dashboard.student.grade !== 5) {
          setError("This aptitude test is currently available only for Grade 5 students.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }

    loadStudent();
  }, [router, studentId]);

  function getActivityMark(activity: (typeof grade5EnglishActivities)[number]): 0 | 1 {
    if (activity.type === "map_label_drop") {
      const selectedMap = mapLabelAnswers[activity.id] || {};
      const expectedMap = activity.mapLabelDrop?.answerMap || {};
      const allCorrect =
        Object.keys(expectedMap).length > 0 &&
        Object.entries(expectedMap).every(([zoneKey, labelKey]) => selectedMap[zoneKey] === labelKey);
      return allCorrect ? 1 : 0;
    }
    if (activity.type === "image_rows") {
      const selectedMap = matchAnswers[activity.id] || {};
      const allRowsCorrect =
        (activity.imageRows || []).length > 0 &&
        (activity.imageRows || []).every((row) => selectedMap[row.key] === row.answer);
      return allRowsCorrect ? 1 : 0;
    }
    if (activity.type === "text_rows") {
      const selectedMap = matchAnswers[activity.id] || {};
      const allRowsCorrect =
        (activity.textRows || []).length > 0 &&
        (activity.textRows || []).every((row) => selectedMap[row.key] === row.answer);
      return allRowsCorrect ? 1 : 0;
    }
    if (activity.type === "dialogue_fill") {
      const selectedMap = matchAnswers[activity.id] || {};
      const blanks = (activity.dialogueFill?.lines || []).filter((line) => line.blankKey && line.answer);
      const allCorrect =
        blanks.length > 0 && blanks.every((line) => selectedMap[line.blankKey!] === line.answer);
      return allCorrect ? 1 : 0;
    }
    if (activity.type === "drag_number_order") {
      const slots = orderSlots[activity.id] || {};
      const cardsByKey = new Map((activity.dragNumberOrder?.cards || []).map((card) => [card.key, card]));
      const allCorrect = activity.dragNumberOrder?.targetOrder.every((slotNumber) => {
        const placedKey = slots[slotNumber];
        if (!placedKey) return false;
        return cardsByKey.get(placedKey)?.number === slotNumber;
      });
      return allCorrect ? 1 : 0;
    }
    if (activity.type === "drag_sort_groups") {
      const mapped = sortGroupByActivity[activity.id] || {};
      const items = activity.dragSortGroups?.items || [];
      const allCorrect =
        items.length > 0 && items.every((item) => mapped[item.key] === item.answerGroupKey);
      return allCorrect ? 1 : 0;
    }
    return 0;
  }

  async function handleSubmit() {
    if (!studentId || grade !== 5) return;
    setError(null);
    setSubmitting(true);
    try {
      const correctAnswers = grade5EnglishActivities.reduce((count, activity) => count + getActivityMark(activity), 0);
      const session = await startExamSession(studentId, grade5EnglishActivities.length);
      const finalResult = await completeExamSession(
        session.exam_session_id,
        correctAnswers,
        subjectId ?? undefined,
        grade5EnglishActivities.length
      );
      setResult(finalResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit aptitude test");
    } finally {
      setSubmitting(false);
    }
  }

  function isActivityComplete(activity: (typeof grade5EnglishActivities)[number]): boolean {
    if (activity.type === "map_label_drop") {
      const selections = mapLabelAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.mapLabelDrop?.zones || []).length;
    }
    if (activity.type === "image_rows") {
      const selections = matchAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.imageRows || []).length;
    }
    if (activity.type === "text_rows") {
      const selections = matchAnswers[activity.id] || {};
      return Object.keys(selections).length === (activity.textRows || []).length;
    }
    if (activity.type === "dialogue_fill") {
      const selections = matchAnswers[activity.id] || {};
      const blanks = (activity.dialogueFill?.lines || []).filter((line) => line.blankKey);
      return blanks.length > 0 && blanks.every((line) => Boolean(selections[line.blankKey!]));
    }
    if (activity.type === "drag_number_order") {
      const slots = orderSlots[activity.id] || {};
      return activity.dragNumberOrder?.targetOrder.every((slot) => Boolean(slots[slot])) ?? false;
    }
    if (activity.type === "drag_sort_groups") {
      const mapped = sortGroupByActivity[activity.id] || {};
      const items = activity.dragSortGroups?.items || [];
      return items.length > 0 && items.every((item) => Boolean(mapped[item.key]));
    }
    return false;
  }

  const answeredCount = grade5EnglishActivities.reduce((count, activity) => {
    return count + (isActivityComplete(activity) ? 1 : 0);
  }, 0);

  useEffect(() => {
    const current = grade5EnglishActivities[currentActivityIndex];
    if (!current || !isActivityComplete(current)) return;
    if (currentActivityIndex >= grade5EnglishActivities.length - 1) return;
    setCurrentActivityIndex((prev) => Math.min(prev + 1, grade5EnglishActivities.length - 1));
  }, [currentActivityIndex, mapLabelAnswers, matchAnswers, orderSlots, sortGroupByActivity]);

  function placeCardInOrderSlot(activityId: number, slot: number, cardKey: string, fromSlot: number | null) {
    setOrderSlots((prev) => {
      const current = { ...(prev[activityId] || {}) };
      if (fromSlot != null) {
        delete current[fromSlot];
      }
      const existingSlot = Object.entries(current).find(([, key]) => key === cardKey)?.[0];
      if (existingSlot != null) {
        delete current[Number(existingSlot)];
      }
      current[slot] = cardKey;
      return { ...prev, [activityId]: current };
    });
  }

  function removeCardFromOrderSlot(activityId: number, slot: number) {
    setOrderSlots((prev) => {
      const current = { ...(prev[activityId] || {}) };
      delete current[slot];
      return { ...prev, [activityId]: current };
    });
  }

  function assignLabelToZone(activityId: number, zoneKey: string, labelKey: string) {
    setMapLabelAnswers((prev) => {
      const current = { ...(prev[activityId] || {}) };
      const existingZone = Object.entries(current).find(([, value]) => value === labelKey)?.[0];
      if (existingZone && existingZone !== zoneKey) {
        delete current[existingZone];
      }
      current[zoneKey] = labelKey;
      return { ...prev, [activityId]: current };
    });
    setActiveLabel((prev) => ({ ...prev, [activityId]: null }));
  }

  function removeLabelFromZone(activityId: number, zoneKey: string) {
    setMapLabelAnswers((prev) => {
      const current = { ...(prev[activityId] || {}) };
      delete current[zoneKey];
      return { ...prev, [activityId]: current };
    });
  }

  function assignActiveChoice(activityId: number, key: string) {
    const current = activeChoice[activityId];
    if (!current) return;
    setMatchAnswers((prev) => {
      const next = { ...(prev[activityId] || {}) };
      const existingKey = Object.entries(next).find(([, value]) => value === current)?.[0];
      if (existingKey && existingKey !== key) {
        delete next[existingKey];
      }
      next[key] = current;
      return { ...prev, [activityId]: next };
    });
    setActiveChoice((prev) => ({ ...prev, [activityId]: null }));
  }

  function setRowAnswer(activityId: number, key: string, value: string) {
    setMatchAnswers((prev) => ({
      ...prev,
      [activityId]: {
        ...(prev[activityId] || {}),
        [key]: value
      }
    }));
  }

  function assignItemToGroup(activityId: number, itemKey: string, groupKey: string) {
    setSortGroupByActivity((prev) => ({
      ...prev,
      [activityId]: {
        ...(prev[activityId] || {}),
        [itemKey]: groupKey
      }
    }));
    setActiveChoice((prev) => ({ ...prev, [activityId]: null }));
  }

  function removeItemFromGroup(activityId: number, itemKey: string) {
    setSortGroupByActivity((prev) => {
      const current = { ...(prev[activityId] || {}) };
      delete current[itemKey];
      return { ...prev, [activityId]: current };
    });
  }

  function usesSharedWordPool(activity: (typeof grade5EnglishActivities)[number]): boolean {
    const rows = activity.imageRows || [];
    if (rows.length === 0) return false;
    const answers = rows.map((row) => row.answer);
    if (new Set(answers).size !== answers.length) return false;
    const optionSignatures = rows.map((row) => [...row.options].sort().join("|"));
    return new Set(optionSignatures).size === 1;
  }

  function labelText(activity: (typeof grade5EnglishActivities)[number], labelKey: string): string {
    return activity.mapLabelDrop?.labels.find((label) => label.key === labelKey)?.text || labelKey;
  }

  const uiLang: AptitudeUiLang = "english";
  const answeredLine = playZoneFinishedLine(answeredCount, grade5EnglishActivities.length, uiLang);

  return (
    <main className={playZoneMainClassNames(uiLang)}>
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">{playZoneEyebrow("english", uiLang)}</p>
          <h1 className="title dashboard-title kid-aptitude-title">{playZoneTitle(5, "english", uiLang)}</h1>
          <p className="kid-aptitude-kicker">{playZoneKicker("english", uiLang)}</p>
          <p className="subtitle kid-aptitude-subtitle">
            {playZoneSubtitle(studentName, grade5EnglishActivities.length, uiLang)}
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

          {!result && grade === 5 ? (
            <article className="dashboard-item subject-item kid-aptitude-card">
              <div className="subject-item-header kid-aptitude-card-header">
                <span className="kid-activity-badge" title="Current step">
                  <span className="kid-activity-badge-emoji" aria-hidden>
                    ★
                  </span>
                  {playZoneStepBadge(currentActivityIndex, grade5EnglishActivities.length, uiLang)}
                </span>
              </div>
              <p className="student-meta kid-aptitude-answered-line section-top">{answeredLine}</p>

              <div className="students-grid section-top">
                {(() => {
                  const activity = grade5EnglishActivities[currentActivityIndex];
                  if (!activity) return null;
                  return (
                    <div key={activity.id}>
                      <p className="student-meta aptitude-activity-prompt kid-aptitude-prompt" style={{ whiteSpace: "pre-line" }}>
                        {activity.prompt}
                      </p>

                      {activity.type === "map_label_drop" && activity.mapLabelDrop ? (
                        <div className="section-top">
                          <p className="student-meta">
                            Drag each province name into the empty box whose arrow points to that province on the
                            map.
                          </p>
                          <MapLabelDropBoard
                            config={activity.mapLabelDrop}
                            assignedByZone={mapLabelAnswers[activity.id] || {}}
                            activeLabelKey={activeLabel[activity.id] ?? null}
                            onSelectLabel={(labelKey) =>
                              setActiveLabel((prev) => ({ ...prev, [activity.id]: labelKey }))
                            }
                            onAssignLabel={(zoneKey, labelKey) => assignLabelToZone(activity.id, zoneKey, labelKey)}
                            onRemoveLabel={(zoneKey) => removeLabelFromZone(activity.id, zoneKey)}
                            labelText={(labelKey) => labelText(activity, labelKey)}
                          />
                        </div>
                      ) : activity.type === "image_rows" ? (
                        usesSharedWordPool(activity) ? (
                          <div className="number-rows-grid section-top">
                            <div className="choice-pool">
                              {Array.from(new Set((activity.imageRows || []).flatMap((row) => row.options))).map((word) => {
                                const selected = activeChoice[activity.id] === word;
                                const used = Object.values(matchAnswers[activity.id] || {}).includes(word);
                                return (
                                  <button
                                    key={`img-pool-${word}`}
                                    type="button"
                                    className={`number-option-btn ${selected ? "number-option-btn-selected" : ""} ${used ? "number-option-btn-used" : ""}`}
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
                            <p className="student-meta">
                              {activity.id === 7
                                ? "Tap an action word above, then tap the blank that matches the picture."
                                : "Tap a sport name above, then tap the matching picture box."}
                            </p>
                            {(activity.imageRows || []).map((row) => (
                              <div key={row.key} className="number-row-card">
                                <button type="button" className="number-badge" onClick={() => assignActiveChoice(activity.id, row.key)}>
                                  <img src={row.image} alt={row.key} className="number-badge-image" />
                                </button>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                  {row.label ? (
                                    <p className="student-meta" style={{ fontWeight: 700 }}>
                                      {row.label}
                                    </p>
                                  ) : null}
                                  <button
                                    type="button"
                                    className={`match-target ${matchAnswers[activity.id]?.[row.key] ? "match-target-filled" : ""}`}
                                    onClick={() => assignActiveChoice(activity.id, row.key)}
                                  >
                                    {matchAnswers[activity.id]?.[row.key] ||
                                      (activity.id === 7 ? "Tap to assign word" : "Tap to assign sport")}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="number-rows-grid section-top">
                            <p className="student-meta">
                              {activity.id === 5
                                ? "Tap sh or ch to complete each word."
                                : "Tap the correct pronoun for each sentence."}
                            </p>
                            {(activity.imageRows || []).map((row, index) => (
                              <div key={row.key} className="number-row-card">
                                <div className="number-badge">
                                  <span className="student-meta" style={{ fontWeight: 800 }}>
                                    {index + 1}.
                                  </span>
                                  <img src={row.image} alt={row.key} className="number-badge-image" />
                                </div>
                                <div>
                                  {row.label ? (
                                    <p className="student-meta" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                                      {activity.id === 5 && matchAnswers[activity.id]?.[row.key]
                                        ? `${matchAnswers[activity.id][row.key]}${row.label.replace(/^_+/, "")}`
                                        : row.label}
                                    </p>
                                  ) : null}
                                  <div className="choice-pool section-top">
                                    {row.options.map((option) => {
                                      const selected = matchAnswers[activity.id]?.[row.key] === option;
                                      return (
                                        <button
                                          key={`${row.key}-${option}`}
                                          type="button"
                                          className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                                          onClick={() => setRowAnswer(activity.id, row.key, option)}
                                        >
                                          {option}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : activity.type === "drag_number_order" && activity.dragNumberOrder ? (
                        <div className="section-top">
                          <p className="student-meta">
                            Tap a numbered box, then tap a picture (or drag and drop) to put the planting steps in
                            order.
                          </p>
                          <div className="pre-slot-grid section-top">
                            {activity.dragNumberOrder.targetOrder.map((slot) => {
                              const cardKey = orderSlots[activity.id]?.[slot];
                              const card = activity.dragNumberOrder?.cards.find((item) => item.key === cardKey);
                              const isSelected = selectedOrderSlot === slot;
                              return (
                                <div
                                  key={`slot-${slot}`}
                                  className={`pre-slot-card ${isSelected ? "pre-slot-selected" : ""}`}
                                  onClick={() => setSelectedOrderSlot(slot)}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const payloadRaw = e.dataTransfer.getData("application/json");
                                    if (payloadRaw) {
                                      try {
                                        const payload = JSON.parse(payloadRaw) as { key?: string; fromSlot?: number };
                                        if (!payload.key) return;
                                        placeCardInOrderSlot(activity.id, slot, payload.key, payload.fromSlot ?? null);
                                        setSelectedOrderSlot(slot);
                                        return;
                                      } catch {
                                        // fall through
                                      }
                                    }
                                    const droppedKey = e.dataTransfer.getData("text/plain");
                                    if (!droppedKey) return;
                                    placeCardInOrderSlot(activity.id, slot, droppedKey, null);
                                    setSelectedOrderSlot(slot);
                                  }}
                                >
                                  <div className="pre-slot-badge">{slot}.</div>
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
                                          removeCardFromOrderSlot(activity.id, slot);
                                        }}
                                      >
                                        Remove
                                      </button>
                                    </>
                                  ) : (
                                    <p className="student-meta">Drop here</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="pre-card-grid section-top">
                            {(activity.dragNumberOrder.cards || [])
                              .filter((card) => !Object.values(orderSlots[activity.id] || {}).includes(card.key))
                              .map((card) => (
                                <button
                                  key={card.key}
                                  type="button"
                                  className="pre-kid-card"
                                  draggable
                                  onDragStart={(e) => e.dataTransfer.setData("text/plain", card.key)}
                                  onClick={() => {
                                    const targetSlot =
                                      selectedOrderSlot ??
                                      activity.dragNumberOrder?.targetOrder.find(
                                        (slot) => !orderSlots[activity.id]?.[slot]
                                      ) ??
                                      null;
                                    if (targetSlot == null) return;
                                    placeCardInOrderSlot(activity.id, targetSlot, card.key, null);
                                  }}
                                >
                                  <img
                                    src={card.image}
                                    alt={card.label}
                                    style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 18 }}
                                  />
                                  <span className="pre-kid-card-label">{card.label}</span>
                                </button>
                              ))}
                          </div>
                        </div>
                      ) : activity.type === "drag_sort_groups" && activity.dragSortGroups ? (
                        <div className="section-top">
                          <p className="student-meta">
                            Drag each habit into Healthy Habits or Unhealthy Habits (or tap a label, then tap a
                            column).
                          </p>
                          <div
                            className="choice-pool section-top"
                            style={{
                              border: "2px solid #7b5ea7",
                              borderRadius: 12,
                              padding: 12,
                              gap: 10,
                              flexWrap: "wrap"
                            }}
                          >
                            {(activity.dragSortGroups.items || [])
                              .filter((item) => !sortGroupByActivity[activity.id]?.[item.key])
                              .map((item) => {
                                const selected = activeChoice[activity.id] === item.key;
                                return (
                                  <button
                                    key={item.key}
                                    type="button"
                                    className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData("text/plain", item.key)}
                                    onClick={() =>
                                      setActiveChoice((prev) => ({
                                        ...prev,
                                        [activity.id]: selected ? null : item.key
                                      }))
                                    }
                                  >
                                    {item.label}
                                  </button>
                                );
                              })}
                          </div>
                          <div
                            className="section-top"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                              gap: 20
                            }}
                          >
                            {(activity.dragSortGroups.groups || []).map((group) => {
                              const groupItems = (activity.dragSortGroups?.items || []).filter(
                                (item) => sortGroupByActivity[activity.id]?.[item.key] === group.key
                              );
                              return (
                                <div key={group.key} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                  <div
                                    className="number-option-btn"
                                    style={{ justifyContent: "center", cursor: "default", fontWeight: 800 }}
                                  >
                                    {group.label}
                                  </div>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const itemKey = e.dataTransfer.getData("text/plain");
                                      if (!itemKey) return;
                                      const isItem = (activity.dragSortGroups?.items || []).some(
                                        (item) => item.key === itemKey
                                      );
                                      if (!isItem) return;
                                      assignItemToGroup(activity.id, itemKey, group.key);
                                    }}
                                    onClick={() => {
                                      const selected = activeChoice[activity.id];
                                      if (!selected) return;
                                      assignItemToGroup(activity.id, selected, group.key);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key !== "Enter" && e.key !== " ") return;
                                      const selected = activeChoice[activity.id];
                                      if (!selected) return;
                                      assignItemToGroup(activity.id, selected, group.key);
                                    }}
                                    style={{
                                      minHeight: 320,
                                      backgroundImage: group.image ? `url(${group.image})` : undefined,
                                      backgroundColor: "#fff",
                                      backgroundSize: "100% 100%",
                                      backgroundRepeat: "no-repeat",
                                      backgroundPosition: "center",
                                      border: group.image ? "none" : "2px dashed #2f7a3e",
                                      borderRadius: 8,
                                      padding: "36px 28px 48px",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "stretch",
                                      gap: 8
                                    }}
                                  >
                                    {groupItems.length === 0 ? (
                                      <p className="student-meta" style={{ textAlign: "center", marginTop: 40 }}>
                                        Drop habits here
                                      </p>
                                    ) : (
                                      groupItems.map((item) => (
                                        <button
                                          key={item.key}
                                          type="button"
                                          className="number-option-btn"
                                          title="Remove"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeItemFromGroup(activity.id, item.key);
                                          }}
                                          style={{ width: "100%", justifyContent: "center" }}
                                        >
                                          {item.label}
                                        </button>
                                      ))
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : activity.type === "text_rows" ? (
                        <div className="number-rows-grid section-top">
                          <p className="student-meta">
                            {activity.id === 9
                              ? "Tap the correct advice for each problem."
                              : "Tap the correct community helper for each scenario."}
                          </p>
                          {(activity.textRows || []).map((row) => (
                            <div key={row.key} className="number-row-card">
                              <div className="match-left" style={{ fontWeight: 700 }}>
                                {row.prompt}
                              </div>
                              <div className="choice-pool">
                                {row.options.map((option) => {
                                  const selected = matchAnswers[activity.id]?.[row.key] === option;
                                  return (
                                    <button
                                      key={`${row.key}-${option}`}
                                      type="button"
                                      className={`number-option-btn ${selected ? "number-option-btn-selected" : ""}`}
                                      onClick={() => setRowAnswer(activity.id, row.key, option)}
                                    >
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : activity.type === "dialogue_fill" && activity.dialogueFill ? (
                        <div className="section-top">
                          <p className="student-meta">
                            Tap a sentence below, then tap a blank (or drag and drop the sentence into the blank).
                          </p>
                          <div
                            className="choice-pool section-top"
                            style={{
                              border: "2px solid #7b5ea7",
                              borderRadius: 12,
                              padding: 12,
                              gap: 10,
                              flexWrap: "wrap"
                            }}
                          >
                            {activity.dialogueFill.choices.map((choice) => {
                              const selected = activeChoice[activity.id] === choice;
                              const used = Object.values(matchAnswers[activity.id] || {}).includes(choice);
                              return (
                                <button
                                  key={choice}
                                  type="button"
                                  className={`number-option-btn ${selected ? "number-option-btn-selected" : ""} ${used ? "number-option-btn-used" : ""}`}
                                  draggable={!used}
                                  onDragStart={(e) => {
                                    if (used) {
                                      e.preventDefault();
                                      return;
                                    }
                                    e.dataTransfer.setData("text/plain", choice);
                                  }}
                                  onClick={() => {
                                    if (used) return;
                                    setActiveChoice((prev) => ({
                                      ...prev,
                                      [activity.id]: selected ? null : choice
                                    }));
                                  }}
                                >
                                  {choice}
                                </button>
                              );
                            })}
                          </div>
                          <div
                            className="section-top"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                              maxWidth: 720
                            }}
                          >
                            {activity.dialogueFill.lines.map((line, index) => {
                              if (line.blankKey) {
                                const filled = matchAnswers[activity.id]?.[line.blankKey];
                                return (
                                  <div
                                    key={`blank-${line.blankKey}`}
                                    style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                                  >
                                    <strong style={{ minWidth: 88 }}>{line.speaker}:</strong>
                                    <button
                                      type="button"
                                      className={`match-target ${filled ? "match-target-filled" : ""}`}
                                      style={{ flex: 1, textAlign: "left", minHeight: 44 }}
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        const dropped = e.dataTransfer.getData("text/plain");
                                        if (!dropped) return;
                                        if (!(activity.dialogueFill?.choices || []).includes(dropped)) return;
                                        setMatchAnswers((prev) => {
                                          const next = { ...(prev[activity.id] || {}) };
                                          const existingKey = Object.entries(next).find(([, value]) => value === dropped)?.[0];
                                          if (existingKey && existingKey !== line.blankKey) {
                                            delete next[existingKey];
                                          }
                                          next[line.blankKey!] = dropped;
                                          return { ...prev, [activity.id]: next };
                                        });
                                        setActiveChoice((prev) => ({ ...prev, [activity.id]: null }));
                                      }}
                                      onClick={() => {
                                        if (activeChoice[activity.id]) {
                                          assignActiveChoice(activity.id, line.blankKey!);
                                          return;
                                        }
                                        if (filled) {
                                          setMatchAnswers((prev) => {
                                            const next = { ...(prev[activity.id] || {}) };
                                            delete next[line.blankKey!];
                                            return { ...prev, [activity.id]: next };
                                          });
                                        }
                                      }}
                                    >
                                      {filled || `(${line.blankKey}) Tap or drop sentence here`}
                                    </button>
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={`line-${index}-${line.speaker}`}
                                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                                >
                                  <strong style={{ minWidth: 88 }}>{line.speaker}:</strong>
                                  <span>{line.text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>

              {answeredCount === grade5EnglishActivities.length ? (
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
