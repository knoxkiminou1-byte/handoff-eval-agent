export const project = {
  "name": "Handoff Eval Agent",
  "headline": "Make AI tools safe to inherit.",
  "summary": "Handoff Eval Agent audits AI-enabled projects for reliability, evaluation coverage, documentation quality, safety risks, and handoff readiness.",
  "githubUrl": "https://github.com/knoxkiminou1-byte/handoff-eval-agent",
  "tags": [
    "Responsible AI",
    "Eval Harness",
    "Runbooks",
    "Risk Register",
    "GitHub Audit"
  ],
  "metrics": [
    {
      "label": "AI Ready",
      "value": "72",
      "detail": "score demo"
    },
    {
      "label": "Eval Coverage",
      "value": "48",
      "detail": "gap detected"
    },
    {
      "label": "Handoff",
      "value": "81",
      "detail": "docs mostly ready"
    },
    {
      "label": "Secrets",
      "value": "Names only",
      "detail": "values never shown"
    }
  ],
  "preview": [
    {
      "label": "Prompt Inventory",
      "value": "6",
      "detail": "AI touchpoints found"
    },
    {
      "label": "Critical Gaps",
      "value": "3",
      "detail": "must-fix items"
    },
    {
      "label": "Generated Docs",
      "value": "7",
      "detail": "review-mode drafts"
    },
    {
      "label": "Static Scan",
      "value": "Safe",
      "detail": "no code execution"
    }
  ],
  "screens": [
    {
      "id": "audit",
      "label": "Audit",
      "title": "Static readiness scan",
      "description": "The agent inspects repo structure and config without executing arbitrary user code.",
      "items": [
        {
          "kicker": "Scanner",
          "title": "Deterministic first pass",
          "copy": "Code checks README, docs, package scripts, env examples, evals, tests, workflows, prompts, and API routes."
        },
        {
          "kicker": "Scores",
          "title": "Readiness breakdown",
          "copy": "AI readiness, eval coverage, documentation, safety, and handoff scores are separated."
        },
        {
          "kicker": "Findings",
          "title": "Severity-ranked gaps",
          "copy": "Critical, high, medium, and low findings include recommended fixes."
        }
      ]
    },
    {
      "id": "inventory",
      "label": "Inventory",
      "title": "Prompt and model map",
      "description": "The system identifies AI usage, prompt files, structured output schemas, validation, and review gates.",
      "items": [
        {
          "kicker": "Prompts",
          "title": "Surface hidden AI calls",
          "copy": "Claude, OpenAI, AI SDK, and prompt-like files are detected by pattern."
        },
        {
          "kicker": "Review",
          "title": "Approval workflow check",
          "copy": "Exports and generated docs are flagged if human review is missing."
        },
        {
          "kicker": "Env",
          "title": "Secret-safe scan",
          "copy": "Only variable names are shown; secret values are never exposed."
        }
      ]
    },
    {
      "id": "package",
      "label": "Handoff",
      "title": "Generated transfer package",
      "description": "Claude receives structured audit context and drafts the docs another owner needs.",
      "items": [
        {
          "kicker": "Runbook",
          "title": "Setup and operations",
          "copy": "Generated docs include local setup, deployment, rollback, logs, and troubleshooting."
        },
        {
          "kicker": "Evals",
          "title": "Suggested test cases",
          "copy": "The eval plan covers false positives, hallucination risks, missing data, and owner review."
        },
        {
          "kicker": "Training",
          "title": "Nontechnical guide",
          "copy": "Staff-facing instructions explain safe operation, limitations, and escalation points."
        }
      ]
    }
  ],
  "capabilities": [
    {
      "title": "AI usage detection",
      "copy": "Finds AI imports, prompt files, API routes, and structured output hints."
    },
    {
      "title": "Eval gap detector",
      "copy": "Checks whether eval cases and measurable grading criteria exist."
    },
    {
      "title": "Risk register",
      "copy": "Explains privacy, hallucination, reliability, and handoff risks."
    },
    {
      "title": "Handoff generator",
      "copy": "Drafts runbooks, training guides, checklists, and owner summaries."
    }
  ],
  "evals": [
    {
      "name": "AI detection",
      "score": 95
    },
    {
      "name": "Eval detection",
      "score": 92
    },
    {
      "name": "Docs scoring",
      "score": 90
    },
    {
      "name": "False positives",
      "score": 88
    }
  ],
  "evaluationIntro": "The eval suite uses fixture projects to test AI usage detection, eval folder detection, docs scoring, human review detection, and generated document structure.",
  "handoffIntro": "Handoff Eval Agent is itself handoff-ready: it documents scanner limitations, static-analysis boundaries, review-mode outputs, and safe operating procedures.",
  "handoff": [
    {
      "title": "Scan",
      "copy": "No arbitrary code execution; analyze files and metadata only."
    },
    {
      "title": "Explain",
      "copy": "Claude-ready summaries translate technical gaps for staff and mentors."
    },
    {
      "title": "Generate",
      "copy": "Draft docs stay in review mode before export."
    },
    {
      "title": "Transfer",
      "copy": "The package gives the next owner setup, safety, evaluation, and maintenance steps."
    }
  ]
} as const;
