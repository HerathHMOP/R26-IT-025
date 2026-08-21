"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getStoredUser, getStudentDashboard } from "@/lib/api";
import {
  grade2EnglishLevel2Activities,
  grade2EnglishLevel2Activity1,
  grade2EnglishLevel2Activity2,
  grade2EnglishLevel2Activity3,
  grade2EnglishLevel2Activity4,
  type FoodLikeChoice
} from "@/lib/grade2EnglishLevel2";
import {
  isGrade2EnglishLevelUnlocked,
  markGrade2EnglishLevel2Complete
} from "@/lib/grade2EnglishLevelProgress";
import { MapLabelDropBoard } from "@/components/aptitude/MapLabelDropBoard";
import type { Grade2Activity } from "@/lib/grade2EnglishAptitude";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function normalizeSpeech(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function speechMatches(transcript: string, accepted: string[]): boolean {
  const spoken = normalizeSpeech(transcript);
  return accepted.some((phrase) => spoken === phrase || spoken.includes(phrase));
}

export default function Grade2EnglishLevel2Page() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const foodActivity = grade2EnglishLevel2Activity1;
  const classroomActivity = grade2EnglishLevel2Activity2;
  const environmentActivity = grade2EnglishLevel2Activity3;
  const colorActivity = grade2EnglishLevel2Activity4;
  const items = foodActivity.items;

  const [studentName, setStudentName] = useState("Student");
  const [error, setError] = useState<string | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [envStepIndex, setEnvStepIndex] = useState(0);
  const [colorStepIndex, setColorStepIndex] = useState(0);
  const [choiceByItem, setChoiceByItem] = useState<Record<string, FoodLikeChoice>>({});
  const [spokenByItem, setSpokenByItem] = useState<Record<string, boolean>>({});
  const [classroomAnswers, setClassroomAnswers] = useState<Record<string, string>>({});
  const [activeClassroomLabel, setActiveClassroomLabel] = useState<string | null>(null);
  const [envChoiceByStep, setEnvChoiceByStep] = useState<Record<string, string>>({});
  const [envSpokenByStep, setEnvSpokenByStep] = useState<Record<string, boolean>>({});
  const [colorChoiceByStep, setColorChoiceByStep] = useState<Record<string, string>>({});
  const [colorSpokenByStep, setColorSpokenByStep] = useState<Record<string, boolean>>({});
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const [levelLocked, setLevelLocked] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const activity = grade2EnglishLevel2Activities[activityIndex];
  const current = items[itemIndex];
  const envStep = environmentActivity.steps[envStepIndex];
  const colorStep = colorActivity.steps[colorStepIndex];
  const choice = current ? choiceByItem[current.key] : undefined;
  const spoken = current ? Boolean(spokenByItem[current.key]) : false;
  const foodCompleted = items.filter((item) => choiceByItem[item.key] && spokenByItem[item.key]).length;
  const foodMax = items.length;
  const classroomZones = classroomActivity.classroomLabelDrop.zones.length;
  const classroomFilled = Object.keys(classroomAnswers).length;
  const classroomCorrect = Object.entries(classroomActivity.classroomLabelDrop.answerMap).every(
    ([zoneKey, labelKey]) => classroomAnswers[zoneKey] === labelKey
  );
  const classroomComplete = classroomFilled === classroomZones && classroomCorrect;

  const envCompleted = environmentActivity.steps.filter((step) => {
    if (step.kind === "choose_clean") {
      return envChoiceByStep[step.key] === step.correctOptionKey && envSpokenByStep[step.key];
    }
    return Boolean(envSpokenByStep[step.key]);
  }).length;
  const envMax = environmentActivity.steps.length;

  const colorCompleted = colorActivity.steps.filter(
    (step) => colorChoiceByStep[step.key] === step.answer && colorSpokenByStep[step.key]
  ).length;
  const colorMax = colorActivity.steps.length;

  const score =
    activity?.type === "classroom_label_drop"
      ? Object.entries(classroomActivity.classroomLabelDrop.answerMap).filter(
          ([zoneKey, labelKey]) => classroomAnswers[zoneKey] === labelKey
        ).length
      : activity?.type === "environment_changes"
        ? envCompleted
        : activity?.type === "color_choose_speak"
          ? colorCompleted
          : foodCompleted;
  const maxScore =
    activity?.type === "classroom_label_drop"
      ? classroomZones
      : activity?.type === "environment_changes"
        ? envMax
        : activity?.type === "color_choose_speak"
          ? colorMax
          : foodMax;
  const allDone =
    activity?.type === "classroom_label_drop"
      ? classroomComplete
      : activity?.type === "environment_changes"
        ? envCompleted === envMax
        : activity?.type === "color_choose_speak"
          ? colorCompleted === colorMax
          : foodCompleted === foodMax;

  const level2AllCorrect =
    foodCompleted === foodMax &&
    classroomComplete &&
    envCompleted === envMax &&
    colorCompleted === colorMax;

  useEffect(() => {
    if (!studentId || !level2AllCorrect) return;
    markGrade2EnglishLevel2Complete(studentId);
  }, [studentId, level2AllCorrect]);

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
        if (dashboard.student.grade !== 2) {
          setError("This level is currently available only for Grade 2 students.");
        }
        const english = dashboard.subjects.find((s) => String(s.code).toLowerCase() === "english");
        const eligible = english?.eligible_levels || [];
        if (!isGrade2EnglishLevelUnlocked(studentId, 2, eligible)) {
          setLevelLocked(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }

    loadStudent();
    setMicSupported(Boolean(getSpeechRecognition()));
  }, [router, studentId]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const speakQuestion = useCallback(() => {
    if (!current || typeof window === "undefined" || !window.speechSynthesis) {
      setFeedback(`Do you like ${current?.questionNoun}?`);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(`Do you like ${current.questionNoun}?`);
    utter.lang = "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }, [current]);

  useEffect(() => {
    if (!current || activity?.type !== "food_like_speak") return;
    setFeedback(null);
    const t = window.setTimeout(() => speakQuestion(), 400);
    return () => window.clearTimeout(t);
  }, [current?.key, activity?.type]); // eslint-disable-line react-hooks/exhaustive-deps

  function selectChoice(next: FoodLikeChoice) {
    if (!current) return;
    setChoiceByItem((prev) => ({ ...prev, [current.key]: next }));
    setSpokenByItem((prev) => {
      const copy = { ...prev };
      delete copy[current.key];
      return copy;
    });
    setFeedback(
      next === "like"
        ? `Now say: “I like ${current.questionNoun}.”`
        : `Now say: “I don't like ${current.questionNoun}.”`
    );
  }

  function markSpoken() {
    if (!current || !choice) return;
    setSpokenByItem((prev) => ({ ...prev, [current.key]: true }));
    setFeedback("Great job! Keep going!");
  }

  function listenForSentence() {
    if (!current || !choice) {
      setFeedback("Choose I Like or I Don't Like first.");
      return;
    }

    const accepted = choice === "like" ? current.likeAccept : current.dontLikeAccept;
    startSpeechListen(accepted, () => {
      setSpokenByItem((prev) => ({ ...prev, [current.key]: true }));
      setFeedback("Great job! Keep going!");
    }, `Try: “${choice === "like" ? `I like ${current.questionNoun}.` : `I don't like ${current.questionNoun}.`}”`);
  }

  function startSpeechListen(accepted: string[], onSuccess: () => void, retryHint: string) {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      setMicSupported(false);
      onSuccess();
      setFeedback("Mic not available — marked as said.");
      return;
    }

    recognitionRef.current?.stop();
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setListening(true);
    setFeedback("Listening… say the sentence!");

    recognition.onresult = (event) => {
      const transcripts: string[] = [];
      for (let i = 0; i < event.results.length; i += 1) {
        const alt = event.results[i]?.[0]?.transcript;
        if (alt) transcripts.push(alt);
      }
      const matched = transcripts.some((t) => speechMatches(t, accepted));
      if (matched) {
        onSuccess();
      } else {
        setFeedback(`I heard “${transcripts[0] || "…"}”. ${retryHint}`);
      }
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      setFeedback("Could not hear you. Tap again, or use Mark as said.");
    };

    recognition.onend = () => setListening(false);

    try {
      recognition.start();
    } catch {
      setListening(false);
      setFeedback("Microphone busy. Try again.");
    }
  }

  function listenForEnvStep() {
    if (!envStep) return;
    if (envStep.kind === "choose_clean" && envChoiceByStep[envStep.key] !== envStep.correctOptionKey) {
      setFeedback("Tap the clean picture first.");
      return;
    }
    startSpeechListen(envStep.sayAccept, () => {
      setEnvSpokenByStep((prev) => ({ ...prev, [envStep.key]: true }));
      setFeedback("Great job!");
    }, `Try: “${envStep.speakPrompt}”`);
  }

  function markEnvSpoken() {
    if (!envStep) return;
    if (envStep.kind === "choose_clean" && envChoiceByStep[envStep.key] !== envStep.correctOptionKey) {
      setFeedback("Tap the clean picture first.");
      return;
    }
    setEnvSpokenByStep((prev) => ({ ...prev, [envStep.key]: true }));
    setFeedback("Marked as said.");
  }

  function selectEnvOption(optionKey: string) {
    if (!envStep || envStep.kind !== "choose_clean") return;
    setEnvChoiceByStep((prev) => ({ ...prev, [envStep.key]: optionKey }));
    setEnvSpokenByStep((prev) => {
      const next = { ...prev };
      delete next[envStep.key];
      return next;
    });
    if (optionKey === envStep.correctOptionKey) {
      setFeedback(`Good! Now say: “${envStep.speakPrompt}”`);
    } else {
      setFeedback("Look again — which one is clean?");
    }
  }

  function selectColorOption(option: string) {
    if (!colorStep) return;
    setColorChoiceByStep((prev) => ({ ...prev, [colorStep.key]: option }));
    setColorSpokenByStep((prev) => {
      const next = { ...prev };
      delete next[colorStep.key];
      return next;
    });
    if (option === colorStep.answer) {
      setFeedback(`Good! Now say: “${colorStep.speakPrompt}”`);
    } else {
      setFeedback("Try another color.");
    }
  }

  function listenForColorStep() {
    if (!colorStep) return;
    if (colorChoiceByStep[colorStep.key] !== colorStep.answer) {
      setFeedback("Choose the correct color first.");
      return;
    }
    startSpeechListen(
      colorStep.sayAccept,
      () => {
        setColorSpokenByStep((prev) => ({ ...prev, [colorStep.key]: true }));
        setFeedback("Great job!");
      },
      `Try: “${colorStep.speakPrompt}”`
    );
  }

  function markColorSpoken() {
    if (!colorStep) return;
    if (colorChoiceByStep[colorStep.key] !== colorStep.answer) {
      setFeedback("Choose the correct color first.");
      return;
    }
    setColorSpokenByStep((prev) => ({ ...prev, [colorStep.key]: true }));
    setFeedback("Marked as said.");
  }

  function assignClassroomLabel(zoneKey: string, labelKey: string) {
    setClassroomAnswers((prev) => {
      const next = { ...prev };
      const existingZone = Object.entries(next).find(([, value]) => value === labelKey)?.[0];
      if (existingZone && existingZone !== zoneKey) {
        delete next[existingZone];
      }
      next[zoneKey] = labelKey;
      return next;
    });
    setActiveClassroomLabel(null);
  }

  function removeClassroomLabel(zoneKey: string) {
    setClassroomAnswers((prev) => {
      const next = { ...prev };
      delete next[zoneKey];
      return next;
    });
  }

  function classroomLabelText(labelKey: string): string {
    return classroomActivity.classroomLabelDrop.labels.find((label) => label.key === labelKey)?.text || labelKey;
  }

  if (!activity) return null;
  if (activity.type === "food_like_speak" && !current) return null;

  return (
    <main className="dashboard-screen kid-aptitude-play aptitude-lang-english food-choice-challenge">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">Grade 2 · Level 2</p>
          <h1 className="title dashboard-title kid-aptitude-title">
            ★ Activity {activity.id}: {activity.title} ★
          </h1>
          <p className="kid-aptitude-kicker">{activity.prompt}</p>
          <p className="subtitle kid-aptitude-subtitle">Hi {studentName}!</p>
        </div>
        <div className="dashboard-topbar-actions">
          <span className="kid-activity-badge" title="Score">
            ★ {score} / {maxScore}
          </span>
          <Link href={`/dashboard/students/${studentId}`} className="btn btn-secondary">
            Home
          </Link>
        </div>
      </header>

      <section className="dashboard-content dashboard-content-single">
        <section className="dashboard-panel dashboard-main-panel">
          {error ? <p className="error-text">{error}</p> : null}

          {!error && levelLocked ? (
            <article className="dashboard-item subject-item kid-aptitude-card">
              <h2 className="dashboard-panel-title">Level 2 is locked</h2>
              <p className="student-meta">
                Complete the Grade 2 English aptitude test (or finish Level 1) to unlock Level 2.
              </p>
              <div className="section-top level-actions">
                <Link href={`/dashboard/students/${studentId}/levels/english/grade-2/level-1`} className="btn">
                  Go to Level 1
                </Link>
                <Link href={`/dashboard/students/${studentId}`} className="btn btn-secondary">
                  Back to profile
                </Link>
              </div>
            </article>
          ) : null}

          {!error && !levelLocked ? (
            <>
              <div className="choice-pool section-top" style={{ marginBottom: 12 }}>
                {grade2EnglishLevel2Activities.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`number-option-btn ${activityIndex === index ? "number-option-btn-selected" : ""}`}
                    onClick={() => {
                      setActivityIndex(index);
                      setFeedback(null);
                      setActiveClassroomLabel(null);
                    }}
                  >
                    Activity {item.id}
                  </button>
                ))}
              </div>

              {activity.type === "food_like_speak" && current ? (
                <article className="dashboard-item subject-item kid-aptitude-card food-choice-card">
                  <p className="student-meta">
                    Item {itemIndex + 1} of {items.length}
                  </p>
                  <div className="family-progress">
                    {items.map((item, i) => (
                      <button
                        key={item.key}
                        type="button"
                        className={`family-step-dot ${i === itemIndex ? "family-step-dot-active" : ""} ${
                          choiceByItem[item.key] && spokenByItem[item.key] ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => setItemIndex(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="food-choice-layout section-top">
                    <div className="food-choice-image-wrap">
                      <img src={current.image} alt={current.label} className="food-choice-image" />
                    </div>

                    <div className="food-choice-panel">
                      <button type="button" className="btn btn-secondary" onClick={speakQuestion}>
                        🔊 Do you like {current.questionNoun}?
                      </button>

                      <div className="food-choice-buttons">
                        <button
                          type="button"
                          className={`btn food-like-btn ${choice === "like" ? "food-choice-selected" : ""}`}
                          onClick={() => selectChoice("like")}
                        >
                          😊 I Like
                        </button>
                        <button
                          type="button"
                          className={`btn food-dislike-btn ${choice === "dont_like" ? "food-choice-selected" : ""}`}
                          onClick={() => selectChoice("dont_like")}
                        >
                          ☹️ I Don&apos;t Like
                        </button>
                      </div>

                      {choice ? (
                        <>
                          <p className="student-meta" style={{ fontWeight: 700 }}>
                            Now say the full sentence.
                          </p>
                          <p className="student-meta">
                            Example:{" "}
                            {choice === "like"
                              ? `“I like ${current.questionNoun}.”`
                              : `“I don't like ${current.questionNoun}.”`}
                          </p>
                          <button
                            type="button"
                            className="btn family-mic-btn"
                            onClick={listenForSentence}
                            disabled={listening}
                          >
                            {listening ? "Listening…" : spoken ? "✓ Recorded!" : "🎤 Tap to record your answer"}
                          </button>
                          {!spoken ? (
                            <button type="button" className="btn btn-secondary" onClick={markSpoken}>
                              Mark as said
                            </button>
                          ) : null}
                        </>
                      ) : (
                        <p className="student-meta">Choose I Like or I Don&apos;t Like first.</p>
                      )}

                      {!micSupported ? (
                        <p className="student-meta">Voice not available — use Mark as said after choosing.</p>
                      ) : null}
                      {feedback ? <p className="alphabet-feedback">{feedback}</p> : null}
                    </div>
                  </div>

                  <div className="alphabet-nav section-top">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={itemIndex === 0}
                      onClick={() => setItemIndex((i) => Math.max(0, i - 1))}
                    >
                      Back
                    </button>
                    {itemIndex < items.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setItemIndex((i) => Math.min(items.length - 1, i + 1))}
                      >
                        Next
                      </button>
                    ) : (
                      <button type="button" className="btn" onClick={() => setActivityIndex(1)}>
                        {foodCompleted === foodMax ? "Go to Activity 2 ★" : "Activity 2"}
                      </button>
                    )}
                  </div>
                </article>
              ) : null}

              {activity.type === "classroom_label_drop" ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta">
                    Drag each word into the box that points to that object (or tap a word, then tap a box). Chair is
                    used twice.
                  </p>
                  <div className="section-top">
                    <MapLabelDropBoard
                      config={
                        classroomActivity.classroomLabelDrop as NonNullable<Grade2Activity["mapLabelDrop"]>
                      }
                      assignedByZone={classroomAnswers}
                      activeLabelKey={activeClassroomLabel}
                      onSelectLabel={setActiveClassroomLabel}
                      onAssignLabel={assignClassroomLabel}
                      onRemoveLabel={removeClassroomLabel}
                      labelText={classroomLabelText}
                    />
                  </div>
                  <p className="student-meta section-top">
                    Correct labels: {score}/{maxScore}
                    {classroomComplete ? " — All correct ★" : ""}
                  </p>
                  <div className="alphabet-nav section-top">
                    <button type="button" className="btn btn-secondary" onClick={() => setActivityIndex(0)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setActivityIndex(2);
                        setFeedback(null);
                      }}
                    >
                      {classroomComplete ? "Go to Activity 3 ★" : "Activity 3"}
                    </button>
                  </div>
                </article>
              ) : null}

              {activity.type === "environment_changes" && envStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <div className="family-progress">
                    {environmentActivity.steps.map((step, i) => {
                      const done =
                        step.kind === "choose_clean"
                          ? envChoiceByStep[step.key] === step.correctOptionKey && envSpokenByStep[step.key]
                          : Boolean(envSpokenByStep[step.key]);
                      return (
                        <button
                          key={step.key}
                          type="button"
                          className={`family-step-dot ${i === envStepIndex ? "family-step-dot-active" : ""} ${
                            done ? "family-step-dot-done" : ""
                          }`}
                          onClick={() => {
                            setEnvStepIndex(i);
                            setFeedback(null);
                          }}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  <p className="student-meta section-top" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                    {envStep.question}
                  </p>

                  {envStep.kind === "choose_clean" ? (
                    <div className="env-compare-grid section-top">
                      {[envStep.optionA, envStep.optionB].map((option) => {
                        const selected = envChoiceByStep[envStep.key] === option.key;
                        const correctPick =
                          selected && envChoiceByStep[envStep.key] === envStep.correctOptionKey;
                        return (
                          <button
                            key={option.key}
                            type="button"
                            className={`env-compare-card ${selected ? "env-compare-card-selected" : ""} ${
                              correctPick ? "env-compare-card-correct" : ""
                            }`}
                            onClick={() => selectEnvOption(option.key)}
                          >
                            <span className="env-compare-badge">{option.label}</span>
                            <img src={option.image} alt={`Option ${option.label}`} className="env-compare-image" />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="env-see-card section-top">
                      <img src={envStep.image} alt={envStep.question} className="env-see-image" />
                      <p className="student-meta">{envStep.example}</p>
                    </div>
                  )}

                  {(envStep.kind === "see_and_say" ||
                    envChoiceByStep[envStep.key] === envStep.correctOptionKey) && (
                    <div className="food-choice-panel section-top" style={{ maxWidth: 480, margin: "0 auto" }}>
                      <p className="student-meta" style={{ fontWeight: 700 }}>
                        Now say: “{envStep.speakPrompt}”
                      </p>
                      <button
                        type="button"
                        className="btn family-mic-btn"
                        onClick={listenForEnvStep}
                        disabled={listening}
                      >
                        {listening
                          ? "Listening…"
                          : envSpokenByStep[envStep.key]
                            ? "✓ Recorded!"
                            : "🎤 Tap to Speak"}
                      </button>
                      {!envSpokenByStep[envStep.key] ? (
                        <button type="button" className="btn btn-secondary" onClick={markEnvSpoken}>
                          Mark as said
                        </button>
                      ) : null}
                    </div>
                  )}

                  {feedback ? <p className="alphabet-feedback section-top">{feedback}</p> : null}

                  <div className="alphabet-nav section-top">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={envStepIndex === 0}
                      onClick={() => {
                        setEnvStepIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                    >
                      Back
                    </button>
                    {envStepIndex < environmentActivity.steps.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setEnvStepIndex((i) => Math.min(environmentActivity.steps.length - 1, i + 1));
                          setFeedback(null);
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setActivityIndex(3);
                          setFeedback(null);
                        }}
                      >
                        {envCompleted === envMax ? "Go to Activity 4 ★" : "Activity 4"}
                      </button>
                    )}
                  </div>
                </article>
              ) : null}

              {activity.type === "color_choose_speak" && colorStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {colorActivity.hint}
                  </p>

                  <div className="family-progress section-top">
                    {colorActivity.steps.map((step, i) => {
                      const done =
                        colorChoiceByStep[step.key] === step.answer && colorSpokenByStep[step.key];
                      return (
                        <button
                          key={step.key}
                          type="button"
                          className={`family-step-dot ${i === colorStepIndex ? "family-step-dot-active" : ""} ${
                            done ? "family-step-dot-done" : ""
                          }`}
                          onClick={() => {
                            setColorStepIndex(i);
                            setFeedback(null);
                          }}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="color-choose-layout section-top">
                    <div className="color-star-panel">
                      <img src={colorStep.image} alt="Star color" className="color-star-image" />
                    </div>
                    <div className="color-options-panel">
                      {colorStep.options.map((option) => {
                        const selected = colorChoiceByStep[colorStep.key] === option;
                        const correct = selected && option === colorStep.answer;
                        return (
                          <button
                            key={option}
                            type="button"
                            className={`color-option-card ${selected ? "color-option-card-selected" : ""} ${
                              correct ? "color-option-card-correct" : ""
                            }`}
                            onClick={() => selectColorOption(option)}
                          >
                            <span
                              className="color-splat"
                              style={{ background: option.toLowerCase() === "white" ? "#f2f2f2" : option.toLowerCase() }}
                              aria-hidden
                            />
                            <strong>{option}</strong>
                            {correct ? <span className="color-check">✓</span> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {colorChoiceByStep[colorStep.key] === colorStep.answer ? (
                    <div className="food-choice-panel section-top" style={{ maxWidth: 480, margin: "0 auto" }}>
                      <p className="student-meta" style={{ fontWeight: 700 }}>
                        Tap the microphone and say the color.
                      </p>
                      <p className="student-meta">Say: “{colorStep.speakPrompt}”</p>
                      <button
                        type="button"
                        className="btn family-mic-btn"
                        onClick={listenForColorStep}
                        disabled={listening}
                      >
                        {listening
                          ? "Listening…"
                          : colorSpokenByStep[colorStep.key]
                            ? "✓ Recorded!"
                            : "🎤 Tap to Speak"}
                      </button>
                      {!colorSpokenByStep[colorStep.key] ? (
                        <button type="button" className="btn btn-secondary" onClick={markColorSpoken}>
                          Mark as said
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {feedback ? <p className="alphabet-feedback section-top">{feedback}</p> : null}

                  <div className="alphabet-nav section-top">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={colorStepIndex === 0}
                      onClick={() => {
                        setColorStepIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                    >
                      Back
                    </button>
                    {colorStepIndex < colorActivity.steps.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setColorStepIndex((i) => Math.min(colorActivity.steps.length - 1, i + 1));
                          setFeedback(null);
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard/students/${studentId}`}
                        className={`btn ${allDone ? "" : "btn-secondary"}`}
                      >
                        {allDone ? "Finish ★" : "Back to profile"}
                      </Link>
                    )}
                  </div>
                </article>
              ) : null}
            </>
          ) : null}
        </section>
      </section>
    </main>
  );
}
