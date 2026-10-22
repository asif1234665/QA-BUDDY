"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert(data.error || "Signup failed");
    }
  }

  return (
    <main className="container" style={{ maxWidth: 500, paddingTop: 80 }}>
      <form className="card" onSubmit={handleSubmit}>
        <h1 className="page-title">Create account</h1>

        <div className="form-group">
          <label>Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Tester" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="********" />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="mt-4">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
