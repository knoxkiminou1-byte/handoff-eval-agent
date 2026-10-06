export function requireEvidence(record: { status?: string; evidence?: string }) {
  if (["OWED", "EXPECTED", "OVERDUE"].includes(record.status || "") && !String(record.evidence || "").trim()) {
    return "evidence required";
  }
  return "";
}
