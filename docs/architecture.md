# Handoff Eval Agent Architecture

## Application Shape

- Frontend: React + Vite + TypeScript
- Styling: custom responsive CSS with a premium dark Bubble 20 interface
- AI layer: Claude-ready adapter design with local deterministic fallback for public demos
- Data: seeded mock data and schema documentation
- Tests: Vitest unit tests for core logic
- Deployment: GitHub Pages static build

## Data Model Concept

The intended production schema includes: audited_projects, audit_runs, audit_findings, prompt_inventory, generated_docs, eval_suggestions.

## AI Boundary

Deterministic code handles counts, scanning, rubric math, missing-data detection, and approval gates. Claude is reserved for narrative interpretation, coaching, risk explanation, report drafting, and nontechnical translation.

## Source Layout

- `src/App.tsx`: primary interactive demo shell
- `src/projectConfig.ts`: project-specific content and workflow data
- `src/lib`: deterministic business logic
- `evals/cases`: fixture-based evaluation cases
- `docs`: handoff and operating documentation
