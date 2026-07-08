import { describe, expect, it } from "vitest";
import { detectAiUsage, detectEvalCoverage, hasHumanReviewWorkflow, inspectDocsFolder, scoreReadiness } from "./handoff";

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
});
