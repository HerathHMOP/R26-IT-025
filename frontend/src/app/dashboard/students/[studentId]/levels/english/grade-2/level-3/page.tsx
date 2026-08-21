"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getStoredUser, getStudentDashboard } from "@/lib/api";
import {
  grade2EnglishLevel3Activities,
  grade2EnglishLevel3Activity1,
  grade2EnglishLevel3Activity2,
  grade2EnglishLevel3Activity3,
  grade2EnglishLevel3Activity4
} from "@/lib/grade2EnglishLevel3";
import {
  isGrade2EnglishLevelUnlocked,
  markGrade2EnglishLevel3Complete
} from "@/lib/grade2EnglishLevelProgress";

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

function articleFor(name: string): string {
  return /^[aeiou]/i.test(name) ? "an" : "a";
}

function shuffleWords(words: string[]): string[] {
  const next = [...words];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function Grade2EnglishLevel3Page() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const vehicleActivity = grade2EnglishLevel3Activity1;
  const schoolActivity = grade2EnglishLevel3Activity2;
  const animalActivity = grade2EnglishLevel3Activity3;
  const classroomSeeActivity = grade2EnglishLevel3Activity4;
  const vehicleItems = vehicleActivity.items;
  const schoolItems = schoolActivity.items;
  const animalItems = animalActivity.items;
  const classroomSeeItems = classroomSeeActivity.items;

  const [studentName, setStudentName] = useState("Student");
  const [error, setError] = useState<string | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [schoolStepIndex, setSchoolStepIndex] = useState(0);
  const [animalStepIndex, setAnimalStepIndex] = useState(0);
  const [seeStepIndex, setSeeStepIndex] = useState(0);
  const [typeByItem, setTypeByItem] = useState<Record<string, string>>({});
  const [nameByItem, setNameByItem] = useState<Record<string, string>>({});
  const [spokenByItem, setSpokenByItem] = useState<Record<string, boolean>>({});
  const [wayByItem, setWayByItem] = useState<Record<string, string>>({});
  const [schoolSpokenByItem, setSchoolSpokenByItem] = useState<Record<string, boolean>>({});
  const [actionByItem, setActionByItem] = useState<Record<string, string>>({});
  const [builtByItem, setBuiltByItem] = useState<Record<string, string[]>>({});
  const [bankByItem, setBankByItem] = useState<Record<string, string[]>>({});
  const [animalSpokenByItem, setAnimalSpokenByItem] = useState<Record<string, boolean>>({});
  const [seeChoiceByItem, setSeeChoiceByItem] = useState<Record<string, string>>({});
  const [seeSpokenByItem, setSeeSpokenByItem] = useState<Record<string, boolean>>({});
  const [listening, setListening] = useState(false);
  const [listeningKey, setListeningKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const [levelLocked, setLevelLocked] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const activity = grade2EnglishLevel3Activities[activityIndex];
  const current = vehicleItems[itemIndex];
  const schoolStep = schoolItems[schoolStepIndex];
  const animalStep = animalItems[animalStepIndex];
  const seeStep = classroomSeeItems[seeStepIndex];

  const vehicleItemDone = (key: string) => {
    const item = vehicleItems.find((i) => i.key === key);
    if (!item) return false;
    return (
      typeByItem[key] === item.typeAnswer &&
      nameByItem[key] === item.nameAnswer &&
      Boolean(spokenByItem[key])
    );
  };

  const schoolItemDone = (key: string) => {
    const item = schoolItems.find((i) => i.key === key);
    if (!item) return false;
    return wayByItem[key] === item.wayAnswer && Boolean(schoolSpokenByItem[key]);
  };

  const sentenceCorrect = (key: string) => {
    const item = animalItems.find((i) => i.key === key);
    if (!item) return false;
    const built = builtByItem[key] || [];
    return (
      built.length === item.sentenceWords.length &&
      built.every((word, i) => word === item.sentenceWords[i])
    );
  };

  const animalItemDone = (key: string) => {
    const item = animalItems.find((i) => i.key === key);
    if (!item) return false;
    return (
      actionByItem[key] === item.actionAnswer &&
      sentenceCorrect(key) &&
      Boolean(animalSpokenByItem[key])
    );
  };

  const seeItemDone = (key: string) => {
    const item = classroomSeeItems.find((i) => i.key === key);
    if (!item) return false;
    return seeChoiceByItem[key] === item.answer && Boolean(seeSpokenByItem[key]);
  };

  const vehicleCompleted = vehicleItems.filter((item) => vehicleItemDone(item.key)).length;
  const schoolCompleted = schoolItems.filter((item) => schoolItemDone(item.key)).length;
  const animalCompleted = animalItems.filter((item) => animalItemDone(item.key)).length;
  const seeCompleted = classroomSeeItems.filter((item) => seeItemDone(item.key)).length;

  const score =
    activity?.type === "school_way_speak"
      ? schoolCompleted
      : activity?.type === "animal_action_speak"
        ? animalCompleted
        : activity?.type === "classroom_see_speak"
          ? seeCompleted
          : vehicleCompleted;
  const maxScore =
    activity?.type === "school_way_speak"
      ? schoolItems.length
      : activity?.type === "animal_action_speak"
        ? animalItems.length
        : activity?.type === "classroom_see_speak"
          ? classroomSeeItems.length
          : vehicleItems.length;
  const allDone = score === maxScore;

  const level3AllCorrect =
    vehicleCompleted === vehicleItems.length &&
    schoolCompleted === schoolItems.length &&
    animalCompleted === animalItems.length &&
    seeCompleted === classroomSeeItems.length;

  const currentTypeOk = current ? typeByItem[current.key] === current.typeAnswer : false;
  const currentNameOk = current ? nameByItem[current.key] === current.nameAnswer : false;
  const currentReady = currentTypeOk && currentNameOk;
  const schoolWayOk = schoolStep ? wayByItem[schoolStep.key] === schoolStep.wayAnswer : false;
  const animalActionOk = animalStep ? actionByItem[animalStep.key] === animalStep.actionAnswer : false;
  const animalSentenceOk = animalStep ? sentenceCorrect(animalStep.key) : false;
  const seeChoiceOk = seeStep ? seeChoiceByItem[seeStep.key] === seeStep.answer : false;

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
        if (!isGrade2EnglishLevelUnlocked(studentId, 3, eligible)) {
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
    if (!studentId || !level3AllCorrect) return;
    markGrade2EnglishLevel3Complete(studentId);
  }, [studentId, level3AllCorrect]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function startSpeechListen(accepted: string[], onSuccess: () => void, retryHint: string, key: string) {
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
    setListeningKey(key);
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
      setListeningKey(null);
    };

    recognition.onerror = () => {
      setListening(false);
      setListeningKey(null);
      setFeedback("Could not hear you. Tap again, or use Mark as said.");
    };

    recognition.onend = () => {
      setListening(false);
      setListeningKey(null);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setListeningKey(null);
      setFeedback("Microphone busy. Try again.");
    }
  }

  function onTypeChange(key: string, value: string) {
    setTypeByItem((prev) => ({ ...prev, [key]: value }));
    setSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFeedback(null);
  }

  function onNameChange(key: string, value: string) {
    setNameByItem((prev) => ({ ...prev, [key]: value }));
    setSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFeedback(null);
  }

  function listenForVehicleItem(key: string) {
    const item = vehicleItems.find((i) => i.key === key);
    if (!item) return;
    if (typeByItem[key] !== item.typeAnswer || nameByItem[key] !== item.nameAnswer) {
      setFeedback("Choose the correct type and name first.");
      return;
    }
    startSpeechListen(
      item.sayAccept,
      () => {
        setSpokenByItem((prev) => ({ ...prev, [key]: true }));
        setFeedback("Great job!");
      },
      `Try: “${item.speakPrompt}”`,
      key
    );
  }

  function markVehicleSpoken(key: string) {
    const item = vehicleItems.find((i) => i.key === key);
    if (!item) return;
    if (typeByItem[key] !== item.typeAnswer || nameByItem[key] !== item.nameAnswer) {
      setFeedback("Choose the correct type and name first.");
      return;
    }
    setSpokenByItem((prev) => ({ ...prev, [key]: true }));
    setFeedback("Marked as said.");
  }

  function selectWay(key: string, wayKey: string) {
    setWayByItem((prev) => ({ ...prev, [key]: wayKey }));
    setSchoolSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const item = schoolItems.find((i) => i.key === key);
    if (item && wayKey === item.wayAnswer) {
      setFeedback(`Good! Now say: “${item.speakPrompt}”`);
    } else {
      setFeedback("Look at the picture again.");
    }
  }

  function listenForSchoolItem(key: string) {
    const item = schoolItems.find((i) => i.key === key);
    if (!item) return;
    if (wayByItem[key] !== item.wayAnswer) {
      setFeedback("Choose the correct way first.");
      return;
    }
    startSpeechListen(
      item.sayAccept,
      () => {
        setSchoolSpokenByItem((prev) => ({ ...prev, [key]: true }));
        setFeedback("Great job!");
      },
      `Try: “${item.speakPrompt}”`,
      `school-${key}`
    );
  }

  function markSchoolSpoken(key: string) {
    const item = schoolItems.find((i) => i.key === key);
    if (!item) return;
    if (wayByItem[key] !== item.wayAnswer) {
      setFeedback("Choose the correct way first.");
      return;
    }
    setSchoolSpokenByItem((prev) => ({ ...prev, [key]: true }));
    setFeedback("Marked as said.");
  }

  function ensureAnimalBank(key: string) {
    const item = animalItems.find((i) => i.key === key);
    if (!item) return;
    setBankByItem((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: shuffleWords(item.sentenceWords) };
    });
    setBuiltByItem((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: [] };
    });
  }

  function selectAction(key: string, action: string) {
    setActionByItem((prev) => ({ ...prev, [key]: action }));
    setAnimalSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const item = animalItems.find((i) => i.key === key);
    if (item && action === item.actionAnswer) {
      ensureAnimalBank(key);
      setFeedback("Well done! Now build the sentence.");
    } else {
      setFeedback("Try another action.");
    }
  }

  function placeWord(key: string, word: string, bankIndex: number) {
    const item = animalItems.find((i) => i.key === key);
    if (!item || actionByItem[key] !== item.actionAnswer) {
      setFeedback("Choose the correct action first.");
      return;
    }
    setBankByItem((prev) => {
      const bank = [...(prev[key] || [])];
      bank.splice(bankIndex, 1);
      return { ...prev, [key]: bank };
    });
    setBuiltByItem((prev) => {
      const built = [...(prev[key] || []), word];
      return { ...prev, [key]: built };
    });
    setAnimalSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFeedback(null);
  }

  function removeBuiltWord(key: string, builtIndex: number) {
    const built = builtByItem[key] || [];
    const word = built[builtIndex];
    if (!word) return;
    setBuiltByItem((prev) => {
      const nextBuilt = [...(prev[key] || [])];
      nextBuilt.splice(builtIndex, 1);
      return { ...prev, [key]: nextBuilt };
    });
    setBankByItem((prev) => ({ ...prev, [key]: [...(prev[key] || []), word] }));
    setAnimalSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function resetSentence(key: string) {
    const item = animalItems.find((i) => i.key === key);
    if (!item) return;
    setBuiltByItem((prev) => ({ ...prev, [key]: [] }));
    setBankByItem((prev) => ({ ...prev, [key]: shuffleWords(item.sentenceWords) }));
    setAnimalSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFeedback("Build the sentence again.");
  }

  function listenForAnimalItem(key: string) {
    const item = animalItems.find((i) => i.key === key);
    if (!item) return;
    if (actionByItem[key] !== item.actionAnswer) {
      setFeedback("Choose the correct action first.");
      return;
    }
    if (!sentenceCorrect(key)) {
      setFeedback("Build the correct sentence first.");
      return;
    }
    startSpeechListen(
      item.sayAccept,
      () => {
        setAnimalSpokenByItem((prev) => ({ ...prev, [key]: true }));
        setFeedback("Great job! You are an Amazing Reporter!");
      },
      `Try: “${item.speakPrompt}”`,
      `animal-${key}`
    );
  }

  function markAnimalSpoken(key: string) {
    const item = animalItems.find((i) => i.key === key);
    if (!item) return;
    if (actionByItem[key] !== item.actionAnswer) {
      setFeedback("Choose the correct action first.");
      return;
    }
    if (!sentenceCorrect(key)) {
      setFeedback("Build the correct sentence first.");
      return;
    }
    setAnimalSpokenByItem((prev) => ({ ...prev, [key]: true }));
    setFeedback("Marked as said.");
  }

  function selectSeeChoice(key: string, choice: string) {
    setSeeChoiceByItem((prev) => ({ ...prev, [key]: choice }));
    setSeeSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const item = classroomSeeItems.find((i) => i.key === key);
    if (item && choice === item.answer) {
      setFeedback(`Good! Now say: “${item.speakPrompt}”`);
    } else {
      setFeedback("Look again — what can you see?");
    }
  }

  function listenForSeeItem(key: string) {
    const item = classroomSeeItems.find((i) => i.key === key);
    if (!item) return;
    if (seeChoiceByItem[key] !== item.answer) {
      setFeedback("Choose the correct word first.");
      return;
    }
    startSpeechListen(
      item.sayAccept,
      () => {
        setSeeSpokenByItem((prev) => ({ ...prev, [key]: true }));
        setFeedback("Great job!");
      },
      `Try: “${item.speakPrompt}”`,
      `see-${key}`
    );
  }

  function markSeeSpoken(key: string) {
    const item = classroomSeeItems.find((i) => i.key === key);
    if (!item) return;
    if (seeChoiceByItem[key] !== item.answer) {
      setFeedback("Choose the correct word first.");
      return;
    }
    setSeeSpokenByItem((prev) => ({ ...prev, [key]: true }));
    setFeedback("Marked as said.");
  }

  if (!activity) return null;

  return (
    <main className="dashboard-screen kid-aptitude-play aptitude-lang-english vehicle-identify-challenge">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">Grade 2 · Level 3</p>
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
              <h2 className="dashboard-panel-title">Level 3 is locked</h2>
              <p className="student-meta">
                Complete the Grade 2 English aptitude test (or finish Level 2) to unlock Level 3.
              </p>
              <div className="section-top level-actions">
                <Link href={`/dashboard/students/${studentId}/levels/english/grade-2/level-2`} className="btn">
                  Go to Level 2
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
                {grade2EnglishLevel3Activities.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`number-option-btn ${activityIndex === index ? "number-option-btn-selected" : ""}`}
                    onClick={() => {
                      setActivityIndex(index);
                      setFeedback(null);
                    }}
                  >
                    Activity {item.id}
                  </button>
                ))}
              </div>

              {activity.type === "vehicle_type_speak" && current ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {vehicleActivity.hint}
                  </p>

                  <div className="family-progress section-top">
                    {vehicleItems.map((item, i) => (
                      <button
                        key={item.key}
                        type="button"
                        className={`family-step-dot ${i === itemIndex ? "family-step-dot-active" : ""} ${
                          vehicleItemDone(item.key) ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => {
                          setItemIndex(i);
                          setFeedback(null);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="vehicle-card section-top">
                    <div className="vehicle-card-image-wrap">
                      <img src={current.image} alt="Vehicle" className="vehicle-card-image" />
                    </div>
                    <div className="vehicle-card-controls">
                      <label className="vehicle-select-row">
                        <span>Type</span>
                        <select
                          value={typeByItem[current.key] || ""}
                          onChange={(e) => onTypeChange(current.key, e.target.value)}
                        >
                          <option value="">Select type</option>
                          {vehicleActivity.typeOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="vehicle-select-row">
                        <span>It is {nameByItem[current.key] ? articleFor(nameByItem[current.key]) : "a"}</span>
                        <select
                          value={nameByItem[current.key] || ""}
                          onChange={(e) => onNameChange(current.key, e.target.value)}
                        >
                          <option value="">Select what it is</option>
                          {vehicleActivity.nameOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>

                      {currentReady ? (
                        <div className="vehicle-speak-panel">
                          <p className="student-meta">Say: “{current.speakPrompt}”</p>
                          <button
                            type="button"
                            className="btn family-mic-btn"
                            onClick={() => listenForVehicleItem(current.key)}
                            disabled={listening}
                          >
                            {listening && listeningKey === current.key
                              ? "Listening…"
                              : spokenByItem[current.key]
                                ? "✓ Recorded!"
                                : "🎤 Tap the mic and say it"}
                          </button>
                          {!spokenByItem[current.key] ? (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => markVehicleSpoken(current.key)}
                            >
                              Mark as said
                            </button>
                          ) : null}
                        </div>
                      ) : (
                        <p className="student-meta">Choose the type and name, then speak.</p>
                      )}
                    </div>
                  </div>

                  <div className="vehicle-legend section-top" aria-label="Vehicle types">
                    {vehicleActivity.typeLegend.map((chip) => (
                      <span
                        key={chip.key}
                        className="vehicle-legend-chip"
                        style={{ background: chip.color }}
                      >
                        {chip.label}
                      </span>
                    ))}
                  </div>

                  <p className="student-meta vehicle-tip">{vehicleActivity.tip}</p>
                  {!micSupported ? (
                    <p className="student-meta">Microphone not available — use Mark as said.</p>
                  ) : null}
                  {feedback ? <p className="alphabet-feedback section-top">{feedback}</p> : null}

                  <div className="alphabet-nav section-top">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={itemIndex === 0}
                      onClick={() => {
                        setItemIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                    >
                      Back
                    </button>
                    {itemIndex < vehicleItems.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setItemIndex((i) => Math.min(vehicleItems.length - 1, i + 1));
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
                          setActivityIndex(1);
                          setFeedback(null);
                        }}
                      >
                        {vehicleCompleted === vehicleItems.length ? "Go to Activity 2 ★" : "Activity 2"}
                      </button>
                    )}
                  </div>
                </article>
              ) : null}

              {activity.type === "school_way_speak" && schoolStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {schoolActivity.hint}
                  </p>

                  <div className="family-progress section-top">
                    {schoolItems.map((item, i) => (
                      <button
                        key={item.key}
                        type="button"
                        className={`family-step-dot ${i === schoolStepIndex ? "family-step-dot-active" : ""} ${
                          schoolItemDone(item.key) ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => {
                          setSchoolStepIndex(i);
                          setFeedback(null);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="school-way-layout section-top">
                    <div className="school-way-image-wrap">
                      <img src={schoolStep.image} alt="How I come to school" className="school-way-image" />
                      {"label" in schoolStep && schoolStep.label ? (
                        <p className="school-way-label">{schoolStep.label}</p>
                      ) : null}
                      {schoolStep.isExample ? (
                        <span className="school-way-example-badge">Example</span>
                      ) : null}
                    </div>

                    <div className="school-way-speak-side">
                      <div className="school-way-bubble-row">
                        <div className="school-way-bubble">
                          {schoolWayOk ? schoolStep.speakPrompt : schoolStep.bubbleText}
                        </div>
                        <img
                          src={schoolActivity.characterImage}
                          alt=""
                          className="school-way-boy"
                        />
                      </div>

                      <p className="student-meta" style={{ fontWeight: 700 }}>
                        Choose the way:
                      </p>
                      <div className="school-way-options">
                        {schoolActivity.wayOptions.map((opt) => {
                          const selected = wayByItem[schoolStep.key] === opt.key;
                          const correct = selected && opt.key === schoolStep.wayAnswer;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              className={`school-way-option ${selected ? "school-way-option-selected" : ""} ${
                                correct ? "school-way-option-correct" : ""
                              }`}
                              onClick={() => selectWay(schoolStep.key, opt.key)}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>

                      {schoolWayOk ? (
                        <div className="vehicle-speak-panel">
                          <button
                            type="button"
                            className="btn family-mic-btn"
                            onClick={() => listenForSchoolItem(schoolStep.key)}
                            disabled={listening}
                          >
                            {listening && listeningKey === `school-${schoolStep.key}`
                              ? "Listening…"
                              : schoolSpokenByItem[schoolStep.key]
                                ? "✓ Recorded!"
                                : "🎤 Tap the mic and say it"}
                          </button>
                          {!schoolSpokenByItem[schoolStep.key] ? (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => markSchoolSpoken(schoolStep.key)}
                            >
                              Mark as said
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {!micSupported ? (
                    <p className="student-meta section-top">Microphone not available — use Mark as said.</p>
                  ) : null}
                  {feedback ? <p className="alphabet-feedback section-top">{feedback}</p> : null}

                  <div className="alphabet-nav section-top">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={schoolStepIndex === 0}
                      onClick={() => {
                        setSchoolStepIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                    >
                      Back
                    </button>
                    {schoolStepIndex < schoolItems.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setSchoolStepIndex((i) => Math.min(schoolItems.length - 1, i + 1));
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
                          setActivityIndex(2);
                          setFeedback(null);
                        }}
                      >
                        {schoolCompleted === schoolItems.length ? "Go to Activity 3 ★" : "Activity 3"}
                      </button>
                    )}
                  </div>
                </article>
              ) : null}

              {activity.type === "animal_action_speak" && animalStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {animalActivity.hint}
                  </p>

                  <div className="family-progress section-top">
                    {animalItems.map((item, i) => (
                      <button
                        key={item.key}
                        type="button"
                        className={`family-step-dot ${i === animalStepIndex ? "family-step-dot-active" : ""} ${
                          animalItemDone(item.key) ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => {
                          setAnimalStepIndex(i);
                          setFeedback(null);
                          if (actionByItem[item.key] === item.actionAnswer) {
                            ensureAnimalBank(item.key);
                          }
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="animal-action-layout section-top">
                    <div className="animal-action-look">
                      <p className="animal-action-step-label">1. Look</p>
                      <p className="student-meta" style={{ fontWeight: 700, color: "#c0392b" }}>
                        What is it?
                      </p>
                      <div className="animal-action-image-wrap">
                        <img src={animalStep.image} alt={animalStep.animal} className="animal-action-image" />
                      </div>
                      <p className="student-meta">
                        e.g. {animalStep.identifyPrompt.toLowerCase().replace(/\.$/, "")}
                      </p>
                      <p className="student-meta" style={{ fontWeight: 800 }}>
                        {animalStep.identifyPrompt}
                      </p>
                    </div>

                    <div className="animal-action-choose">
                      <p className="animal-action-step-label">2. Choose the action</p>
                      <p className="student-meta" style={{ fontWeight: 700, color: "#c0392b" }}>
                        What can it do?
                      </p>
                      <div className="animal-action-options">
                        {animalActivity.actionOptions.map((action) => {
                          const selected = actionByItem[animalStep.key] === action;
                          const correct = selected && action === animalStep.actionAnswer;
                          return (
                            <button
                              key={action}
                              type="button"
                              className={`animal-action-option ${selected ? "animal-action-option-selected" : ""} ${
                                correct ? "animal-action-option-correct" : ""
                              }`}
                              onClick={() => selectAction(animalStep.key, action)}
                            >
                              {action}
                              {correct ? <span className="animal-action-check">✓</span> : null}
                            </button>
                          );
                        })}
                      </div>
                      {animalActionOk ? (
                        <p className="alphabet-feedback">Well done! ★</p>
                      ) : null}
                    </div>

                    <div className="animal-action-build">
                      <p className="animal-action-step-label">3. Build the sentence</p>
                      <p className="student-meta">Tap the words in order to make the sentence.</p>
                      {!animalActionOk ? (
                        <p className="student-meta">Choose the correct action first.</p>
                      ) : (
                        <>
                          <div className="animal-word-bank">
                            {(bankByItem[animalStep.key] || []).map((word, i) => (
                              <button
                                key={`${word}-${i}`}
                                type="button"
                                className="animal-word-tile"
                                onClick={() => placeWord(animalStep.key, word, i)}
                              >
                                {word}
                              </button>
                            ))}
                          </div>
                          <div className="animal-sentence-slots">
                            {(builtByItem[animalStep.key] || []).length === 0 ? (
                              <span className="animal-slot-placeholder">Drop words here</span>
                            ) : (
                              (builtByItem[animalStep.key] || []).map((word, i) => (
                                <button
                                  key={`${word}-built-${i}`}
                                  type="button"
                                  className="animal-word-tile animal-word-tile-placed"
                                  onClick={() => removeBuiltWord(animalStep.key, i)}
                                >
                                  {word}
                                </button>
                              ))
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => resetSentence(animalStep.key)}
                          >
                            Reset words
                          </button>
                          {animalSentenceOk ? (
                            <div className="vehicle-speak-panel">
                              <p className="student-meta" style={{ fontWeight: 700 }}>
                                Student says: “{animalStep.speakPrompt}”
                              </p>
                              <button
                                type="button"
                                className="btn family-mic-btn"
                                onClick={() => listenForAnimalItem(animalStep.key)}
                                disabled={listening}
                              >
                                {listening && listeningKey === `animal-${animalStep.key}`
                                  ? "Listening…"
                                  : animalSpokenByItem[animalStep.key]
                                    ? "✓ Recorded!"
                                    : "🎤 Say the sentence"}
                              </button>
                              {!animalSpokenByItem[animalStep.key] ? (
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => markAnimalSpoken(animalStep.key)}
                                >
                                  Mark as said
                                </button>
                              ) : null}
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="animal-gallery section-top" aria-label="Action gallery">
                    {animalActivity.gallery.map((g) => (
                      <span key={g.animal} className="animal-gallery-chip">
                        {g.animal}: {g.action}
                      </span>
                    ))}
                  </div>

                  {!micSupported ? (
                    <p className="student-meta section-top">Microphone not available — use Mark as said.</p>
                  ) : null}
                  {feedback ? <p className="alphabet-feedback section-top">{feedback}</p> : null}

                  <div className="alphabet-nav section-top">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={animalStepIndex === 0}
                      onClick={() => {
                        setAnimalStepIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                    >
                      Back
                    </button>
                    {animalStepIndex < animalItems.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          const nextIndex = Math.min(animalItems.length - 1, animalStepIndex + 1);
                          const nextItem = animalItems[nextIndex];
                          setAnimalStepIndex(nextIndex);
                          setFeedback(null);
                          if (nextItem && actionByItem[nextItem.key] === nextItem.actionAnswer) {
                            ensureAnimalBank(nextItem.key);
                          }
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
                        {animalCompleted === animalItems.length ? "Go to Activity 4 ★" : "Activity 4"}
                      </button>
                    )}
                  </div>
                </article>
              ) : null}

              {activity.type === "classroom_see_speak" && seeStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {classroomSeeActivity.hint}
                  </p>

                  <div className="family-progress section-top">
                    {classroomSeeItems.map((item, i) => (
                      <button
                        key={item.key}
                        type="button"
                        className={`family-step-dot ${i === seeStepIndex ? "family-step-dot-active" : ""} ${
                          seeItemDone(item.key) ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => {
                          setSeeStepIndex(i);
                          setFeedback(null);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="classroom-see-card section-top">
                    <p className="classroom-see-question">{seeStep.question}</p>
                    <div className="classroom-see-image-wrap">
                      <img src={seeStep.image} alt="Classroom object" className="classroom-see-image" />
                    </div>
                    <p className="classroom-see-prompt">
                      {seeStep.promptPrefix}{" "}
                      <span className="classroom-see-blank">
                        {seeChoiceOk ? seeStep.answer : "................"}
                      </span>
                    </p>

                    <div className="classroom-see-options">
                      {classroomSeeActivity.nameOptions.map((opt) => {
                        const selected = seeChoiceByItem[seeStep.key] === opt;
                        const correct = selected && opt === seeStep.answer;
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`classroom-see-option ${selected ? "classroom-see-option-selected" : ""} ${
                              correct ? "classroom-see-option-correct" : ""
                            }`}
                            onClick={() => selectSeeChoice(seeStep.key, opt)}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {seeChoiceOk ? (
                      <div className="vehicle-speak-panel section-top">
                        <p className="student-meta">Say: “{seeStep.speakPrompt}”</p>
                        <button
                          type="button"
                          className="btn family-mic-btn"
                          onClick={() => listenForSeeItem(seeStep.key)}
                          disabled={listening}
                        >
                          {listening && listeningKey === `see-${seeStep.key}`
                            ? "Listening…"
                            : seeSpokenByItem[seeStep.key]
                              ? "✓ Recorded!"
                              : "🎤 Tap to Speak"}
                        </button>
                        {!seeSpokenByItem[seeStep.key] ? (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => markSeeSpoken(seeStep.key)}
                          >
                            Mark as said
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {!micSupported ? (
                    <p className="student-meta section-top">Microphone not available — use Mark as said.</p>
                  ) : null}
                  {feedback ? <p className="alphabet-feedback section-top">{feedback}</p> : null}

                  <div className="alphabet-nav section-top">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={seeStepIndex === 0}
                      onClick={() => {
                        setSeeStepIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                    >
                      Back
                    </button>
                    {seeStepIndex < classroomSeeItems.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setSeeStepIndex((i) => Math.min(classroomSeeItems.length - 1, i + 1));
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
