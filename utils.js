export function statusToColor(status) {
  switch (status) {
    case "active":
    case "running":
    case "completed":
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
    case "failed":
    case "escalated":
    case "red":
    case "critical":
      return "red";
    default:
      return "orange";
  }
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
