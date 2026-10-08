// DEMO DATA — replace with verified/surveyed campus data in Phase 2

/** @typedef {{ id: string, name: string, type?: string }} Room */
/** @typedef {{ id: string, label: string, rooms: Room[] }} Floor */
/** @typedef {{ id: string, name: string, x: number, z: number, w: number, d: number, wallColor: string, roofColor: string, departments?: string[], summary?: string, floors: Floor[] }} Building */
/** @typedef {{ id: string, name: string, tag: string, desc: string, x: number, z: number, y?: number }} CampusFeature */

export const campusMeta = {
  name: 'I²IT Pune Campus Digital Twin',
  location: 'P-14, Rajiv Gandhi Infotech Park, MIDC Phase I, Hinjawadi, Pune 411057',
  disclaimer:
    'Prototype campus model with representative room assignments. Not an official architectural survey.',
};

export const campusData = {
  buildings: [
    {
      id: 'B001',
      name: 'Academic Building',
      x: 0,
      z: -12,
      w: 14,
      d: 9,
      wallColor: '#C9BBA0',
      roofColor: '#8B7F63',
      departments: [
        'Computer Engineering',
        'Information Technology',
        'Electronics & Telecommunication',
      ],
      summary:
        'Primary academic block for B.E. programmes. Representative floor slabs demonstrate building → floor → room navigation.',
      floors: [
        {
          id: 'F00',
          label: 'Ground Floor',
          rooms: [
            { id: 'R01', name: 'Reception', type: 'Office' },
            { id: 'R02', name: 'Admission Office', type: 'Office' },
            { id: 'R03', name: 'Mechanical Workshop', type: 'Lab' },
            { id: 'R04', name: 'Seminar Hall 1', type: 'Hall' },
          ],
        },
        {
          id: 'F01',
          label: '1st Floor',
          rooms: [
            { id: 'R01', name: 'CSE Lab 1', type: 'Laboratory' },
            { id: 'R02', name: 'CSE Lab 2', type: 'Laboratory' },
            { id: 'R03', name: 'IT Lab 1', type: 'Laboratory' },
            { id: 'R04', name: 'Faculty Cabin – CSE', type: 'Faculty' },
            { id: 'R05', name: 'Classroom A101', type: 'Classroom' },
            { id: 'R06', name: 'Classroom A102', type: 'Classroom' },
          ],
        },
        {
          id: 'F02',
          label: '2nd Floor',
          rooms: [
            { id: 'R01', name: 'TPO Office', type: 'Office' },
            { id: 'R02', name: 'E&TC Lab 1', type: 'Laboratory' },
            { id: 'R03', name: 'E&TC Lab 2', type: 'Laboratory' },
            { id: 'R04', name: 'HOD Cabin – E&TC', type: 'Faculty' },
            { id: 'R05', name: 'Classroom A201', type: 'Classroom' },
          ],
        },
        {
          id: 'F03',
          label: '3rd Floor',
          rooms: [
            { id: 'R01', name: 'Project Lab', type: 'Laboratory' },
            { id: 'R02', name: 'Research Cell', type: 'Lab' },
            { id: 'R03', name: 'Conference Room', type: 'Room' },
            { id: 'R04', name: 'Classroom A301', type: 'Classroom' },
          ],
        },
      ],
    },
    {
      id: 'B002',
      name: 'PPCRC',
      x: 8,
      z: 6,
      w: 8,
      d: 7,
      wallColor: '#2F5D62',
      roofColor: '#1E4448',
      summary:
        'Pralhad P. Chhabria Research Centre — institute R&D, consultancy and collaboration (verified facility name; room list is demo data).',
      floors: [
        {
          id: 'F00',
          label: 'Ground Floor',
          rooms: [
            { id: 'R01', name: 'Innovation Lab', type: 'Laboratory' },
            { id: 'R02', name: 'Robotics Lab', type: 'Laboratory' },
            { id: 'R03', name: 'Incubation Cell', type: 'Office' },
          ],
        },
        {
          id: 'F01',
          label: '1st Floor',
          rooms: [
            { id: 'R01', name: 'R&D Office', type: 'Office' },
            { id: 'R02', name: 'Meeting Room', type: 'Room' },
          ],
        },
      ],
    },
    {
      id: 'B003',
      name: 'Library',
      x: 14,
      z: -2,
      w: 8,
      d: 8,
      wallColor: '#B5654A',
      roofColor: '#7A4636',
      summary: 'Central library facility (verified concept; layout and rooms are representative).',
      floors: [
        {
          id: 'F00',
          label: 'Ground Floor',
          rooms: [
            { id: 'R01', name: 'Circulation Desk', type: 'Desk' },
            { id: 'R02', name: 'Reading Hall', type: 'Hall' },
            { id: 'R03', name: 'Reference Section', type: 'Section' },
          ],
        },
        {
          id: 'F01',
          label: '1st Floor',
          rooms: [
            { id: 'R01', name: 'Digital Library', type: 'Lab' },
            { id: 'R02', name: 'Periodicals Section', type: 'Section' },
            { id: 'R03', name: 'Discussion Room 1', type: 'Room' },
            { id: 'R04', name: 'Discussion Room 2', type: 'Room' },
          ],
        },
      ],
    },
  ],
};

/** Info-only campus entities (no floor/room survey in prototype) */
export const campusFeatures = [
  {
    id: 'auditorium',
    name: 'Auditorium',
    tag: 'Campus Life',
    desc:
      'Auditorium for orientations, tech talks and placement events (capacity figures from public reports — not modelled room-by-room).',
    x: -12,
    z: -2,
    meshKey: 'auditorium',
  },
  {
    id: 'mithila',
    name: 'Hostel Mithila',
    tag: 'Residences',
    desc: 'On-campus girls residence (verified name on official campus-life pages).',
    x: 11,
    z: 11,
    meshKey: 'mithila',
  },
  {
    id: 'nalanda',
    name: 'Hostel Nalanda',
    tag: 'Residences',
    desc: 'On-campus boys residence (verified name on official campus-life pages).',
    x: -11,
    z: 11,
    meshKey: 'nalanda',
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria',
    tag: 'Campus Life',
    desc: 'Campus cafeteria — verified facility; geometry is stylized.',
    x: 16,
    z: 5,
    meshKey: 'cafeteria',
  },
  {
    id: 'sports',
    name: 'Sports & Recreation',
    tag: 'Campus Life',
    desc:
      'On-campus recreational spaces; institute also references nearby Balewadi Sports Complex (~2 km) for additional facilities.',
    x: 0,
    z: 18,
    y: 3.2,
    meshKey: 'sports',
  },
  {
    id: 'plaza',
    name: "Founder's Plaza",
    tag: 'History',
    desc: 'Central open space — stylized plaza marker in the prototype model.',
    x: 0,
    z: 2,
    y: 4.4,
    meshKey: 'plaza',
  },
];

export function fullRoomId(building, floor, room) {
  return `${building.id}-${floor.id}-${room.id}`;
}

export function getBuilding(buildingId) {
  return campusData.buildings.find((b) => b.id === buildingId);
}

export function getFloor(building, floorId) {
  return building.floors.find((f) => f.id === floorId);
}

export function getRoom(building, floor, roomId) {
  return floor.rooms.find((r) => r.id === roomId);
}
