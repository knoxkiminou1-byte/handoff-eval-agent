import { useMemo, useState } from "react";
import handoffVisual from "./assets/handoff-audit-visual.png";
import "./styles.css";
import {
  ProjectFile,
  auditProject,
  generateHandoffDocs,
  parseFileManifest,
  serializeAuditReport,
} from "./lib/handoff";

const sampleManifest = `file: README.md
AI assistant for intake summaries with human review before export.
---
file: .env.example
ANTHROPIC_API_KEY=
DATABASE_URL=
---
file: docs/runbook.md
Setup, deploy, rollback, and support process.
---
file: docs/evaluation-plan.md
Eval cases cover missing data, hallucinated claims, and reviewer approval.
---
file: src/ai/agent.ts
import Anthropic from '@anthropic-ai/sdk';
const systemPrompt = "Summarize intake notes with citations.";
messages.create({ model: "claude-sonnet-4-5", messages });
---
file: prompts/intake-system.md
System prompt for safe intake summaries. Use JSON schema for output.
---
file: evals/cases/case-01.json
{"input":"missing contact date","expected":"ask for review"}
---
file: docs/security.md
Secrets live in provider env vars. Generated exports require reviewer approval.`;

function Icon({ name }: { name: "scan" | "copy" | "download" | "shield" | "file" | "alert" }) {
  const paths = {
    scan: "M4 7V5h4M16 5h4v2M20 17v2h-4M8 19H4v-2M7 12h10M12 7v10",
    copy: "M8 8h10v10H8z M5 5h10",
    download: "M12 4v10m0 0l-4-4m4 4l4-4M5 20h14",
    shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z",
    file: "M6 3h8l4 4v14H6z M14 3v5h5",
    alert: "M12 4l9 16H3z M12 9v5m0 3h.01",
  };
  return (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function downloadText(filename: string, value: string) {
  const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(href);
}

function useClipboard() {
  const [copied, setCopied] = useState("");
  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }
  return { copied, copy };
}

function ScoreCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="score-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <meter min={0} max={100} value={value} />
      <small>{detail}</small>
    </article>
  );
}

export default function App() {
  const [manifest, setManifest] = useState(sampleManifest);
  const [scanCount, setScanCount] = useState(1);
  const [findingQuery, setFindingQuery] = useState("");
  const [activeDoc, setActiveDoc] = useState<"summary" | "runbook" | "evals" | "report">("summary");
  const { copied, copy } = useClipboard();

  const files: ProjectFile[] = useMemo(() => parseFileManifest(manifest), [manifest, scanCount]);
  const audit = useMemo(() => auditProject(files), [files]);
  const docs = useMemo(() => generateHandoffDocs(files), [files]);
  const reportMarkdown = useMemo(() => serializeAuditReport(files), [files]);
  const visibleFindings = audit.findings.filter((finding) => {
    const q = findingQuery.trim().toLowerCase();
    if (!q) return true;
    return `${finding.title} ${finding.detail} ${finding.evidence}`.toLowerCase().includes(q);
  });

  const docText = {
    summary: docs.ownerSummary,
    runbook: docs.setupRunbook.map((item) => `- ${item}`).join("\n"),
    evals: docs.evalPlan.map((item) => `- ${item}`).join("\n"),
    report: reportMarkdown,
  };

  const severityCounts = audit.findings.reduce<Record<string, number>>((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a href="#top" className="brand">
          <span className="brand-mark"><Icon name="shield" /></span>
          <span>Handoff Eval Agent<small>Responsible AI audit</small></span>
        </a>
        <nav>
          <a href="#scanner">Scanner</a>
          <a href="#scorecards">Scorecards</a>
          <a href="#findings">Risks</a>
          <a href="#docs">Generated Docs</a>
        </nav>
        <section className="scope-card">
          <span>Static scan</span>
          <strong>{files.length}</strong>
          <small>pasted files analyzed</small>
        </section>
      </aside>
      <section className="workspace" id="top">
        <header className="hero">
          <div className="hero-copy">
            <p className="section-label">Safe to inherit</p>
            <h1>Audit AI projects before another owner has to trust them.</h1>
            <p>Paste a file manifest, scan for AI usage, prompt inventory, eval coverage, review gates, secret-like values, and missing docs, then generate the handoff package.</p>
            <div className="hero-actions">
              <a href="#scanner"><Icon name="scan" /> Scan repository</a>
              <button type="button" onClick={() => copy("owner-summary", docs.ownerSummary)}><Icon name="copy" /> {copied === "owner-summary" ? "Copied" : "Copy summary"}</button>
            </div>
          </div>
          <div className="hero-visual">
            <img src={handoffVisual} alt="" />
            <div className="readiness-card">
              <span>Readiness</span>
              <strong>{audit.overall}</strong>
              <small>{audit.findings.length} findings in the current scan</small>
            </div>
          </div>
        </header>
        <section className="scanner-panel panel" id="scanner">
          <div className="panel-heading">
            <div>
              <p className="section-label">Repository Scanner</p>
              <h2>Paste file paths and content. The app performs a static audit.</h2>
            </div>
            <button type="button" onClick={() => setScanCount((count) => count + 1)}><Icon name="scan" /> Run scan</button>
          </div>
          <textarea value={manifest} onChange={(event) => setManifest(event.target.value)} aria-label="File manifest input" />
        </section>
        <section className="status-strip" id="scorecards">
          <article><span>Overall</span><strong>{audit.overall}</strong></article>
          <article><span>AI files</span><strong>{audit.aiFiles.length}</strong></article>
          <article><span>Prompts</span><strong>{audit.promptFiles.length}</strong></article>
          <article><span>Possible secrets</span><strong>{audit.secrets.length}</strong></article>
        </section>
        <section className="score-grid">
          <ScoreCard label="AI readiness" value={audit.scores.aiReadiness} detail="AI usage and prompts detected" />
          <ScoreCard label="Eval coverage" value={audit.scores.evalCoverage} detail="tests or eval cases visible" />
          <ScoreCard label="Documentation" value={audit.scores.documentation} detail="core handoff docs present" />
          <ScoreCard label="Handoff" value={audit.scores.handoff} detail="owner transfer signal" />
        </section>
        <section className="audit-grid">
          <article className="panel findings-panel" id="findings">
            <div className="panel-heading">
              <div>
                <p className="section-label">Risk Register</p>
                <h2>Severity-ranked findings.</h2>
              </div>
              <div className="severity-pills">
                {["critical", "high", "medium", "low"].map((severity) => (
                  <span key={severity} className={severity}>{severityCounts[severity] || 0} {severity}</span>
                ))}
              </div>
            </div>
            <label>
              Search findings
              <input value={findingQuery} onChange={(event) => setFindingQuery(event.target.value)} placeholder="Title, detail, or evidence" />
            </label>
            <div className="finding-list">
              {visibleFindings.map((finding) => (
                <article key={finding.id} className={finding.severity}>
                  <Icon name={finding.severity === "low" ? "file" : "alert"} />
                  <div>
                    <span>{finding.id} - {finding.severity}</span>
                    <strong>{finding.title}</strong>
                    <p>{finding.detail}</p>
                    <small>Evidence: {finding.evidence}</small>
                    <small>{finding.recommendation}</small>
                  </div>
                </article>
              ))}
            </div>
          </article>
          <article className="panel inventory-panel">
            <p className="section-label">Prompt Inventory</p>
            <h2>{audit.promptFiles.length} prompt-like files</h2>
            <div className="inventory-list">
              {audit.promptFiles.slice(0, 8).map((file) => (
                <div key={file.path}><Icon name="file" /> {file.path}</div>
              ))}
            </div>
            <p className="boundary-note">Secret values are not displayed. The scan only reports count and file path signals.</p>
          </article>
        </section>
        <section className="docs-grid" id="docs">
          <article className="panel docs-panel">
            <div className="panel-heading">
              <div>
                <p className="section-label">Generated Docs</p>
                <h2>Review-mode handoff package.</h2>
              </div>
              <div className="doc-actions">
                <button type="button" onClick={() => copy(activeDoc, docText[activeDoc])}><Icon name="copy" /> {copied === activeDoc ? "Copied" : "Copy"}</button>
                <button type="button" onClick={() => downloadText("handoff-eval-agent-report.md", reportMarkdown)}><Icon name="download" /> Download</button>
              </div>
            </div>
            <div className="doc-tabs">
              {(["summary", "runbook", "evals", "report"] as const).map((doc) => (
                <button type="button" key={doc} className={activeDoc === doc ? "active" : ""} onClick={() => setActiveDoc(doc)}>{doc}</button>
              ))}
            </div>
            <pre>{docText[activeDoc]}</pre>
          </article>
        </section>
      </section>
    </main>
  );
}
