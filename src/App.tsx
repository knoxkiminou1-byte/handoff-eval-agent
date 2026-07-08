import { useMemo, useState } from "react";
import "./styles.css";
import { project } from "./projectConfig";

type ScreenId = (typeof project.screens)[number]["id"];

function Pill({ children }: { children: string }) {
  return <span className="pill">{children}</span>;
}

function MetricBubble({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric-bubble">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function MiniPreview() {
  return (
    <div className="preview-grid" aria-label="Dashboard preview">
      {project.preview.map((item, index) => (
        <div className={`preview-card tone-${index % 4}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.detail}</small>
        </div>
      ))}
    </div>
  );
}

function ScreenPanel({ id }: { id: ScreenId }) {
  const screen = project.screens.find((item) => item.id === id) ?? project.screens[0];
  return (
    <section className="screen-panel">
      <div>
        <p className="section-label">{screen.label}</p>
        <h2>{screen.title}</h2>
        <p>{screen.description}</p>
      </div>
      <div className="screen-list">
        {screen.items.map((item) => (
          <article key={item.title}>
            <span>{item.kicker}</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvaluationPanel() {
  const score = useMemo(() => Math.round(project.evals.reduce((sum, item) => sum + item.score, 0) / project.evals.length), []);
  return (
    <section className="band eval-band" id="evals">
      <div className="band-copy">
        <p className="section-label">Evaluation</p>
        <h2>Built with visible tests, guardrails, and handoff criteria.</h2>
        <p>{project.evaluationIntro}</p>
      </div>
      <div className="scorecard">
        <div className="score-ring">
          <strong>{score}</strong>
          <span>/100</span>
        </div>
        <div className="eval-list">
          {project.evals.map((item) => (
            <div key={item.name}>
              <span>{item.name}</span>
              <meter min={0} max={100} value={item.score} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HandoffPanel() {
  return (
    <section className="band handoff-band" id="handoff">
      <div className="handoff-steps">
        {project.handoff.map((step, index) => (
          <article key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </article>
        ))}
      </div>
      <div className="band-copy">
        <p className="section-label">Runbook Ready</p>
        <h2>Designed to be inherited, not just demoed.</h2>
        <p>{project.handoffIntro}</p>
      </div>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState<ScreenId>(project.screens[0].id);

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Primary">
        <a href="#top" className="brand">
          <span className="brand-mark" />
          {project.name}
        </a>
        <div>
          <a href="#system">System</a>
          <a href="#evals">Evals</a>
          <a href="#handoff">Handoff</a>
          <a href={project.githubUrl}>GitHub</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>{project.headline}</h1>
          <p>{project.summary}</p>
          <div className="cta-row">
            <a className="button primary" href="#system">Open demo workflow</a>
            <a className="button secondary" href={project.githubUrl}>View GitHub</a>
          </div>
          <div className="tag-row">
            {project.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
          </div>
        </div>
        <div className="hero-preview">
          <MiniPreview />
        </div>
      </section>

      <section className="metrics-row" aria-label="System metrics">
        {project.metrics.map((metric) => <MetricBubble key={metric.label} {...metric} />)}
      </section>

      <section className="system-grid" id="system">
        <aside className="rail">
          <p className="section-label">Workflow</p>
          {project.screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              className={active === screen.id ? "active" : ""}
              onClick={() => setActive(screen.id)}
            >
              {screen.label}
            </button>
          ))}
        </aside>
        <ScreenPanel id={active} />
      </section>

      <section className="capability-section">
        <p className="section-label">Capabilities</p>
        <div className="capability-grid">
          {project.capabilities.map((capability) => (
            <article key={capability.title}>
              <h3>{capability.title}</h3>
              <p>{capability.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <EvaluationPanel />
      <HandoffPanel />
    </main>
  );
}
