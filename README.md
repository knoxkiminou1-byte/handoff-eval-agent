# Handoff Eval Agent

Handoff Eval Agent audits AI-enabled projects for reliability, evaluation coverage, documentation quality, safety risks, and handoff readiness.

## Mission

Make AI tools safe to inherit.

## Demo

- Live system: https://knoxkiminou1-byte.github.io/handoff-eval-agent/
- GitHub: https://github.com/knoxkiminou1-byte/handoff-eval-agent

## Core Features

- **AI usage detection:** Finds AI imports, prompt files, API routes, and structured output hints.
- **Eval gap detector:** Checks whether eval cases and measurable grading criteria exist.
- **Risk register:** Explains privacy, hallucination, reliability, and handoff risks.
- **Handoff generator:** Drafts runbooks, training guides, checklists, and owner summaries.

## Claude Architecture

This MVP is Claude-ready without requiring a public API key. Deterministic TypeScript handles facts, scores, scans, approval gates, and metrics. Claude is reserved for narrative explanation, coaching, report drafting, risk interpretation, and nontechnical translation.

## Human Review Workflow

Outputs that could affect real people are treated as drafts until reviewed. The UI, docs, and eval cases all reinforce human approval before export.

## Evaluation Strategy

Eval fixtures live in `evals/cases`. Unit tests cover deterministic logic in `src/lib`.

## Tech Stack

- React + Vite
- TypeScript
- Zod-ready architecture
- Vitest
- GitHub Pages

## Local Setup

```bash
npm install
npm run dev
```

## Verify

```bash
npm run test
npm run build
```

## Documentation

- [Product brief](docs/product-brief.md)
- [Architecture](docs/architecture.md)
- [Evaluation plan](docs/evaluation-plan.md)
- [Security](docs/security.md)
- [Runbook](docs/runbook.md)
- [Training guide](docs/training-guide.md)
- [Handoff checklist](docs/handoff-checklist.md)
- [Limitations](docs/limitations.md)

## What I Would Improve Next

Add authenticated workspaces, real Claude API execution behind server-side routes, persistent Postgres storage, and a browser-based eval runner that records regression history.
