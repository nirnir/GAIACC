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

const baseFilterOptions = {
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

const filterLabels = {
  status: "Status",
  businessUnit: "Business unit",
  risk: "Risk level",
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  renderFilters();
  renderOverview();
  renderModule();
  wireNavigation();
  wirePerspectives();
}

function getFilterOptions() {
  const businessUnits = Array.from(new Set(agents.map((agent) => agent.businessUnit)))
    .sort((a, b) => a.localeCompare(b));

  return {
    ...baseFilterOptions,
    businessUnit: [
      { label: "All business units", value: "all" },
      ...businessUnits.map((unit) => ({ label: unit, value: unit })),
    ],
  };
}

function renderFilters() {
  const container = document.getElementById("filter-panel");
  if (!container) return;
  const options = getFilterOptions();

  container.innerHTML = "";
  Object.entries(state.filters).forEach(([key, value]) => {
    const wrapper = document.createElement("div");
    wrapper.className = "filter";

    const label = document.createElement("label");
    label.setAttribute("for", `filter-${key}`);
    label.textContent = filterLabels[key] ?? key;

    const select = document.createElement("select");
    select.id = `filter-${key}`;
    select.value = value;
    (options[key] ?? []).forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.label;
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      state.filters[key] = select.value;
      renderModule();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    container.appendChild(wrapper);
  });
}

function renderOverview() {
  const container = document.getElementById("overview-metrics");
  if (!container) return;

  const metrics = insights[state.perspective] ?? [];
  container.innerHTML = "";

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

  syncPerspectiveButtons();
}

function renderModule() {
  const title = document.getElementById("module-title");
  const subtitle = document.getElementById("module-subtitle");
  const container = document.getElementById("module-container");
  if (!container) return;

  const moduleCopy = copy[state.module];
  if (title && moduleCopy) title.textContent = moduleCopy.title;
  if (subtitle && moduleCopy) subtitle.textContent = moduleCopy.subtitle;

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
    default:
      container.textContent = "Module not available.";
  }

  syncNavigation();
}

function renderInventoryModule(root) {
  const filteredAgents = agents.filter((agent) => {
    const statusMatch =
      state.filters.status === "all" || agent.status === state.filters.status;
    const riskMatch =
      state.filters.risk === "all" || agent.riskLevel === state.filters.risk;
    const businessUnitMatch =
      state.filters.businessUnit === "all" || agent.businessUnit === state.filters.businessUnit;
    return statusMatch && riskMatch && businessUnitMatch;
  });

  const overview = document.createElement("section");
  overview.className = "inventory-overview";

  overview.appendChild(buildInventoryHeader(filteredAgents.length));
  overview.appendChild(buildInventorySummary(filteredAgents));

  if (!filteredAgents.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No agents match the selected filters.";
    overview.appendChild(empty);
  } else {
    overview.appendChild(buildInventoryBoard(filteredAgents));
  }

  root.appendChild(overview);
}

function buildInventoryHeader(agentCount) {
  const header = document.createElement("header");

  const copyBlock = document.createElement("div");
  copyBlock.innerHTML = `
    <h3>Operational snapshot</h3>
    <p class="muted">Live signals flowing into mission control.</p>
  `;

  const pillTray = document.createElement("div");
  pillTray.className = "inventory-pills";

  telemetry.forEach((line, index) => {
    const pill = document.createElement("span");
    pill.className = `status-pill ${index % 3 === 0 ? "green" : index % 3 === 1 ? "orange" : "red"}`;
    pill.textContent = line;
    pillTray.appendChild(pill);
  });

  const total = document.createElement("span");
  total.className = "status-pill green";
  total.textContent = `${agentCount} agents in view`;
  pillTray.appendChild(total);

  header.appendChild(copyBlock);
  header.appendChild(pillTray);
  return header;
}

function buildInventorySummary(filteredAgents) {
  const summary = document.createElement("div");
  summary.className = "inventory-summary";

  const totalAgents = filteredAgents.length;
  const activeAgents = filteredAgents.filter((agent) => agent.status === "active").length;
  const pausedAgents = filteredAgents.filter((agent) => agent.status === "paused").length;
  const failedAgents = filteredAgents.filter((agent) => agent.status === "failed").length;

  const averageSuccess =
    totalAgents === 0
      ? 0
      : filteredAgents.reduce((acc, agent) => acc + agent.successRate, 0) / totalAgents;
  const averageAutomation =
    totalAgents === 0
      ? 0
      : filteredAgents.reduce((acc, agent) => acc + agent.automationRate, 0) / totalAgents;
  const averageLatency =
    totalAgents === 0
      ? 0
      : filteredAgents.reduce((acc, agent) => acc + agent.avgLatency, 0) / totalAgents;

  const cards = [
    { label: "Total agents", value: totalAgents.toString() },
    { label: "Active", value: activeAgents.toString() },
    { label: "Paused", value: pausedAgents.toString() },
    { label: "Failed", value: failedAgents.toString() },
    { label: "Avg success", value: `${Math.round(averageSuccess * 100)}%` },
    { label: "Avg automation", value: `${Math.round(averageAutomation * 100)}%` },
    { label: "Avg latency", value: `${averageLatency.toFixed(1)}s` },
  ];

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <span>${card.label}</span>
      <strong>${card.value}</strong>
    `;
    summary.appendChild(article);
  });

  return summary;
}

function buildInventoryBoard(filteredAgents) {
  const board = document.createElement("div");
  board.className = "inventory-board";

  const laneConfig = [
    { key: "active", label: "Active", accent: "green" },
    { key: "paused", label: "Paused", accent: "orange" },
    { key: "failed", label: "Needs attention", accent: "red" },
  ];

  const coveredStatuses = new Set(laneConfig.map((lane) => lane.key));
  const additionalStatuses = Array.from(
    new Set(filteredAgents.map((agent) => agent.status).filter((status) => !coveredStatuses.has(status)))
  );

  additionalStatuses.forEach((status) => {
    laneConfig.push({ key: status, label: status.replace(/\b\w/g, (c) => c.toUpperCase()), accent: "slate" });
  });

  laneConfig.forEach((lane) => {
    const laneRoot = document.createElement("section");
    laneRoot.className = `inventory-lane accent-${lane.accent}`;

    const header = document.createElement("header");
    header.innerHTML = `
      <h4>${lane.label}</h4>
      <span class="lane-count">${filteredAgents.filter((agent) => agent.status === lane.key).length}</span>
    `;

    const body = document.createElement("div");
    body.className = "lane-body";

    const agentsInLane = filteredAgents.filter((agent) => agent.status === lane.key);
    if (!agentsInLane.length) {
      body.classList.add("empty");
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No agents in this lane.";
      body.appendChild(empty);
    } else {
      agentsInLane.forEach((agent) => {
        body.appendChild(buildAgentTile(agent));
      });
    }

    laneRoot.appendChild(header);
    laneRoot.appendChild(body);
    board.appendChild(laneRoot);
  });

  return board;
}

function buildAgentTile(agent) {
  const tile = document.createElement("article");
  tile.className = "agent-tile";
  tile.tabIndex = 0;
  tile.setAttribute("role", "link");
  tile.setAttribute("aria-label", `Open ${agent.name}`);

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  titleBlock.innerHTML = `
    <h5>${agent.name}</h5>
    <p>${agent.id} · ${agent.businessUnit}</p>
  `;

  const statusPill = document.createElement("span");
  statusPill.className = `status-pill ${statusToColor(agent.status)}`;
  statusPill.textContent = agent.status.toUpperCase();

  header.appendChild(titleBlock);
  header.appendChild(statusPill);

  const metrics = document.createElement("div");
  metrics.className = "tile-metrics";
  [
    { label: "Success", value: `${Math.round(agent.successRate * 100)}%` },
    { label: "Automation", value: `${Math.round(agent.automationRate * 100)}%` },
    { label: "Latency", value: `${agent.avgLatency.toFixed(1)}s` },
  ].forEach((metric) => {
    const metricEl = document.createElement("div");
    metricEl.innerHTML = `
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
    `;
    metrics.appendChild(metricEl);
  });

  const footer = document.createElement("footer");
  footer.innerHTML = `
    <span class="muted">Owner: ${agent.owner}</span>
    <a class="ghost-btn" href="agent.html?id=${encodeURIComponent(agent.id)}">Open</a>
  `;

  tile.appendChild(header);
  tile.appendChild(metrics);
  tile.appendChild(footer);

  tile.addEventListener("click", () => {
    window.location.href = `agent.html?id=${encodeURIComponent(agent.id)}`;
  });

  tile.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = `agent.html?id=${encodeURIComponent(agent.id)}`;
    }
  });

  return tile;
}

function renderHitlModule(root) {
  const layout = document.createElement("div");
  layout.className = "queue-layout";

  const laneMap = [
    { key: "pending", label: "Pending" },
    { key: "investigating", label: "Investigating" },
    { key: "escalated", label: "Escalated" },
    { key: "completed", label: "Completed" },
  ];

  laneMap.forEach((lane) => {
    const column = document.createElement("section");
    column.className = "queue-column";

    const header = document.createElement("header");
    const items = actionQueue.filter((item) => item.status === lane.key);
    header.innerHTML = `
      <span>${lane.label}</span>
      <span class="queue-count">${items.length}</span>
    `;

    column.appendChild(header);

    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Queue clear.";
      column.appendChild(empty);
    } else {
      items.forEach((item) => column.appendChild(buildQueueCard(item)));
    }

    layout.appendChild(column);
  });

  root.appendChild(layout);
}

function buildQueueCard(item) {
  const card = document.createElement("article");
  card.className = "queue-card";
  card.innerHTML = `
    <header>
      <div>
        <h3 class="queue-title">${item.title}</h3>
        <p class="queue-meta">${item.workflow} • ${item.businessUnit}</p>
      </div>
      <div>
        <span class="status-pill ${statusToColor(item.status)}">${item.status.toUpperCase()}</span>
        <span class="queue-sla">SLA ${item.sla}</span>
      </div>
    </header>
    <p class="queue-description">${item.summary}</p>
    <footer>
      <button class="ghost-btn resolve-btn" type="button">Resolve</button>
      <button class="ghost-btn escalate-btn" type="button">Escalate</button>
    </footer>
  `;
  return card;
}

function renderInsightsModule(root) {
  const wrapper = document.createElement("section");
  wrapper.className = "recommendations";

  if (!recommendations.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No active recommendations.";
    wrapper.appendChild(empty);
  } else {
    recommendations.forEach((item) => {
      const card = document.createElement("article");
      card.className = "recommendation";
      card.innerHTML = `
        <strong>${item.title}</strong>
        <p>${item.rationale}</p>
        <footer>
          <span>${item.impact}</span>
          <span>Owner: ${item.owner}</span>
          <span>${item.due}</span>
        </footer>
      `;
      wrapper.appendChild(card);
    });
  }

  root.appendChild(wrapper);
}

function renderGovernanceModule(root) {
  const grid = document.createElement("div");
  grid.className = "policy-grid";

  if (!policies.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No policies registered.";
    root.appendChild(empty);
    return;
  }

  policies.forEach((policy) => {
    const card = document.createElement("article");
    card.className = "policy-card";
    card.innerHTML = `
      <header>
        <div>
          <h4>${policy.name}</h4>
          <span class="muted">Coverage: ${policy.coverage}</span>
        </div>
        <span class="status-pill ${statusToColor(policy.status)}">${policy.status.toUpperCase()}</span>
      </header>
      <p>${policy.description}</p>
      <footer class="muted">Last audit ${policy.lastAudit}</footer>
    `;
    grid.appendChild(card);
  });

  root.appendChild(grid);
}

function renderOptimizationModule(root) {
  const list = document.createElement("div");
  list.className = "experiment-list";

  if (!experiments.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No experiments running.";
    root.appendChild(empty);
    return;
  }

  experiments.forEach((experiment) => {
    const card = document.createElement("article");
    card.className = "experiment";
    card.innerHTML = `
      <h4>${experiment.name}</h4>
      <p class="muted">${experiment.detail}</p>
      <div class="experiment-meta">
        <span class="status-pill ${statusToColor(experiment.status)}">${experiment.status.toUpperCase()}</span>
        <div class="progress" role="progressbar" aria-valuenow="${experiment.completion}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${experiment.completion}%"></div>
        </div>
        <span class="muted">${experiment.completion}% complete</span>
      </div>
    `;
    list.appendChild(card);
  });

  root.appendChild(list);
}

function wireNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const module = item.dataset.module;
      if (!module || module === state.module) return;
      state.module = module;
      renderModule();
    });
  });
}

function wirePerspectives() {
  const buttons = document.querySelectorAll(".toggle-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const perspective = button.dataset.perspective;
      if (!perspective || perspective === state.perspective) return;
      state.perspective = perspective;
      renderOverview();
      renderModule();
    });
  });
}

function syncNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.module === state.module);
  });
}

function syncPerspectiveButtons() {
  const buttons = document.querySelectorAll(".toggle-btn");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.perspective === state.perspective);
  });
}
