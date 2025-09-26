const state = {
  module: "inventory",
  perspective: "ops",
  selectedAgent: null,
  detailView: "profile",
  filters: {
    status: "all",
    businessUnit: "all",
    risk: "all",
  },
};

const copy = {
  inventory: {
    title: "Inventory Manager",
    subtitle: "Real-time view of deployed agents, their state, and health.",
  },
  hitl: {
    title: "Human-in-the-Loop Console",
    subtitle: "Route escalations, manage approvals, and keep SLAs on track.",
  },
  insights: {
    title: "Outcome Insights",
    subtitle: "Quantify business impact and surface levers for improvement.",
  },
  governance: {
    title: "Governance & Guardrails",
    subtitle: "Ensure policies travel with agents and every decision is auditable.",
  },
  optimization: {
    title: "Optimization Lab",
    subtitle: "Experiment, tune, and control cost-quality tradeoffs at scale.",
  },
};

const agents = [
  {
    id: "AIOPS-017",
    name: "Revenue Ops Planner",
    status: "active",
    businessUnit: "Go-To-Market",
    owner: "Ops Automation Guild",
    successRate: 0.94,
    automationRate: 0.81,
    avgLatency: 6.2,
    hoursSaved: 4820,
    lastIncident: "12d ago",
    riskLevel: "medium",
    adoption: "Global Sales",
    dependencies: {
      tools: ["Salesforce", "Tableau", "SAP"],
      connectors: ["Databricks Lakehouse", "Palantir AIP"],
      policies: ["SOX Controls", "PII Masking"],
    },
    guardrails: [
      { name: "Financial Data Boundary", status: "green" },
      { name: "Revenue Forecast Review", status: "orange" },
    ],
    recentActivity: [
      "Generated Q4 revenue coverage plan",
      "Escalated contract anomaly to finance reviewer",
      "Rolled back retrieval model after canary drift",
    ],
  },
  {
    id: "CX-204",
    name: "Customer Care Orchestrator",
    status: "active",
    businessUnit: "Customer Experience",
    owner: "Support Ops",
    successRate: 0.89,
    automationRate: 0.74,
    avgLatency: 3.8,
    hoursSaved: 6950,
    lastIncident: "3d ago",
    riskLevel: "low",
    adoption: "Tier 1 & 2 Support",
    dependencies: {
      tools: ["Zendesk", "Slack", "ServiceNow"],
      connectors: ["LangSmith", "Mosaic Gateway"],
      policies: ["GDPR Privacy Pack", "PCI Redaction"],
    },
    guardrails: [
      { name: "EU Data Residency", status: "green" },
      { name: "Payment Redaction", status: "green" },
    ],
    recentActivity: [
      "Deflected billing ticket with self-service workflow",
      "Routed outage escalation to on-call engineer",
      "Captured CSAT feedback into evaluation dataset",
    ],
  },
  {
    id: "RISK-88",
    name: "Third-Party Risk Analyst",
    status: "paused",
    businessUnit: "Risk & Compliance",
    owner: "Enterprise Trust",
    successRate: 0.76,
    automationRate: 0.52,
    avgLatency: 12.5,
    hoursSaved: 1830,
    lastIncident: "2h ago",
    riskLevel: "high",
    adoption: "Vendor Management",
    dependencies: {
      tools: ["GRC Vault", "DocuSign"],
      connectors: ["AI Gateway", "Policy Engine"],
      policies: ["AI Act Tier 2", "Vendor Risk Guardrails"],
    },
    guardrails: [
      { name: "Sensitive Document Access", status: "red" },
      { name: "Dual Control", status: "orange" },
    ],
    recentActivity: [
      "Paused after exceeding false positive threshold",
      "Requested manual review for procurement contract",
      "Generated audit evidence pack for Q3",
    ],
  },
  {
    id: "SUPPLY-61",
    name: "Supply Chain Navigator",
    status: "active",
    businessUnit: "Operations",
    owner: "Fulfillment PMO",
    successRate: 0.91,
    automationRate: 0.68,
    avgLatency: 8.4,
    hoursSaved: 3810,
    lastIncident: "7d ago",
    riskLevel: "medium",
    adoption: "Global Logistics",
    dependencies: {
      tools: ["SAP IBP", "Snowflake"],
      connectors: ["Mosaic Gateway", "Vertex Forecast API"],
      policies: ["Export Control", "Supplier Compliance"],
    },
    guardrails: [
      { name: "Cold Chain Policy", status: "green" },
      { name: "Supplier Risk", status: "green" },
    ],
    recentActivity: [
      "Predicted port congestion impact for APAC",
      "Triggered alternate route automation",
      "Logged scenario to optimization notebook",
    ],
  },
  {
    id: "HR-142",
    name: "Talent Mobility Advisor",
    status: "failed",
    businessUnit: "People",
    owner: "HR Innovation",
    successRate: 0.63,
    automationRate: 0.41,
    avgLatency: 5.9,
    hoursSaved: 940,
    lastIncident: "12m ago",
    riskLevel: "medium",
    adoption: "Corporate HR",
    dependencies: {
      tools: ["Workday", "Greenhouse"],
      connectors: ["AI Gateway", "Employee Graph"],
      policies: ["PII Safe Handling", "Bias Monitoring"],
    },
    guardrails: [
      { name: "Bias Monitoring", status: "red" },
      { name: "PII Masking", status: "orange" },
    ],
    recentActivity: [
      "Failed to complete internal transfer recommendation",
      "Escalated to HRBP for manual approval",
      "Opened eval notebook for fairness regression",
    ],
  },
];

const actionQueue = [
  {
    id: "INC-4450",
    title: "Procurement Contract Review",
    summary: "Vendor clause flagged as ambiguous. Needs legal validation before execution.",
    status: "pending",
    sla: "02:15",
    businessUnit: "Risk & Compliance",
    workflow: "Third-Party Risk Analyst",
    urgency: "high",
  },
  {
    id: "INC-4412",
    title: "Customer Refund Escalation",
    summary: "High value customer requested manual override for refund exception.",
    status: "pending",
    sla: "00:42",
    businessUnit: "Customer Experience",
    workflow: "Customer Care Orchestrator",
    urgency: "critical",
  },
  {
    id: "INC-4390",
    title: "AI Policy Drift",
    summary: "Policy pack mismatch detected between staging and production gateways.",
    status: "escalated",
    sla: "04:20",
    businessUnit: "Platform",
    workflow: "Gateway Governance",
    urgency: "medium",
  },
  {
    id: "INC-4302",
    title: "Forecast Accuracy Regression",
    summary: "A/B test variant B regressed cost-to-serve by 6%.",
    status: "investigating",
    sla: "08:00",
    businessUnit: "Operations",
    workflow: "Supply Chain Navigator",
    urgency: "medium",
  },
  {
    id: "INC-4220",
    title: "Successful Automation Review",
    summary: "Bulk billing adjustments auto-approved with zero escalations for 48h.",
    status: "completed",
    sla: "--",
    businessUnit: "Finance",
    workflow: "Revenue Ops Planner",
    urgency: "low",
  },
];

const insights = {
  ops: [
    { label: "Autonomy Rate", value: "78%", trend: "+6.2% vs last month" },
    { label: "Average Time Saved", value: "11.4 hrs/task", trend: "+1.8 hrs" },
    { label: "Escalation MTTR", value: "34 min", trend: "-12 min" },
    { label: "Coverage", value: "146 agents", trend: "+18 onboarded" },
  ],
  exec: [
    { label: "Hours Returned to Business", value: "38,420", trend: "+4,120 YoY" },
    { label: "Net Cost Avoidance", value: "$7.9M", trend: "+$900k QoQ" },
    { label: "CSAT Lift", value: "+9.4 pts", trend: "+1.1 pts" },
    { label: "Adoption Velocity", value: "21 new teams", trend: "+5 vs target" },
  ],
  security: [
    { label: "Policy Coverage", value: "98.4%", trend: "+0.8%" },
    { label: "High Risk Agents", value: "4", trend: "-2 vs last week" },
    { label: "Audit Evidence Packs", value: "27 ready", trend: "GDPR, HIPAA" },
    { label: "Incident Containment", value: "< 6 min", trend: "SOAR auto-closure" },
  ],
};

const recommendations = [
  {
    title: "Promote Variant B for Customer Care",
    impact: "+4.2% FCR / -3% cost",
    rationale: "Lang model swap in canary shows consistent quality uplift with lower token spend.",
    owner: "Support Ops",
    due: "Ready for rollout",
  },
  {
    title: "Enable Retrieval Cache for Revenue Ops",
    impact: "-$12k monthly / latency -18%",
    rationale: "High repeat queries detected on fiscal planning scenarios.",
    owner: "Ops Automation Guild",
    due: "Pilot scheduled",
  },
  {
    title: "Tighten Vendor Risk Guardrail",
    impact: "Reduce false positives by 22%",
    rationale: "Policy evaluation shows over-triggering on low risk suppliers.",
    owner: "Enterprise Trust",
    due: "Needs legal review",
  },
];

const policies = [
  {
    name: "PII Safe Handling",
    coverage: "Global",
    status: "green",
    description: "Auto-redaction enforced across CRM, ERP, and support transcripts.",
    lastAudit: "6h ago",
  },
  {
    name: "GDPR Residency",
    coverage: "EU Region",
    status: "green",
    description: "Geo-fenced storage and inference enforced via AI Gateway policies.",
    lastAudit: "2h ago",
  },
  {
    name: "Bias Monitoring",
    coverage: "People Ops",
    status: "orange",
    description: "Drift detected on fairness metrics for Talent Mobility Advisor.",
    lastAudit: "20m ago",
  },
  {
    name: "Incident Response",
    coverage: "Enterprise",
    status: "green",
    description: "SOAR playbooks executed with 99% SLA adherence.",
    lastAudit: "11h ago",
  },
];

const experiments = [
  {
    name: "Support Agent Model Swap",
    status: "Running",
    detail: "A/B testing GPT-4o vs. Claude Opus for refund workflows.",
    completion: 64,
  },
  {
    name: "Revenue Plan Strategy",
    status: "Canary",
    detail: "Tool sequencing variant with scenario caching enabled.",
    completion: 32,
  },
  {
    name: "Risk Policy Tuning",
    status: "Design",
    detail: "Notebook-driven evals on supplier onboarding accuracy.",
    completion: 18,
  },
];

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
      state.detailView = "profile";
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
  if (!state.selectedAgent || !filteredAgents.find((agent) => agent.id === state.selectedAgent)) {
    state.selectedAgent = filteredAgents[0]?.id ?? null;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "detail-panel";
  wrapper.innerHTML = `
    <section>
      <div class="section-header">
        <h3>Agent Inventory</h3>
        <p class="muted">${filteredAgents.length} agents match your filters.</p>
      </div>
      <div class="agent-grid" id="agent-grid"></div>
    </section>
    <aside class="detail-card" id="agent-detail">
      ${state.selectedAgent ? "" : `<p class="muted">Select an agent to view details.</p>`}
    </aside>
  `;

  container.appendChild(wrapper);

  const grid = wrapper.querySelector("#agent-grid");
  const template = document.getElementById("agent-card-template");

  filteredAgents.forEach((agent) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".agent-name").textContent = agent.name;
    const statusNode = node.querySelector(".agent-status");
    statusNode.textContent = agent.status;
    statusNode.classList.add(agent.status);

    const meta = node.querySelector(".agent-meta");
    meta.innerHTML = `
      <div>
        <dt>Business Unit</dt>
        <dd>${agent.businessUnit}</dd>
      </div>
      <div>
        <dt>Owner</dt>
        <dd>${agent.owner}</dd>
      </div>
      <div>
        <dt>Success Rate</dt>
        <dd>${Math.round(agent.successRate * 100)}%</dd>
      </div>
      <div>
        <dt>Automation</dt>
        <dd>${Math.round(agent.automationRate * 100)}%</dd>
      </div>
    `;

    node.querySelector(".view-details").addEventListener("click", () => {
      state.selectedAgent = agent.id;
      state.detailView = "profile";
      renderModule();
    });

    node.querySelector(".view-dependencies").addEventListener("click", () => {
      state.selectedAgent = agent.id;
      state.detailView = "dependencies";
      renderModule();
    });

    if (agent.id === state.selectedAgent) {
      node.querySelector(".agent-card").classList.add("active-selection");
    }

    grid.appendChild(node);
  });

  if (state.selectedAgent) {
    renderAgentDetail(wrapper.querySelector("#agent-detail"));
  }
}

function renderAgentDetail(detailContainer) {
  const agent = agents.find((item) => item.id === state.selectedAgent);
  if (!agent) return;

  detailContainer.innerHTML = `
    <header class="detail-header">
      <h3>${agent.name}</h3>
      <span class="status-pill ${statusToColor(agent.status)}">${agent.status.toUpperCase()}</span>
    </header>
    <div class="detail-grid">
      <div>
        <span>Business Unit</span>
        <strong>${agent.businessUnit}</strong>
      </div>
      <div>
        <span>Owner</span>
        <strong>${agent.owner}</strong>
      </div>
      <div>
        <span>Success Rate</span>
        <strong>${Math.round(agent.successRate * 100)}%</strong>
      </div>
      <div>
        <span>Automation Rate</span>
        <strong>${Math.round(agent.automationRate * 100)}%</strong>
      </div>
      <div>
        <span>Average Latency</span>
        <strong>${agent.avgLatency} sec</strong>
      </div>
      <div>
        <span>Hours Saved</span>
        <strong>${agent.hoursSaved.toLocaleString()}</strong>
      </div>
    </div>
    <div class="detail-switcher">
      <button class="ghost-btn ${state.detailView === "profile" ? "active" : ""}" data-view="profile">Run Log</button>
      <button class="ghost-btn ${state.detailView === "dependencies" ? "active" : ""}" data-view="dependencies">Dependency Graph</button>
      <button class="ghost-btn ${state.detailView === "guardrails" ? "active" : ""}" data-view="guardrails">Guardrails</button>
    </div>
    <div class="detail-body" id="detail-body"></div>
  `;

  detailContainer.querySelectorAll(".detail-switcher .ghost-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.detailView = button.dataset.view;
      renderAgentDetail(detailContainer);
    });
  });

  const body = detailContainer.querySelector("#detail-body");
  if (state.detailView === "dependencies") {
    body.innerHTML = renderDependencies(agent);
  } else if (state.detailView === "guardrails") {
    body.innerHTML = renderGuardrails(agent.guardrails);
  } else {
    body.innerHTML = renderRunLog(agent.recentActivity);
  }
}

function renderDependencies(agent) {
  return `
    <div class="detail-card nested">
      <h4>Dependencies</h4>
      <p class="muted">Visualize upstream tools and guardrails before deploying changes.</p>
      <div class="badge-grid">
        ${agent.dependencies.tools.map((tool) => `<span class="chip">🛠 ${tool}</span>`).join("")}
      </div>
      <div class="badge-grid">
        ${agent.dependencies.connectors
          .map((connector) => `<span class="chip">🔌 ${connector}</span>`)
          .join("")}
      </div>
      <div class="badge-grid">
        ${agent.dependencies.policies.map((policy) => `<span class="chip">🛡 ${policy}</span>`).join("")}
      </div>
      <p class="muted">Use blast radius analysis before editing shared resources.</p>
    </div>
  `;
}

function renderGuardrails(items) {
  return `
    <div class="detail-card nested">
      <h4>Guardrail Health</h4>
      <div class="policy-grid">
        ${items
          .map(
            (item) => `
              <div class="policy-card">
                <header>
                  <strong>${item.name}</strong>
                  <span class="status-pill ${statusToColor(item.status)}">${item.status.toUpperCase()}</span>
                </header>
                <p class="muted">${guardrailCopy(item.status)}</p>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderRunLog(activity) {
  return `
    <div class="detail-card nested">
      <h4>Latest Activity</h4>
      <div class="timeline">
        ${activity.map((entry) => `<div class="timeline-item">${entry}</div>`).join("")}
      </div>
    </div>
  `;
}

function statusToColor(status) {
  switch (status) {
    case "active":
    case "running":
    case "completed":
    case "resolved":
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
      return "red";
    default:
      return "orange";
  }
}

function guardrailCopy(status) {
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
  .detail-card.nested { background: rgba(8, 10, 20, 0.95); border-style: dashed; }
  .detail-switcher { display: flex; gap: 8px; }
  .detail-switcher .ghost-btn.active { background: rgba(132, 255, 224, 0.25); color: var(--bg-900); }
  .detail-card strong { display: block; font-size: 1.2rem; }
  .section-header { display: flex; justify-content: space-between; align-items: baseline; }
  .section-header h3 { margin: 0; }
  .experiment-list { display: grid; gap: 16px; }
  .experiment { display: grid; gap: 10px; background: rgba(8, 10, 20, 0.9); border: 1px solid rgba(132, 255, 224, 0.1); padding: 16px; border-radius: var(--radius-md); }
  .experiment-meta { display: flex; align-items: center; gap: 12px; }
  .progress { flex: 1; height: 6px; border-radius: 999px; background: rgba(132, 255, 224, 0.1); overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, rgba(132, 255, 224, 0.6), rgba(93, 216, 255, 0.9)); }
  .agent-card.active-selection { outline: 1px solid rgba(132, 255, 224, 0.4); box-shadow: 0 0 0 3px rgba(132, 255, 224, 0.12); }
  #filter-panel { display: grid; gap: 12px; }
  .filter { display: grid; gap: 6px; font-size: 0.85rem; color: var(--text-muted); }
  .filter select { background: rgba(11, 14, 25, 0.9); border: 1px solid rgba(132, 255, 224, 0.25); border-radius: var(--radius-sm); padding: 8px; color: var(--text-primary); }
`;
document.head.appendChild(style);
