import { describe, expect, it } from "vitest";
import {
  auditProject,
  detectAiUsage,
  detectEvalCoverage,
  generateFindings,
  generateHandoffDocs,
  hasHumanReviewWorkflow,
  inspectDocsFolder,
  parseFileManifest,
  scoreReadiness,
  serializeAuditReport,
} from "./handoff";

const fixture = [
  { path: "README.md", content: "AI intake tool with human review." },
  { path: ".env.example", content: "ANTHROPIC_API_KEY=" },
  { path: "docs/runbook.md", content: "Setup and deploy." },
  { path: "docs/evaluation-plan.md", content: "Eval cases." },
  { path: "src/ai.ts", content: "import Anthropic from '@anthropic-ai/sdk'; messages.create({})" },
  { path: "evals/cases/case-01.json", content: "{}" },
];

describe("Handoff Eval Agent scanner", () => {
  it("detects AI usage without exposing secrets", () => {
    expect(detectAiUsage(fixture).map((file) => file.path)).toContain("src/ai.ts");
  });

  it("detects eval coverage", () => {
    expect(detectEvalCoverage(fixture)).toBe(true);
  });

  it("checks docs presence", () => {
    expect(inspectDocsFolder(fixture).every((item) => item.present)).toBe(true);
  });

  it("scores readiness from deterministic signals", () => {
    expect(scoreReadiness(fixture)).toMatchObject({ evalCoverage: 82, documentation: 100, handoff: 81 });
  });

  it("detects human review workflow language", () => {
    expect(hasHumanReviewWorkflow(fixture)).toBe(true);
  });

  it("parses pasted file manifests", () => {
    const parsed = parseFileManifest("file: README.md\nAI tool\n---\npath: docs/runbook.md\nRunbook");
    expect(parsed.map((file) => file.path)).toEqual(["README.md", "docs/runbook.md"]);
  });

  it("generates findings and handoff docs", () => {
    const weakFixture = [
      { path: "src/ai.ts", content: "messages.create({ prompt: 'hello' })" },
      { path: ".env", content: "API_KEY=sk-testsecretvalue1234567890" },
    ];
    expect(generateFindings(weakFixture).some((finding) => finding.severity === "critical")).toBe(true);
    expect(auditProject(weakFixture).overall).toBeLessThan(75);
    expect(generateHandoffDocs(weakFixture).setupRunbook).toContain("Copy .env.example to a local environment file and fill values outside version control.");
  });

  it("serializes a markdown audit report", () => {
    expect(serializeAuditReport(fixture)).toContain("# Handoff Eval Agent Report");
  });
});
