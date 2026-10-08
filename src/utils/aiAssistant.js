import { findMatch, findBuildingByName } from './search.js';

/**
 * Simulated campus assistant — pattern matching only (not an LLM).
 * @returns {{ answer: string, navigate?: { buildingId, floorId?, roomId?, explodeFloors?: boolean } }}
 */
export function answerCampusQuery(text) {
  const lower = text.toLowerCase().trim();

  let m =
    lower.match(/where(?:'s| is) (?:the )?(.+?)\??$/) ||
    lower.match(/location of (?:the )?(.+?)\??$/);
  if (m) {
    const found = findMatch(m[1]);
    if (found?.type === 'room') {
      return {
        answer: `${found.roomName} is located in the ${found.buildingName} on the ${found.floorLabel}.`,
        navigate: {
          buildingId: found.buildingId,
          floorId: found.floorId,
          roomId: found.roomId,
          explodeFloors: true,
        },
      };
    }
    if (found?.type === 'building') {
      return {
        answer: `${found.buildingName} has ${found.floorCount} representative floor${found.floorCount > 1 ? 's' : ''} in this prototype. Opening the building view.`,
        navigate: { buildingId: found.buildingId, explodeFloors: false },
      };
    }
    return {
      answer: `I couldn't find anything matching "${m[1]}" in the local prototype dataset. Try "TPO Office", "Library", or "PPCRC".`,
    };
  }

  m = lower.match(/how many floors (?:does |do |in )?(?:the )?(.+?)(?: have)?\??$/);
  if (m) {
    const b = findBuildingByName(m[1]);
    if (b) {
      return {
        answer: `${b.name} has ${b.floors.length} floors in this prototype dataset (representative, not surveyed).`,
      };
    }
    return {
      answer: `I don't recognise "${m[1]}" as a building in the demo. Try Academic Building, PPCRC, or Library.`,
    };
  }

  m = lower.match(/how many rooms (?:are there )?(?:in|on) (?:the )?(.+)/);
  if (m) {
    const b2 = findBuildingByName(m[1]);
    if (b2) {
      const total = b2.floors.reduce((sum, f) => sum + f.rooms.length, 0);
      return {
        answer: `${b2.name} has ${total} representative rooms across ${b2.floors.length} floors in the prototype.`,
      };
    }
  }

  const fallback = findMatch(lower);
  if (fallback?.type === 'room') {
    return {
      answer: `${fallback.roomName} is on the ${fallback.floorLabel} of ${fallback.buildingName} (ID: ${fallback.fullId}).`,
      navigate: {
        buildingId: fallback.buildingId,
        floorId: fallback.floorId,
        roomId: fallback.roomId,
        explodeFloors: true,
      },
    };
  }
  if (fallback?.type === 'building') {
    return {
      answer: `${fallback.buildingName} — select Explore Floors to see the demo room list.`,
      navigate: { buildingId: fallback.buildingId, explodeFloors: false },
    };
  }

  return {
    answer:
      'I can answer questions like "Where is the TPO office?", "Where is the library?", or "How many floors does the Academic Building have?" (Prototype / local dataset only.)',
  };
}
