# Project status — I²IT Campus Digital Twin

**Current:** Phase 2–4 proof of concept (frontend prototype)

## Implemented (real in this repo)

- Three.js 3D campus viewer (WebGL)
- Interactive buildings with Building → Floor → Room hierarchy (B001–B003)
- Floor vertical separation (“explode”) animation
- Building / floor / room selection with breadcrumbs
- Keyword search over local dataset
- Camera transitions (campus, building, floor, room focus)
- Lightweight floor-plan mode (prototype grid)
- Campus Assistant UI with **local pattern matching** (not an LLM)
- Prototype status & roadmap panel
- Stylized campus facilities (hostels, auditorium, cafeteria, sports, plaza)

## Simulated (looks real, local logic only)

- Campus Assistant “AI” (regex / keyword matching on `campusData`)
- Floor plans (not architectural drawings)
- Indoor navigation paths (camera fly-to only, no graph routing)

## Representative / demo data

- Room lists, room IDs, floor labels
- Building positions, dimensions, and simplified geometry
- Some facility blurbs shortened for UI

See `src/data/campusData.js` and comments `DEMO DATA`.

## Not implemented

- MongoDB, Express, REST API
- Authentication or admin module
- BIM / GLB high-fidelity models
- Real-time IoT, occupancy, or indoor GPS
- External LLM or NLU API
- Verified campus survey / GIS import

## Future work

1. Campus data collection & verification  
2. High-fidelity 3D assets (Blender → GLB)  
3. Database + API  
4. Search & navigation engine (waypoints)  
5. Production AI assistant  
6. Live digital twin integrations  
