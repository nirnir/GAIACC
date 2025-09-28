import {
  copy,
  agentCatalog,
  actionQueue,
  insights,
  recommendations,
  policies,
  experiments,
  workflows,
} from "./data.js";
import {
  statusToColor,
  categorizeWorkflowStatus,
  formatTriggerLabel,
  formatRunCadenceValue,
} from "./utils.js";

const state = {
  module: "inventory",
  perspective: "ops",
  filters: {
    status: "all",
  },
};

const telemetry = [
  "Ops | Supply Chain Navigator latency spike mitigated via cache warm-up.",
  "Security | AI Gateway policy drift resolved with auto-sync.",
  "Compliance | Generated audit evidence pack for GDPR controllers.",
  "Product | New agent templates published for Finance close workflows.",
];

const WORKFLOW_LANES = [
  { key: "running", label: "Running", accent: "green" },
  { key: "paused", label: "Paused", accent: "orange" },
  { key: "requires-attention", label: "Requires Attention", accent: "red" },
  { key: "completed", label: "Completed", accent: "slate" },
];

const LANE_CARD_LIMITS = {
  min: 2,
  max: 4,
};

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const createBadge = (label, className) =>
  `<span class="catalog-badge ${className}">${label}</span>`;

const statusBadge = (status) => createBadge(status, `status-${slugify(status)}`);

const domainBadge = (domain) => createBadge(domain, `domain-${slugify(domain)}`);

const ownerBadge = (owner) => createBadge(owner, `owner-${slugify(owner)}`);

const buildDomainOwnerCell = (domain, owner) => {
  const badges = [domainBadge(domain)];
  if (owner && owner !== domain) {
    badges.push(ownerBadge(owner));
  }
  return badges.join(" ");
};

const triggerBadge = (trigger) => {
  if (!trigger) return "";
  if (typeof trigger === "string") {
    return createBadge(trigger, `trigger-${slugify(trigger)}`);
  }
  const type = trigger.type ? slugify(trigger.type) : slugify(trigger.label ?? "");
  const label = trigger.label ?? trigger.type ?? "";
  return createBadge(label, `trigger-${type}`);
};

const personaBadge = (persona) => createBadge(persona, `persona-${slugify(persona)}`);

const createMetricPill = (value, label) =>
  `<span class="metric-pill"><strong>${value}</strong>${label ? `<span>${label}</span>` : ""}</span>`;

const createTimestamp = (text) => `<span class="timestamp-text">${text}</span>`;

const createAdoptionBadge = (value) => {
  const tier = value >= 75 ? "high" : value >= 55 ? "medium" : "low";
  return `<span class="catalog-badge adoption-${tier}">${value}%</span>`;
};

const baseFilterOptions = {
  status: [
    { label: "All statuses", value: "all" },
    { label: "Running", value: "running" },
    { label: "Paused", value: "paused" },
    { label: "Requires Attention", value: "requires-attention" },
    { label: "Completed", value: "completed" },
  ],
};

const filterLabels = {
  status: "Status",
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
  return baseFilterOptions;
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
  const filteredWorkflows = workflows.filter((workflow) => {
    const laneKey = categorizeWorkflowStatus(workflow.status);
    return state.filters.status === "all" || laneKey === state.filters.status;
  });

  const overview = document.createElement("section");
  overview.className = "inventory-overview";

  overview.appendChild(buildInventoryHeader(filteredWorkflows.length));
  overview.appendChild(buildInventorySummary(filteredWorkflows));

  if (!filteredWorkflows.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No workflows match the selected filters.";
    overview.appendChild(empty);
  } else {
    overview.appendChild(buildInventoryBoard(filteredWorkflows));
  }

  root.appendChild(overview);

  const catalogSection = buildAgentCatalogSection();
  root.appendChild(catalogSection);
}

function buildAgentCatalogSection() {
  const section = document.createElement("section");
  section.className = "agent-catalog";

  const heading = document.createElement("header");
  heading.className = "catalog-header";
  heading.innerHTML = `
    <h3>Agent Catalog</h3>
    <p class="muted">A quick reference for automated workflows and assisted copilots available across the enterprise.</p>
  `;
  section.appendChild(heading);

  const catalogGroups = [
    {
      title: "Automated Agentic AI Workflows",
      description: "Hands-off automations operating within guardrails.",
      entries: agentCatalog.automated,
      variant: "automated",
    },
    {
      title: "Assisted Agentic AI (Copilot / Human-in-the-Loop)",
      description: "Embedded copilots that support teams with insights and recommendations.",
      entries: agentCatalog.assisted,
      variant: "assisted",
    },
  ];

  catalogGroups.forEach((group) => {
    const groupSection = document.createElement("section");
    groupSection.className = "catalog-group";

    const groupHeader = document.createElement("header");
    groupHeader.innerHTML = `
      <h4>${group.title}</h4>
      <p class="muted">${group.description}</p>
    `;
    groupSection.appendChild(groupHeader);

    const tableWrapper = document.createElement("div");
    tableWrapper.className = "catalog-table-wrapper";

    const table = document.createElement("table");
    table.className = `catalog-table catalog-table--${group.variant}`;

    if (group.variant === "automated") {
      table.innerHTML = `
        <thead>
          <tr>
            <th scope="col">Workflow ID / Name</th>
            <th scope="col">Domain / Owner</th>
            <th scope="col">Status</th>
            <th scope="col">Trigger Type</th>
            <th scope="col">Run Time</th>
            <th scope="col">Next Scheduled Run</th>
            <th scope="col">Last Execution Timestamp</th>
          </tr>
        </thead>
      `;
    } else {
      table.innerHTML = `
        <thead>
          <tr>
            <th scope="col">Workflow ID / Name</th>
            <th scope="col">Monthly Active Users (MAU)</th>
            <th scope="col">Adoption %</th>
            <th scope="col">User Role / Persona</th>
            <th scope="col">Domain / Owner</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
      `;
    }

    const tbody = document.createElement("tbody");

    group.entries.forEach((entry) => {
      const row = document.createElement("tr");
      if (group.variant === "automated") {
        row.innerHTML = `
          <th scope="row">
            <div class="workflow-cell">
              <span class="workflow-id">${entry.id}</span>
              <a class="workflow-link workflow-name" href="workflow.html?id=${encodeURIComponent(entry.id)}">${entry.name}</a>
            </div>
          </th>
          <td data-label="Domain / Owner">
            <div class="badge-stack">${buildDomainOwnerCell(entry.domain, entry.owner)}</div>
          </td>
          <td data-label="Status">${statusBadge(entry.status)}</td>
          <td data-label="Trigger Type">${triggerBadge(entry.trigger)}</td>
          <td data-label="Run Time">${createMetricPill(
            entry.runTime.value,
            entry.runTime.descriptor
          )}</td>
          <td data-label="Next Scheduled Run">${createTimestamp(entry.nextRun)}</td>
          <td data-label="Last Execution Timestamp">${createTimestamp(entry.lastRun)}</td>
        `;
      } else {
        const mau = entry.mau.toLocaleString("en-US");
        row.innerHTML = `
          <th scope="row">
            <div class="workflow-cell">
              <span class="workflow-id">${entry.id}</span>
              <a class="workflow-link workflow-name" href="workflow.html?id=${encodeURIComponent(entry.id)}">${entry.name}</a>
            </div>
          </th>
          <td data-label="Monthly Active Users (MAU)">${createMetricPill(mau, "users")}</td>
          <td data-label="Adoption %">${createAdoptionBadge(entry.adoption)}</td>
          <td data-label="User Role / Persona">${personaBadge(entry.persona)}</td>
          <td data-label="Domain / Owner">
            <div class="badge-stack">${buildDomainOwnerCell(entry.domain, entry.owner)}</div>
          </td>
          <td data-label="Status">${statusBadge(entry.status)}</td>
        `;
      }
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    groupSection.appendChild(tableWrapper);
    section.appendChild(groupSection);
  });

  return section;
}

function buildInventoryHeader(workflowCount) {
  const header = document.createElement("header");

  const copyBlock = document.createElement("div");
  copyBlock.innerHTML = `
    <h3>Operational snapshot</h3>
    <p class="muted">Live signals from automated and assisted workflows.</p>
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
  total.textContent = `${workflowCount} workflows in view`;
  pillTray.appendChild(total);

  header.appendChild(copyBlock);
  header.appendChild(pillTray);
  return header;
}

function buildInventorySummary(filteredWorkflows) {
  const summary = document.createElement("div");
  summary.className = "inventory-summary";

  const totalWorkflows = filteredWorkflows.length;
  const countsByLane = WORKFLOW_LANES.reduce((acc, lane) => {
    acc[lane.key] = filteredWorkflows.filter(
      (workflow) => categorizeWorkflowStatus(workflow.status) === lane.key
    ).length;
    return acc;
  }, {});

  const automatedCount = filteredWorkflows.filter((workflow) => workflow.type === "Automated").length;
  const assistedCount = filteredWorkflows.filter((workflow) => workflow.type === "Assisted").length;

  const cards = [
    { label: "Total workflows", value: totalWorkflows.toString() },
    ...WORKFLOW_LANES.map((lane) => ({
      label: lane.label,
      value: (countsByLane[lane.key] ?? 0).toString(),
    })),
    { label: "Automated", value: automatedCount.toString() },
    { label: "Assisted", value: assistedCount.toString() },
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

function buildInventoryBoard(filteredWorkflows) {
  const board = document.createElement("div");
  board.className = "inventory-board";

  WORKFLOW_LANES.forEach((lane) => {
    const laneRoot = document.createElement("section");
    laneRoot.className = `inventory-lane accent-${lane.accent}`;

    const header = document.createElement("header");
    const workflowsInLane = filteredWorkflows.filter(
      (workflow) => categorizeWorkflowStatus(workflow.status) === lane.key
    );
    header.innerHTML = `
      <h4>${lane.label}</h4>
      <span class="lane-count">${workflowsInLane.length}</span>
    `;

    const body = document.createElement("div");
    body.className = "lane-body";

    const visibleWorkflows = workflowsInLane.slice(0, LANE_CARD_LIMITS.max);

    visibleWorkflows.forEach((workflow) => {
      body.appendChild(buildWorkflowTile(workflow));
    });

    const placeholdersNeeded = Math.max(
      0,
      LANE_CARD_LIMITS.min - visibleWorkflows.length
    );

    for (let index = 0; index < placeholdersNeeded; index += 1) {
      body.appendChild(buildWorkflowPlaceholderTile(lane));
    }

    const overflowCount = workflowsInLane.length - visibleWorkflows.length;
    if (overflowCount > 0) {
      body.appendChild(buildLaneOverflowNotice(overflowCount));
    }

    laneRoot.appendChild(header);
    laneRoot.appendChild(body);
    board.appendChild(laneRoot);
  });

  return board;
}

function buildWorkflowTile(workflow) {
  const tile = document.createElement("article");
  tile.className = "agent-tile workflow-tile";
  tile.tabIndex = 0;
  tile.setAttribute("role", "link");
  tile.setAttribute("aria-label", `Open ${workflow.name}`);

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  titleBlock.innerHTML = `
    <h5>${workflow.name}</h5>
    <p>${workflow.id} · ${workflow.type}</p>
  `;

  const statusPill = document.createElement("span");
  statusPill.className = `status-pill ${statusToColor(workflow.status)}`;
  statusPill.textContent = workflow.status.toUpperCase();

  header.appendChild(titleBlock);
  header.appendChild(statusPill);

  const metrics = document.createElement("div");
  metrics.className = "tile-metrics";

  const metricConfig =
    workflow.type === "Automated"
      ? [
          {
            label: "Run time",
            value: workflow.runTime
              ? `${workflow.runTime.value} ${workflow.runTime.descriptor ?? ""}`.trim()
              : "—",
          },
          { label: "Next run", value: workflow.nextRun ?? "—" },
          { label: "Last run", value: workflow.lastRun ?? "—" },
        ]
      : [
          {
            label: "Monthly users",
            value:
              workflow.mau !== undefined
                ? workflow.mau.toLocaleString("en-US")
                : "—",
          },
          {
            label: "Adoption",
            value:
              workflow.adoption !== undefined ? `${workflow.adoption}%` : "—",
          },
          { label: "Persona", value: workflow.persona ?? "—" },
        ];

  metricConfig.forEach((metric) => {
    const metricEl = document.createElement("div");
    metricEl.innerHTML = `
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
    `;
    metrics.appendChild(metricEl);
  });

  const footer = document.createElement("footer");
  footer.innerHTML = `
    <span class="muted">${workflow.domain} • ${workflow.owner}</span>
    <a class="ghost-btn" href="workflow.html?id=${encodeURIComponent(workflow.id)}">Open</a>
  `;

  tile.appendChild(header);
  tile.appendChild(metrics);
  tile.appendChild(footer);

  const openWorkflow = () => {
    window.location.href = `workflow.html?id=${encodeURIComponent(workflow.id)}`;
  };

  tile.addEventListener("click", openWorkflow);

  tile.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWorkflow();
    }
  });

  return tile;
}

function buildWorkflowPlaceholderTile(lane) {
  const placeholder = document.createElement("article");
  placeholder.className = "agent-tile workflow-tile workflow-placeholder";
  placeholder.tabIndex = -1;
  placeholder.setAttribute("aria-hidden", "true");
  placeholder.innerHTML = `
    <div class="placeholder-body">
      <span class="placeholder-label">${lane.label}</span>
      <strong>Slot available</strong>
      <p>Assign a workflow to balance load.</p>
    </div>
  `;
  return placeholder;
}

function buildLaneOverflowNotice(extraCount) {
  const notice = document.createElement("div");
  notice.className = "lane-overflow";
  notice.textContent = `+${extraCount} more workflow${extraCount > 1 ? "s" : ""}`;
  return notice;
}

function renderHitlModule(root) {
  const layout = document.createElement("div");
  layout.className = "queue-layout hitl-workflow-layout";

  const laneMap = [
    { key: "pending", label: "Pending review" },
    { key: "investigating", label: "Investigating" },
    { key: "escalated", label: "Escalated" },
    { key: "completed", label: "Completed" },
  ];

  laneMap.forEach((lane) => {
    const column = document.createElement("section");
    column.className = "queue-column";

    const items = actionQueue.filter((item) => item.status === lane.key);
    column.innerHTML = `
      <header>
        <span>${lane.label}</span>
        <span class="queue-count">${items.length}</span>
      </header>
    `;

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
  const workflow = workflows.find((wf) => wf.id === item.workflowId);
  const card = document.createElement("article");
  card.className = "queue-card hitl-workflow-card";

  if (workflow) {
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Open ${workflow.name} workflow details`);
  }

  const workflowStatus = workflow?.status ?? item.status;
  const metrics = [];

  if (workflow) {
    if (workflow.type === "Automated") {
      metrics.push(
        { label: "Trigger", value: formatTriggerLabel(workflow.trigger) },
        { label: "Cadence", value: formatRunCadenceValue(workflow) },
        { label: "Next run", value: workflow.nextRun ?? "—" }
      );
    } else {
      metrics.push(
        {
          label: "Monthly users",
          value:
            workflow.mau !== undefined
              ? workflow.mau.toLocaleString("en-US")
              : "—",
        },
        {
          label: "Adoption",
          value:
            workflow.adoption !== undefined ? `${workflow.adoption}%` : "—",
        },
        { label: "Persona", value: workflow.persona ?? "—" }
      );
    }
  }

  card.innerHTML = `
    <header>
      <div>
        <h3 class="queue-title">
          ${
            workflow
              ? `<a class="workflow-link" href="workflow.html?id=${encodeURIComponent(
                  workflow.id
                )}">${workflow.name}</a>`
              : item.title
          }
        </h3>
        <p class="queue-meta">
          ${workflow ? `${workflow.id} • ${workflow.type}` : item.workflow}
        </p>
      </div>
      <div class="queue-status-group">
        <span class="status-pill ${statusToColor(workflowStatus)}">${workflowStatus.toUpperCase()}</span>
        <span class="queue-sla">SLA ${item.sla}</span>
      </div>
    </header>
    <p class="queue-description">${item.summary}</p>
    ${
      metrics.length
        ? `<div class="queue-insights">${metrics
            .map(
              (metric) => `
                <div>
                  <span>${metric.label}</span>
                  <strong>${metric.value}</strong>
                </div>
              `
            )
            .join("")}</div>`
        : ""
    }
    <footer>
      <span class="muted">${item.businessUnit}</span>
      ${
        workflow
          ? `<span class="muted">${workflow.domain ?? "—"} • ${workflow.owner ?? "—"}</span>`
          : ""
      }
    </footer>
  `;

  if (workflow) {
    const openWorkflow = () => {
      window.location.href = `workflow.html?id=${encodeURIComponent(workflow.id)}`;
    };

    card.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) return;
      openWorkflow();
    });

    card.addEventListener("keypress", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openWorkflow();
      }
    });
  }

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
