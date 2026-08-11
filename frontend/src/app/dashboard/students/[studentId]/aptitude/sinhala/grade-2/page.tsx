"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  completeExamSession,
  getStoredUser,
  getStudentDashboard,
  startExamSession,
  type CompleteExamSessionResponse
} from "@/lib/api";

import { grade2SinhalaActivities } from "@/lib/grade2SinhalaAptitude";

export default function Grade2SinhalaAptitudePage() {
  const WORD_SEPARATOR = " | ";

  const params = useParams<{ studentId: string }>();
  const router = useRouter();

  const studentId = useMemo(
    () => Number(params?.studentId),
    [params?.studentId]
  );

  const [studentName, setStudentName] = useState("Student");
  const [grade, setGrade] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mcqAnswers, setMcqAnswers] =
    useState<Record<number, string>>({});

  const [matchAnswers, setMatchAnswers] =
    useState<Record<number, Record<string, string>>>({});

  const [activeChoice, setActiveChoice] =
    useState<Record<number, string | null>>({});

  const [currentActivityIndex, setCurrentActivityIndex] =
    useState(0);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] =
    useState<CompleteExamSessionResponse | null>(null);

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
          dashboard.subjects.find(
            (subject) => subject.code === "sinhala"
          )?.id ?? null
        );

        if (dashboard.student.grade !== 2) {
          setError(
            "This aptitude test is currently available only for Grade 2 students."
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load student profile"
        );
      }
    }

    loadStudent();
  }, [router, studentId]);

  function getActivityMark(
    activity: (typeof grade2SinhalaActivities)[number]
  ): 0 | 1 {
    if (activity.type === "mcq") {
      return mcqAnswers[activity.id] === activity.answer ? 1 : 0;
    }

    if (activity.type === "image_rows") {
      const selectedMap = matchAnswers[activity.id] || {};

      const allRowsCorrect =
        (activity.imageRows || []).length > 0 &&
        (activity.imageRows || []).every(
          (row) => selectedMap[row.key] === row.answer
        );

      return allRowsCorrect ? 1 : 0;
    }

    if (activity.type === "text_rows") {
      const selectedMap = matchAnswers[activity.id] || {};

      const allRowsCorrect =
        (activity.textRows || []).length > 0 &&
        (activity.textRows || []).every(
          (row) => selectedMap[row.key] === row.answer
        );

      return allRowsCorrect ? 1 : 0;
    }

    if (activity.type === "word_boxes") {
      const selectedMap = matchAnswers[activity.id] || {};

      const allRowsCorrect =
        (activity.wordBoxRows || []).length > 0 &&
        (activity.wordBoxRows || []).every(
          (row) => selectedMap[row.key] === row.answer
        );

      return allRowsCorrect ? 1 : 0;
    }

    if (activity.type === "match_letters") {
      const selectedMap = matchAnswers[activity.id] || {};
      const expectedMap = activity.matchAnswerMap || {};

      const allMatched =
        Object.keys(expectedMap).length > 0 &&
        Object.entries(expectedMap).every(
          ([left, right]) => selectedMap[left] === right
        );

      return allMatched ? 1 : 0;
    }

    if (activity.type === "match_pictures") {
      const selectedMap = matchAnswers[activity.id] || {};
      const expectedMap = activity.matchAnswerMap || {};

      const allMatched =
        Object.keys(expectedMap).length > 0 &&
        Object.entries(expectedMap).every(
          ([left, right]) => selectedMap[left] === right
        );

      return allMatched ? 1 : 0;
    }

    if (activity.type === "arrange_words") {
      const selectedMap = matchAnswers[activity.id] || {};

      const allRowsCorrect =
        (activity.arrangeWordRows || []).length > 0 &&
        (activity.arrangeWordRows || []).every((row) => {
          const builtWords = (selectedMap[row.key] || "")
            .split(WORD_SEPARATOR)
            .filter(Boolean);

          return builtWords.join(" ") === row.answer;
        });

      return allRowsCorrect ? 1 : 0;
    }

    return 0;
  }

  const answeredCount = grade2SinhalaActivities.reduce(
    (count, activity) => {
      if (activity.type === "mcq") {
        return count + (mcqAnswers[activity.id] ? 1 : 0);
      }

      if (activity.type === "image_rows") {
        const selections = matchAnswers[activity.id] || {};

        return (
          count +
          (Object.keys(selections).length ===
          (activity.imageRows || []).length
            ? 1
            : 0)
        );
      }

      if (activity.type === "text_rows") {
        const selections = matchAnswers[activity.id] || {};

        return (
          count +
          (Object.keys(selections).length ===
          (activity.textRows || []).length
            ? 1
            : 0)
        );
      }

      if (activity.type === "word_boxes") {
        const selections = matchAnswers[activity.id] || {};

        return (
          count +
          (Object.keys(selections).length ===
          (activity.wordBoxRows || []).length
            ? 1
            : 0)
        );
      }

      if (activity.type === "match_letters") {
        const selections = matchAnswers[activity.id] || {};

        return (
          count +
          (Object.keys(selections).length ===
          (activity.leftItems || []).length
            ? 1
            : 0)
        );
      }

      if (activity.type === "match_pictures") {
        const selections = matchAnswers[activity.id] || {};

        return (
          count +
          (Object.keys(selections).length ===
          (activity.leftItems || []).length
            ? 1
            : 0)
        );
      }

      if (activity.type === "arrange_words") {
        const selections = matchAnswers[activity.id] || {};

        const completeRows = (
          activity.arrangeWordRows || []
        ).filter((row) => {
          const builtWords = (selections[row.key] || "")
            .split(WORD_SEPARATOR)
            .filter(Boolean);

          return builtWords.length === row.words.length;
        }).length;

        return (
          count +
          ((activity.arrangeWordRows || []).length > 0 &&
          completeRows ===
            (activity.arrangeWordRows || []).length
            ? 1
            : 0)
        );
      }

      return count;
    },
    0
  );

  function isActivityComplete(
    activity: (typeof grade2SinhalaActivities)[number]
  ): boolean {
    if (activity.type === "mcq") {
      return Boolean(mcqAnswers[activity.id]);
    }

    if (activity.type === "image_rows") {
      const selections = matchAnswers[activity.id] || {};

      return (
        Object.keys(selections).length ===
        (activity.imageRows || []).length
      );
    }

    if (activity.type === "text_rows") {
      const selections = matchAnswers[activity.id] || {};

      return (
        Object.keys(selections).length ===
        (activity.textRows || []).length
      );
    }

    if (activity.type === "word_boxes") {
      const selections = matchAnswers[activity.id] || {};

      return (
        Object.keys(selections).length ===
        (activity.wordBoxRows || []).length
      );
    }

    if (activity.type === "match_letters") {
      const selections = matchAnswers[activity.id] || {};

      return (
        Object.keys(selections).length ===
        (activity.leftItems || []).length
      );
    }

    if (activity.type === "match_pictures") {
      const selections = matchAnswers[activity.id] || {};

      return (
        Object.keys(selections).length ===
        (activity.leftItems || []).length
      );
    }

    if (activity.type === "arrange_words") {
      const selections = matchAnswers[activity.id] || {};

      return (activity.arrangeWordRows || []).every((row) => {
        const builtWords = (selections[row.key] || "")
          .split(WORD_SEPARATOR)
          .filter(Boolean);

        return builtWords.length === row.words.length;
      });
    }

    return false;
  }

  useEffect(() => {
    const current =
      grade2SinhalaActivities[currentActivityIndex];

    if (!current || !isActivityComplete(current)) {
      return;
    }

    if (
      currentActivityIndex >=
      grade2SinhalaActivities.length - 1
    ) {
      return;
    }

    setCurrentActivityIndex((prev) =>
      Math.min(
        prev + 1,
        grade2SinhalaActivities.length - 1
      )
    );
  }, [currentActivityIndex, mcqAnswers, matchAnswers]);

  function assignActiveChoice(
    activityId: number,
    key: string
  ) {
    const current = activeChoice[activityId];

    if (!current) {
      return;
    }

    setMatchAnswers((prev) => ({
      ...prev,
      [activityId]: {
        ...(prev[activityId] || {}),
        [key]: current
      }
    }));

    setActiveChoice((prev) => ({
      ...prev,
      [activityId]: null
    }));
  }

  async function handleSubmit() {
    if (!studentId || grade !== 2) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const correctAnswers =
        grade2SinhalaActivities.reduce(
          (count, activity) =>
            count + getActivityMark(activity),
          0
        );

      const session = await startExamSession(
        studentId,
        grade2SinhalaActivities.length
      );

      const finalResult =
        await completeExamSession(
          session.exam_session_id,
          correctAnswers,
          subjectId ?? undefined,
          grade2SinhalaActivities.length
        );

      setResult(finalResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit aptitude test"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="dashboard-screen kid-aptitude-play">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <p className="dashboard-eyebrow kid-aptitude-eyebrow">
            සිංහල
          </p>

          <h1 className="title dashboard-title kid-aptitude-title">
            Grade 2 Sinhala Aptitude Test
          </h1>

          <p className="kid-aptitude-kicker">
            Sinhala Learning Activities
          </p>

          <p className="subtitle kid-aptitude-subtitle">
            Student : <strong>{studentName}</strong>
          </p>
        </div>

        <div className="dashboard-topbar-actions">
          <Link
            href={`/dashboard/students/${studentId}`}
            className="btn btn-secondary"
          >
            Back to Student Profile
          </Link>
        </div>
      </header>

      <section className="dashboard-content dashboard-content-single">
        <section className="dashboard-panel dashboard-main-panel">

          {error ? (
            <p className="error-text">
              {error}
            </p>
          ) : null}

          {result ? (
            <section className="dashboard-item kid-result-card">
              <h2 className="dashboard-panel-title kid-result-title">
                Aptitude Test Completed
              </h2>

              <p className="student-meta">
                Score: {result.correct_answers}/
                {result.total_activities} (
                {result.score_percent}%)
              </p>

              <p className="student-meta">
                Eligible level: {result.eligible_level}
              </p>

              <p className="student-meta">
                Unlocked levels:{" "}
                {result.eligible_levels.join(", ")}
              </p>

              <div className="section-top">
                <Link
                  href={`/dashboard/students/${studentId}`}
                  className="btn"
                >
                  Continue to Student Dashboard
                </Link>
              </div>
            </section>
          ) : null}

          {!result && grade === 2 ? (
            <article className="dashboard-item subject-item kid-aptitude-card">

              <div className="subject-item-header kid-aptitude-card-header">
                <span
                  className="kid-activity-badge"
                  title="Current Activity"
                >
                  <span
                    className="kid-activity-badge-emoji"
                    aria-hidden
                  >
                    ★
                  </span>

                  Activity{" "}
                  {currentActivityIndex + 1} /{" "}
                  {grade2SinhalaActivities.length}
                </span>
              </div>

              <p className="student-meta kid-aptitude-answered-line section-top">
                Completed Activities: {answeredCount} /{" "}
                {grade2SinhalaActivities.length}
              </p>

              <div className="students-grid section-top">

                {(() => {
                  const activity =
                    grade2SinhalaActivities[
                      currentActivityIndex
                    ];

                  if (!activity) {
                    return null;
                  }

                  return (
                    <div key={activity.id}>

                      <p className="student-meta aptitude-activity-prompt kid-aptitude-prompt">
                        {activity.prompt}
                      </p>

                      {activity.type === "image_rows" ? (
                        <div className="number-rows-grid section-top">

                          <div className="choice-pool">
                            {Array.from(
                              new Set(
                                (activity.imageRows || []).flatMap(
                                  (row) => row.options
                                )
                              )
                            ).map((word) => {

                              const selected =
                                activeChoice[
                                  activity.id
                                ] === word;

                              return (
                                <button
                                  key={`img-pool-${word}`}
                                  type="button"
                                  className={`number-option-btn ${
                                    selected
                                      ? "number-option-btn-selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setActiveChoice(
                                      (prev) => ({
                                        ...prev,
                                        [activity.id]:
                                          selected
                                            ? null
                                            : word
                                      })
                                    )
                                  }
                                >
                                  {word}
                                </button>
                              );
                            })}
                          </div>

                          <p className="student-meta">
                            Tap a word above, then tap the
                            matching picture.
                          </p>

                          {(activity.imageRows || []).map(
                            (row) => (
                              <div
                                key={row.key}
                                className="number-row-card"
                              >
                                {row.label ? (
                                  <div className="match-left">
                                    {row.label}
                                  </div>
                                ) : null}

                                <button
                                  type="button"
                                  className="number-badge"
                                  onClick={() =>
                                    assignActiveChoice(
                                      activity.id,
                                      row.key
                                    )
                                  }
                                >
                                  <img
                                    src={row.image}
                                    alt={row.key}
                                    className="number-badge-image"
                                  />
                                </button>

                                <button
                                  type="button"
                                  className={`match-target ${
                                    matchAnswers[
                                      activity.id
                                    ]?.[row.key]
                                      ? "match-target-filled"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    assignActiveChoice(
                                      activity.id,
                                      row.key
                                    )
                                  }
                                >
                                  {matchAnswers[
                                    activity.id
                                  ]?.[row.key] ||
                                    "Tap to assign word"}
                                </button>
                              </div>
                            )
                          )}
                        </div>

                      ) : activity.type === "text_rows" ? (
                        <div className="number-rows-grid section-top">

                          {(activity.textRows || []).map(
                            (row) => (
                              <div
                                key={row.key}
                                className="number-row-card"
                              >
                                <div className="match-left">
                                  {row.prompt}
                                </div>

                                <div className="choice-pool">
                                  {row.options.map(
                                    (option) => {

                                      const selected =
                                        matchAnswers[
                                          activity.id
                                        ]?.[row.key] ===
                                        option;

                                      return (
                                        <button
                                          key={`${row.key}-${option}`}
                                          type="button"
                                          className={`number-option-btn ${
                                            selected
                                              ? "number-option-btn-selected"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            setMatchAnswers(
                                              (prev) => ({
                                                ...prev,
                                                [activity.id]:
                                                  {
                                                    ...(prev[
                                                      activity.id
                                                    ] || {}),
                                                    [row.key]:
                                                      option
                                                  }
                                              })
                                            )
                                          }
                                        >
                                          {option}
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>

                      ) : activity.type === "word_boxes" ? (
                        <div className="number-rows-grid section-top">

                          {(activity.wordBoxRows || []).map(
                            (row) => {

                              const pattern =
                                row.patternRows ||
                                [
                                  [
                                    row.topRow[0],
                                    row.topRow[1],
                                    row.topRow[2]
                                  ],
                                  [row.sideColumn[0]],
                                  [row.sideColumn[1]]
                                ];

                              const blankCell =
                                row.blankCell || {
                                  row: 0,
                                  col: 0
                                };

                              const colCount =
                                Math.max(
                                  ...pattern.map(
                                    (cells) =>
                                      cells.length
                                  )
                                );

                              return (
                                <div
                                  key={row.key}
                                  className="word-box-row-card"
                                >

                                  <div
                                    className="word-box-shape"
                                    style={{
                                      gridTemplateColumns:
                                        `repeat(${colCount}, 42px)`
                                    }}
                                  >
                                    {pattern.flatMap(
                                      (
                                        cells,
                                        rowIdx
                                      ) =>
                                        Array.from({
                                          length:
                                            colCount
                                        }).map(
                                          (
                                            _,
                                            colIdx
                                          ) => {

                                            const value =
                                              cells[
                                                colIdx
                                              ] ??
                                              null;

                                            if (
                                              value ==
                                              null
                                            ) {
                                              return (
                                                <div
                                                  key={`${row.key}-${rowIdx}-${colIdx}`}
                                                  className="word-box-empty"
                                                />
                                              );
                                            }

                                            const isBlank =
                                              blankCell.row ===
                                                rowIdx &&
                                              blankCell.col ===
                                                colIdx;

                                            return (
                                              <div
                                                key={`${row.key}-${rowIdx}-${colIdx}`}
                                                className="word-box-cell"
                                              >
                                                {isBlank
                                                  ? matchAnswers[
                                                      activity
                                                        .id
                                                    ]?.[
                                                      row.key
                                                    ] ||
                                                    value
                                                  : value}
                                              </div>
                                            );
                                          }
                                        )
                                    )}
                                  </div>

                                  <div className="choice-pool">
                                    {row.options.map(
                                      (option) => {

                                        const selected =
                                          matchAnswers[
                                            activity.id
                                          ]?.[
                                            row.key
                                          ] === option;

                                        return (
                                          <button
                                            key={`${row.key}-${option}`}
                                            type="button"
                                            className={`number-option-btn ${
                                              selected
                                                ? "number-option-btn-selected"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              setMatchAnswers(
                                                (prev) => ({
                                                  ...prev,
                                                  [activity.id]:
                                                    {
                                                      ...(prev[
                                                        activity.id
                                                      ] ||
                                                        {}),
                                                      [row.key]:
                                                        option
                                                    }
                                                })
                                              )
                                            }
                                          >
                                            {option}
                                          </button>
                                        );
                                      }
                                    )}
                                  </div>

                                  <p className="student-meta">
                                    {row.optionHint ||
                                      `(${row.options.join(
                                        " / "
                                      )})`}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>

                      ) : activity.type === "match_letters" ? (
                        <div className="match-grid section-top">

                          <div className="choice-pool">
                            {(activity.rightItems || []).map(
                              (right) => {

                                const selected =
                                  activeChoice[
                                    activity.id
                                  ] === right;

                                return (
                                  <button
                                    key={`pool-${right}`}
                                    type="button"
                                    className={`letter-choice ${
                                      selected
                                        ? "letter-choice-selected"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setActiveChoice(
                                        (prev) => ({
                                          ...prev,
                                          [activity.id]:
                                            selected
                                              ? null
                                              : right
                                        })
                                      )
                                    }
                                  >
                                    {right}
                                  </button>
                                );
                              }
                            )}
                          </div>

                          <p className="student-meta">
                            වචනයක් තෝරලා, ගැලපෙන වාක්‍ය කොටසට
                            ටැප් කරන්න.
                          </p>

                          {(activity.leftItems || []).map(
                            (left) => (
                              <div
                                key={left}
                                className="match-row"
                              >
                                <span className="match-left">
                                  {left}
                                </span>

                                <span className="match-arrow">
                                  →
                                </span>

                                <button
                                  type="button"
                                  className={`match-target ${
                                    matchAnswers[
                                      activity.id
                                    ]?.[left]
                                      ? "match-target-filled"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    assignActiveChoice(
                                      activity.id,
                                      left
                                    )
                                  }
                                >
                                  {matchAnswers[
                                    activity.id
                                  ]?.[left] ||
                                    "ගැලපෙන වචනය තෝරන්න"}
                                </button>
                              </div>
                            )
                          )}
                        </div>

                      ) : activity.type === "match_pictures" ? (
                        <div className="match-grid section-top">

                          {(activity.leftItems || []).map(
                            (left) => (
                              <div
                                key={left}
                                className="match-row"
                              >
                                <span className="match-left">
                                  {left}
                                </span>

                                <span className="match-arrow">
                                  →
                                </span>

                                <div className="letter-picture-options">
                                  {(
                                    activity.pictureOptions ||
                                    []
                                  ).map((pic) => {

                                    const selected =
                                      matchAnswers[
                                        activity.id
                                      ]?.[left] ===
                                      pic.label;

                                    return (
                                      <button
                                        key={`${left}-${pic.label}`}
                                        type="button"
                                        className={`picture-choice ${
                                          selected
                                            ? "picture-choice-selected"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          setMatchAnswers(
                                            (prev) => ({
                                              ...prev,
                                              [activity.id]:
                                                {
                                                  ...(prev[
                                                    activity
                                                      .id
                                                  ] || {}),
                                                  [left]:
                                                    pic.label
                                                }
                                            })
                                          )
                                        }
                                      >
                                        <img
                                          src={pic.image}
                                          alt={pic.label}
                                          className="picture-choice-thumb"
                                        />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )
                          )}
                        </div>

                      ) : activity.type === "arrange_words" ? (
                        <div className="number-rows-grid section-top">

                          {(activity.arrangeWordRows || []).map(
                            (row, index) => {

                              const builtWords =
                                (
                                  matchAnswers[
                                    activity.id
                                  ]?.[row.key] || ""
                                )
                                  .split(
                                    WORD_SEPARATOR
                                  )
                                  .filter(Boolean);

                              const builtSentence =
                                builtWords.join(" ");

                              return (
                                <div
                                  key={row.key}
                                  className="word-box-row-card"
                                >

                                  <div className="match-left">
                                    {index + 1}){" "}
                                    {row.words.join(
                                      " / "
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    className={`match-target ${
                                      builtWords.length > 0
                                        ? "match-target-filled"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setMatchAnswers(
                                        (prev) => ({
                                          ...prev,
                                          [activity.id]:
                                            {
                                              ...(prev[
                                                activity.id
                                              ] || {}),
                                              [row.key]:
                                                ""
                                            }
                                        })
                                      )
                                    }
                                  >
                                    {builtSentence ||
                                      "වචන ටැප් කර වාක්‍යය සකස් කරන්න"}
                                  </button>

                                  <div className="choice-pool">
                                    {row.words.map(
                                      (word) => {

                                        const alreadyPicked =
                                          builtWords.includes(
                                            word
                                          );

                                        return (
                                          <button
                                            key={`${row.key}-${word}`}
                                            type="button"
                                            className={`number-option-btn ${
                                              alreadyPicked
                                                ? "number-option-btn-selected"
                                                : ""
                                            }`}
                                            disabled={
                                              alreadyPicked
                                            }
                                            onClick={() =>
                                              setMatchAnswers(
                                                (prev) => {

                                                  const currentWords =
                                                    (
                                                      prev[
                                                        activity
                                                          .id
                                                      ]?.[
                                                        row
                                                          .key
                                                      ] || ""
                                                    )
                                                      .split(
                                                        WORD_SEPARATOR
                                                      )
                                                      .filter(
                                                        Boolean
                                                      );

                                                  const nextWords =
                                                    [
                                                      ...currentWords,
                                                      word
                                                    ];

                                                  return {
                                                    ...prev,
                                                    [activity.id]:
                                                      {
                                                        ...(prev[
                                                          activity
                                                            .id
                                                        ] ||
                                                          {}),
                                                        [row.key]:
                                                          nextWords.join(
                                                            WORD_SEPARATOR
                                                          )
                                                      }
                                                  };
                                                }
                                              )
                                            }
                                          >
                                            {word}
                                          </button>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>

                      ) : activity.type === "mcq" ? (
                        <div className="aptitude-options section-top">

                          {(activity.options || []).map(
                            (option) => (
                              <label
                                key={option}
                                className="aptitude-option"
                              >
                                <input
                                  type="radio"
                                  name={`activity-${activity.id}`}
                                  checked={
                                    mcqAnswers[
                                      activity.id
                                    ] === option
                                  }
                                  onChange={() =>
                                    setMcqAnswers(
                                      (prev) => ({
                                        ...prev,
                                        [activity.id]:
                                          option
                                      })
                                    )
                                  }
                                />

                                <span>
                                  {option}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>

              {answeredCount ===
              grade2SinhalaActivities.length ? (
                <button
                  type="button"
                  className="btn kid-submit-btn section-top"
                  onClick={handleSubmit}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Aptitude Test"}
                </button>
              ) : null}

            </article>
          ) : null}

        </section>
      </section>
    </main>
  );
}