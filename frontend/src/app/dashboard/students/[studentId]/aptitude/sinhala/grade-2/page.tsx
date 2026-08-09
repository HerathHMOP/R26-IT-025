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

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});

  const [matchAnswers, setMatchAnswers] = useState<
    Record<number, Record<string, string>>
  >({});

  const [activeChoice, setActiveChoice] = useState<
    Record<number, string | null>
  >({});

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

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
            .split(" | ")
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
            .split(" | ")
            .filter(Boolean);

          return builtWords.length === row.words.length;
        }).length;

        return (
          count +
          ((activity.arrangeWordRows || []).length > 0 &&
          completeRows === (activity.arrangeWordRows || []).length
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
          .split(" | ")
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

  return (
    <main className="dashboard-shell">
      <header className="dashboard-topbar kid-aptitude-topbar">
        <div>
          <h1 className="title">
            Grade 2 Sinhala Aptitude Test
          </h1>

          <p className="subtitle">
            Student : <strong>{studentName}</strong>
          </p>

          <p className="subtitle">
            Grade : {grade ?? "-"}
          </p>
        </div>

        <div className="dashboard-topbar-actions">
          <button
            className="btn btn-secondary"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </header>

      <section className="dashboard-content dashboard-content-single">
        <section className="dashboard-panel dashboard-main-panel">
          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          {!error && (
            <>
              <h2>Grade 2 Sinhala</h2>

              <p>
                Student profile loaded successfully.
              </p>

              <p>
                Subject ID : {subjectId ?? "-"}
              </p>

              <p>
                Total Activities :{" "}
                {grade2SinhalaActivities.length}
              </p>

              <p>
                Completed Activities : {answeredCount}
              </p>

              <p>
                Current Activity :{" "}
                {currentActivityIndex + 1}
              </p>

              <p>
                Answer matching is ready.
              </p>

              <div className="section-top">
                <Link
                  href={`/dashboard/students/${studentId}`}
                  className="btn"
                >
                  Student Dashboard
                </Link>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}