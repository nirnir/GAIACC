# Agent Command Center

The Agent Command Center is a mission-control inspired console for monitoring, governing, and optimizing enterprise AI agents. This lightweight prototype demonstrates how operations, security, and executive teams can share a single pane of glass while keeping human-in-the-loop workflows and guardrails front and center.

## Features

- **Agents Home** – browse agents across business units, inspect dependencies, guardrails, and recent activity.
- **Operational HITL Console** – triage escalations with SLA-aware queues and simple resolution/escalation controls.
- **Outcome Insights** – connect runs and tasks directly to business KPIs for executives and operations teams.
- **Governance Workspace** – track guardrail coverage and assemble evidence packs for audits in seconds.
- **Optimization Lab** – review live recommendations, experiments, and rollout progress to balance cost, latency, and quality.

The interface embraces a Palantir-style dark aesthetic, emphasizing contrast, clarity, and contextual detail.

## Getting Started

1. Serve the static files (for example using Python):
   ```bash
   python -m http.server 8000
   ```
2. Navigate to `http://localhost:8000` in your browser and select `index.html`.
3. Use the left navigation to explore each workspace. Filters in the sidebar scope the agent inventory.

## Customizing Data

All sample content lives in [`app.js`](app.js). Update the `agents`, `actionQueue`, `insights`, `policies`, and `recommendations` arrays to tailor the console to your environment or wire them up to a real data source.

## Project Structure

```
├── index.html   # Application shell and templates
├── styles.css   # Mission-control inspired design system
├── app.js       # Sample data, view logic, and lightweight state management
```

## Roadmap Ideas

- Integrate real telemetry via WebSockets for live updates.
- Replace static dependency chips with an interactive graph visualization.
- Persist queue actions and filters in local storage to mimic a production console.
- Layer in authentication and role-based layouts for exec, ops, and security personas.

## License

This prototype is provided as-is for demonstration purposes.
