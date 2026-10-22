"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function createProject(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/projects/${data.project.id}`);
    } else {
      alert(data.error || "Failed to create project");
    }
  }

  return (
    <main className="container" style={{ maxWidth: 700 }}>
      <div className="card">
        <h1 className="page-title">Create Project</h1>

        <form onSubmit={createProject}>
          <div className="form-group">
            <label>Project Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <button className="btn btn-primary" type="submit">Create</button>
        </form>
      </div>
    </main>
  );
}
