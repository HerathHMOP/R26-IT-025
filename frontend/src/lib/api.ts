export async function getStoredUser() {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

export type CompleteExamSessionResponse = {
  correct_answers: number;
  total_activities: number;
  score_percent: number;
  eligible_level: string;
  eligible_levels: string[];
};

export async function getStudentDashboard(studentId: number) {
  const res = await fetch(`/api/students/${studentId}/dashboard`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load student dashboard");
  return res.json();
}

export async function startExamSession(studentId: number, totalActivities: number) {
  const res = await fetch(`/api/exam-sessions/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, totalActivities })
  });
  if (!res.ok) throw new Error("Failed to start exam session");
  return res.json();
}

export async function completeExamSession(
  sessionId: string,
  correctAnswers: number,
  subjectId: number | undefined,
  totalActivities: number
) {
  const res = await fetch(`/api/exam-sessions/${sessionId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correctAnswers, subjectId, totalActivities })
  });
  if (!res.ok) throw new Error("Failed to complete exam session");
  return res.json() as Promise<CompleteExamSessionResponse>;
}

export type LoginResponse = {
  token: string;
  user: Record<string, any>;
};

export async function loginAccount(email: string, password: string) {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = payload && payload.message ? payload.message : res.statusText || "Failed to login";
    throw new Error(message);
  }

  return (await res.json()) as LoginResponse;
}

export function setSession(token: string, user: Record<string, any>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("user", JSON.stringify(user));
  } catch (_e) {
    // ignore storage errors in restricted environments
  }
}

export async function registerAccount(payload: {
  account_type: "parent" | "teacher";
  full_name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body && body.message ? body.message : res.statusText || "Failed to register";
    throw new Error(message);
  }

  return (await res.json()) as LoginResponse;
}
