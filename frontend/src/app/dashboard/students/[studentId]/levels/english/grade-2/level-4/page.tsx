"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getStoredUser, getStudentDashboard } from "@/lib/api";
import {
  grade2EnglishLevel4Activities,
  grade2EnglishLevel4Activity1,
  grade2EnglishLevel4Activity2,
  grade2EnglishLevel4Activity3,
  grade2EnglishLevel4Activity4
} from "@/lib/grade2EnglishLevel4";
import {
  isGrade2EnglishLevelUnlocked,
  markGrade2EnglishLevel4Complete
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

type Phase = "match" | "speak" | "continue";
type JobListenTarget = "job" | "place";
type KitchenPhase = "select" | "sentences";

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

export default function Grade2EnglishLevel4Page() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);
  const conversationActivity = grade2EnglishLevel4Activity1;
  const jobActivity = grade2EnglishLevel4Activity2;
  const farmerActivity = grade2EnglishLevel4Activity3;
  const kitchenActivity = grade2EnglishLevel4Activity4;
  const items = conversationActivity.items;
  const jobItems = jobActivity.items;
  const farmerSteps = farmerActivity.steps;
  const kitchenObjects = kitchenActivity.objects;
  const kitchenSteps = kitchenActivity.steps;
  const kitchenCorrectKeys = useMemo(
    () => kitchenObjects.filter((o) => o.isKitchen).map((o) => o.key),
    [kitchenObjects]
  );

  const [studentName, setStudentName] = useState("Student");
  const [error, setError] = useState<string | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("match");
  const [speakIndex, setSpeakIndex] = useState(0);
  const [jobStepIndex, setJobStepIndex] = useState(0);
  const [farmerStepIndex, setFarmerStepIndex] = useState(0);
  const [kitchenPhase, setKitchenPhase] = useState<KitchenPhase>("select");
  const [kitchenStepIndex, setKitchenStepIndex] = useState(0);
  const [matchByItem, setMatchByItem] = useState<Record<string, string>>({});
  const [activePromptKey, setActivePromptKey] = useState<string | null>(null);
  const [spokenByItem, setSpokenByItem] = useState<Record<string, boolean>>({});
  const [continueSpoken, setContinueSpoken] = useState(false);
  const [jobChoiceByItem, setJobChoiceByItem] = useState<Record<string, string>>({});
  const [placeChoiceByItem, setPlaceChoiceByItem] = useState<Record<string, string>>({});
  const [jobSpokenByItem, setJobSpokenByItem] = useState<Record<string, boolean>>({});
  const [placeSpokenByItem, setPlaceSpokenByItem] = useState<Record<string, boolean>>({});
  const [farmerChoiceByStep, setFarmerChoiceByStep] = useState<Record<string, string>>({});
  const [farmerSpokenByStep, setFarmerSpokenByStep] = useState<Record<string, boolean>>({});
  const [showFarmerExample, setShowFarmerExample] = useState(false);
  const [selectedKitchen, setSelectedKitchen] = useState<Record<string, boolean>>({});
  const [kitchenChoiceByStep, setKitchenChoiceByStep] = useState<Record<string, string>>({});
  const [kitchenSpokenByStep, setKitchenSpokenByStep] = useState<Record<string, boolean>>({});
  const [listening, setListening] = useState(false);
  const [listeningTarget, setListeningTarget] = useState<JobListenTarget | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const [levelLocked, setLevelLocked] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const activity = grade2EnglishLevel4Activities[activityIndex];
  const speakItem = items[speakIndex];
  const jobStep = jobItems[jobStepIndex];
  const farmerStep = farmerSteps[farmerStepIndex];
  const kitchenStep = kitchenSteps[kitchenStepIndex];

  const matchedCount = items.filter((item) => matchByItem[item.key] === item.answer).length;
  const spokenCount = items.filter((item) => spokenByItem[item.key]).length;
  const allMatched = matchedCount === items.length;
  const allSpoken = spokenCount === items.length;
  const conversationScore = matchedCount + spokenCount + (continueSpoken ? 1 : 0);
  const conversationMax = items.length * 2 + 1;
  const conversationDone = allMatched && allSpoken && continueSpoken;

  const jobItemDone = (key: string) => {
    const item = jobItems.find((i) => i.key === key);
    if (!item) return false;
    return (
      jobChoiceByItem[key] === item.jobAnswer &&
      placeChoiceByItem[key] === item.placeAnswer &&
      Boolean(jobSpokenByItem[key]) &&
      Boolean(placeSpokenByItem[key])
    );
  };

  const farmerStepDone = (key: string) => {
    const step = farmerSteps.find((s) => s.key === key);
    if (!step) return false;
    return farmerChoiceByStep[key] === step.answer && Boolean(farmerSpokenByStep[key]);
  };

  const kitchenSelectCorrect =
    kitchenCorrectKeys.every((key) => selectedKitchen[key]) &&
    kitchenObjects.every((obj) => (selectedKitchen[obj.key] ? obj.isKitchen : true));

  const kitchenStepDone = (key: string) => {
    const step = kitchenSteps.find((s) => s.key === key);
    if (!step) return false;
    return kitchenChoiceByStep[key] === step.answer && Boolean(kitchenSpokenByStep[key]);
  };

  const jobCompleted = jobItems.filter((item) => jobItemDone(item.key)).length;
  const jobMax = jobItems.length;
  const farmerCompleted = farmerSteps.filter((step) => farmerStepDone(step.key)).length;
  const farmerMax = farmerSteps.length;
  const kitchenSentenceCompleted = kitchenSteps.filter((step) => kitchenStepDone(step.key)).length;
  const kitchenScore = (kitchenSelectCorrect ? 1 : 0) + kitchenSentenceCompleted;
  const kitchenMax = 1 + kitchenSteps.length;
  const kitchenDone = kitchenSelectCorrect && kitchenSentenceCompleted === kitchenSteps.length;

  const score =
    activity?.type === "job_place_speak"
      ? jobCompleted
      : activity?.type === "farmer_reporter_speak"
        ? farmerCompleted
        : activity?.type === "kitchen_items_speak"
          ? kitchenScore
          : conversationScore;
  const maxScore =
    activity?.type === "job_place_speak"
      ? jobMax
      : activity?.type === "farmer_reporter_speak"
        ? farmerMax
        : activity?.type === "kitchen_items_speak"
          ? kitchenMax
          : conversationMax;
  const allDone =
    activity?.type === "job_place_speak"
      ? jobCompleted === jobMax
      : activity?.type === "farmer_reporter_speak"
        ? farmerCompleted === farmerMax
        : activity?.type === "kitchen_items_speak"
          ? kitchenDone
          : conversationDone;

  const level4AllCorrect =
    conversationDone &&
    jobCompleted === jobMax &&
    farmerCompleted === farmerMax &&
    kitchenDone;

  const usedReplies = new Set(Object.values(matchByItem).filter(Boolean));
  const availableReplies = conversationActivity.replyPool.filter((reply) => !usedReplies.has(reply));
  const jobChoiceOk = jobStep ? jobChoiceByItem[jobStep.key] === jobStep.jobAnswer : false;
  const placeChoiceOk = jobStep ? placeChoiceByItem[jobStep.key] === jobStep.placeAnswer : false;
  const farmerChoiceOk = farmerStep ? farmerChoiceByStep[farmerStep.key] === farmerStep.answer : false;
  const kitchenChoiceOk = kitchenStep
    ? kitchenChoiceByStep[kitchenStep.key] === kitchenStep.answer
    : false;
  const farmerFillOptions = useMemo(() => {
    const set = new Set([...farmerActivity.helpingWords, "seeds"]);
    return Array.from(set);
  }, []);

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
        if (!isGrade2EnglishLevelUnlocked(studentId, 4, eligible)) {
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
    if (!studentId || !level4AllCorrect) return;
    markGrade2EnglishLevel4Complete(studentId);
  }, [studentId, level4AllCorrect]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function startSpeechListen(
    accepted: string[],
    onSuccess: () => void,
    retryHint: string,
    target: JobListenTarget | null = null
  ) {
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
    setListeningTarget(target);
    setFeedback("Listening… say your reply!");

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
      setListeningTarget(null);
    };

    recognition.onerror = () => {
      setListening(false);
      setListeningTarget(null);
      setFeedback("Could not hear you. Tap again, or use Mark as said.");
    };

    recognition.onend = () => {
      setListening(false);
      setListeningTarget(null);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setListeningTarget(null);
      setFeedback("Microphone busy. Try again.");
    }
  }

  function resetMatches() {
    setMatchByItem({});
    setActivePromptKey(null);
    setSpokenByItem({});
    setContinueSpoken(false);
    setPhase("match");
    setSpeakIndex(0);
    setFeedback("Matches cleared.");
  }

  function selectPrompt(key: string) {
    setActivePromptKey((prev) => (prev === key ? null : key));
    setFeedback(null);
  }

  function assignReply(reply: string) {
    if (!activePromptKey) {
      setFeedback("Tap a speech bubble first, then choose a reply.");
      return;
    }
    setMatchByItem((prev) => {
      const next = { ...prev };
      const existingKey = Object.entries(next).find(([, value]) => value === reply)?.[0];
      if (existingKey) delete next[existingKey];
      next[activePromptKey] = reply;
      return next;
    });
    setSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[activePromptKey];
      return next;
    });
    setActivePromptKey(null);

    const item = items.find((i) => i.key === activePromptKey);
    if (item && reply === item.answer) {
      setFeedback("Good match!");
    } else {
      setFeedback("Try another reply.");
    }
  }

  function clearMatch(key: string) {
    setMatchByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function goToSpeakPhase() {
    if (!allMatched) {
      setFeedback("Match all replies correctly first.");
      return;
    }
    setPhase("speak");
    setSpeakIndex(0);
    setFeedback("Now speak each reply.");
  }

  function listenForSpeakItem() {
    if (!speakItem) return;
    if (matchByItem[speakItem.key] !== speakItem.answer) {
      setFeedback("This reply is not matched correctly yet.");
      return;
    }
    startSpeechListen(
      speakItem.sayAccept,
      () => {
        setSpokenByItem((prev) => ({ ...prev, [speakItem.key]: true }));
        setFeedback("Great reply!");
      },
      `Try: “${speakItem.answer}”`
    );
  }

  function markSpeakItem() {
    if (!speakItem) return;
    if (matchByItem[speakItem.key] !== speakItem.answer) {
      setFeedback("This reply is not matched correctly yet.");
      return;
    }
    setSpokenByItem((prev) => ({ ...prev, [speakItem.key]: true }));
    setFeedback("Marked as said.");
  }

  function listenForContinue() {
    startSpeechListen(
      [
        "i played",
        "i studied",
        "i went",
        "i helped",
        "i read",
        "i watched",
        "today i",
        "i did"
      ],
      () => {
        setContinueSpoken(true);
        setFeedback("Wonderful! You continued the conversation.");
      },
      "Say what you did today in a full sentence."
    );
  }

  function markContinueSpoken() {
    setContinueSpoken(true);
    setFeedback("Marked as said.");
  }

  function selectJob(key: string, job: string) {
    setJobChoiceByItem((prev) => ({ ...prev, [key]: job }));
    setJobSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const item = jobItems.find((i) => i.key === key);
    if (item && job === item.jobAnswer) {
      setFeedback(`Good! Now say: “${item.jobPrompt}”`);
    } else {
      setFeedback("Look at the picture again.");
    }
  }

  function selectPlace(key: string, place: string) {
    setPlaceChoiceByItem((prev) => ({ ...prev, [key]: place }));
    setPlaceSpokenByItem((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const item = jobItems.find((i) => i.key === key);
    if (item && place === item.placeAnswer) {
      setFeedback(`Good! Now say: “${item.placePrompt}”`);
    } else {
      setFeedback("Where does this person work?");
    }
  }

  function listenForJobLine(target: JobListenTarget) {
    if (!jobStep) return;
    if (target === "job") {
      if (jobChoiceByItem[jobStep.key] !== jobStep.jobAnswer) {
        setFeedback("Choose the correct job first.");
        return;
      }
      startSpeechListen(
        jobStep.jobAccept,
        () => {
          setJobSpokenByItem((prev) => ({ ...prev, [jobStep.key]: true }));
          setFeedback("Great!");
        },
        `Try: “${jobStep.jobPrompt}”`,
        "job"
      );
      return;
    }
    if (placeChoiceByItem[jobStep.key] !== jobStep.placeAnswer) {
      setFeedback("Choose the correct workplace first.");
      return;
    }
    startSpeechListen(
      jobStep.placeAccept,
      () => {
        setPlaceSpokenByItem((prev) => ({ ...prev, [jobStep.key]: true }));
        setFeedback("Great!");
      },
      `Try: “${jobStep.placePrompt}”`,
      "place"
    );
  }

  function markJobLine(target: JobListenTarget) {
    if (!jobStep) return;
    if (target === "job") {
      if (jobChoiceByItem[jobStep.key] !== jobStep.jobAnswer) {
        setFeedback("Choose the correct job first.");
        return;
      }
      setJobSpokenByItem((prev) => ({ ...prev, [jobStep.key]: true }));
      setFeedback("Marked as said.");
      return;
    }
    if (placeChoiceByItem[jobStep.key] !== jobStep.placeAnswer) {
      setFeedback("Choose the correct workplace first.");
      return;
    }
    setPlaceSpokenByItem((prev) => ({ ...prev, [jobStep.key]: true }));
    setFeedback("Marked as said.");
  }

  function selectFarmerWord(key: string, word: string) {
    setFarmerChoiceByStep((prev) => ({ ...prev, [key]: word }));
    setFarmerSpokenByStep((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const step = farmerSteps.find((s) => s.key === key);
    if (step && word === step.answer) {
      setFeedback(`Good! Now say: “${step.speakPrompt}”`);
    } else {
      setFeedback("Use the helping words and try again.");
    }
  }

  function listenForFarmerStep() {
    if (!farmerStep) return;
    if (farmerChoiceByStep[farmerStep.key] !== farmerStep.answer) {
      setFeedback("Choose the correct helping word first.");
      return;
    }
    startSpeechListen(
      farmerStep.sayAccept,
      () => {
        setFarmerSpokenByStep((prev) => ({ ...prev, [farmerStep.key]: true }));
        setFeedback("Great reporting!");
      },
      `Try: “${farmerStep.speakPrompt}”`
    );
  }

  function markFarmerSpoken() {
    if (!farmerStep) return;
    if (farmerChoiceByStep[farmerStep.key] !== farmerStep.answer) {
      setFeedback("Choose the correct helping word first.");
      return;
    }
    setFarmerSpokenByStep((prev) => ({ ...prev, [farmerStep.key]: true }));
    setFeedback("Marked as said.");
  }

  function playFarmerExample() {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setShowFarmerExample(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(farmerActivity.exampleLines.join(" "));
    utter.lang = "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
    setShowFarmerExample(true);
  }

  function toggleKitchenObject(key: string) {
    setSelectedKitchen((prev) => ({ ...prev, [key]: !prev[key] }));
    setFeedback(null);
  }

  function checkKitchenSelection() {
    if (kitchenSelectCorrect) {
      setFeedback("Great! Those belong in the kitchen. Now complete the sentences.");
      setKitchenPhase("sentences");
    } else {
      setFeedback("Select only the kitchen items. Leave out pen and pencil.");
    }
  }

  function selectKitchenWord(key: string, word: string) {
    setKitchenChoiceByStep((prev) => ({ ...prev, [key]: word }));
    setKitchenSpokenByStep((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const step = kitchenSteps.find((s) => s.key === key);
    if (step && word === step.answer) {
      setFeedback(`Good! Now say: “${step.speakPrompt}”`);
    } else {
      setFeedback("Try another word.");
    }
  }

  function listenForKitchenStep() {
    if (!kitchenStep) return;
    if (kitchenChoiceByStep[kitchenStep.key] !== kitchenStep.answer) {
      setFeedback("Choose the correct word first.");
      return;
    }
    startSpeechListen(
      kitchenStep.sayAccept,
      () => {
        setKitchenSpokenByStep((prev) => ({ ...prev, [kitchenStep.key]: true }));
        setFeedback("Great job!");
      },
      `Try: “${kitchenStep.speakPrompt}”`
    );
  }

  function markKitchenSpoken() {
    if (!kitchenStep) return;
    if (kitchenChoiceByStep[kitchenStep.key] !== kitchenStep.answer) {
      setFeedback("Choose the correct word first.");
      return;
    }
    setKitchenSpokenByStep((prev) => ({ ...prev, [kitchenStep.key]: true }));
    setFeedback("Marked as said.");
  }

  if (!activity) return null;

  return (
    <main className="dashboard-screen kid-aptitude-play aptitude-lang-english conversation-match-challenge">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">Grade 2 · Level 4</p>
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
              <h2 className="dashboard-panel-title">Level 4 is locked</h2>
              <p className="student-meta">
                Complete the Grade 2 English aptitude test (or finish Level 3) to unlock Level 4.
              </p>
              <div className="section-top level-actions">
                <Link href={`/dashboard/students/${studentId}/levels/english/grade-2/level-3`} className="btn">
                  Go to Level 3
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
                {grade2EnglishLevel4Activities.map((item, index) => (
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

              {activity.type === "conversation_match_speak" ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {conversationActivity.hint}
                  </p>

                  <div className="conversation-phase-tabs section-top">
                    <button
                      type="button"
                      className={`conversation-phase-tab ${phase === "match" ? "conversation-phase-tab-active" : ""}`}
                      onClick={() => setPhase("match")}
                    >
                      1. Match
                    </button>
                    <button
                      type="button"
                      className={`conversation-phase-tab ${phase === "speak" ? "conversation-phase-tab-active" : ""}`}
                      onClick={() => {
                        if (!allMatched) {
                          setFeedback("Match all replies correctly first.");
                          return;
                        }
                        setPhase("speak");
                      }}
                    >
                      2. Speak
                    </button>
                    <button
                      type="button"
                      className={`conversation-phase-tab ${phase === "continue" ? "conversation-phase-tab-active" : ""}`}
                      onClick={() => {
                        if (!allSpoken) {
                          setFeedback("Speak all matched replies first.");
                          return;
                        }
                        setPhase("continue");
                      }}
                    >
                      3. Continue
                    </button>
                  </div>

                  {phase === "match" ? (
                    <div className="conversation-match-layout section-top">
                      <div className="conversation-prompts">
                        {items.map((item, index) => {
                          const matched = matchByItem[item.key];
                          const correct = matched === item.answer;
                          const active = activePromptKey === item.key;
                          return (
                            <div
                              key={item.key}
                              className={`conversation-prompt-row ${active ? "conversation-prompt-row-active" : ""} ${
                                correct ? "conversation-prompt-row-correct" : ""
                              }`}
                            >
                              <span className="conversation-num">{index + 1}</span>
                              <span className={`conversation-avatar conversation-avatar-${item.avatar}`} aria-hidden>
                                {item.avatar === "boy" ? "B" : "G"}
                              </span>
                              <button
                                type="button"
                                className="conversation-bubble"
                                onClick={() => selectPrompt(item.key)}
                              >
                                {item.prompt}
                              </button>
                              <button
                                type="button"
                                className={`conversation-slot ${matched ? "conversation-slot-filled" : ""} ${
                                  correct ? "conversation-slot-correct" : ""
                                }`}
                                onClick={() => {
                                  if (matched) clearMatch(item.key);
                                  else selectPrompt(item.key);
                                }}
                              >
                                {matched || "Drop reply here"}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="conversation-reply-pool">
                        <p className="student-meta" style={{ fontWeight: 800 }}>
                          Replies
                        </p>
                        <div className="conversation-replies">
                          {availableReplies.map((reply) => (
                            <button
                              key={reply}
                              type="button"
                              className="conversation-reply-chip"
                              onClick={() => assignReply(reply)}
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                        <button type="button" className="btn btn-secondary" onClick={resetMatches}>
                          Reset
                        </button>
                        {allMatched ? (
                          <button type="button" className="btn" onClick={goToSpeakPhase}>
                            Go to Speak ★
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {phase === "speak" && speakItem ? (
                    <div className="conversation-speak-panel section-top">
                      <div className="family-progress">
                        {items.map((item, i) => (
                          <button
                            key={item.key}
                            type="button"
                            className={`family-step-dot ${i === speakIndex ? "family-step-dot-active" : ""} ${
                              spokenByItem[item.key] ? "family-step-dot-done" : ""
                            }`}
                            onClick={() => {
                              setSpeakIndex(i);
                              setFeedback(null);
                            }}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <div className="conversation-speak-card">
                        <div className="conversation-speak-line">
                          <span className={`conversation-avatar conversation-avatar-${speakItem.avatar}`} aria-hidden>
                            {speakItem.avatar === "boy" ? "B" : "G"}
                          </span>
                          <div className="conversation-bubble">{speakItem.prompt}</div>
                        </div>
                        <div className="conversation-speak-line">
                          <div className="conversation-slot conversation-slot-filled conversation-slot-correct">
                            Your reply: {speakItem.answer}
                          </div>
                          <span className="conversation-avatar conversation-avatar-girl" aria-hidden>
                            G
                          </span>
                        </div>

                        <button
                          type="button"
                          className="btn family-mic-btn"
                          onClick={listenForSpeakItem}
                          disabled={listening}
                        >
                          {listening
                            ? "Listening…"
                            : spokenByItem[speakItem.key]
                              ? "✓ Recorded!"
                              : "🎤 Tap to Speak"}
                        </button>
                        {!spokenByItem[speakItem.key] ? (
                          <button type="button" className="btn btn-secondary" onClick={markSpeakItem}>
                            Mark as said
                          </button>
                        ) : null}
                      </div>

                      <div className="alphabet-nav section-top">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={speakIndex === 0}
                          onClick={() => {
                            setSpeakIndex((i) => Math.max(0, i - 1));
                            setFeedback(null);
                          }}
                        >
                          Back
                        </button>
                        {speakIndex < items.length - 1 ? (
                          <button
                            type="button"
                            className="btn"
                            onClick={() => {
                              setSpeakIndex((i) => Math.min(items.length - 1, i + 1));
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
                              if (!allSpoken) {
                                setFeedback("Speak all replies first.");
                                return;
                              }
                              setPhase("continue");
                              setFeedback(null);
                            }}
                          >
                            {allSpoken ? "Continue ★" : "Continue"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {phase === "continue" ? (
                    <div className="conversation-continue-panel section-top">
                      <div className="conversation-speak-line">
                        <span className="conversation-avatar conversation-avatar-girl" aria-hidden>
                          G
                        </span>
                        <div className="conversation-bubble">{conversationActivity.continuePrompt}</div>
                      </div>
                      <p className="student-meta">{conversationActivity.continueHint}</p>
                      <button
                        type="button"
                        className="btn family-mic-btn"
                        onClick={listenForContinue}
                        disabled={listening}
                      >
                        {listening ? "Listening…" : continueSpoken ? "✓ Recorded!" : "🎤 Tap to Speak"}
                      </button>
                      {!continueSpoken ? (
                        <button type="button" className="btn btn-secondary" onClick={markContinueSpoken}>
                          Mark as said
                        </button>
                      ) : null}
                      <div className="alphabet-nav section-top">
                        <button type="button" className="btn btn-secondary" onClick={() => setPhase("speak")}>
                          Back
                        </button>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => {
                            setActivityIndex(1);
                            setFeedback(null);
                          }}
                        >
                          {conversationDone ? "Go to Activity 2 ★" : "Activity 2"}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {!micSupported ? (
                    <p className="student-meta section-top">Microphone not available — use Mark as said.</p>
                  ) : null}
                  {feedback && activity.type === "conversation_match_speak" ? (
                    <p className="alphabet-feedback section-top">{feedback}</p>
                  ) : null}
                </article>
              ) : null}

              {activity.type === "job_place_speak" && jobStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {jobActivity.hint}
                  </p>

                  <div className="family-progress section-top">
                    {jobItems.map((item, i) => (
                      <button
                        key={item.key}
                        type="button"
                        className={`family-step-dot ${i === jobStepIndex ? "family-step-dot-active" : ""} ${
                          jobItemDone(item.key) ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => {
                          setJobStepIndex(i);
                          setFeedback(null);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="job-place-layout section-top">
                    <div className="job-place-image-wrap">
                      <img src={jobStep.image} alt={jobStep.jobAnswer} className="job-place-image" />
                    </div>

                    <div className="job-place-panels">
                      <div className="job-place-panel">
                        <p className="job-place-sentence">
                          {jobStep.pronoun} is a{" "}
                          <span className="job-place-blank">
                            {jobChoiceOk ? jobStep.jobAnswer : "……………"}
                          </span>
                        </p>
                        <div className="job-place-options">
                          {jobActivity.jobOptions.map((opt) => {
                            const selected = jobChoiceByItem[jobStep.key] === opt;
                            const correct = selected && opt === jobStep.jobAnswer;
                            return (
                              <button
                                key={opt}
                                type="button"
                                className={`job-place-option ${selected ? "job-place-option-selected" : ""} ${
                                  correct ? "job-place-option-correct" : ""
                                }`}
                                onClick={() => selectJob(jobStep.key, opt)}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {jobChoiceOk ? (
                          <div className="vehicle-speak-panel">
                            <p className="student-meta">Say: “{jobStep.jobPrompt}”</p>
                            <button
                              type="button"
                              className="btn family-mic-btn"
                              onClick={() => listenForJobLine("job")}
                              disabled={listening}
                            >
                              {listening && listeningTarget === "job"
                                ? "Listening…"
                                : jobSpokenByItem[jobStep.key]
                                  ? "✓ Recorded!"
                                  : "🎤 Tap the microphone and speak"}
                            </button>
                            {!jobSpokenByItem[jobStep.key] ? (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => markJobLine("job")}
                              >
                                Mark as said
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      <div className="job-place-panel">
                        <p className="job-place-sentence">
                          {jobStep.pronoun} works in the{" "}
                          <span className="job-place-blank">
                            {placeChoiceOk ? jobStep.placeAnswer : "……………"}
                          </span>
                        </p>
                        <div className="job-place-options">
                          {jobActivity.placeOptions.map((opt) => {
                            const selected = placeChoiceByItem[jobStep.key] === opt;
                            const correct = selected && opt === jobStep.placeAnswer;
                            return (
                              <button
                                key={opt}
                                type="button"
                                className={`job-place-option ${selected ? "job-place-option-selected" : ""} ${
                                  correct ? "job-place-option-correct" : ""
                                }`}
                                onClick={() => selectPlace(jobStep.key, opt)}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {placeChoiceOk ? (
                          <div className="vehicle-speak-panel">
                            <p className="student-meta">Say: “{jobStep.placePrompt}”</p>
                            <button
                              type="button"
                              className="btn family-mic-btn"
                              onClick={() => listenForJobLine("place")}
                              disabled={listening}
                            >
                              {listening && listeningTarget === "place"
                                ? "Listening…"
                                : placeSpokenByItem[jobStep.key]
                                  ? "✓ Recorded!"
                                  : "🎤 Tap the microphone and speak"}
                            </button>
                            {!placeSpokenByItem[jobStep.key] ? (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => markJobLine("place")}
                              >
                                Mark as said
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
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
                      disabled={jobStepIndex === 0}
                      onClick={() => {
                        setJobStepIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                    >
                      Back
                    </button>
                    {jobStepIndex < jobItems.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setJobStepIndex((i) => Math.min(jobItems.length - 1, i + 1));
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
                        {jobCompleted === jobMax ? "Go to Activity 3 ★" : "Activity 3"}
                      </button>
                    )}
                  </div>
                </article>
              ) : null}

              {activity.type === "farmer_reporter_speak" && farmerStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {farmerActivity.hint}
                  </p>

                  <div className="family-progress section-top">
                    {farmerSteps.map((step, i) => (
                      <button
                        key={step.key}
                        type="button"
                        className={`family-step-dot ${i === farmerStepIndex ? "family-step-dot-active" : ""} ${
                          farmerStepDone(step.key) ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => {
                          setFarmerStepIndex(i);
                          setFeedback(null);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="farmer-reporter-layout section-top">
                    <div className="farmer-reporter-left">
                      <div className="farmer-reporter-image-wrap">
                        <img src={farmerActivity.image} alt="Farmer" className="farmer-reporter-image" />
                      </div>
                      <p className="farmer-reporter-tip">{farmerActivity.tip}</p>
                    </div>

                    <div className="farmer-reporter-right">
                      <div className="farmer-helping-words">
                        <p className="student-meta" style={{ fontWeight: 800, margin: 0 }}>
                          Helping words
                        </p>
                        <div className="farmer-helping-chips">
                          {farmerActivity.helpingWords.map((word) => (
                            <span key={word} className="farmer-helping-chip">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="farmer-prompt-panel">
                        <p className="farmer-blank-line">{farmerStep.blankPrompt}</p>
                        <div className="job-place-options">
                          {farmerFillOptions.map((opt) => {
                            const selected = farmerChoiceByStep[farmerStep.key] === opt;
                            const correct = selected && opt === farmerStep.answer;
                            return (
                              <button
                                key={opt}
                                type="button"
                                className={`job-place-option ${selected ? "job-place-option-selected" : ""} ${
                                  correct ? "job-place-option-correct" : ""
                                }`}
                                onClick={() => selectFarmerWord(farmerStep.key, opt)}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {farmerChoiceOk ? (
                          <div className="vehicle-speak-panel">
                            <p className="student-meta">
                              Prompt: Tell us about the farmer. Say: “{farmerStep.speakPrompt}”
                            </p>
                            <button
                              type="button"
                              className="btn family-mic-btn"
                              onClick={listenForFarmerStep}
                              disabled={listening}
                            >
                              {listening
                                ? "Listening…"
                                : farmerSpokenByStep[farmerStep.key]
                                  ? "✓ Recorded!"
                                  : "🎤 Tap the microphone and speak"}
                            </button>
                            {!farmerSpokenByStep[farmerStep.key] ? (
                              <button type="button" className="btn btn-secondary" onClick={markFarmerSpoken}>
                                Mark as said
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      <div className="farmer-example-panel">
                        <button type="button" className="btn btn-secondary" onClick={playFarmerExample}>
                          Listen to example
                        </button>
                        {showFarmerExample ? (
                          <ul className="farmer-example-list">
                            {farmerActivity.exampleLines.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
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
                      disabled={farmerStepIndex === 0}
                      onClick={() => {
                        setFarmerStepIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                    >
                      Back
                    </button>
                    {farmerStepIndex < farmerSteps.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setFarmerStepIndex((i) => Math.min(farmerSteps.length - 1, i + 1));
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
                        {farmerCompleted === farmerMax ? "Go to Activity 4 ★" : "Activity 4"}
                      </button>
                    )}
                  </div>
                </article>
              ) : null}

              {activity.type === "kitchen_items_speak" ? (
                <article className="dashboard-item subject-item kid-aptitude-card">
                  <div className="conversation-phase-tabs section-top">
                    <button
                      type="button"
                      className={`conversation-phase-tab ${kitchenPhase === "select" ? "conversation-phase-tab-active" : ""}`}
                      onClick={() => setKitchenPhase("select")}
                    >
                      1. Select kitchen items
                    </button>
                    <button
                      type="button"
                      className={`conversation-phase-tab ${kitchenPhase === "sentences" ? "conversation-phase-tab-active" : ""}`}
                      onClick={() => {
                        if (!kitchenSelectCorrect) {
                          setFeedback("Select the correct kitchen items first.");
                          return;
                        }
                        setKitchenPhase("sentences");
                      }}
                    >
                      2. Say the sentences
                    </button>
                  </div>

                  {kitchenPhase === "select" ? (
                    <div className="kitchen-select-panel section-top">
                      <p className="student-meta" style={{ fontWeight: 700 }}>
                        {kitchenActivity.prompt}
                      </p>
                      <div className="kitchen-scene-wrap">
                        <img
                          src={kitchenActivity.kitchenImage}
                          alt="Kitchen"
                          className="kitchen-scene-image"
                        />
                      </div>
                      <div className="kitchen-object-grid">
                        {kitchenObjects.map((obj) => {
                          const selected = Boolean(selectedKitchen[obj.key]);
                          return (
                            <button
                              key={obj.key}
                              type="button"
                              className={`kitchen-object-card ${selected ? "kitchen-object-card-selected" : ""} ${
                                selected && obj.isKitchen ? "kitchen-object-card-correct" : ""
                              } ${selected && !obj.isKitchen ? "kitchen-object-card-wrong" : ""}`}
                              onClick={() => toggleKitchenObject(obj.key)}
                            >
                              <img src={obj.image} alt={obj.label} className="kitchen-object-image" />
                              <strong>{obj.label}</strong>
                            </button>
                          );
                        })}
                      </div>
                      <button type="button" className="btn" onClick={checkKitchenSelection}>
                        {kitchenSelectCorrect ? "Go to sentences ★" : "Check selection"}
                      </button>
                    </div>
                  ) : null}

                  {kitchenPhase === "sentences" && kitchenStep ? (
                    <div className="kitchen-sentence-panel section-top">
                      <p className="student-meta" style={{ fontWeight: 700 }}>
                        {kitchenActivity.hint}
                      </p>
                      <div className="family-progress">
                        {kitchenSteps.map((step, i) => (
                          <button
                            key={step.key}
                            type="button"
                            className={`family-step-dot ${i === kitchenStepIndex ? "family-step-dot-active" : ""} ${
                              kitchenStepDone(step.key) ? "family-step-dot-done" : ""
                            }`}
                            onClick={() => {
                              setKitchenStepIndex(i);
                              setFeedback(null);
                            }}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <div className="kitchen-sentence-card">
                        {"image" in kitchenStep && kitchenStep.image ? (
                          <img
                            src={kitchenStep.image}
                            alt=""
                            className="kitchen-sentence-thumb"
                          />
                        ) : null}
                        <p className="farmer-blank-line">{kitchenStep.blankPrompt}</p>
                        <div className="job-place-options">
                          {kitchenStep.options.map((opt) => {
                            const selected = kitchenChoiceByStep[kitchenStep.key] === opt;
                            const correct = selected && opt === kitchenStep.answer;
                            return (
                              <button
                                key={opt}
                                type="button"
                                className={`job-place-option ${selected ? "job-place-option-selected" : ""} ${
                                  correct ? "job-place-option-correct" : ""
                                }`}
                                onClick={() => selectKitchenWord(kitchenStep.key, opt)}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {kitchenChoiceOk ? (
                          <div className="vehicle-speak-panel">
                            <p className="student-meta">Say: “{kitchenStep.speakPrompt}”</p>
                            <button
                              type="button"
                              className="btn family-mic-btn"
                              onClick={listenForKitchenStep}
                              disabled={listening}
                            >
                              {listening
                                ? "Listening…"
                                : kitchenSpokenByStep[kitchenStep.key]
                                  ? "✓ Recorded!"
                                  : "🎤 Tap to Speak"}
                            </button>
                            {!kitchenSpokenByStep[kitchenStep.key] ? (
                              <button type="button" className="btn btn-secondary" onClick={markKitchenSpoken}>
                                Mark as said
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      <div className="alphabet-nav section-top">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={kitchenStepIndex === 0}
                          onClick={() => {
                            setKitchenStepIndex((i) => Math.max(0, i - 1));
                            setFeedback(null);
                          }}
                        >
                          Back
                        </button>
                        {kitchenStepIndex < kitchenSteps.length - 1 ? (
                          <button
                            type="button"
                            className="btn"
                            onClick={() => {
                              setKitchenStepIndex((i) => Math.min(kitchenSteps.length - 1, i + 1));
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
                    </div>
                  ) : null}

                  {!micSupported ? (
                    <p className="student-meta section-top">Microphone not available — use Mark as said.</p>
                  ) : null}
                  {feedback ? <p className="alphabet-feedback section-top">{feedback}</p> : null}
                </article>
              ) : null}
            </>
          ) : null}
        </section>
      </section>
    </main>
  );
}
