# I²IT Pune Campus Digital Twin (prototype)

Frontend proof of concept for an I²IT campus digital twin: **Campus → Building → Floor → Room** navigation in Three.js, with search and a **local** campus assistant.

Original single-file prototypes are preserved in [`uploads/`](uploads/).

## Tech stack

- React + Vite
- Three.js
- CSS (digital-twin UI)

No backend, database, or external AI APIs in this prototype.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:4318**

Production build:

```bash
npm run build
npm run preview
```

## Presentation demo (2–3 min)

1. Open app — campus overview  
2. Click **Academic Building** (3D or “Explore Academic Building”)  
3. **Explore Floors** — floors separate  
4. Select **2nd Floor** (slab or label)  
5. Select **TPO Office**  
6. **Demo Reset**  
7. Search: `TPO Office` — camera navigates  
8. Open **Campus Assistant** — ask: `Where is the TPO office?`  
9. Show **Prototype status** panel (right column)  
10. Explain: representative data today; verified survey + MongoDB + BIM + real AI in later phases  

## Data model

`src/data/campusData.js` — buildings `B001` (Academic), `B002` (PPCRC), `B003` (Library) with floors and rooms.  
`campusFeatures` — info-only facilities (hostels, auditorium, etc.).

Room IDs: `B001-F02-R01` format.

## Documentation

- [research/campus-research.md](research/campus-research.md) — verified facts vs demo data  
- [PROJECT_STATUS.md](PROJECT_STATUS.md) — implemented / simulated / future  

## Architecture (intended production)

| Layer | Future |
|-------|--------|
| Frontend | React, Three.js, floor plan UI |
| Backend | Node.js, Express |
| Database | MongoDB |
| AI | LLM / NLU |
| Assets | BIM / GLB, surveyed floor plans |
| Navigation | Campus graph, waypoints |

Only the frontend prototype column is built in this repository.
