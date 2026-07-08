# Handoff Eval Agent Security Notes

## Demo Boundary

This public portfolio version uses seeded data and local deterministic logic. It does not require secrets to run.

## Secret Handling

- Do not commit API keys.
- Use `.env.local` for local secrets.
- Use platform-managed environment variables for production.
- Only env var names should appear in scanner or docs output.

## Privacy

Do not upload real client, student, participant, health, legal, or donor records to the public demo. Replace sensitive fields with mock data before testing.

## Human Review

Generated outputs should remain in review mode until a human approves them.
