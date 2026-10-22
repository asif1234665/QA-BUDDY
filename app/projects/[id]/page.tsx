"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [phases, setPhases] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [bugs, setBugs] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  const [phaseName, setPhaseName] = useState("");
  const [phaseDescription, setPhaseDescription] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [scenarioTitle, setScenarioTitle] = useState("");

  const [testCaseForm, setTestCaseForm] = useState({
    title: "",
    priority: "medium",
    testType: "functional",
    preconditions: "",
    steps: "",
    expectedResult: "",
    actualResult: "",
    status: "not_started",
  });

  const [bugForm, setBugForm] = useState({
    title: "",
    severity: "major",
    priority: "medium",
    description: "",
    stepsToReproduce: "",
    actualResult: "",
    expectedResult: "",
    status: "new",
  });

  const [reportForm, setReportForm] = useState({
    testPlanId: "",
    executionDate: new Date().toISOString().slice(0, 10),
    summary: "",
    totalCases: "",
    passed: "",
    failed: "",
    blocked: "",
    resultStatus: "in_progress",
  });

  async function refreshProject() {
    const res = await fetch(`/api/projects/${projectId}`);
    const data = await res.json();
    setProject(data.project);
    setPhases(data.phases || []);
    setPlans(data.plans || []);
    setScenarios(data.scenarios || []);
    setCases(data.cases || []);
    setBugs(data.bugs || []);
    setReports(data.reports || []);
  }

  useEffect(() => {
    refreshProject();
  }, [projectId]);

  async function addPhase(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/phases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, name: phaseName, description: phaseDescription }),
    });

    const data = await res.json();
    if (res.ok) {
      setPhaseName("");
      setPhaseDescription("");
      refreshProject();
    } else {
      alert(data.error || "Failed");
    }
  }

  async function addPlan(e: React.FormEvent) {
    e.preventDefault();
    if (!planTitle) return alert("Plan title required");

    const res = await fetch("/api/test-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        phaseId: phases[0]?.id,
        title: planTitle,
        objective: "Testing objective",
        scope: "Scope",
        environment: "QA",
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setPlanTitle("");
      refreshProject();
    } else {
      alert(data.error || "Failed");
    }
  }

  async function addScenario(e: React.FormEvent) {
    e.preventDefault();
    if (!scenarioTitle) return alert("Scenario title required");

    const res = await fetch("/api/test-scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        phaseId: phases[0]?.id,
        testPlanId: plans[0]?.id,
        title: scenarioTitle,
        objective: "Scenario objective",
        preconditions: "System is ready",
        steps: "1. Open the app\n2. Enter valid credentials\n3. Verify result",
        expectedResult: "User can log in successfully",
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setScenarioTitle("");
      refreshProject();
    } else {
      alert(data.error || "Failed");
    }
  }

  async function addTestCase(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/test-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        phaseId: phases[0]?.id,
        testPlanId: plans[0]?.id,
        testScenarioId: scenarios[0]?.id,
        ...testCaseForm,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setTestCaseForm({
        title: "",
        priority: "medium",
        testType: "functional",
        preconditions: "",
        steps: "",
        expectedResult: "",
        actualResult: "",
        status: "not_started",
      });
      refreshProject();
    } else {
      alert(data.error || "Failed");
    }
  }

  async function addBug(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/bugs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, phaseId: phases[0]?.id, testCaseId: cases[0]?.id, ...bugForm }),
    });

    const data = await res.json();
    if (res.ok) {
      setBugForm({
        title: "",
        severity: "major",
        priority: "medium",
        description: "",
        stepsToReproduce: "",
        actualResult: "",
        expectedResult: "",
        status: "new",
      });
      refreshProject();
    } else {
      alert(data.error || "Failed");
    }
  }

  async function addReport(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/execution-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        phaseId: phases[0]?.id,
        testPlanId: plans[0]?.id,
        ...reportForm,
        totalCases: Number(reportForm.totalCases),
        passed: Number(reportForm.passed),
        failed: Number(reportForm.failed),
        blocked: Number(reportForm.blocked),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setReportForm({
        testPlanId: "",
        executionDate: new Date().toISOString().slice(0, 10),
        summary: "",
        totalCases: "",
        passed: "",
        failed: "",
        blocked: "",
        resultStatus: "in_progress",
      });
      refreshProject();
    } else {
      alert(data.error || "Failed");
    }
  }

  const [caseSearch, setCaseSearch] = useState("");
  const filteredCases = cases.filter((item) => item.title.toLowerCase().includes(caseSearch.toLowerCase()));

  if (!project) return <div className="container">Loading...</div>;

  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="muted">{project.description || "No description provided"}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => router.push("/dashboard")}>Back</button>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="sub-title">Add Phase</h2>
          <form onSubmit={addPhase}>
            <div className="form-group">
              <label>Phase Name</label>
              <input value={phaseName} onChange={(e) => setPhaseName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={phaseDescription} onChange={(e) => setPhaseDescription(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">Create Phase</button>
          </form>
        </div>

        <div className="card">
          <h2 className="sub-title">Add Test Plan</h2>
          <form onSubmit={addPlan}>
            <div className="form-group">
              <label>Plan Title</label>
              <input value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">Create Plan</button>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="sub-title">Add Test Scenario</h2>
        <form onSubmit={addScenario}>
          <div className="form-group">
            <label>Scenario Title</label>
            <input value={scenarioTitle} onChange={(e) => setScenarioTitle(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit">Create Scenario</button>
        </form>
      </div>

      <div className="card mt-4">
        <h2 className="sub-title">Add Test Case</h2>
        <form onSubmit={addTestCase}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Title</label>
              <input value={testCaseForm.title} onChange={(e) => setTestCaseForm({ ...testCaseForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={testCaseForm.priority} onChange={(e) => setTestCaseForm({ ...testCaseForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Type</label>
              <select value={testCaseForm.testType} onChange={(e) => setTestCaseForm({ ...testCaseForm, testType: e.target.value })}>
                <option value="functional">Functional</option>
                <option value="ui">UI</option>
                <option value="api">API</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={testCaseForm.status} onChange={(e) => setTestCaseForm({ ...testCaseForm, status: e.target.value })}>
                <option value="not_started">Not Started</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="blocked">Blocked</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Preconditions</label>
            <textarea value={testCaseForm.preconditions} onChange={(e) => setTestCaseForm({ ...testCaseForm, preconditions: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Steps</label>
            <textarea value={testCaseForm.steps} onChange={(e) => setTestCaseForm({ ...testCaseForm, steps: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Expected Result</label>
            <textarea value={testCaseForm.expectedResult} onChange={(e) => setTestCaseForm({ ...testCaseForm, expectedResult: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Actual Result</label>
            <textarea value={testCaseForm.actualResult} onChange={(e) => setTestCaseForm({ ...testCaseForm, actualResult: e.target.value })} />
          </div>

          <button className="btn btn-primary" type="submit">Create Test Case</button>
        </form>
      </div>

      <div className="card mt-4">
        <h2 className="sub-title">Add Bug Report</h2>
        <form onSubmit={addBug}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Title</label>
              <input value={bugForm.title} onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Severity</label>
              <select value={bugForm.severity} onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Priority</label>
              <select value={bugForm.priority} onChange={(e) => setBugForm({ ...bugForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={bugForm.status} onChange={(e) => setBugForm({ ...bugForm, status: e.target.value })}>
                <option value="new">New</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="fixed">Fixed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={bugForm.description} onChange={(e) => setBugForm({ ...bugForm, description: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Steps to Reproduce</label>
            <textarea value={bugForm.stepsToReproduce} onChange={(e) => setBugForm({ ...bugForm, stepsToReproduce: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Actual Result</label>
            <textarea value={bugForm.actualResult} onChange={(e) => setBugForm({ ...bugForm, actualResult: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Expected Result</label>
            <textarea value={bugForm.expectedResult} onChange={(e) => setBugForm({ ...bugForm, expectedResult: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Attach screenshot / file</label>
            <input type="file" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);
              formData.append("bugId", "temporary");

              const res = await fetch("/api/bugs/upload", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();
              if (res.ok) {
                alert("Uploaded: " + data.fileUrl);
              } else {
                alert(data.error || "Upload failed");
              }
            }} />
          </div>

          <button className="btn btn-primary" type="submit">Create Bug</button>
        </form>
      </div>

      <div className="card mt-4">
        <h2 className="sub-title">Add Execution Report</h2>
        <form onSubmit={addReport}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Test Plan</label>
              <select value={reportForm.testPlanId} onChange={(e) => setReportForm({ ...reportForm, testPlanId: e.target.value })}>
                <option value="">Select plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Execution Date</label>
              <input type="date" value={reportForm.executionDate} onChange={(e) => setReportForm({ ...reportForm, executionDate: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Total Cases</label>
              <input value={reportForm.totalCases} onChange={(e) => setReportForm({ ...reportForm, totalCases: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Passed</label>
              <input value={reportForm.passed} onChange={(e) => setReportForm({ ...reportForm, passed: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Failed</label>
              <input value={reportForm.failed} onChange={(e) => setReportForm({ ...reportForm, failed: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Blocked</label>
              <input value={reportForm.blocked} onChange={(e) => setReportForm({ ...reportForm, blocked: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Summary</label>
            <textarea value={reportForm.summary} onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Result Status</label>
            <select value={reportForm.resultStatus} onChange={(e) => setReportForm({ ...reportForm, resultStatus: e.target.value })}>
              <option value="in_progress">In Progress</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
              <option value="partial">Partial</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit">Create Report</button>
        </form>
      </div>

      <div className="grid grid-2 mt-4">
        <div className="card">
          <h2 className="sub-title">Phases</h2>
          {phases.length === 0 ? <p className="muted">No phases yet.</p> : (
            <ul>
              {phases.map((phase) => (
                <li key={phase.id} style={{ marginBottom: 8 }}>
                  <strong>{phase.name}</strong>
                  <div className="muted">{phase.description || "No description"}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="sub-title">Test Plans</h2>
          {plans.length === 0 ? <p className="muted">No test plans yet.</p> : (
            <ul>
              {plans.map((plan) => (
                <li key={plan.id} style={{ marginBottom: 8 }}>
                  <strong>{plan.title}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-2 mt-4">
        <div className="card">
          <h2 className="sub-title">Test Cases</h2>
          <div className="form-group">
            <label>Search case</label>
            <input value={caseSearch} onChange={(e) => setCaseSearch(e.target.value)} />
          </div>
          {filteredCases.length === 0 ? <p className="muted">No cases matching your search.</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.status}</td>
                    <td>{item.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2 className="sub-title">Bugs</h2>
          {bugs.length === 0 ? <p className="muted">No bugs yet.</p> : (
            <ul>
              {bugs.map((bug) => (
                <li key={bug.id} style={{ marginBottom: 8 }}>
                  <strong>{bug.title}</strong>
                  <div className="muted">{bug.status} • {bug.severity}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="sub-title">Reports</h2>
        {reports.length === 0 ? <p className="muted">No execution reports yet.</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>Summary</th>
                <th>Total</th>
                <th>Pass</th>
                <th>Fail</th>
                <th>Blocked</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.summary || "No summary"}</td>
                  <td>{report.totalCases}</td>
                  <td>{report.passed}</td>
                  <td>{report.failed}</td>
                  <td>{report.blocked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
