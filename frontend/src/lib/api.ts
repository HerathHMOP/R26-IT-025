const TOKEN_KEY = "lms_token";
const USER_KEY = "lms_user";

export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  return base.replace(/\/$/, "");
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): { id: number; email: string; full_name: string; account_type: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(token: string, user: unknown): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Clears stored credentials and navigates to the public home page (full reload). */
export function logoutAndRedirectHome(): void {
  if (typeof window === "undefined") return;
  clearSession();
  window.location.replace("/");
}

type JsonRecord = Record<string, unknown>;

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers
  });

  if (typeof window !== "undefined" && res.status === 401) {
    logoutAndRedirectHome();
  }

  return res;
}

export type RegisterBody = {
  account_type: "parent" | "teacher";
  full_name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: number;
    account_type: string;
    full_name: string;
    email: string;
    is_email_verified?: boolean;
  };
};

export async function registerAccount(body: RegisterBody): Promise<AuthResponse> {
  const res = await fetch(`${getApiBase()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Register failed (${res.status})`);
  }
  return data as AuthResponse;
}

export async function loginAccount(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${getApiBase()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Login failed (${res.status})`);
  }
  return data as AuthResponse;
}

export type StudentProfile = {
  id: number;
  user_id: number;
  full_name: string;
  date_of_birth: string | null;
  grade: number;
  preferred_language: "sinhala" | "english" | "tamil";
  created_at?: string;
};

export async function listMyStudents(): Promise<StudentProfile[]> {
  const res = await authFetch("/students");
  const data = (await res.json().catch(() => ({}))) as JsonRecord;
  if (!res.ok) {
    throw new Error((data.message as string) || `Failed to load students (${res.status})`);
  }

  const students = data.students;
  return Array.isArray(students) ? (students as StudentProfile[]) : [];
}

export type CreateStudentBody = {
  full_name: string;
  date_of_birth?: string;
  grade: number;
  preferred_language: "sinhala" | "english" | "tamil";
};

export async function createStudentProfile(body: CreateStudentBody): Promise<StudentProfile> {
  const res = await authFetch("/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = (await res.json().catch(() => ({}))) as JsonRecord;
  if (!res.ok) {
    throw new Error((data.message as string) || `Failed to create student (${res.status})`);
  }
  return data as unknown as StudentProfile;
}

export type StudentDashboardSubject = {
  id: number;
  code: string;
  display_name: string;
  content_language: "sinhala" | "english" | "tamil" | "both";
  current_level: number | null;
  eligible_levels: number[];
  level_updated_at: string | null;
  progress: {
    total_activities: number;
    completed_activities: number;
    average_score: number | null;
  };
};

export type StudentDashboardData = {
  student: {
    id: number;
    user_id: number;
    full_name: string;
    grade: number;
    grade_group: "pre_g1" | "g2_g5";
    preferred_language: "sinhala" | "english" | "tamil";
  };
  subjects: StudentDashboardSubject[];
  aptitude_test: {
    total_activities: number;
    max_level: number;
  };
};

export async function getStudentDashboard(studentId: number): Promise<StudentDashboardData> {
  const res = await authFetch(`/students/${studentId}/dashboard`);
  const data = (await res.json().catch(() => ({}))) as JsonRecord;
  if (!res.ok) {
    throw new Error((data.message as string) || `Failed to load student dashboard (${res.status})`);
  }
  return data as unknown as StudentDashboardData;
}

export type SubjectEligibilityData = {
  student_id: number;
  subject_id: number;
  subject_code: string;
  subject_name: string;
  requested_level?: number | null;
  eligible_level: number | null;
  eligible_levels: number[];
  can_access: boolean;
  message?: string;
};

export async function getSubjectLevelEligibility(
  studentId: number,
  subjectId: number,
  level?: number
): Promise<SubjectEligibilityData> {
  const query = level ? `?level=${level}` : "";
  const res = await authFetch(`/students/${studentId}/subjects/${subjectId}/eligibility${query}`);
  const data = (await res.json().catch(() => ({}))) as JsonRecord;
  if (!res.ok) {
    throw new Error((data.message as string) || `Failed to check level eligibility (${res.status})`);
  }
  return data as unknown as SubjectEligibilityData;
}

export type StartExamSessionResponse = {
  exam_session_id: number;
  student_id: number;
  total_questions: number;
  status: "started";
};

export async function startExamSession(studentId: number, totalQuestions?: number): Promise<StartExamSessionResponse> {
  const res = await authFetch("/exam-sessions/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: studentId,
      ...(totalQuestions ? { total_questions: totalQuestions } : {})
    })
  });
  const data = (await res.json().catch(() => ({}))) as JsonRecord;
  if (!res.ok) {
    throw new Error((data.message as string) || `Failed to start aptitude test (${res.status})`);
  }
  return data as unknown as StartExamSessionResponse;
}

export type CompleteExamSessionResponse = {
  exam_session_id: number;
  student_id: number;
  total_activities: number;
  correct_answers: number;
  score_percent: number;
  eligible_level: number | null;
  eligible_levels: number[];
  assigned_subject_ids?: number[];
};

export async function completeExamSession(
  sessionId: number,
  correctAnswers: number,
  subjectId?: number,
  totalActivities?: number
): Promise<CompleteExamSessionResponse> {
  const res = await authFetch(`/exam-sessions/${sessionId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      correct_answers: correctAnswers,
      ...(subjectId ? { subject_id: subjectId } : {}),
      ...(totalActivities ? { total_activities: totalActivities } : {})
    })
  });
  const data = (await res.json().catch(() => ({}))) as JsonRecord;
  if (!res.ok) {
    throw new Error((data.message as string) || `Failed to complete aptitude test (${res.status})`);
  }
  return data as unknown as CompleteExamSessionResponse;
}
