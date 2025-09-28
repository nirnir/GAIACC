export function statusToColor(status) {
  const normalized = (status ?? "")
    .toString()
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "active":
    case "running":
    case "completed":
    case "complete":
    case "resolved":
    case "green":
      return "green";
    case "paused":
    case "canary":
    case "design":
    case "investigating":
    case "pending":
    case "orange":
      return "orange";
    case "requires attention":
    case "requires-attention":
    case "awaiting input":
    case "awaiting-input":
    case "escalated":
    case "error":
    case "failed":
    case "red":
    case "critical":
      return "red";
    default:
      return "orange";
  }
}

export function categorizeWorkflowStatus(status) {
  const normalized = (status ?? "")
    .toString()
    .trim()
    .toLowerCase();

  if (normalized === "running" || normalized === "active") return "running";
  if (normalized === "paused") return "paused";
  if (normalized.startsWith("complete")) return "completed";
  if (normalized === "requires attention" || normalized === "requires-attention")
    return "requires-attention";
  if (
    normalized === "awaiting input" ||
    normalized === "awaiting-input" ||
    normalized === "escalated" ||
    normalized === "error" ||
    normalized === "failed"
  )
    return "requires-attention";
  return "requires-attention";
}

export function formatTriggerLabel(trigger) {
  if (!trigger) return "—";
  if (typeof trigger === "string") return trigger;
  return trigger.label ?? trigger.type ?? "—";
}

export function formatRunCadenceValue(workflow) {
  if (!workflow || !workflow.runTime) return "—";
  const descriptor = workflow.runTime.descriptor ? ` ${workflow.runTime.descriptor}` : "";
  return `${workflow.runTime.value}${descriptor}`;
}

export function guardrailCopy(status) {
  switch (status) {
    case "green":
      return "Operating within expected thresholds.";
    case "orange":
      return "Degradation detected. Review evaluation notebook.";
    case "red":
      return "Policy violation. HITL approval required before restart.";
    default:
      return "Monitoring.";
  }
}
