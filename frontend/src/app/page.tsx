import Link from "next/link";

export default function HomePage() {
  return (
    <main className="app-shell landing-page">
      <section className="card card--pop landing-hero">
        <p className="landing-eyebrow">Learning together</p>
        <h1 className="title landing-title">Modern LMS</h1>
        <p className="subtitle landing-lead">
          A bright, friendly space for Pre-K through Grade 5 — sign in to pick up where you left off, or register to get
          started in minutes.
        </p>
        <nav className="nav-links landing-actions">
          <Link href="/login" className="btn btn-glow">
            Sign in
          </Link>
          <Link href="/register" className="btn btn-secondary">
            Create account
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Parent dashboard
          </Link>
        </nav>
      </section>

      <section className="card card--pop landing-feature-strip section-top">
        <h2 className="landing-feature-title">What you can do here</h2>
        <ul className="landing-feature-list">
          <li>Quick diagnostic-style activities that help place each learner on the right level.</li>
          <li>Subject progress for English, Sinhala, maths, and more — tuned to grade.</li>
          <li>One parent account, multiple student profiles, simple navigation.</li>
        </ul>
      </section>
    </main>
  );
}
