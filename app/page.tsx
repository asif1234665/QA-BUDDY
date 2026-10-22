import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <nav className="navbar">
        <div className="navbar-inner">
          <div style={{ fontWeight: 800 }}>QA Management</div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 48 }}>
        <div className="card" style={{ textAlign: "center", padding: "56px 24px" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: 18 }}>Manual testing made simple</h1>
          <p style={{ maxWidth: 700, margin: "0 auto 28px", fontSize: "1.1rem", color: "#475569" }}>
            Manage projects, test plans, scenarios, cases, bugs, defects, execution reports, and exports in one app.
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link href="/signup" className="btn btn-primary">Get Started</Link>
            <Link href="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>

        <div className="grid grid-3 mt-4">
          <div className="card">
            <h3>Test Plans</h3>
            <p className="muted">Plan scope, objective, and environment for each phase.</p>
          </div>
          <div className="card">
            <h3>Test Cases</h3>
            <p className="muted">Track detailed steps, expected vs actual results, and statuses.</p>
          </div>
          <div className="card">
            <h3>Bug Tracking</h3>
            <p className="muted">Log defects with screenshot attachments and severity levels.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
