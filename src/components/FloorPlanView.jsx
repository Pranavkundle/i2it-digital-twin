import { fullRoomId } from '../data/campusData.js';

/** Lightweight prototype grid — not an architectural drawing */
export default function FloorPlanView({ building, floor, selectedRoomId, onSelectRoom }) {
  const rooms = floor.rooms;
  const cols = Math.min(3, Math.max(2, Math.ceil(Math.sqrt(rooms.length))));

  return (
    <div className="floorplan-overlay">
      <div className="fp-header">
        {building.name} — {floor.label}
        <span className="fp-disclaimer">Prototype layout · Phase 1 survey pending</span>
      </div>
      <div
        className="fp-layout"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {rooms.map((r, i) => (
          <button
            key={r.id}
            type="button"
            className={`fp-cell${selectedRoomId === r.id ? ' active' : ''}${i === Math.floor(rooms.length / 2) ? ' wide' : ''}`}
            onClick={() => onSelectRoom(r.id)}
          >
            <span className="fp-name">{r.name}</span>
            <span className="fp-id">{fullRoomId(building, floor, r)}</span>
          </button>
        ))}
        <div className="fp-corridor" aria-hidden="true">Corridor</div>
      </div>
    </div>
  );
}
