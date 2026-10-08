export default function Breadcrumbs({ building, floor, room, onNavigate }) {
  return (
    <nav className="breadcrumb" aria-label="Campus navigation">
      <button type="button" onClick={onNavigate.campus}>Campus</button>
      {building && (
        <>
          <span className="sep">›</span>
          {floor || room ? (
            <button type="button" onClick={onNavigate.building}>{building.name}</button>
          ) : (
            <span className="current">{building.name}</span>
          )}
        </>
      )}
      {floor && (
        <>
          <span className="sep">›</span>
          {room ? (
            <button type="button" onClick={onNavigate.floor}>{floor.label}</button>
          ) : (
            <span className="current">{floor.label}</span>
          )}
        </>
      )}
      {room && (
        <>
          <span className="sep">›</span>
          <span className="current">{room.name}</span>
        </>
      )}
    </nav>
  );
}
