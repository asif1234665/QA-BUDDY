"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadProjects() {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    }

    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.description || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && project.status === "active") ||
      (filter === "draft" && project.status === "draft");

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 className="page-title">Projects</h1>
        <Link href="/projects/new" className="btn btn-primary">New Project</Link>
      </div>

      <div className="card mb-4">
        <div className="grid grid-2">
          <div className="form-group">
            <label>Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search project name or description" />
          </div>

          <div className="form-group">
            <label>Filter</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="muted">No matching projects.</p>
      ) : (
        <div className="grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card">
              <h3>{project.name}</h3>
              <p className="muted">{project.description || "No description"}</p>
              <div className="row" style={{ marginTop: 12 }}>
                <span className="badge badge-new">{project.status || "active"}</span>
                <Link href={`/projects/${project.id}`} className="btn btn-secondary">Open</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
