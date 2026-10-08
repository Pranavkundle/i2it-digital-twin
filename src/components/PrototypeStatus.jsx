const implemented = [
  '3D Campus Viewer',
  'Building Selection',
  'Floor Exploration',
  'Room Search',
  'Campus Assistant',
  'Floor Plan View',
];

const future = [
  'Verified Campus Dataset',
  'MongoDB Database',
  'REST API',
  'High-Fidelity 3D Models',
  'Accurate Floor Plans',
  'Advanced Navigation',
  'Real AI / NLU',
  'Live Indoor Positioning',
];

const phases = [
  'Phase 1 — Requirement + Campus Data Collection',
  'Phase 2 — High-Fidelity 3D Models',
  'Phase 3 — MongoDB + REST API',
  'Phase 4 — Search + Navigation Engine',
  'Phase 5 — AI Campus Assistant',
  'Phase 6 — Live Digital Twin / IoT',
];

export default function PrototypeStatus() {
  return (
    <div className="status-block glass">
      <h3>Prototype status</h3>
      <ul className="check-list">
        {implemented.map((item) => (
          <li key={item}><span className="ok">✓</span> {item}</li>
        ))}
      </ul>
      <h4>Next phase</h4>
      <ul className="check-list muted-list">
        {future.map((item) => (
          <li key={item}><span className="pending">○</span> {item}</li>
        ))}
      </ul>
      <h4>Roadmap</h4>
      <ol className="roadmap">
        {phases.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>
      <p className="current-phase">
        <strong>Current:</strong> Phase 2–4 proof of concept (frontend prototype)
      </p>
    </div>
  );
}
