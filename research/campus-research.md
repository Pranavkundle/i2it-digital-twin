# I²IT Pune — Campus research log (prototype)

This file records **verified public facts** used in the digital twin UI and 3D labels, separate from **representative demo data** in `src/data/campusData.js`.

| Source | Fact | URL | Use in prototype |
|--------|------|-----|------------------|
| Official campus life | Residential campus in Rajiv Gandhi Infotech Park, Hinjawadi; cafeteria, gym, medical facility, green campus narrative | https://www.isquareit.edu.in/campus-life/ | Facility descriptions; footer location |
| Official campus life | Girls hostel **Mithila** and boys hostel **Nalanda** named on campus | https://www.isquareit.edu.in/campus-life/ | Hostel building labels in 3D |
| Hostel page | Separate hostels; **300** girls beds, **580** boys beds (as stated on site) | https://www.isquareit.edu.in/hostel-accommodation/ | Hostel info cards (not 3D counts) |
| NAAC SSR (public PDF) | Campus **10.22 acres**, built-up **~40,805 sqm**; auditorium ~300 seats; library automated (ILMS) | https://www.isquareit.edu.in/storage/2024/07/SSR-of-NAAC-cycle-II-with-DVV-scores-received-on-26-06-2024.pdf | Optional stats in docs; library blurb |
| Academic brochure PDF | **PPCRC** (Pralhad P. Chhabria Research Centre), R&D/consultancy cell | https://www.isquareit.edu.in/wp-content/uploads/2025/07/AB-2025-26-A4-compressed.pdf | B002 building name & panel copy |
| Address | P-14, MIDC Phase I, Hinjawadi, Pune 411057 | https://www.isquareit.edu.in/campus-life/ | `campusMeta.location` |

## Representative / not verified in this prototype

- Building X/Z positions, heights, and window patterns in Three.js
- Floor counts used for **navigation demo** (Academic 4 floors, etc.)
- Room names (TPO Office, CSE Lab, …) and IDs (`B001-F02-R01`)
- Floor plan grid layout

All of the above are marked in code with `// DEMO DATA — replace with verified/surveyed campus data in Phase 2` and in the UI as “Prototype / Representative”.

## Visual references

Public photos and campus pages informed **cream/beige academic facades**, landscaped grounds, and multi-storey massing. The scene is a **simplified interpretation**, not BIM or photogrammetry.
