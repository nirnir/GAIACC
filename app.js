import {
  copy,
  agents,
  actionQueue,
  insights,
  recommendations,
  policies,
  experiments,
  agentCatalog,
} from "./data.js";
import { statusToColor } from "./utils.js";

const state = {
  module: "inventory",
  perspective: "ops",
  filters: {
    status: "all",
    businessUnit: "all",
    risk: "all",
  },
};

const telemetry = [
  "Ops | Supply Chain Navigator latency spike mitigated via cache warm-up.",
  "Security | AI Gateway policy drift resolved with auto-sync.",
  "Compliance | Generated audit evidence pack for GDPR controllers.",
  "Product | New agent templates published for Finance close workflows.",
];

const filterOptions = {
  status: [
    { label: "All statuses", value: "all" },
    { label: "Active", value: "active" },
    { label: "Paused", value: "paused" },
    { label: "Failed", value: "failed" },
  ],
  risk: [
    { label: "All risk", value: "all" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ],
};

function init() {
  renderFilters();
  renderOverview();
  renderModule();
  wireNavigation();
  wirePerspectives();
}

document.addEventListener("DOMContentLoaded", init);

function wireNavigation(
