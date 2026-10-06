import { requireEvidence } from "./mit";

export type ProjectFile = { path: string; content: string };

export type Finding = {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
  evidence: string;
  recommendation: string;
};

export function detectAiUsage(files: ProjectFile[]) {
  const pattern = /(anthropic|claude|openai|ai-sdk|generateText|messages\.create)/i;
  return files.filter((file) => pattern.test(file.content) || /prompt/i.test(file.path));
}

export function detectEvalCoverage(files: ProjectFile[]) {
  return files.some((file) => /(^|\/)evals?\//i.test(file.path) || /\.test\./.test(file.path));
}

export function inspectDocsFolder(files: ProjectFile[]) {
  const required = ["README.md", "docs/runbook.md", "docs/evaluation-plan.md", ".env.example"];
  return required.map((path) => ({ path, present: files.some((file) => file.path === path) }));
}

export function scoreReadiness(files: ProjectFile[]) {
  const ai = detectAiUsage(files).length > 0;
  const evals = detectEvalCoverage(files);
  const docs = inspectDocsFolder(files).filter((item) => item.present).length;
  return {
    aiReadiness: ai ? 72 : 35,
    evalCoverage: evals ? 82 : 28,
    documentation: Math.round((docs / 4) * 100),
    handoff: docs >= 3 ? 81 : 42,
  };
}

export function hasHumanReviewWorkflow(files: ProjectFile[]) {
  return files.some((file) => /(human review|approved|approval|reviewer)/i.test(file.content));
}

export function parseFileManifest(input: string): ProjectFile[] {
  return input.split(/\n---+\n/g).map((block) => block.trim()).filter(Boolean).map((block, index) => {
    const [firstLine, ...rest] = block.split("\n");
    const pathMatch = firstLine.match(/^(file|path):\s*(.+)$/i);
    if (pathMatch) return { path: pathMatch[2].trim(), content: rest.join("\n").trim() };
    return { path: `pasted/file-${String(index + 1).padStart(2, "0")}.txt`, content: block };
  });
}

export function detectSecrets(files: ProjectFile[]) {
  const secretPatterns = [/sk-[a-zA-Z0-9_-]{20,}/, /api[_-]?key\s*=\s*["']?[a-zA-Z0-9_-]{16,}/i, /secret\s*=\s*["']?[a-zA-Z0-9_-]{16,}/i, /password\s*=\s*["']?[^"'\s]{8,}/i];
  return files.filter((file) => secretPatterns.some((pattern) => pattern.test(file.content)));
}

export function detectPromptFiles(files: ProjectFile[]) {
  return files.filter((file) => /(prompt|system|instruction|agent)/i.test(file.path) || /(system prompt|developer message|tool call|messages)/i.test(file.content));
}

function keep(finding: Finding) {
  return requireEvidence({ status: "OWED", evidence: finding.evidence }) === "";
}

export function generateFindings(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  const docs = inspectDocsFolder(files);
  const readiness = scoreReadiness(files);
  const secrets = detectSecrets(files);
  const aiFiles = detectAiUsage(files);
  const prompts = detectPromptFiles(files);
  const hasReview = hasHumanReviewWorkflow(files);

  if (secrets.length > 0) findings.push({ id: "RISK-001", severity: "critical", title: "Possible secret value in source", detail: `${secrets.length} file(s) look like they may include a live credential value.`, evidence: secrets.map((file) => file.path).join(", "), recommendation: "Rotate exposed values, move secrets into environment variables, and commit only .env.example names." });
  if (aiFiles.length > 0 && !detectEvalCoverage(files)) findings.push({ id: "RISK-002", severity: "high", title: "AI usage without eval coverage", detail: "AI-related files were detected, but no eval folder or test coverage signal was found.", evidence: aiFiles.map((file) => file.path).join(", "), recommendation: "Add eval cases for happy paths, hallucination risk, missing data, refusal boundaries, and reviewer gates." });
  if (aiFiles.length > 0 && !hasReview) findings.push({ id: "RISK-003", severity: "high", title: "Generated output lacks human review signal", detail: "The scan did not find approval, reviewer, or human review language.", evidence: aiFiles.map((file) => file.path).join(", "), recommendation: "Add an explicit review gate before generated content is exported, sent, or shown as final." });
  if (docs.some((doc) => !doc.present)) findings.push({ id: "RISK-004", severity: "medium", title: "Handoff documentation incomplete", detail: `${docs.filter((doc) => !doc.present).map((doc) => doc.path).join(", ")} missing from the scanned files.`, evidence: docs.filter((doc) => !doc.present).map((doc) => doc.path).join(", "), recommendation: "Add setup, runbook, evaluation, security, limitations, and owner checklist docs before transfer." });
  if (prompts.length > 0 && !files.some((file) => /zod|schema|json schema|structured output/i.test(file.content))) findings.push({ id: "RISK-005", severity: "medium", title: "Prompt inventory has no structured output signal", detail: `${prompts.length} prompt-like file(s) were found without a visible schema or validator.`, evidence: prompts.map((file) => file.path).join(", "), recommendation: "Use a typed schema for generated outputs and keep prompt files versioned with expected examples." });
  if (readiness.documentation >= 100 && readiness.evalCoverage >= 80 && hasReview && secrets.length === 0) findings.push({ id: "INFO-001", severity: "low", title: "Handoff package is close", detail: "Core docs, eval coverage, and review-language signals are present.", evidence: docs.map((doc) => doc.path).join(", "), recommendation: "Run a human walkthrough and attach owner-specific access notes before final transfer." });
  return findings.filter(keep);
}

export function auditProject(files: ProjectFile[]) {
  const scores = scoreReadiness(files);
  const findings = generateFindings(files);
  const severityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
  const riskPenalty = findings.reduce((sum, finding) => sum + severityWeights[finding.severity] * 4, 0);
  const overall = Math.max(0, Math.min(100, Math.round((scores.aiReadiness + scores.evalCoverage + scores.documentation + scores.handoff) / 4 - riskPenalty)));
  return { overall, scores, aiFiles: detectAiUsage(files), promptFiles: detectPromptFiles(files), docs: inspectDocsFolder(files), secrets: detectSecrets(files), findings, hasReview: hasHumanReviewWorkflow(files), evalCoverage: detectEvalCoverage(files) };
}

export function generateHandoffDocs(files: ProjectFile[]) {
  const audit = auditProject(files);
  return {
    ownerSummary: audit.overall >= 75 ? "This project has a workable handoff foundation, but the listed findings should be resolved before a nontechnical owner inherits it." : "This project needs focused handoff work before transfer. Start with eval coverage, review gates, and missing docs.",
    setupRunbook: ["Install dependencies with the package manager used in the repo.", "Copy .env.example to a local environment file and fill values outside version control.", "Run tests, evals, and the local dev server before changing prompts.", "Record model/provider names, API routes, and reviewer responsibilities."],
    evalPlan: ["Create fixture projects with complete docs, missing docs, secret-like strings, and no evals.", "Grade false positives separately from missed critical risks.", "Add tests for hallucination-prone generated docs and source-grounded summaries.", "Require a human reviewer before any generated handoff package is considered final."],
    riskRegister: audit.findings.filter((finding) => finding.severity !== "low").slice(0, 4),
    missingDocs: audit.docs.filter((doc) => !doc.present).map((doc) => doc.path),
  };
}

export function serializeAuditReport(files: ProjectFile[]) {
  const audit = auditProject(files);
  const docs = generateHandoffDocs(files);
  return ["# Handoff Eval Agent Report", "", `Overall readiness: ${audit.overall}/100`, `AI files detected: ${audit.aiFiles.length}`, `Prompt inventory: ${audit.promptFiles.length}`, `Eval coverage detected: ${audit.evalCoverage ? "yes" : "no"}`, `Human review detected: ${audit.hasReview ? "yes" : "no"}`, `Possible secrets detected: ${audit.secrets.length}`, "", "## Scorecard", `- AI readiness: ${audit.scores.aiReadiness}/100`, `- Eval coverage: ${audit.scores.evalCoverage}/100`, `- Documentation: ${audit.scores.documentation}/100`, `- Handoff: ${audit.scores.handoff}/100`, "", "## Findings", ...audit.findings.map((finding) => `- ${finding.id} [${finding.severity}] ${finding.title}\n  Evidence: ${finding.evidence}\n  Fix: ${finding.recommendation}`), "", "## Generated Owner Summary", docs.ownerSummary, "", "## Setup Runbook", ...docs.setupRunbook.map((item) => `- ${item}`), "", "## Eval Plan", ...docs.evalPlan.map((item) => `- ${item}`), "", "## Missing Docs", ...(docs.missingDocs.length > 0 ? docs.missingDocs.map((item) => `- ${item}`) : ["- None detected."]), "", "## Static Scan Boundary", "This report is generated from pasted file paths and content. It does not execute repository code or expose secret values."].join("\n");
}
