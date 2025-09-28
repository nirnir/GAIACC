const state = {
  module: "inventory",
  perspective: "ops",
  selectedAgent: null,
  detailView: "profile",
  agentPage: false,
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

const agentCatalog = [
  {
    title: "Automated Agentic AI Workflows (Background Execution)",
    description:
      "Hands-off automations where agents execute end-to-end within defined guardrails.",
    groups: [
      {
        name: "Food & Consumer Apps",
        items: [
          {
            title: "Dynamic Menu Optimization",
            description:
              "Agents analyze consumption patterns, dietary needs, waste levels, and supplier availability to automatically update menus daily across sites.",
          },
          {
            title: "Personalized Promotions",
            description:
              "AI agents tailor offers to user segments (students, employees, patients) and push them through Everyday/So’Eze, driving adoption and revenue lift.",
          },
          {
            title: "Order Routing & Capacity Management",
            description:
              "Agents balance demand across kitchens, kiosks, and delivery partners, adjusting prep schedules to minimize wait times and food waste.",
          },
        ],
      },
      {
        name: "Facility Management (FM)",
        items: [
          {
            title: "Predictive Maintenance",
            description:
              "Agents monitor IoT sensor data, predict equipment failures, and auto-generate work orders in Service Cloud (Keystone).",
          },
          {
            title: "Energy Optimization",
            description:
              "Agents dynamically adjust HVAC, lighting, and cleaning schedules based on occupancy and weather, driving sustainability KPIs.",
          },
          {
            title: "Compliance Automation",
            description:
              "AI monitors service data (cleaning, safety checks) and ensures SLA compliance automatically, escalating only exceptions.",
          },
        ],
      },
      {
        name: "Workforce & Ops",
        items: [
          {
            title: "Shift Scheduling",
            description:
              "Agents forecast demand (e.g., lunch peaks, events), auto-generate optimized rosters, and sync with HR systems.",
          },
          {
            title: "Inventory & Procurement",
            description:
              "Agents monitor stock levels, place restock orders, and negotiate prices dynamically across suppliers.",
          },
          {
            title: "Contract Bidding Support",
            description:
              "Agents ingest bid requirements and auto-draft Sodexo responses with historical benchmarks and compliance checks.",
          },
        ],
      },
    ],
  },
  {
    title: "Assisted Agentic AI (Copilot / Human-in-the-Loop)",
    description:
      "Copilots embedded in Sodexo employee and client workflows for decision support.",
    groups: [
      {
        name: "For Onsite Staff & Managers",
        items: [
          {
            title: "Operations Copilot",
            description:
              "A ServiceNow/Jira-style console highlighting drivers behind metrics with recommended actions.",
          },
          {
            title: "Menu & Nutrition Copilot",
            description:
              "Helps chefs adapt recipes for allergies and dietary needs instantly, checking costs and supplier availability.",
          },
          {
            title: "Contract Copilot",
            description:
              "Assists sales with proposals, pulling from case studies, KPIs, and regulatory requirements.",
          },
        ],
      },
      {
        name: "For Facility Teams",
        items: [
          {
            title: "Maintenance Copilot",
            description:
              "Frontline staff receive guided troubleshooting via AR glasses or mobile apps that auto-update logs.",
          },
          {
            title: "Cleaning & Safety Copilot",
            description:
              "Supervisors see instant risk maps highlighting compliance gaps and recommended actions.",
          },
        ],
      },
      {
        name: "For Executives & Digital Leaders",
        items: [
          {
            title: "Adoption & ROI Insights",
            description:
              "Surfaces which digital solutions drive active users, revenue, and retention by region.",
          },
          {
            title: "Strategic Planning Copilot",
            description:
              "Combines financials, adoption, and market data to simulate scenarios like new deployments.",
          },
        ],
      },
      {
        name: "For Clients",
        items: [
          {
            title: "Client Portal Copilot",
            description:
              "Helps B2B clients monitor site performance, satisfaction, sustainability impact, and costs through natural language queries.",
          },
        ],
      },
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
      state.agentPage = false;
      state.selectedAgent = null;
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
    state.agentPage = false;
    state.selectedAgent = null;
    renderModule();
  });

  panel.querySelector("#bu-filter").addEventListener("change", (event) => {
    state.filters.businessUnit = event.target.value;
    state.agentPage = false;
    state.selectedAgent = null;
    renderModule();
  });

  panel.querySelector("#risk-filter").addEventListener("change", (event) => {
    state.filters.risk = event.target.value;
    state.agentPage = false;
    state.selectedAgent = null;
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

function buildAgentCatalogSection() {
  const section = document.createElement("section");
  section.className = "agent-catalog";
  section.setAttribute("aria-labelledby", "agent-catalog-heading");
  section.innerHTML = `
    <header class="catalog-header">
      <div>
        <h3 id="agent-catalog-heading">Agentic AI Catalog</h3>
        <p class="muted">Explore Sodexo's production-ready automations and guided copilots.</p>
      </div>
    </header>
    <div class="catalog-layout">
      ${agentCatalog
        .map(
          (pillar, pillarIndex) => `
            <article class="catalog-column" aria-labelledby="pillar-${pillarIndex}">
              <header>
                <h4 id="pillar-${pillarIndex}">${pillar.title}</h4>
                <p class="muted">${pillar.description}</p>
              </header>
              <div class="catalog-groups">
                ${pillar.groups
                  .map(
                    (group, groupIndex) => `
                      <section class="catalog-group" aria-labelledby="pillar-${pillarIndex}-group-${groupIndex}">
                        <h5 id="pillar-${pillarIndex}-group-${groupIndex}">${group.name}</h5>
                        <ul>
                          ${group.items
                            .map(
                              (item) => `
                                <li>
                                  <strong>${item.title}</strong>
                                  <p>${item.description}</p>
                                </li>
                              `
                            )
                            .join("")}
                        </ul>
                      </section>
                    `
                  )
                  .join("")}
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;

  return section;
}

function renderInventoryModule(container) {
  const filteredAgents = applyAgentFilters(agents);

  if (state.agentPage && (!state.selectedAgent || !filteredAgents.find((agent) => agent.id === state.selectedAgent))) {
    state.agentPage = false;
    state.selectedAgent = filteredAgents[0]?.id ?? null;
  }

  if (state.agentPage && state.selectedAgent) {
    renderAgentPage(container);
    return;
  }

  container.appendChild(buildAgentCatalogSection());

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

  card.querySelector(".tile-open").addEventListener("click", (event) => {
    event.stopPropagation();
    state.selectedAgent = agent.id;
    state.detailView = "profile";
    state.agentPage = true;
    renderModule();
  });

  card.addEventListener("click", () => {
    state.selectedAgent = agent.id;
    state.detailView = "profile";
    state.agentPage = true;
    renderModule();
  });

  return card;
}

function renderAgentPage(container) {
  const agent = agents.find((item) => item.id === state.selectedAgent);
  if (!agent) {
    state.agentPage = false;
    renderInventoryModule(container);
    return;
  }

  const page = document.createElement("section");
  page.className = "agent-page";
  page.innerHTML = `
    <button class="ghost-btn back-button" type="button">← Back to inventory</button>
    <header class="agent-hero">
      <div>
        <span class="muted">${agent.id}</span>
        <h3>${agent.name}</h3>
        <div class="agent-hero-meta">
          <span>${agent.businessUnit}</span>
          <span>${agent.owner}</span>
          <span class="risk-chip risk-${agent.riskLevel}">Risk: ${agent.riskLevel.toUpperCase()}</span>
        </div>
      </div>
      <div class="agent-hero-actions">
        <span class="status-pill ${statusToColor(agent.status)}">${agent.status.toUpperCase()}</span>
        <div class="hero-buttons">
          <button class="primary-btn" type="button">Launch Playbook</button>
          <button class="ghost-btn" type="button">Pause Agent</button>
          <button class="ghost-btn" type="button">Escalate</button>
        </div>
      </div>
    </header>
    <section class="agent-metric-band">
      ${[
        { label: "Success Rate", value: `${Math.round(agent.successRate * 100)}%` },
        { label: "Automation", value: `${Math.round(agent.automationRate * 100)}%` },
        { label: "Average Latency", value: `${agent.avgLatency}s` },
        { label: "Hours Saved", value: agent.hoursSaved.toLocaleString() },
        { label: "Last Incident", value: agent.lastIncident },
      ]
        .map(
          (item) => `
            <article>
              <span>${item.label}</span>
              <strong>${item.value}</strong>
            </article>
          `
        )
        .join("")}
    </section>
    <div class="agent-page-grid">
      <section class="agent-core">
        <nav class="detail-switcher">
          <button class="ghost-btn ${state.detailView === "profile" ? "active" : ""}" data-view="profile" type="button">Run Log</button>
          <button class="ghost-btn ${state.detailView === "dependencies" ? "active" : ""}" data-view="dependencies" type="button">Dependency Graph</button>
          <button class="ghost-btn ${state.detailView === "guardrails" ? "active" : ""}" data-view="guardrails" type="button">Guardrails</button>
        </nav>
        <div class="detail-body" id="detail-body"></div>
      </section>
      <aside class="agent-side">
        <article class="detail-card">
          <h4>Operational Checklist</h4>
          <ul class="checklist">
            <li>Blast radius reviewed</li>
            <li>Guardrail pack synced</li>
            <li>Escalation rota acknowledged</li>
            <li>Telemetry routed to observability hub</li>
          </ul>
        </article>
        <article class="detail-card">
          <h4>Recent Activity</h4>
          <div class="timeline">${agent.recentActivity
            .map((entry) => `<div class="timeline-item">${entry}</div>`)
            .join("")}</div>
        </article>
      </aside>
    </div>
  `;

  page.querySelector(".back-button").addEventListener("click", () => {
    state.agentPage = false;
    renderModule();
  });

  page.querySelectorAll(".detail-switcher .ghost-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.detailView = button.dataset.view;
      renderAgentPage(container);
    });
  });

  container.appendChild(page);

  const body = page.querySelector("#detail-body");
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
  .agent-card.active-selection { outline: 1px solid rgba(37, 99, 235, 0.35); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
  #filter-panel { display: grid; gap: 12px; }
  .filter { display: grid; gap: 6px; font-size: 0.85rem; color: var(--text-muted); }
  .filter select { background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--radius-sm); padding: 8px; color: var(--text-primary); }
`;
document.head.appendChild(style);
