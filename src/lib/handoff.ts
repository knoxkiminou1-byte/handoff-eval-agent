export type ProjectFile = { path: string; content: string };

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
