"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getStoredUser, getStudentDashboard } from "@/lib/api";
import {
  grade2EnglishLevel1Activities,
  grade2EnglishLevel1Activity1,
  grade2EnglishLevel1Activity2,
  grade2EnglishLevel1Activity3,
  grade2EnglishLevel1Activity4
} from "@/lib/grade2EnglishLevel1";
import {
  getGrade2EnglishLevelProgress,
  markGrade2EnglishLevel1Complete
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
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function speechMatches(transcript: string, accepted: string[]): boolean {
  const spoken = normalizeSpeech(transcript);
  return accepted.some((word) => spoken === word || spoken.includes(word));
}

export default function Grade2EnglishLevel1Page() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const studentId = useMemo(() => Number(params?.studentId), [params?.studentId]);

  const [studentName, setStudentName] = useState("Student");
  const [error, setError] = useState<string | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [familyStepIndex, setFamilyStepIndex] = useState(0);
  const [animalStepIndex, setAnimalStepIndex] = useState(0);
  const [saidPictures, setSaidPictures] = useState<Record<string, boolean>>({});
  const [bonusDone, setBonusDone] = useState<Record<string, boolean>>({});
  const [familyCorrect, setFamilyCorrect] = useState<Record<string, boolean>>({});
  const [animalCorrect, setAnimalCorrect] = useState<Record<string, boolean>>({});
  const [skyFound, setSkyFound] = useState<Record<string, boolean>>({});
  const [listeningKey, setListeningKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const [level1UnlockedNext, setLevel1UnlockedNext] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const activity = grade2EnglishLevel1Activities[activityIndex];
  const alphabetActivity = grade2EnglishLevel1Activity1;
  const familyActivity = grade2EnglishLevel1Activity2;
  const animalActivity = grade2EnglishLevel1Activity3;
  const skyActivity = grade2EnglishLevel1Activity4;
  const letters = alphabetActivity.letters;
  const currentLetter = letters[letterIndex];
  const currentFamilyStep = familyActivity.steps[familyStepIndex];
  const currentAnimalStep = animalActivity.steps[animalStepIndex];

  const alphabetSaidCount = Object.values(saidPictures).filter(Boolean).length;
  const alphabetTotalPictures = letters.reduce((sum, card) => sum + card.pictures.length, 0);
  const alphabetBonusCount = Object.values(bonusDone).filter(Boolean).length;
  const alphabetScore = alphabetSaidCount + alphabetBonusCount;
  const alphabetMax = alphabetTotalPictures + letters.length;

  const familyScore = Object.values(familyCorrect).filter(Boolean).length;
  const familyMax = familyActivity.steps.length;
  const animalScore = Object.values(animalCorrect).filter(Boolean).length;
  const animalMax = animalActivity.steps.length;
  const skyScore = Object.values(skyFound).filter(Boolean).length;
  const skyMax = skyActivity.items.length;

  const score =
    activity?.type === "family_say_who"
      ? familyScore
      : activity?.type === "animal_say_name"
        ? animalScore
        : activity?.type === "sky_say_what"
          ? skyScore
          : alphabetScore;
  const maxScore =
    activity?.type === "family_say_who"
      ? familyMax
      : activity?.type === "animal_say_name"
        ? animalMax
        : activity?.type === "sky_say_what"
          ? skyMax
          : alphabetMax;

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      }
    }

    loadStudent();
    setMicSupported(Boolean(getSpeechRecognition()));
    if (studentId) {
      setLevel1UnlockedNext(getGrade2EnglishLevelProgress(studentId).level1Complete);
    }
  }, [router, studentId]);

  const alphabetPerfect =
    letters.every((card) => card.pictures.every((p) => saidPictures[p.key])) &&
    letters.every((card) => Boolean(bonusDone[card.letter]));
  const familyPerfect = familyActivity.steps.every((step) => familyCorrect[step.key]);
  const animalPerfect = animalActivity.steps.every((step) => animalCorrect[step.key]);
  const skyPerfect = skyActivity.items.every((item) => skyFound[item.key]);
  const level1AllCorrect = alphabetPerfect && familyPerfect && animalPerfect && skyPerfect;

  useEffect(() => {
    if (!studentId || !level1AllCorrect) return;
    markGrade2EnglishLevel1Complete(studentId);
    setLevel1UnlockedNext(true);
  }, [studentId, level1AllCorrect]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const markPictureSaid = useCallback((pictureKey: string, message: string) => {
    setSaidPictures((prev) => ({ ...prev, [pictureKey]: true }));
    setFeedback(message);
  }, []);

  const startListening = useCallback(
    (targetKey: string, accepted: string[], successMessage: string, onSuccess: () => void) => {
      const SpeechRecognitionCtor = getSpeechRecognition();
      if (!SpeechRecognitionCtor) {
        setMicSupported(false);
        onSuccess();
        setFeedback(`${successMessage} (mic not available — marked as said)`);
        return;
      }

      recognitionRef.current?.stop();
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.continuous = false;
      recognitionRef.current = recognition;
      setListeningKey(targetKey);
      setFeedback("Listening… say it clearly!");

      recognition.onresult = (event) => {
        const transcripts: string[] = [];
        for (let i = 0; i < event.results.length; i += 1) {
          const alt = event.results[i]?.[0]?.transcript;
          if (alt) transcripts.push(alt);
        }
        const matched = transcripts.some((t) => speechMatches(t, accepted));
        if (matched) {
          onSuccess();
          setFeedback(successMessage);
        } else {
          setFeedback(`I heard “${transcripts[0] || "…"}”. Try again!`);
        }
        setListeningKey(null);
      };

      recognition.onerror = () => {
        setListeningKey(null);
        setFeedback("Could not hear you. Tap again, or use Mark as said.");
      };

      recognition.onend = () => {
        setListeningKey((prev) => (prev === targetKey ? null : prev));
      };

      try {
        recognition.start();
      } catch {
        setListeningKey(null);
        setFeedback("Microphone busy. Try again.");
      }
    },
    []
  );

  function listenForPicture(pictureKey: string, accepted: string[], label: string) {
    startListening(pictureKey, accepted, `Great! You said ${label}.`, () =>
      markPictureSaid(pictureKey, `Great! You said ${label}.`)
    );
  }

  function listenForFamilyStep() {
    if (!currentFamilyStep) return;
    startListening(
      currentFamilyStep.key,
      currentFamilyStep.sayAccept,
      `Great! This is my ${currentFamilyStep.label}.`,
      () => setFamilyCorrect((prev) => ({ ...prev, [currentFamilyStep.key]: true }))
    );
  }

  function listenForAnimalStep() {
    if (!currentAnimalStep) return;
    startListening(
      `animal-${currentAnimalStep.key}`,
      currentAnimalStep.sayAccept,
      `Great! It's a ${currentAnimalStep.label}!`,
      () => setAnimalCorrect((prev) => ({ ...prev, [currentAnimalStep.key]: true }))
    );
  }

  function listenForSkyScene() {
    const SpeechRecognitionCtor = getSpeechRecognition();
    const remaining = skyActivity.items.filter((item) => !skyFound[item.key]);
    if (remaining.length === 0) {
      setFeedback("You found everything in the sky!");
      return;
    }

    if (!SpeechRecognitionCtor) {
      setMicSupported(false);
      setFeedback("Mic not available — tap a word to mark it.");
      return;
    }

    recognitionRef.current?.stop();
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setListeningKey("sky-scene");
    setFeedback("Listening… say what you can see!");

    recognition.onresult = (event) => {
      const transcripts: string[] = [];
      for (let i = 0; i < event.results.length; i += 1) {
        const alt = event.results[i]?.[0]?.transcript;
        if (alt) transcripts.push(alt);
      }
      const spoken = normalizeSpeech(transcripts.join(" "));
      const matched = remaining.filter((item) =>
        item.sayAccept.some((word) => spoken === word || spoken.includes(word))
      );
      if (matched.length > 0) {
        setSkyFound((prev) => {
          const next = { ...prev };
          matched.forEach((item) => {
            next[item.key] = true;
          });
          return next;
        });
        setFeedback(`Nice! You said: ${matched.map((m) => m.label).join(", ")}.`);
      } else {
        setFeedback(`I heard “${transcripts[0] || "…"}”. Try naming something in the sky!`);
      }
      setListeningKey(null);
    };

    recognition.onerror = () => {
      setListeningKey(null);
      setFeedback("Could not hear you. Tap again, or tap a word to mark it.");
    };

    recognition.onend = () => {
      setListeningKey((prev) => (prev === "sky-scene" ? null : prev));
    };

    try {
      recognition.start();
    } catch {
      setListeningKey(null);
      setFeedback("Microphone busy. Try again.");
    }
  }

  function listenForSkyItem(itemKey: string, accepted: string[], label: string) {
    startListening(`sky-${itemKey}`, accepted, `Great! You found the ${label}.`, () =>
      setSkyFound((prev) => ({ ...prev, [itemKey]: true }))
    );
  }

  function listenForBonus() {
    if (!currentLetter) return;
    const letter = currentLetter.letter.toLowerCase();
    const pictureWords = currentLetter.pictures.map((p) => p.label.toLowerCase());
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      setBonusDone((prev) => ({ ...prev, [currentLetter.letter]: true }));
      setFeedback("Bonus marked (mic not available).");
      return;
    }

    recognitionRef.current?.stop();
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    const targetKey = `bonus-${currentLetter.letter}`;
    setListeningKey(targetKey);
    setFeedback("Listening… say the letter and the words!");

    recognition.onresult = (event) => {
      const transcripts: string[] = [];
      for (let i = 0; i < event.results.length; i += 1) {
        const alt = event.results[i]?.[0]?.transcript;
        if (alt) transcripts.push(alt);
      }
      const spoken = normalizeSpeech(transcripts.join(" "));
      const hasLetter = spoken.includes(letter) || spoken.startsWith(letter);
      const hasWords = pictureWords.every((word) => spoken.includes(word));
      if (hasLetter && hasWords) {
        setBonusDone((prev) => ({ ...prev, [currentLetter.letter]: true }));
        setFeedback(`Bonus! You said ${currentLetter.letter} and the words!`);
      } else {
        setFeedback(
          `I heard “${transcripts[0] || "…"}”. Try saying ${currentLetter.letter} ${pictureWords.join(" ")}.`
        );
      }
      setListeningKey(null);
    };

    recognition.onerror = () => {
      setListeningKey(null);
      setFeedback("Could not hear you. Tap again, or use Mark bonus.");
    };

    recognition.onend = () => {
      setListeningKey((prev) => (prev === targetKey ? null : prev));
    };

    try {
      recognition.start();
    } catch {
      setListeningKey(null);
      setFeedback("Microphone busy. Try again.");
    }
  }

  function switchActivity(index: number) {
    recognitionRef.current?.stop();
    setListeningKey(null);
    setFeedback(null);
    setActivityIndex(index);
  }

  if (!activity) return null;

  const picturesDone = currentLetter?.pictures.every((p) => saidPictures[p.key]) ?? false;
  const alphabetAllDone = letters.every((card) => card.pictures.every((p) => saidPictures[p.key]));
  const familyAllDone = familyActivity.steps.every((step) => familyCorrect[step.key]);
  const familyStepDone = currentFamilyStep ? Boolean(familyCorrect[currentFamilyStep.key]) : false;
  const animalAllDone = animalActivity.steps.every((step) => animalCorrect[step.key]);
  const animalStepDone = currentAnimalStep ? Boolean(animalCorrect[currentAnimalStep.key]) : false;
  const skyAllDone = skyActivity.items.every((item) => skyFound[item.key]);

  return (
    <main className="dashboard-screen kid-aptitude-play aptitude-lang-english alphabet-detective">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">Grade 2 · Level 1</p>
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
            Back
          </Link>
        </div>
      </header>

      <section className="dashboard-content dashboard-content-single">
        <section className="dashboard-panel dashboard-main-panel">
          {error ? <p className="error-text">{error}</p> : null}

          {!error ? (
            <>
              {level1UnlockedNext ? (
                <div className="dashboard-item section-top" style={{ borderColor: "#2f9e5b", background: "#eefbf2" }}>
                  <p className="student-meta" style={{ fontWeight: 800, margin: 0 }}>
                    Level 1 complete! Level 2 is unlocked.
                  </p>
                  <div className="section-top">
                    <Link href={`/dashboard/students/${studentId}/levels/english/grade-2/level-2`} className="btn">
                      Go to Level 2 ★
                    </Link>
                  </div>
                </div>
              ) : null}

              <div className="choice-pool section-top" style={{ marginBottom: 12 }}>
                {grade2EnglishLevel1Activities.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`number-option-btn ${activityIndex === index ? "number-option-btn-selected" : ""}`}
                    onClick={() => switchActivity(index)}
                  >
                    Activity {item.id}
                  </button>
                ))}
              </div>

              {activity.type === "alphabet_picture_detective" && currentLetter ? (
                <article className="dashboard-item subject-item kid-aptitude-card alphabet-detective-card">
                  <p className="student-meta">
                    Letter {letterIndex + 1} of {letters.length}
                  </p>
                  <div className="alphabet-detective-layout">
                    <aside className="alphabet-detective-howto">
                      <strong>How to play</strong>
                      <ol>
                        <li>Look at the letter.</li>
                        <li>Look at the pictures.</li>
                        <li>Say the name of each picture.</li>
                        <li>Bonus: say the letter and both words together!</li>
                      </ol>
                      {!micSupported ? (
                        <p className="student-meta">
                          Voice not available in this browser — use <em>Mark as said</em>.
                        </p>
                      ) : null}
                    </aside>

                    <div className="alphabet-detective-main">
                      <div className="alphabet-detective-stage">
                        <div className="alphabet-letter-tile" aria-label={`Letter ${currentLetter.letter}`}>
                          {currentLetter.letter}
                        </div>
                        <div className="alphabet-picture-grid">
                          {currentLetter.pictures.map((picture) => {
                            const done = Boolean(saidPictures[picture.key]);
                            const listening = listeningKey === picture.key;
                            return (
                              <div
                                key={picture.key}
                                className={`alphabet-picture-card ${done ? "alphabet-picture-card-done" : ""}`}
                              >
                                <img src={picture.image} alt={picture.label} className="alphabet-picture-image" />
                                <strong>{picture.label}</strong>
                                <button
                                  type="button"
                                  className={`btn ${listening ? "btn-secondary" : ""}`}
                                  onClick={() => listenForPicture(picture.key, picture.sayAccept, picture.label)}
                                  disabled={listeningKey != null && !listening}
                                >
                                  {listening ? "Listening…" : done ? "✓ Said!" : "🎤 Say this picture"}
                                </button>
                                {!done ? (
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => markPictureSaid(picture.key, `Nice! ${picture.label} marked.`)}
                                  >
                                    Mark as said
                                  </button>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className={`alphabet-bonus ${bonusDone[currentLetter.letter] ? "alphabet-bonus-done" : ""}`}>
                        <div>
                          <strong>Bonus challenge</strong>
                          <p className="student-meta">
                            Say the letter and the word{currentLetter.pictures.length > 1 ? "s" : ""} together!
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn"
                          onClick={listenForBonus}
                          disabled={
                            !picturesDone ||
                            (listeningKey != null && listeningKey !== `bonus-${currentLetter.letter}`)
                          }
                        >
                          {bonusDone[currentLetter.letter]
                            ? "✓ Bonus done!"
                            : listeningKey === `bonus-${currentLetter.letter}`
                              ? "Listening…"
                              : "🎤 Bonus"}
                        </button>
                        {picturesDone && !bonusDone[currentLetter.letter] ? (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setBonusDone((prev) => ({ ...prev, [currentLetter.letter]: true }));
                              setFeedback("Bonus marked!");
                            }}
                          >
                            Mark bonus
                          </button>
                        ) : null}
                      </div>

                      {feedback ? <p className="alphabet-feedback">{feedback}</p> : null}

                      <div className="alphabet-nav">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={letterIndex === 0}
                          onClick={() => {
                            setLetterIndex((i) => Math.max(0, i - 1));
                            setFeedback(null);
                          }}
                        >
                          Previous
                        </button>
                        <div className="alphabet-dots" aria-hidden>
                          {letters.map((card, i) => (
                            <span
                              key={card.letter}
                              className={`alphabet-dot ${i === letterIndex ? "alphabet-dot-active" : ""} ${
                                card.pictures.every((p) => saidPictures[p.key]) ? "alphabet-dot-done" : ""
                              }`}
                            />
                          ))}
                        </div>
                        {letterIndex < letters.length - 1 ? (
                          <button
                            type="button"
                            className="btn"
                            onClick={() => {
                              setLetterIndex((i) => Math.min(letters.length - 1, i + 1));
                              setFeedback(null);
                            }}
                          >
                            Next
                          </button>
                        ) : (
                          <button type="button" className="btn" onClick={() => switchActivity(1)}>
                            {alphabetAllDone ? "Go to Activity 2 ★" : "Activity 2"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ) : null}

              {activity.type === "family_say_who" && currentFamilyStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card alphabet-detective-card">
                  <div className="family-progress section-top">
                    {familyActivity.steps.map((step, i) => (
                      <button
                        key={step.key}
                        type="button"
                        className={`family-step-dot ${i === familyStepIndex ? "family-step-dot-active" : ""} ${
                          familyCorrect[step.key] ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => {
                          setFamilyStepIndex(i);
                          setFeedback(null);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="family-say-layout section-top">
                    <div className="family-photo-panel">
                      <img
                        src={familyActivity.familyImage}
                        alt="Family photo"
                        className="family-group-image"
                      />
                      <p className="student-meta" style={{ textAlign: "center", marginTop: 8 }}>
                        Look at the family photo
                      </p>
                    </div>

                    <div className="family-answer-panel">
                      <img
                        src={currentFamilyStep.portrait}
                        alt="Who is this?"
                        className="family-portrait-image"
                      />
                      <p className="family-blank-prompt">{familyActivity.blankPrompt}</p>
                      {familyStepDone ? (
                        <p className="alphabet-feedback" style={{ fontSize: "1.15rem" }}>
                          This is my <strong>{currentFamilyStep.label}</strong>.
                        </p>
                      ) : (
                        <p className="student-meta">Tap the microphone and say your answer.</p>
                      )}

                      <button
                        type="button"
                        className="btn family-mic-btn"
                        onClick={listenForFamilyStep}
                        disabled={listeningKey != null && listeningKey !== currentFamilyStep.key}
                      >
                        {listeningKey === currentFamilyStep.key
                          ? "Listening…"
                          : familyStepDone
                            ? "✓ Correct!"
                            : "🎤 Tap to Speak"}
                      </button>

                      {!familyStepDone ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setFamilyCorrect((prev) => ({ ...prev, [currentFamilyStep.key]: true }));
                            setFeedback(`This is my ${currentFamilyStep.label}.`);
                          }}
                        >
                          Mark as said
                        </button>
                      ) : null}

                      {!micSupported ? (
                        <p className="student-meta">Voice not available — use Mark as said.</p>
                      ) : null}

                      {feedback ? <p className="alphabet-feedback">{feedback}</p> : null}

                      <div className="alphabet-nav">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={familyStepIndex === 0}
                          onClick={() => {
                            setFamilyStepIndex((i) => Math.max(0, i - 1));
                            setFeedback(null);
                          }}
                        >
                          Back
                        </button>
                        {familyStepIndex < familyActivity.steps.length - 1 ? (
                          <button
                            type="button"
                            className="btn"
                            onClick={() => {
                              setFamilyStepIndex((i) => Math.min(familyActivity.steps.length - 1, i + 1));
                              setFeedback(null);
                            }}
                          >
                            Next
                          </button>
                        ) : (
                          <button type="button" className="btn" onClick={() => switchActivity(2)}>
                            {familyAllDone ? "Go to Activity 3 ★" : "Activity 3"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ) : null}

              {activity.type === "animal_say_name" && currentAnimalStep ? (
                <article className="dashboard-item subject-item kid-aptitude-card alphabet-detective-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {animalActivity.hint}
                  </p>

                  <div className="family-progress section-top">
                    {animalActivity.steps.map((step, i) => (
                      <button
                        key={step.key}
                        type="button"
                        className={`family-step-dot ${i === animalStepIndex ? "family-step-dot-active" : ""} ${
                          animalCorrect[step.key] ? "family-step-dot-done" : ""
                        }`}
                        onClick={() => {
                          setAnimalStepIndex(i);
                          setFeedback(null);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="animal-say-stage section-top">
                    <button
                      type="button"
                      className="btn btn-secondary animal-nav-arrow"
                      disabled={animalStepIndex === 0}
                      onClick={() => {
                        setAnimalStepIndex((i) => Math.max(0, i - 1));
                        setFeedback(null);
                      }}
                      aria-label="Previous animal"
                    >
                      ←
                    </button>

                    <div className="animal-card">
                      <img
                        src={currentAnimalStep.image}
                        alt={animalStepDone ? currentAnimalStep.label : "Animal"}
                        className="animal-card-image"
                      />
                      <div className="animal-blanks" aria-hidden>
                        {(animalStepDone ? currentAnimalStep.label : "_".repeat(currentAnimalStep.label.length))
                          .split("")
                          .map((ch, i) => (
                            <span key={`${currentAnimalStep.key}-${i}`} className="animal-blank-char">
                              {animalStepDone ? ch.toUpperCase() : "_"}
                            </span>
                          ))}
                      </div>
                      {animalStepDone ? (
                        <p className="alphabet-feedback" style={{ fontSize: "1.2rem" }}>
                          {currentAnimalStep.label}
                        </p>
                      ) : (
                        <p className="student-meta">Tap the microphone and say the animal name.</p>
                      )}
                      <button
                        type="button"
                        className="btn family-mic-btn"
                        onClick={listenForAnimalStep}
                        disabled={listeningKey != null && listeningKey !== `animal-${currentAnimalStep.key}`}
                      >
                        {listeningKey === `animal-${currentAnimalStep.key}`
                          ? "Listening…"
                          : animalStepDone
                            ? "✓ Correct!"
                            : "🎤 Tap to Speak"}
                      </button>
                      {!animalStepDone ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setAnimalCorrect((prev) => ({ ...prev, [currentAnimalStep.key]: true }));
                            setFeedback(`It's a ${currentAnimalStep.label}!`);
                          }}
                        >
                          Mark as said
                        </button>
                      ) : null}
                      {feedback ? <p className="alphabet-feedback">{feedback}</p> : null}
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary animal-nav-arrow"
                      disabled={animalStepIndex >= animalActivity.steps.length - 1}
                      onClick={() => {
                        setAnimalStepIndex((i) => Math.min(animalActivity.steps.length - 1, i + 1));
                        setFeedback(null);
                      }}
                      aria-label="Next animal"
                    >
                      →
                    </button>
                  </div>

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
                    {animalStepIndex < animalActivity.steps.length - 1 ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setAnimalStepIndex((i) => Math.min(animalActivity.steps.length - 1, i + 1));
                          setFeedback(null);
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <button type="button" className="btn" onClick={() => switchActivity(3)}>
                        {animalAllDone ? "Go to Activity 4 ★" : "Activity 4"}
                      </button>
                    )}
                  </div>
                </article>
              ) : null}

              {activity.type === "sky_say_what" ? (
                <article className="dashboard-item subject-item kid-aptitude-card alphabet-detective-card">
                  <p className="student-meta" style={{ fontWeight: 700 }}>
                    {skyActivity.hint}
                  </p>

                  <div className="sky-say-layout section-top">
                    <div className="sky-scene-panel">
                      <img src={skyActivity.sceneImage} alt="Beautiful sky" className="sky-scene-image" />
                    </div>

                    <div className="sky-words-panel">
                      <p className="student-meta">Say what you can see (or tap a word, then speak):</p>
                      <div className="choice-pool">
                        {skyActivity.items.map((item) => {
                          const found = Boolean(skyFound[item.key]);
                          const listening = listeningKey === `sky-${item.key}`;
                          return (
                            <button
                              key={item.key}
                              type="button"
                              className={`number-option-btn ${found ? "number-option-btn-selected" : ""} ${
                                listening ? "number-option-btn-used" : ""
                              }`}
                              onClick={() => {
                                if (found) return;
                                listenForSkyItem(item.key, item.sayAccept, item.label);
                              }}
                              disabled={listeningKey != null && !listening}
                            >
                              {found ? `✓ ${item.label}` : item.label}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        className="btn family-mic-btn"
                        onClick={listenForSkyScene}
                        disabled={listeningKey != null && listeningKey !== "sky-scene"}
                      >
                        {listeningKey === "sky-scene" ? "Listening…" : "🎤 Say what you see"}
                      </button>

                      <div className="choice-pool">
                        {skyActivity.items
                          .filter((item) => !skyFound[item.key])
                          .map((item) => (
                            <button
                              key={`mark-${item.key}`}
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                setSkyFound((prev) => ({ ...prev, [item.key]: true }));
                                setFeedback(`Marked: ${item.label}`);
                              }}
                            >
                              Mark “{item.label}”
                            </button>
                          ))}
                      </div>

                      {!micSupported ? (
                        <p className="student-meta">Voice not available — use Mark buttons.</p>
                      ) : null}
                      {feedback ? <p className="alphabet-feedback">{feedback}</p> : null}
                      <p className="student-meta">
                        Found {skyScore} / {skyMax}
                      </p>

                      <div className="alphabet-nav">
                        <button type="button" className="btn btn-secondary" onClick={() => switchActivity(2)}>
                          Back
                        </button>
                        <Link
                          href={
                            level1UnlockedNext
                              ? `/dashboard/students/${studentId}/levels/english/grade-2/level-2`
                              : `/dashboard/students/${studentId}`
                          }
                          className={`btn ${skyAllDone ? "" : "btn-secondary"}`}
                        >
                          {level1UnlockedNext
                            ? "Go to Level 2 ★"
                            : skyAllDone
                              ? "Finish ★"
                              : "Back to profile"}
                        </Link>
                      </div>
                    </div>
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
