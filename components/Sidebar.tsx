import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/dashboard/test-plans", label: "Test Plans" },
  { href: "/dashboard/test-cases", label: "Test Cases" },
  { href: "/dashboard/bugs", label: "Bugs" },
  { href: "/dashboard/reports", label: "Reports" },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        padding: "24px 16px",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 24, marginBottom: 24 }}>QA Buddy</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              color: "#e2e8f0",
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
