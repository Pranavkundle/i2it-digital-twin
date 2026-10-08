import { campusFeatures } from '../data/campusData.js';

export default function ContextPanel({
  nav,
  building,
  floor,
  room,
  feature,
  searchResult,
  onExploreFloors,
  onSelectRoom,
  onNavigateSearch,
  fullRoomId,
}) {
  if (searchResult && !room) {
    return (
      <div className="panel glass">
        <div className="panel-tag">Search result</div>
        {searchResult.type === 'room' ? (
          <>
            <h2>{searchResult.roomName}</h2>
            <p className="muted">{searchResult.buildingName}</p>
            <p className="muted">{searchResult.floorLabel}</p>
            <p className="id-line">{searchResult.fullId}</p>
            <button type="button" className="primary" onClick={onNavigateSearch}>
              View location
            </button>
          </>
        ) : (
          <>
            <h2>{searchResult.buildingName}</h2>
            <p className="muted">{searchResult.floorCount} floors (prototype data)</p>
            <button type="button" className="primary" onClick={onNavigateSearch}>
              View location
            </button>
          </>
        )}
      </div>
    );
  }

  if (feature) {
    const meta = campusFeatures.find((f) => f.id === feature.id) || feature;
    return (
      <div className="panel glass">
        <div className="panel-tag">{meta.tag}</div>
        <h2>{meta.name}</h2>
        <p className="body">{meta.desc}</p>
        <p className="demo-note">Facility metadata from public sources; 3D geometry is stylized.</p>
      </div>
    );
  }

  if (room && floor && building) {
    return (
      <div className="panel glass">
        <div className="panel-tag">Room</div>
        <h2>{room.name}</h2>
        <p className="muted">{building.name}</p>
        <p className="muted">{floor.label}</p>
        <p className="id-line">{fullRoomId}</p>
        {room.type && <p className="chip">{room.type}</p>}
        <button type="button" className="primary" onClick={() => onSelectRoom(room.id)}>
          Navigate here
        </button>
      </div>
    );
  }

  if (floor && building) {
    return (
      <div className="panel glass">
        <div className="panel-tag">{building.name}</div>
        <h2>{floor.label}</h2>
        <p className="muted">Representative room list</p>
        <ul className="room-list">
          {floor.rooms.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className={nav.roomId === r.id ? 'active' : ''}
                onClick={() => onSelectRoom(r.id)}
              >
                <span>{r.name}</span>
                <span className="rid">{building.id}-{floor.id}-{r.id}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (building && !nav.explodeFloors) {
    return (
      <div className="panel glass">
        <div className="panel-tag">Building</div>
        <h2>{building.name}</h2>
        {building.departments && (
          <ul className="dept-list">
            {building.departments.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
        {building.summary && <p className="body">{building.summary}</p>}
        <p className="muted">{building.floors.length} prototype floors</p>
        <button type="button" className="primary" onClick={onExploreFloors}>
          Explore Floors
        </button>
      </div>
    );
  }

  if (building && nav.explodeFloors && !floor) {
    return (
      <div className="panel glass">
        <div className="panel-tag">{building.name}</div>
        <h2>Floors</h2>
        <p className="body">Click a floor slab or label in the 3D view.</p>
      </div>
    );
  }

  return (
    <div className="panel glass">
      <div className="panel-tag">Campus</div>
      <h2>I²IT Pune</h2>
      <p className="body">
        Select a building in the 3D view or search for a room. Academic Building is the primary
        demo path for floor explosion and room navigation.
      </p>
      <p className="demo-note">{campusFeatures.length} supporting facilities shown as stylized models.</p>
    </div>
  );
}
