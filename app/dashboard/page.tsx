"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = ["#16a34a", "#ef4444", "#f59e0b", "#3b82f6"];

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [meRes, projRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/projects"),
        ]);

        if (!meRes.ok) {
          router.push("/login");
          return;
        }

        const meData = await meRes.json();
        const projData = await projRes.json();

        setUser(meData.user);
        setProjects(projData.projects || []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const chartData = [
    { name: "Projects", value: projects.length },
    { name: "Open Bugs", value: 7 },
    { name: "Pass", value: 18 },
    { name: "Fail", value: 5 },
  ];

  const pieData = [
    { name: "Passed", value: 18 },
    { name: "Failed", value: 5 },
    { name: "Blocked", value: 3 },
  ];

  if (loading) return <div className="container">Loading...</div>;

  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="muted">Welcome, {user?.name}</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge badge-new">Key: {user?.uniqueKey}</span>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>Total Projects</h3>
          <div style={{ fontSize: 30, fontWeight: 800 }}>{projects.length}</div>
        </div>
        <div className="card">
          <h3>Pass Rate</h3>
          <div style={{ fontSize: 30, fontWeight: 800 }}>78%</div>
        </div>
        <div className="card">
          <h3>Current User</h3>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.email}</div>
        </div>
      </div>

      <div className="grid grid-2 mt-4">
        <div className="card">
          <h3>Summary</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Execution Status</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 className="sub-title">Your Projects</h2>
          <Link href="/projects/new" className="btn btn-primary">New Project</Link>
        </div>

        {projects.length === 0 ? (
          <p className="muted">No projects created yet.</p>
        ) : (
          <div className="grid">
            {projects.map((project) => (
              <div key={project.id} className="card" style={{ border: "1px solid #e2e8f0" }}>
                <h3>{project.name}</h3>
                <p className="muted">{project.description || "No description available"}</p>
                <Link href={`/projects/${project.id}`} className="btn btn-secondary">Open</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
