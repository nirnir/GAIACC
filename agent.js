import { agents } from "./data.js";
import { statusToColor, guardrailCopy } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("agent-root");
  const params = new URLSearchParams(window.location.search);
  const agentId = params.get("id");
  const agent = agents.find((item) => item.id === agentId);

  if (!agent) {
    renderMissingAgent(root, agentId);
    return;
  }

  const state = {
    queue: agent.hitl.queue.map((item) => ({ ...item })),
    decisions: [...agent.hitl.decisionLog],
    actionCompletion: agent.insights.actions.map(() => false),
  };

  const rerender = () => renderAgentView(root, agent, state, rerender);
  rerender();
});

function renderMissingAgent(root, agentId) {
  root.innerHTML = "";
  const card = document.createElement("section");
  card.className = "detail-card agent-missing";
  card.innerHTML = `
    <h2>Agent not found</h2>
    <p class="muted">We couldn't locate an agent with the ID <strong>${agentId ?? "unknown"}</strong>.</p>
    <div class="hero-buttons">
      <a class="primary-btn" href="index.html">Return to mission control</a>
    </div>
  `;
  root.appendChild(card);
}

function renderAgentView(root, agent, state, rerender) {
  root.innerHTML = "";
  root.appendChild(buildHero(agent));

  const layout = document.createElement("div");
  layout.className = "agent-detail-grid";

  const primary = document.createElement("section");
  primary.className = "agent-detail-primary";
  primary.appendChild(buildHitlSection(agent, state, rerender));
  primary.appendChild(buildPerformanceSection(agent));

  const secondary = document.createElement("aside");
  secondary.className = "agent-detail-secondary";
  secondary.appendChild(buildInsightsSection(agent, state, rerender));
  secondary.appendChild(buildGuardrailsCard(agent));
  secondary.appendChild(buildDependenciesCard(agent));
  secondary.appendChild(buildPlaybooksCard(agent));
  secondary.appendChild(buildActivityCard(agent));

  layout.appendChild(primary);
  layout.appendChild(secondary);
  root.appendChild(layout);
}

function buildHero(agent) {
  const hero = document.createElement("section");
  hero.className = "detail-card agent-hero-card";
  hero.innerHTML = `
    <div class="agent-hero-header">
      <div>
        <span class="muted">${agent.id}</span>
        <h1>${agent.name}</h1>
        <div class="agent-hero-meta">
          <span>${agent.businessUnit}</span>
          <span>${agent.owner}</span>
          <span class="risk-chip risk-${agent.riskLevel}">Risk: ${agent.riskLevel.toUpperCase()}</span>
        </div>
      </div>
      <div class="agent-hero-status">
        <span class="status-pill ${statusToColor(agent.status)}">${agent.status.toUpperCase()}</span>
        <div class="hero-buttons">
          <button class="primary-btn" type="button">Launch Playbook</button>
          <button class="ghost-btn" type="button">Pause Agent</button>
          <button class="ghost-btn" type="button">Escalate</button>
        </div>
      </div>
    </div>
    <div class="agent-hero-foot">
      ${[
        { label: "Success Rate", value: `${Math.round(agent.successRate * 100)}%` },
        { label: "Automation", value: `${Math.round(agent.automationRate * 100)}%` },
        { label: "Avg Latency", value: `${agent.avgLatency}s` },
        { label: "Hours Saved", value: agent.hoursSaved.toLocaleString() },
        { label: "Last Incident", value: agent.lastIncident },
      ]
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

function buildHitlSection(agent, state, rerender) {
  const pending = state.queue.filter((item) => item.status !== "completed").length;
  const section = document.createElement("section");
  section.className = "detail-card hitl-console";
  section.innerHTML = `
    <div class="section-header">
      <h3>Human-in-the-Loop Console</h3>
      <span class="status-pill ${pending ? "orange" : "green"}">${pending} open</span>
    </div>
    <p class="muted">Coordinate manual approvals, escalations, and annotations for this agent.</p>
    <div class="hitl-queue" role="list"></div>
    <form class="hitl-note" aria-label="Log human decision">
      <label for="hitl-note-field">
        <span>Add operator note</span>
      </label>
      <textarea id="hitl-note-field" rows="3" maxlength="280" placeholder="Document decisions, context, or follow-up actions"></textarea>
      <div class="hitl-note-footer">
        <span class="muted char-count">0 / 280</span>
        <button class="primary-btn" type="submit">Log decision</button>
      </div>
    </form>
    <div class="hitl-log">
      <h4>Decision log</h4>
      <ul class="timeline"></ul>
    </div>
  `;

  const queueContainer = section.querySelector(".hitl-queue");
  if (!state.queue.length) {
    queueContainer.innerHTML = `<p class="muted">No manual interventions required.</p>`;
  } else {
    state.queue.forEach((item, index) => {
      queueContainer.appendChild(buildHitlCard(item, index, state, rerender));
    });
  }

  const logList = section.querySelector(".timeline");
  if (!state.decisions.length) {
    const empty = document.createElement("li");
    empty.className = "timeline-item";
    empty.textContent = "No human decisions recorded yet.";
    logList.appendChild(empty);
  } else {
    state.decisions.forEach((entry) => {
      const item = document.createElement("li");
      item.className = "timeline-item";
      item.innerHTML = entry;
      logList.appendChild(item);
    });
  }

  const noteForm = section.querySelector(".hitl-note");
  const textarea = noteForm.querySelector("textarea");
  const counter = noteForm.querySelector(".char-count");
  textarea.addEventListener("input", () => {
    const length = textarea.value.length;
    counter.textContent = `${length} / 280`;
  });

  noteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = textarea.value.trim();
    if (!value) return;
    appendDecision(state, `Operator note: ${value}`);
    textarea.value = "";
    counter.textContent = "0 / 280";
    rerender();
  });

  return section;
}

function buildHitlCard(item, index, state, rerender) {
  const card = document.createElement("article");
  card.className = `hitl-item status-${item.status}`;
  card.innerHTML = `
    <header>
      <div>
        <strong>${item.title}</strong>
        <p class="muted">${item.description}</p>
      </div>
      <span class="status-pill ${statusToColor(item.status)}">${formatStatusLabel(item.status)}</span>
    </header>
    <footer>
      <div class="hitl-meta">
        <span>SLA ${item.sla}</span>
        <span>${item.channel}</span>
        <span>${item.assignee}</span>
      </div>
      <div class="hitl-actions">
        <button class="ghost-btn" type="button" data-action="start">Start review</button>
        <button class="primary-btn" type="button" data-action="resolve">Mark resolved</button>
        <button class="ghost-btn" type="button" data-action="escalate">Escalate</button>
      </div>
    </footer>
  `;

  const actions = card.querySelectorAll("button[data-action]");
  actions.forEach((button) => {
    button.disabled = item.status === "completed";
  });

  const startBtn = card.querySelector('button[data-action="start"]');
  const resolveBtn = card.querySelector('button[data-action="resolve"]');
  const escalateBtn = card.querySelector('button[data-action="escalate"]');

  if (item.status !== "pending") {
    startBtn.disabled = true;
  }
  if (item.status === "escalated") {
    escalateBtn.disabled = true;
  }

  startBtn.addEventListener("click", () => {
    state.queue[index].status = "investigating";
    appendDecision(state, `${item.id}: reviewer acknowledged via HITL console`);
    rerender();
  });

  resolveBtn.addEventListener("click", () => {
    state.queue[index].status = "completed";
    appendDecision(state, `${item.id}: resolved and agent unblocked`);
    rerender();
  });

  escalateBtn.addEventListener("click", () => {
    state.queue[index].status = "escalated";
    appendDecision(state, `${item.id}: escalated to ${item.assignee}`);
    rerender();
  });

  return card;
}

function buildPerformanceSection(agent) {
  const section = document.createElement("section");
  section.className = "detail-card performance-card";
  section.innerHTML = `
    <div class="section-header">
      <h3>Performance &amp; Error Intelligence</h3>
      <span class="status-pill ${statusToColor(agent.status)}">${agent.status.toUpperCase()}</span>
    </div>
    <p class="muted">Understand execution quality, hotspots, and recent incidents.</p>
  `;

  const metricGrid = document.createElement("div");
  metricGrid.className = "performance-metric-grid";
  agent.performance.metrics.forEach((metric) => {
    const item = document.createElement("article");
    item.innerHTML = `
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
      <small class="muted">${metric.trend}</small>
    `;
    metricGrid.appendChild(item);
  });
  section.appendChild(metricGrid);

  const errorWrapper = document.createElement("div");
  errorWrapper.className = "error-breakdown";
  const maxCount = Math.max(...agent.performance.errorBreakdown.map((item) => item.count), 1);
  agent.performance.errorBreakdown.forEach((item) => {
    const row = document.createElement("div");
    row.className = "error-row";
    row.innerHTML = `
      <div class="error-label">
        <strong>${item.label}</strong>
        <small class="muted">${item.change}</small>
      </div>
      <div class="error-bar-track">
        <div class="error-bar-fill" role="progressbar" aria-valuemin="0" aria-valuemax="${maxCount}" aria-valuenow="${item.count}" style="width: ${(item.count / maxCount) * 100}%"></div>
      </div>
      <span class="error-count">${item.count}</span>
    `;
    errorWrapper.appendChild(row);
  });
  section.appendChild(errorWrapper);

  const incidents = document.createElement("div");
  incidents.className = "timeline incident-timeline";
  agent.performance.incidents.forEach((incident) => {
    const item = document.createElement("div");
    item.className = "timeline-item incident-item";
    item.innerHTML = `
      <strong>${incident.timestamp}</strong>
      <p>${incident.summary}</p>
      <span class="muted">${incident.resolution}</span>
    `;
    incidents.appendChild(item);
  });
  section.appendChild(incidents);

  const evalNotes = document.createElement("div");
  evalNotes.className = "evaluation-notes";
  const heading = document.createElement("h4");
  heading.textContent = "Evaluation focus";
  evalNotes.appendChild(heading);
  const list = document.createElement("ul");
  list.className = "note-list";
  agent.performance.evaluationNotes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    list.appendChild(li);
  });
  evalNotes.appendChild(list);
  section.appendChild(evalNotes);

  return section;
}

function buildInsightsSection(agent, state, rerender) {
  const section = document.createElement("section");
  section.className = "detail-card insights-card";
  section.innerHTML = `
    <div class="section-header">
      <h3>Insights &amp; Recommended Actions</h3>
    </div>
    <p class="muted">${agent.insights.narrative}</p>
    <div class="insight-actions"></div>
    <div class="insight-opportunities">
      <h4>Opportunities to explore</h4>
      <div class="badge-grid"></div>
    </div>
  `;

  const actionList = section.querySelector(".insight-actions");
  agent.insights.actions.forEach((action, index) => {
    const card = document.createElement("article");
    card.className = "insight-action";
    const completed = state.actionCompletion[index];
    card.innerHTML = `
      <header>
        <strong>${action.title}</strong>
        <span class="status-pill ${completed ? "green" : "orange"}">${completed ? "Completed" : action.status}</span>
      </header>
      <p>${action.description}</p>
      <footer>
        <span>${action.owner}</span>
        <span>${action.impact}</span>
        <span>${action.due}</span>
      </footer>
      <button class="primary-btn" type="button">${completed ? "Logged" : "Mark complete"}</button>
    `;
    const button = card.querySelector("button");
    if (completed) {
      button.disabled = true;
    } else {
      button.addEventListener("click", () => {
        state.actionCompletion[index] = true;
        appendDecision(state, `${action.title} marked complete by operations`);
        rerender();
      });
    }
    actionList.appendChild(card);
  });

  const badgeGrid = section.querySelector(".badge-grid");
  agent.insights.opportunities.forEach((item) => {
    const badge = document.createElement("span");
    badge.className = "chip";
    badge.textContent = `${item.label} • ${item.detail}`;
    badgeGrid.appendChild(badge);
  });

  return section;
}

function buildGuardrailsCard(agent) {
  const section = document.createElement("section");
  section.className = "detail-card guardrail-card";
  section.innerHTML = `
    <h4>Guardrail health</h4>
    <div class="policy-grid"></div>
  `;

  const grid = section.querySelector(".policy-grid");
  agent.guardrails.forEach((guardrail) => {
    const card = document.createElement("article");
    card.className = "policy-card";
    card.innerHTML = `
      <header>
        <strong>${guardrail.name}</strong>
        <span class="status-pill ${statusToColor(guardrail.status)}">${guardrail.status.toUpperCase()}</span>
      </header>
      <p class="muted">${guardrailCopy(guardrail.status)}</p>
    `;
    grid.appendChild(card);
  });

  return section;
}

function buildDependenciesCard(agent) {
  const section = document.createElement("section");
  section.className = "detail-card dependencies-card";
  section.innerHTML = `
    <h4>Dependencies</h4>
    <p class="muted">Keep blast radius in check before making upstream changes.</p>
    <div class="badge-grid" data-type="tools"></div>
    <div class="badge-grid" data-type="connectors"></div>
    <div class="badge-grid" data-type="policies"></div>
  `;

  const toolGrid = section.querySelector('[data-type="tools"]');
  agent.dependencies.tools.forEach((tool) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = `🛠 ${tool}`;
    toolGrid.appendChild(chip);
  });

  const connectorGrid = section.querySelector('[data-type="connectors"]');
  agent.dependencies.connectors.forEach((connector) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = `🔌 ${connector}`;
    connectorGrid.appendChild(chip);
  });

  const policyGrid = section.querySelector('[data-type="policies"]');
  agent.dependencies.policies.forEach((policy) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = `🛡 ${policy}`;
    policyGrid.appendChild(chip);
  });

  return section;
}

function buildPlaybooksCard(agent) {
  const section = document.createElement("section");
  section.className = "detail-card playbook-card";
  section.innerHTML = `
    <h4>Playbooks</h4>
    <ul class="note-list"></ul>
  `;
  const list = section.querySelector(".note-list");
  agent.hitl.playbooks.forEach((playbook) => {
    const item = document.createElement("li");
    item.textContent = playbook;
    list.appendChild(item);
  });
  return section;
}

function buildActivityCard(agent) {
  const section = document.createElement("section");
  section.className = "detail-card activity-card";
  section.innerHTML = `
    <h4>Recent activity</h4>
    <div class="timeline"></div>
  `;
  const timeline = section.querySelector(".timeline");
  agent.recentActivity.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.textContent = entry;
    timeline.appendChild(item);
  });
  return section;
}

function appendDecision(state, entry) {
  const timestamp = formatNow();
  state.decisions = [`${timestamp} • ${entry}`, ...state.decisions];
}

function formatNow() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function formatStatusLabel(status) {
  return status
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
