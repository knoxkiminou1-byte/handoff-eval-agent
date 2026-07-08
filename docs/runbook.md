# Handoff Eval Agent Runbook

## Purpose

Operate, verify, and hand off Handoff Eval Agent.

## Local Setup

```bash
npm install
npm run dev
```

## Verification

```bash
npm run test
npm run build
```

## Deployment

This repo is configured for GitHub Pages at:

https://knoxkiminou1-byte.github.io/handoff-eval-agent/

Build output can be published from `dist` to the `gh-pages` branch.

## Common Failure Modes

- Build fails: run `npm install` and check TypeScript errors.
- Demo data looks wrong: inspect `src/projectConfig.ts` and `src/lib`.
- AI output seems unsupported: compare it against `evals/cases` required/prohibited claims.
- Export path skips review: treat as a blocker and fix approval gating.

## Maintenance

- Re-run tests before changing copy or logic.
- Update docs when workflow, env vars, deployment, or eval behavior changes.
- Keep limitations visible.
