import { campusData, fullRoomId, getBuilding } from '../data/campusData.js';

export function findBuildingByName(nameQ) {
  const q = (nameQ || '').toLowerCase().trim();
  return campusData.buildings.find(
    (b) => b.name.toLowerCase().includes(q) || q.includes(b.name.toLowerCase()),
  );
}

/** @returns {null | { type: 'room', buildingId, buildingName, floorId, floorLabel, roomId, roomName, fullId, roomType? } | { type: 'building', buildingId, buildingName, floorCount }} */
export function findMatch(queryRaw) {
  const q = (queryRaw || '').toLowerCase().trim();
  if (!q) return null;

  for (const b of campusData.buildings) {
    for (const f of b.floors) {
      for (const r of f.rooms) {
        const fid = fullRoomId(b, f, r).toLowerCase();
        if (
          fid === q ||
          r.name.toLowerCase() === q ||
          r.name.toLowerCase().includes(q) ||
          fid.includes(q)
        ) {
          return {
            type: 'room',
            buildingId: b.id,
            buildingName: b.name,
            floorId: f.id,
            floorLabel: f.label,
            roomId: r.id,
            roomName: r.name,
            roomType: r.type,
            fullId: fullRoomId(b, f, r),
          };
        }
      }
    }
  }

  for (const b of campusData.buildings) {
    if (b.name.toLowerCase().includes(q) || b.id.toLowerCase() === q) {
      return {
        type: 'building',
        buildingId: b.id,
        buildingName: b.name,
        floorCount: b.floors.length,
      };
    }
  }

  return null;
}

export function resolveNavigationTarget(match) {
  if (!match) return null;
  if (match.type === 'room') {
    return {
      buildingId: match.buildingId,
      floorId: match.floorId,
      roomId: match.roomId,
      explodeFloors: true,
    };
  }
  return { buildingId: match.buildingId, floorId: null, roomId: null, explodeFloors: false };
}

export { getBuilding };
