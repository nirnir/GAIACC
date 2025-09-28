import { workflows } from "./data.js";
import {
  statusToColor,
  categorizeWorkflowStatus,
  formatTriggerLabel,
  formatRunCadenceValue,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("workflow-root");
  const params = new URLSearchParams(window.location.search);
  const workflowId = params.get("id");
  const workflow = workflows.find((item) => item.id === workflowId);

  if (!root) return;

  if (!workflow) {
    renderMissingWorkflow(root, workflowId);
    return;
  }

  renderWorkflowView(root, workflow);
});

function renderMissingWorkflow(root, workflowId) {
  root.innerHTML = "";
  const card = document.createElement("section");
  card.className = "detail-card agent-missing";
  card.innerHTML = `
    <h2>Workflow not found</h2>
    <p class="muted">We couldn't locate a workflow with the ID <strong>${workflowId ?? "unknown"}</strong>.</p>
    <div class="hero-buttons">
      <a class="primary-btn" href="index.html">Return to mission control</a>
    </div>
  `;
  root.appendChild(card);
}

function renderWorkflowView(root, workflow) {
  root.innerHTML = "";
  root.appendChild(buildWorkflowHero(workflow));
  root.appendChild(buildWorkflowDetails(workflow));
  root.appendChild(buildWorkflowTimelineCard(workflow));
  root.appendChild(buildWorkflowContextCard(workflow));
}

function buildWorkflowHero(workflow) {
  const hero = document.createElement("section");
  hero.className = "detail-card agent-hero-card workflow-hero-card";

  const metrics =
    workflow.type === "Automated"
      ? [
          { label: "Trigger", value: formatTriggerLabel(workflow.trigger) },
          { label: "Run cadence", value: formatRunCadenceValue(workflow) },
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
          { label: "Owner", value: workflow.owner ?? "—" },
        ];

  const narrative = getWorkflowNarrative(workflow);

  hero.innerHTML = `
    <div class="agent-hero-header">
      <div>
        <span class="muted">${workflow.id}</span>
        <h1>${workflow.name}</h1>
        <div class="agent-hero-meta">
          ${
            [workflow.type, workflow.domain ?? "—", workflow.owner ?? "—"]
              .map((item) => `<span class="detail-badge">${item}</span>`)
              .join("")
          }
        </div>
      </div>
      <div class="agent-hero-status">
        <span class="status-pill ${statusToColor(workflow.status)}">${workflow.status.toUpperCase()}</span>
      </div>
    </div>
    <p class="workflow-narrative">${narrative}</p>
    <div class="agent-hero-foot">
      ${metrics
        .map(
          (metric) => `
            <div>
              <span>${metric.label}</span>
              <strong>${metric.value}</strong>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  return hero;
}

function buildWorkflowDetails(workflow) {
  const layout = document.createElement("div");
  layout.className = "agent-detail-grid workflow-detail-grid";
  layout.appendChild(buildOverviewCard(workflow));
  layout.appendChild(buildOperationsCard(workflow));
  layout.appendChild(buildHealthCard(workflow));
  layout.appendChild(buildActionCard(workflow));
  return layout;
}

function createDetailGrid(entries) {
  const grid = document.createElement("div");
  grid.className = "detail-grid";
  entries.forEach((entry) => {
    const item = document.createElement("div");
    item.innerHTML = `
      <span>${entry.label}</span>
      <strong>${entry.value}</strong>
    `;
    grid.appendChild(item);
  });
  return grid;
}

function buildOverviewCard(workflow) {
  const card = document.createElement("section");
  card.className = "detail-card workflow-overview-card";
  card.innerHTML = `<h3>Workflow overview</h3>`;
  card.appendChild(
    createDetailGrid([
      { label: "Type", value: workflow.type },
      { label: "Domain", value: workflow.domain ?? "—" },
      { label: "Owner", value: workflow.owner ?? "—" },
      { label: "Status", value: workflow.status ?? "—" },
    ])
  );

  const statusNote = document.createElement("p");
  statusNote.className = "muted overview-guidance";
  statusNote.textContent = getStatusGuidance(workflow.status);
  card.appendChild(statusNote);

  return card;
}

function buildOperationsCard(workflow) {
  const card = document.createElement("section");
  card.className = "detail-card workflow-operations-card";

  if (workflow.type === "Automated") {
    card.innerHTML = `<h3>Automation schedule</h3>`;
    card.appendChild(
      createDetailGrid([
        { label: "Trigger", value: formatTriggerLabel(workflow.trigger) },
        { label: "Run cadence", value: formatRunCadenceValue(workflow) },
        { label: "Next run", value: workflow.nextRun ?? "—" },
        { label: "Last run", value: workflow.lastRun ?? "—" },
      ])
    );

    const list = document.createElement("ul");
    list.className = "workflow-key-list";
    list.innerHTML = `
      <li>Confirm upstream telemetry before the ${workflow.nextRun ?? "next"} cycle.</li>
      <li>Validate guardrail policies for ${workflow.domain ?? "core"} scenarios.</li>
      <li>Share runtime digest with ${workflow.owner ?? "workflow owner"} after execution.</li>
    `;
    card.appendChild(list);
  } else {
    card.innerHTML = `<h3>Copilot adoption</h3>`;
    card.appendChild(
      createDetailGrid([
        {
          label: "Monthly active users",
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
        { label: "Domain", value: workflow.domain ?? "—" },
      ])
    );

    const list = document.createElement("ul");
    list.className = "workflow-key-list";
    list.innerHTML = `
      <li>Capture feedback from ${workflow.persona ?? "core"} leads this sprint.</li>
      <li>Enable ${workflow.owner ?? "workflow owner"} with latest enablement assets.</li>
      <li>Highlight ${workflow.domain ?? "cross-functional"} wins in the weekly report.</li>
    `;
    card.appendChild(list);
  }

  return card;
}

function buildHealthCard(workflow) {
  const card = document.createElement("section");
  card.className = "detail-card workflow-health-card";
  card.innerHTML = `<h3>Operational health</h3>`;

  const signals = getWorkflowHealthSignals(workflow);
  const list = document.createElement("div");
  list.className = "workflow-health-list";

  signals.forEach((signal) => {
    const item = document.createElement("div");
    item.className = `workflow-health-item tone-${signal.tone}`;
    item.innerHTML = `
      <span>${signal.label}</span>
      <strong>${signal.value}</strong>
      <p>${signal.detail}</p>
    `;
    list.appendChild(item);
  });

  card.appendChild(list);
  return card;
}

function buildActionCard(workflow) {
  const card = document.createElement("section");
  card.className = "detail-card workflow-action-card";
  card.innerHTML = `<h3>Next best actions</h3>`;

  const actions = getWorkflowActionItems(workflow);
  const list = document.createElement("div");
  list.className = "workflow-action-list";

  actions.forEach((action) => {
    const item = document.createElement("article");
    item.className = "workflow-action-item";
    item.innerHTML = `
      <header>
        <h4>${action.title}</h4>
        <span class="action-status action-status--${action.statusClass}">${action.status}</span>
      </header>
      <p>${action.detail}</p>
      <footer>
        <span>Owner: ${action.owner}</span>
        <span>Due: ${action.due}</span>
      </footer>
    `;
    list.appendChild(item);
  });

  card.appendChild(list);
  return card;
}

function buildWorkflowTimelineCard(workflow) {
  const card = document.createElement("section");
  card.className = "detail-card workflow-timeline-card";
  card.innerHTML = `<h3>Operational timeline</h3>`;

  const entries = getWorkflowTimelineEntries(workflow);
  const list = document.createElement("ol");
  list.className = "workflow-timeline";

  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "workflow-timeline-item";
    item.innerHTML = `
      <span class="timeline-time">${entry.time}</span>
      <div>
        <strong>${entry.title}</strong>
        <p>${entry.detail}</p>
      </div>
    `;
    list.appendChild(item);
  });

  card.appendChild(list);
  return card;
}

function buildWorkflowContextCard(workflow) {
  const card = document.createElement("section");
  card.className = "detail-card workflow-context-card";
  card.innerHTML = `<h3>Context & dependencies</h3>`;

  const sections = getWorkflowContextSections(workflow);
  const grid = document.createElement("div");
  grid.className = "workflow-context-grid";

  sections.forEach((section) => {
    const column = document.createElement("div");
    column.innerHTML = `<h4>${section.title}</h4>`;
    const list = document.createElement("ul");
    list.className = "workflow-context-list";
    section.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    column.appendChild(list);
    grid.appendChild(column);
  });

  card.appendChild(grid);
  return card;
}

function getWorkflowNarrative(workflow) {
  const lane = categorizeWorkflowStatus(workflow.status);
  const triggerLabel = formatTriggerLabel(workflow.trigger);
  const cadence = formatRunCadenceValue(workflow);
  const owner = workflow.owner ?? "the owning team";

  const base =
    workflow.type === "Automated"
      ? `${workflow.name} keeps ${
          workflow.domain ? workflow.domain.toLowerCase() : "core"
        } operations in motion${
          triggerLabel && triggerLabel !== "—"
            ? ` using ${triggerLabel.toLowerCase()} signals`
            : ""
        } to orchestrate on-time execution.`
      : `${workflow.name} equips ${
          workflow.persona ? workflow.persona.toLowerCase() : "frontline"
        } teams with guided intelligence for ${
          workflow.domain ? workflow.domain.toLowerCase() : "cross-functional"
        } decisions.`;

  const cadenceCopy =
    workflow.type === "Automated" && cadence && cadence !== "—"
      ? ` Average runtime is tracking at ${cadence}.`
      : "";

  const laneCopy = {
    running: ` Telemetry looks healthy—focus with ${owner} on incremental optimization.`,
    paused: ` Runs are paused; validate prerequisites and stakeholder approvals before resuming.`,
    completed: ` The latest cycle completed cleanly; capture outcomes and feed learnings into the backlog.`,
    "requires-attention": ` Active escalations are open—coordinate with ${owner} to unblock before the next cycle.`,
  };

  return `${base}${cadenceCopy}${laneCopy[lane] ?? ""}`;
}

function getWorkflowHealthSignals(workflow) {
  const lane = categorizeWorkflowStatus(workflow.status);
  const owner = workflow.owner ?? "workflow owner";
  const laneMapping = {
    running: {
      label: "Stable",
      detail: "Telemetry within guardrails and no active escalations.",
      tone: "positive",
    },
    paused: {
      label: "Paused",
      detail: "Workflow intentionally paused—confirm restart criteria before next run.",
      tone: "warning",
    },
    completed: {
      label: "Completed",
      detail: "Cycle completed—review outputs and archive if no follow-up required.",
      tone: "positive",
    },
    "requires-attention": {
      label: "Attention needed",
      detail: "Escalations pending human review; align with owners to remediate.",
      tone: "critical",
    },
  };

  const signals = [
    {
      label: "Operational posture",
      value: laneMapping[lane]?.label ?? "Review",
      detail: laneMapping[lane]?.detail ?? "Investigate outstanding tasks before the next milestone.",
      tone: laneMapping[lane]?.tone ?? "warning",
    },
  ];

  if (workflow.type === "Automated") {
    signals.push(
      {
        label: "Cadence",
        value: formatRunCadenceValue(workflow),
        detail: workflow.nextRun
          ? `Next run scheduled ${workflow.nextRun}.`
          : "Runs execute on demand—confirm readiness with operators.",
        tone: "neutral",
      },
      {
        label: "Data checkpoints",
        value: workflow.lastRun ?? "Awaiting history",
        detail: `Monitor upstream signals feeding ${workflow.domain ?? "operations"}.`,
        tone: "neutral",
      }
    );
  } else {
    const adoption = workflow.adoption ?? 0;
    const adoptionTone = adoption >= 70 ? "positive" : adoption >= 55 ? "warning" : "critical";
    signals.push(
      {
        label: "Adoption trend",
        value:
          workflow.adoption !== undefined ? `${workflow.adoption}% engaged` : "Momentum TBD",
        detail:
          workflow.mau !== undefined
            ? `${workflow.mau.toLocaleString("en-US")} monthly users interacting with guided flows.`
            : "Monitor MAU to calibrate enablement cadence.",
        tone: adoptionTone,
      },
      {
        label: "Persona focus",
        value: workflow.persona ?? "—",
        detail: `Primary persona coverage across ${workflow.domain ?? "core"} teams.`,
        tone: "neutral",
      }
    );
  }

  signals.push({
    label: "Owner alignment",
    value: owner,
    detail: `${owner} accountable for decisions and cross-team coordination.`,
    tone: "neutral",
  });

  return signals;
}

function getWorkflowActionItems(workflow) {
  const lane = categorizeWorkflowStatus(workflow.status);
  const owner = workflow.owner ?? "Workflow owner";
  const persona = workflow.persona ?? "stakeholders";
  const nextRun = workflow.nextRun ?? "next run";
  const trigger = formatTriggerLabel(workflow.trigger);
  const triggerDescriptor = trigger && trigger !== "—" ? trigger.toLowerCase() : "core";

  const normalizeStatus = (value) => value.toLowerCase().replace(/\s+/g, "-");

  if (workflow.type === "Automated") {
    return [
      {
        title:
          lane === "requires-attention"
            ? "Clear escalation backlog"
            : "Validate telemetry checkpoints",
        detail:
          lane === "requires-attention"
            ? `Review active incidents with ${owner} before the ${nextRun} window.`
            : `Spot-check upstream signals to confirm ${triggerDescriptor} inputs remain stable ahead of execution.`,
        owner,
        due: lane === "requires-attention" ? "Immediate" : "Today",
        status: lane === "requires-attention" ? "In progress" : "Planned",
        statusClass: normalizeStatus(
          lane === "requires-attention" ? "in-progress" : "planned"
        ),
      },
      {
        title: "Sync guardrails",
        detail: `Ensure policy coverage for ${workflow.domain ?? "core"} scenarios is up to date and documented.`,
        owner,
        due: "This week",
        status: "Ready",
        statusClass: normalizeStatus("ready"),
      },
      {
        title: "Communicate status",
        detail: `Publish a digest of run outcomes to impacted teams to maintain alignment on automation posture.`,
        owner: "Program PM",
        due: "This week",
        status: "Planned",
        statusClass: normalizeStatus("planned"),
      },
    ];
  }

  return [
    {
      title:
        lane === "requires-attention"
          ? "Resolve pending reviews"
          : "Promote success stories",
      detail:
        lane === "requires-attention"
          ? `Coordinate enablement with ${owner} to unblock ${persona} tasks awaiting input.`
          : `Highlight recent wins from ${persona} teams to reinforce adoption momentum.`,
      owner,
      due: lane === "requires-attention" ? "Immediate" : "This week",
      status: lane === "requires-attention" ? "In progress" : "Planned",
      statusClass: normalizeStatus(
        lane === "requires-attention" ? "in-progress" : "planned"
      ),
    },
    {
      title: "Refresh enablement assets",
      detail: `Update playbooks and quick reference guides for ${persona} audiences with the latest prompts and guardrails.`,
      owner,
      due: "Next sprint",
      status: "Ready",
      statusClass: normalizeStatus("ready"),
    },
    {
      title: "Collect qualitative feedback",
      detail: `Schedule listening sessions with power users to uncover friction points across ${
        workflow.domain ?? "core"
      } use cases.`,
      owner: "Customer success",
      due: "Next sprint",
      status: "Planned",
      statusClass: normalizeStatus("planned"),
    },
  ];
}

function getWorkflowTimelineEntries(workflow) {
  const entries = [];
  const trigger = formatTriggerLabel(workflow.trigger);
  const triggerDescriptor = trigger && trigger !== "—" ? trigger.toLowerCase() : "core";
  const cadenceValue = formatRunCadenceValue(workflow);
  const cadenceDescriptor = cadenceValue && cadenceValue !== "—" ? cadenceValue : "standard";

  if (workflow.lastRun) {
    entries.push({
      time: workflow.lastRun,
      title: "Last execution",
      detail: `Workflow completed using ${triggerDescriptor} signals; log artifacts archived for review.`,
    });
  }

  entries.push({
    time: "T-60 min",
    title: "Pre-flight check",
    detail:
      workflow.type === "Automated"
        ? `Validate connectors and guardrails before the ${cadenceDescriptor} cycle.`
        : `Confirm briefing inputs and knowledge base updates for ${workflow.persona ?? "stakeholder"} sessions.`,
  });

  entries.push({
    time: workflow.nextRun ?? "Next milestone",
    title: workflow.type === "Automated" ? "Next scheduled run" : "Upcoming enablement",
    detail:
      workflow.type === "Automated"
        ? `Monitor execution telemetry with ${workflow.owner ?? "owners"} and capture anomalies.`
        : `Plan targeted nudges with ${workflow.owner ?? "owners"} to boost ${
            workflow.persona ?? "user"
          } adoption.`,
  });

  return entries;
}

function getWorkflowContextSections(workflow) {
  if (workflow.type === "Automated") {
    return [
      {
        title: "Signals to watch",
        items: [
          `${formatTriggerLabel(workflow.trigger)} event stream health`,
          `Runtime average ${formatRunCadenceValue(workflow)}`,
          `${workflow.domain ?? "Operations"} telemetry guardrails`,
        ],
      },
      {
        title: "Key stakeholders",
        items: [
          `Owner: ${workflow.owner ?? "—"}`,
          `Escalation: ${workflow.owner ?? "Ops"} → Command Center`,
          `Impacted teams: ${workflow.domain ?? "Enterprise"}`,
        ],
      },
    ];
  }

  return [
    {
      title: "Signals to watch",
      items: [
        `${workflow.mau !== undefined ? `${workflow.mau.toLocaleString("en-US")} MAU` : "Usage"} trends`,
        `${workflow.adoption !== undefined ? `${workflow.adoption}%` : "Adoption"} engagement score`,
        `${workflow.domain ?? "Cross-functional"} qualitative feedback`,
      ],
    },
    {
      title: "Key stakeholders",
      items: [
        `Owner: ${workflow.owner ?? "—"}`,
        `Primary persona: ${workflow.persona ?? "—"}`,
        `Enablement cadence: Weekly touchpoint`,
      ],
    },
  ];
}

function getStatusGuidance(status) {
  const lane = categorizeWorkflowStatus(status);
  switch (lane) {
    case "running":
      return "Operating normally. Monitor telemetry for optimization opportunities.";
    case "paused":
      return "Paused intentionally. Validate prerequisites and approvals before resuming.";
    case "completed":
      return "Workflow has completed its run. Review outputs and archive if no further action is required.";
    default:
      return "Requires attention. Check escalation queues or governance policies for next steps.";
  }
}
