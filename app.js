import {
  copy,
  agents,
  actionQueue,
  insights,
  recommendations,
  policies,
  experiments,
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

function wireNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.module === state.module) return;
      state.module = button.dataset.module;
      document
        .querySelectorAll(".nav-item")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      updateTopline();
      renderOverview();
      renderModule();
    });
  });
}

function wirePerspectives() {
  document.querySelectorAll(".toggle-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.perspective === state.perspective) return;
      state.perspective = button.dataset.perspective;
      document
        .querySelectorAll(".toggle-btn")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderOverview();
      renderModule();
    });
  });
}

function updateTopline() {
  const { title, subtitle } = copy[state.module];
  document.getElementById("module-title").textContent = title;
  document.getElementById("module-subtitle").textContent = subtitle;
}

function renderOverview() {
  const container = document.getElementById("overview-metrics");
  container.innerHTML = "";
  const metrics = insights[state.perspective];
  metrics.forEach((metric) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    card.innerHTML = `
      <h3>${metric.label}</h3>
      <strong>${metric.value}</strong>
      <span class="metric-trend">${metric.trend}</span>
    `;
    container.appendChild(card);
  });
}

function renderModule() {
  const container = document.getElementById("module-container");
  container.innerHTML = "";
  switch (state.module) {
    case "inventory":
      renderInventoryModule(container);
      break;
    case "hitl":
      renderHitlModule(container);
      break;
    case "insights":
      renderInsightsModule(container);
      break;
    case "governance":
      renderGovernanceModule(container);
      break;
    case "optimization":
      renderOptimizationModule(container);
      break;
  }
}

function renderFilters() {
  const panel = document.getElementById("filter-panel");
  const businessUnits = [
    { label: "All business units", value: "all" },
    ...Array.from(new Set(agents.map((agent) => agent.businessUnit))).map((unit) => ({
      label: unit,
      value: unit,
    })),
  ];

  panel.innerHTML = `
    <label class="filter">
      <span>Status</span>
      <select id="status-filter">
        ${filterOptions.status
          .map((option) => `<option value="${option.value}">${option.label}</option>`)
          .join("")}
      </select>
    </label>
    <label class="filter">
      <span>Business unit</span>
      <select id="bu-filter">
        ${businessUnits
          .map((option) => `<option value="${option.value}">${option.label}</option>`)
          .join("")}
      </select>
    </label>
    <label class="filter">
      <span>Risk</span>
      <select id="risk-filter">
        ${filterOptions.risk
          .map((option) => `<option value="${option.value}">${option.label}</option>`)
          .join("")}
      </select>
    </label>
  `;

  panel.querySelector("#status-filter").value = state.filters.status;
  panel.querySelector("#bu-filter").value = state.filters.businessUnit;
  panel.querySelector("#risk-filter").value = state.filters.risk;

  panel.querySelector("#status-filter").addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    renderModule();
  });

  panel.querySelector("#bu-filter").addEventListener("change", (event) => {
    state.filters.businessUnit = event.target.value;
    renderModule();
  });

  panel.querySelector("#risk-filter").addEventListener("change", (event) => {
    state.filters.risk = event.target.value;
    renderModule();
  });
}

function applyAgentFilters(list) {
  return list.filter((agent) => {
    const statusMatch =
      state.filters.status === "all" || agent.status === state.filters.status;
    const buMatch =
      state.filters.businessUnit === "all" || agent.businessUnit === state.filters.businessUnit;
    const riskMatch = state.filters.risk === "all" || agent.riskLevel === state.filters.risk;
    return statusMatch && buMatch && riskMatch;
  });
}

function renderInventoryModule(container) {
  const filteredAgents = applyAgentFilters(agents);

  const boardHeader = document.createElement("section");
  boardHeader.className = "inventory-overview";
  const total = filteredAgents.length;
  const activeCount = filteredAgents.filter((agent) => agent.status === "active").length;
  const pausedCount = filteredAgents.filter((agent) => agent.status === "paused").length;
  const failedCount = filteredAgents.filter((agent) => agent.status === "failed").length;
  const highRisk = filteredAgents.filter((agent) => agent.riskLevel === "high").length;

  boardHeader.innerHTML = `
    <header>
      <div>
        <h3>Agent Flight Deck</h3>
        <p class="muted">${total} agents match your filters. Grouped by operational status for fast triage.</p>
      </div>
      <div class="inventory-pills">
        <span class="status-pill green">${activeCount} Operational</span>
        <span class="status-pill orange">${pausedCount} Needs Attention</span>
        <span class="status-pill red">${failedCount} Offline</span>
      </div>
    </header>
    <div class="inventory-summary">
      <article>
        <span>Total Hours Returned</span>
        <strong>${filteredAgents
          .reduce((acc, agent) => acc + agent.hoursSaved, 0)
          .toLocaleString()}</strong>
      </article>
      <article>
        <span>Average Success Rate</span>
        <strong>${filteredAgents.length
          ? Math.round(
              (filteredAgents.reduce((acc, agent) => acc + agent.successRate, 0) /
                filteredAgents.length) *
                100
            )
          : 0}%</strong>
      </article>
      <article>
        <span>Average Automation</span>
        <strong>${filteredAgents.length
          ? Math.round(
              (filteredAgents.reduce((acc, agent) => acc + agent.automationRate, 0) /
                filteredAgents.length) *
                100
            )
          : 0}%</strong>
      </article>
      <article>
        <span>High Risk Agents</span>
        <strong>${highRisk}</strong>
      </article>
    </div>
  `;

  container.appendChild(boardHeader);

  const board = document.createElement("div");
  board.className = "inventory-board";

  const statusLaneMap = {
    active: "operational",
    running: "operational",
    paused: "attention",
    investigating: "attention",
    canary: "attention",
    failed: "offline",
    escalated: "offline",
  };

  const lanes = [
    {
      id: "operational",
      label: "Operational",
      caption: "Healthy throughput & within guardrails.",
      accent: "green",
    },
    {
      id: "attention",
      label: "Needs Attention",
      caption: "Guardrails warming or latency drift detected.",
      accent: "orange",
    },
    {
      id: "offline",
      label: "Offline / Failed",
      caption: "HITL or restart required before resuming.",
      accent: "red",
    },
    {
      id: "other",
      label: "Other States",
      caption: "Queued for deployment or waiting on signal.",
      accent: "slate",
    },
  ];

  lanes.forEach((lane) => {
    const column = document.createElement("section");
    column.className = `inventory-lane accent-${lane.accent}`;
    const laneAgents = filteredAgents.filter((agent) => {
      const mapped = statusLaneMap[agent.status] ?? "other";
      return mapped === lane.id;
    });

    column.innerHTML = `
      <header>
        <div>
          <h4>${lane.label}</h4>
          <p class="muted">${lane.caption}</p>
        </div>
        <span class="lane-count">${laneAgents.length}</span>
      </header>
      <div class="lane-body ${laneAgents.length ? "" : "empty"}"></div>
    `;

    const body = column.querySelector(".lane-body");

    if (!laneAgents.length) {
      body.innerHTML = `<p class="muted">No agents in this lane.</p>`;
    } else {
      laneAgents.forEach((agent) => body.appendChild(buildAgentTile(agent)));
    }

    board.appendChild(column);
  });

  container.appendChild(board);
}

function buildAgentTile(agent) {
  const card = document.createElement("article");
  card.className = `agent-tile risk-${agent.riskLevel}`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.innerHTML = `
    <header>
      <div>
        <h5>${agent.name}</h5>
        <p class="muted">${agent.id} · ${agent.businessUnit}</p>
      </div>
      <span class="status-pill ${statusToColor(agent.status)}">${agent.status.toUpperCase()}</span>
    </header>
    <div class="tile-metrics">
      <div>
        <span>Success</span>
        <strong>${Math.round(agent.successRate * 100)}%</strong>
      </div>
      <div>
        <span>Automation</span>
        <strong>${Math.round(agent.automationRate * 100)}%</strong>
      </div>
      <div>
        <span>Latency</span>
        <strong>${agent.avgLatency}s</strong>
      </div>
    </div>
    <footer>
      <span class="risk-chip risk-${agent.riskLevel}">Risk: ${agent.riskLevel.toUpperCase()}</span>
      <button class="ghost-btn tile-open" type="button">Open Agent</button>
    </footer>
  `;

  const openAgent = () => {
    window.location.href = `agent.html?id=${encodeURIComponent(agent.id)}`;
  };

  card.querySelector(".tile-open").addEventListener("click", (event) => {
    event.stopPropagation();
    openAgent();
  });

  card.addEventListener("click", openAgent);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAgent();
    }
  });

  return card;
}

function renderHitlModule(container) {
  const columns = [
    { key: "pending", label: "Action Required", color: "orange" },
    { key: "investigating", label: "Investigating", color: "orange" },
    { key: "escalated", label: "Escalated", color: "red" },
    { key: "completed", label: "Resolved", color: "green" },
  ];

  const layout = document.createElement("div");
  layout.className = "queue-layout";

  columns.forEach((column) => {
    const col = document.createElement("section");
    col.className = "queue-column";
    const items = actionQueue.filter((item) => item.status === column.key);
    col.innerHTML = `
      <header>
        <span>${column.label}</span>
        <span class="status-pill ${column.color}">${items.length}</span>
      </header>
      <div class="queue-items"></div>
    `;

    const list = col.querySelector(".queue-items");
    items.forEach((item) => list.appendChild(buildQueueCard(item)));
    layout.appendChild(col);
  });

  container.appendChild(layout);
}

function buildQueueCard(item) {
  const template = document.getElementById("queue-card-template");
  const node = template.content.cloneNode(true);
  node.querySelector(".queue-title").textContent = `${item.id} · ${item.title}`;
  node.querySelector(
    ".queue-meta"
  ).textContent = `${item.workflow} • ${item.businessUnit} • ${item.urgency.toUpperCase()}`;
  node.querySelector(".queue-description").textContent = item.summary;
  node.querySelector(".queue-sla").textContent = item.sla === "--" ? "SLA Met" : `SLA ${item.sla}`;

  node.querySelector(".resolve-btn").addEventListener("click", () => {
    transitionQueueItem(item.id, "completed");
  });

  node.querySelector(".escalate-btn").addEventListener("click", () => {
    transitionQueueItem(item.id, "escalated");
  });

  return node;
}

function transitionQueueItem(id, nextStatus) {
  const record = actionQueue.find((item) => item.id === id);
  if (!record) return;
  record.status = nextStatus;
  renderModule();
}

function renderInsightsModule(container) {
  const section = document.createElement("div");
  section.className = "detail-panel";
  section.innerHTML = `
    <section class="detail-card">
      <h3>Outcome-Centric KPIs</h3>
      <p class="muted">Align agent performance to business value and adoption.</p>
      <div class="detail-grid">
        ${insights.exec
          .map(
            (item) => `
              <div>
                <span>${item.label}</span>
                <strong>${item.value}</strong>
                <span class="metric-trend">${item.trend}</span>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
    <aside class="detail-card">
      <h3>Operational Signals</h3>
      <div class="timeline">
        ${telemetry.map((item) => `<div class="timeline-item">${item}</div>`).join("")}
      </div>
    </aside>
  `;
  container.appendChild(section);

  const outcomes = document.createElement("section");
  outcomes.className = "detail-card";
  outcomes.innerHTML = `
    <h3>Runs → Tasks → Impact</h3>
    <p class="muted">Trace production runs to downstream metrics in a single view.</p>
    <div class="detail-grid">
      <div>
        <span>Runs (24h)</span>
        <strong>12,480</strong>
        <span class="metric-trend">+14% vs baseline</span>
      </div>
      <div>
        <span>Tasks Automated</span>
        <strong>9,721</strong>
        <span class="metric-trend">82% autonomous</span>
      </div>
      <div>
        <span>Human Hand-offs</span>
        <strong>1,460</strong>
        <span class="metric-trend">-9% escalations</span>
      </div>
      <div>
        <span>Business Impact</span>
        <strong>$2.4M value</strong>
        <span class="metric-trend">ROI calculator refreshed hourly</span>
      </div>
    </div>
  `;
  container.appendChild(outcomes);
}

function renderGovernanceModule(container) {
  const grid = document.createElement("div");
  grid.className = "policy-grid";
  policies.forEach((policy) => {
    const card = document.createElement("article");
    card.className = "policy-card";
    card.innerHTML = `
      <header>
        <div>
          <strong>${policy.name}</strong>
          <p class="muted">${policy.coverage}</p>
        </div>
        <span class="status-pill ${statusToColor(policy.status)}">${policy.status.toUpperCase()}</span>
      </header>
      <p>${policy.description}</p>
      <footer class="muted">Last audit ${policy.lastAudit}</footer>
    `;
    grid.appendChild(card);
  });

  const evidence = document.createElement("section");
  evidence.className = "detail-card";
  evidence.innerHTML = `
    <h3>Audit Evidence Packs</h3>
    <p class="muted">Compile proof for GDPR, CCPA, HIPAA with one click.</p>
    <div class="badge-grid">
      <span class="chip">GDPR Controllers</span>
      <span class="chip">CCPA Processors</span>
      <span class="chip">HIPAA BAA</span>
      <span class="chip">AI Act Tier 2</span>
    </div>
  `;

  container.appendChild(grid);
  container.appendChild(evidence);
}

function renderOptimizationModule(container) {
  const recs = document.createElement("section");
  recs.className = "detail-card";
  recs.innerHTML = `
    <h3>Live Recommendations</h3>
    <p class="muted">Balance quality, latency, and cost per agent.</p>
    <div class="recommendations">
      ${recommendations
        .map(
          (item) => `
            <div class="recommendation">
              <strong>${item.title}</strong>
              <p>${item.rationale}</p>
              <footer>
                <span>${item.owner}</span>
                <span>${item.impact}</span>
                <span>${item.due}</span>
              </footer>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  const experimentsCard = document.createElement("section");
  experimentsCard.className = "detail-card";
  experimentsCard.innerHTML = `
    <h3>Experiments &amp; Rollouts</h3>
    <p class="muted">Track A/B tests, canaries, and model swaps in one place.</p>
    <div class="experiment-list">
      ${experiments
        .map(
          (experiment) => `
            <div class="experiment">
              <div>
                <strong>${experiment.name}</strong>
                <p class="muted">${experiment.detail}</p>
              </div>
              <div class="experiment-meta">
                <span class="status-pill ${statusToColor(experiment.status.toLowerCase())}">${experiment.status}</span>
                <div class="progress">
                  <div class="progress-bar" style="width: ${experiment.completion}%"></div>
                </div>
                <span class="muted">${experiment.completion}%</span>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  container.appendChild(recs);
  container.appendChild(experimentsCard);
}

// Style hooks for generated content
const style = document.createElement("style");
style.textContent = `
  .muted { color: var(--text-muted); }
  .detail-card.nested { background: var(--surface-alt); border-style: dashed; border-color: rgba(37, 99, 235, 0.2); }
  .detail-switcher { display: flex; gap: 8px; flex-wrap: wrap; }
  .detail-switcher .ghost-btn.active { background: rgba(37, 99, 235, 0.16); color: var(--text-primary); }
  .detail-card strong { display: block; font-size: 1.15rem; }
  .section-header { display: flex; justify-content: space-between; align-items: baseline; }
  .section-header h3 { margin: 0; }
  .experiment-list { display: grid; gap: 16px; }
  .experiment { display: grid; gap: 10px; background: var(--surface-alt); border: 1px solid rgba(37, 99, 235, 0.14); padding: 16px; border-radius: var(--radius-md); }
  .experiment-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .progress { flex: 1; height: 6px; border-radius: 999px; background: rgba(37, 99, 235, 0.12); overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, rgba(37, 99, 235, 0.8), rgba(59, 130, 246, 0.9)); }
  .agent-tile:hover, .agent-tile:focus-within { outline: 1px solid rgba(37, 99, 235, 0.35); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
  #filter-panel { display: grid; gap: 12px; }
  .filter { display: grid; gap: 6px; font-size: 0.85rem; color: var(--text-muted); }
  .filter select { background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--radius-sm); padding: 8px; color: var(--text-primary); }
`;
document.head.appendChild(style);
