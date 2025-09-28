import { workflows } from "./data.js";
import { statusToColor, categorizeWorkflowStatus } from "./utils.js";

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
}

function buildWorkflowHero(workflow) {
  const hero = document.createElement("section");
  hero.className = "detail-card agent-hero-card workflow-hero-card";

  const metrics =
    workflow.type === "Automated"
      ? [
          { label: "Trigger", value: formatTrigger(workflow.trigger) },
          { label: "Run cadence", value: formatRunCadence(workflow) },
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

  hero.innerHTML = `
    <div class="agent-hero-header">
      <div>
        <span class="muted">${workflow.id}</span>
        <h1>${workflow.name}</h1>
        <div class="agent-hero-meta">
          <span>${workflow.type}</span>
          <span>${workflow.domain ?? "—"}</span>
          <span>${workflow.owner ?? "—"}</span>
        </div>
      </div>
      <div class="agent-hero-status">
        <span class="status-pill ${statusToColor(workflow.status)}">${workflow.status.toUpperCase()}</span>
      </div>
    </div>
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

  const overviewCard = document.createElement("section");
  overviewCard.className = "detail-card";
  overviewCard.innerHTML = `<h3>Workflow overview</h3>`;
  overviewCard.appendChild(
    createDetailGrid([
      { label: "Type", value: workflow.type },
      { label: "Domain", value: workflow.domain ?? "—" },
      { label: "Owner", value: workflow.owner ?? "—" },
      { label: "Status", value: workflow.status ?? "—" },
    ])
  );

  const secondaryCard = document.createElement("section");
  secondaryCard.className = "detail-card";

  if (workflow.type === "Automated") {
    secondaryCard.innerHTML = `<h3>Automation schedule</h3>`;
    secondaryCard.appendChild(
      createDetailGrid([
        { label: "Trigger", value: formatTrigger(workflow.trigger) },
        { label: "Run cadence", value: formatRunCadence(workflow) },
        { label: "Next run", value: workflow.nextRun ?? "—" },
        { label: "Last run", value: workflow.lastRun ?? "—" },
      ])
    );
  } else {
    secondaryCard.innerHTML = `<h3>Copilot adoption</h3>`;
    secondaryCard.appendChild(
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
  }

  const guidanceCard = document.createElement("section");
  guidanceCard.className = "detail-card nested";
  guidanceCard.innerHTML = `
    <h4>Status guidance</h4>
    <p class="muted">${getStatusGuidance(workflow.status)}</p>
  `;

  layout.appendChild(overviewCard);
  layout.appendChild(secondaryCard);
  layout.appendChild(guidanceCard);
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

function formatTrigger(trigger) {
  if (!trigger) return "—";
  if (typeof trigger === "string") return trigger;
  return trigger.label ?? trigger.type ?? "—";
}

function formatRunCadence(workflow) {
  if (!workflow.runTime) return "—";
  const descriptor = workflow.runTime.descriptor ? ` ${workflow.runTime.descriptor}` : "";
  return `${workflow.runTime.value}${descriptor}`;
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
