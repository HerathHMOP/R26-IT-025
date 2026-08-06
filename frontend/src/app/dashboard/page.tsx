"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { createStudentProfile, getStoredUser, listMyStudents, logoutAndRedirectHome, type StudentProfile } from "@/lib/api";
import { signalAppNavigationStart } from "@/lib/navProgressEvents";

function initialsFromName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function gradeLabel(grade: number): string {
  if (grade === 0) return "Pre-K";
  return `Grade ${grade}`;
}

function languageLabel(lang: string): string {
  if (!lang) return "";
  return lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
}

function avatarGradient(studentId: number): string {
  const hue = (studentId * 47 + 180) % 360;
  const hue2 = (hue + 38) % 360;
  return `linear-gradient(135deg, hsl(${hue} 62% 88%) 0%, hsl(${hue2} 55% 80%) 100%)`;
}

function IconBadge(props: { children: ReactNode }) {
  return (
    <span className="parent-stat-icon" aria-hidden>
      {props.children}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [savingStudent, setSavingStudent] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    grade: 1,
    preferred_language: "english" as "sinhala" | "english" | "tamil"
  });

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);

    async function loadStudents() {
      setLoadingStudents(true);
      setStudentError(null);
      try {
        const data = await listMyStudents();
        setStudents(data);
      } catch (err) {
        setStudentError(err instanceof Error ? err.message : "Failed to load students");
      } finally {
        setLoadingStudents(false);
      }
    }

    loadStudents();
  }, [router]);

  function logout() {
    signalAppNavigationStart();
    logoutAndRedirectHome();
  }

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    setStudentError(null);
    setSavingStudent(true);

    try {
      const created = await createStudentProfile({
        full_name: form.full_name.trim(),
        date_of_birth: form.date_of_birth || undefined,
        grade: Number(form.grade),
        preferred_language: form.preferred_language
      });
      setStudents((prev) => [created, ...prev]);
      setForm({
        full_name: "",
        date_of_birth: "",
        grade: 1,
        preferred_language: "english"
      });
      setIsAddModalOpen(false);
    } catch (err) {
      setStudentError(err instanceof Error ? err.message : "Failed to create student");
    } finally {
      setSavingStudent(false);
    }
  }

  if (!user) {
    return (
      <main className="dashboard-screen hub-page">
        <section className="dashboard-panel">
          <p className="loading-text">Loading...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-screen hub-page">
      <header className="dashboard-topbar">
        <div>
          <p className="dashboard-eyebrow">Parent hub</p>
          <h1 className="title dashboard-title">Your dashboard</h1>
          <p className="subtitle">
            Signed in as <strong>{user.full_name}</strong> ({user.email})
          </p>
        </div>
        <div className="dashboard-topbar-actions">
          <button type="button" className="btn btn-glow" onClick={() => setIsAddModalOpen(true)}>
            Add student profile
          </button>
          <button type="button" onClick={logout} className="btn btn-secondary">
            Log out
          </button>
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <aside className="dashboard-panel parent-account-panel" aria-label={`Account summary for ${user.full_name}`}>
          <div className="parent-account-hero">
            <div className="parent-account-avatar" aria-hidden="true">
              {initialsFromName(user.full_name)}
            </div>
            <div className="parent-account-hero-text">
              <h2 className="dashboard-panel-title parent-account-title">Your account</h2>
              <p className="parent-account-tagline">Profiles and access for your family.</p>
            </div>
          </div>
          <ul className="parent-account-stats" aria-label="Account summary">
            <li className="parent-stat-tile">
              <IconBadge>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </IconBadge>
              <div className="parent-stat-body">
                <span className="parent-stat-label">Role</span>
                <span className="parent-stat-value">{user.account_type}</span>
              </div>
            </li>
            <li className="parent-stat-tile">
              <IconBadge>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </IconBadge>
              <div className="parent-stat-body">
                <span className="parent-stat-label">Status</span>
                <span className="parent-stat-value parent-stat-value--ok">Signed in</span>
              </div>
            </li>
            <li className="parent-stat-tile">
              <IconBadge>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </IconBadge>
              <div className="parent-stat-body">
                <span className="parent-stat-label">Students linked</span>
                <span className="parent-stat-value">{loadingStudents ? "…" : String(students.length)}</span>
              </div>
            </li>
          </ul>
        </aside>

        <section className="dashboard-panel dashboard-main-panel parent-students-panel">
          <div className="section-title-row parent-students-header">
            <div>
              <h2 className="dashboard-panel-title">Your students</h2>
              <p className="parent-students-hint subtitle">
                Choose a learner to open their hub — subjects, levels, and activities.
              </p>
            </div>
          </div>
          {loadingStudents ? <p className="loading-text">Loading students...</p> : null}
          {studentError ? <p className="error-text">{studentError}</p> : null}
          {!loadingStudents && students.length === 0 ? (
            <p className="subtitle">No student profiles yet — tap &quot;Add student profile&quot; above to create the first one.</p>
          ) : null}
          <div className="students-grid dashboard-students-grid">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/dashboard/students/${student.id}`}
                className="dashboard-student-link"
                aria-label={`Open learning hub for ${student.full_name}`}
              >
                <article className="dashboard-item dashboard-student-item parent-student-card">
                  <div
                    className="parent-student-avatar"
                    style={{ background: avatarGradient(student.id) }}
                    aria-hidden="true"
                  >
                    {initialsFromName(student.full_name)}
                  </div>
                  <div className="parent-student-info">
                    <strong className="parent-student-name">{student.full_name}</strong>
                    <div className="parent-student-chips">
                      <span className="parent-student-chip">{gradeLabel(student.grade)}</span>
                      <span className="parent-student-chip">{languageLabel(student.preferred_language)}</span>
                      {student.date_of_birth ? (
                        <span className="parent-student-chip parent-student-chip--muted">
                          DOB {student.date_of_birth.slice(0, 10)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <span className="parent-student-chevron" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </section>
      {isAddModalOpen ? (
        <div className="modal-overlay" onClick={() => !savingStudent && setIsAddModalOpen(false)}>
          <section className="modal-card hub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>Add Student Profile</h2>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsAddModalOpen(false)}
                disabled={savingStudent}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="auth-form">
              <label className="field">
                <span>Student full name</span>
                <input
                  className="input"
                  required
                  value={form.full_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                />
              </label>
              <div className="grid-2">
                <label className="field">
                  <span>Date of birth (optional)</span>
                  <input
                    className="input"
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Grade</span>
                  <select
                    className="select"
                    value={String(form.grade)}
                    onChange={(e) => setForm((prev) => ({ ...prev, grade: Number(e.target.value) }))}
                  >
                    <option value="0">Pre-K</option>
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Preferred language</span>
                <select
                  className="select"
                  value={form.preferred_language}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      preferred_language: e.target.value as "sinhala" | "english" | "tamil"
                    }))
                  }
                >
                  <option value="english">English</option>
                  <option value="sinhala">Sinhala</option>
                  <option value="tamil">Tamil</option>
                </select>
              </label>
              <button type="submit" className="btn btn-glow" disabled={savingStudent} aria-busy={savingStudent}>
                {savingStudent ? "Saving..." : "Add student"}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
