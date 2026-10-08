import { useCallback, useRef, useState } from 'react';
import {
  campusFeatures,
  campusMeta,
  fullRoomId,
  getBuilding,
  getFloor,
  getRoom,
} from './data/campusData.js';
import { answerCampusQuery } from './utils/aiAssistant.js';
import { findMatch } from './utils/search.js';
import { getFeatureById } from './three/sceneManager.js';
import SceneViewport from './components/SceneViewport.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import ContextPanel from './components/ContextPanel.jsx';
import CampusAssistant from './components/CampusAssistant.jsx';
import FloorPlanView from './components/FloorPlanView.jsx';
import PrototypeStatus from './components/PrototypeStatus.jsx';
import './App.css';

const initialNav = {
  buildingId: null,
  floorId: null,
  roomId: null,
  explodeFloors: false,
  featureId: null,
};

export default function App() {
  const sceneRef = useRef(null);
  const [nav, setNav] = useState(initialNav);
  const [viewMode, setViewMode] = useState('3d');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [toast, setToast] = useState('');
  const [assistantOpen, setAssistantOpen] = useState(false);

  const pushScene = useCallback(
    (patch) => {
      setNav((prev) => {
        const next = { ...prev, ...patch };
        sceneRef.current?.applyState({
          buildingId: next.buildingId,
          floorId: next.floorId,
          roomId: next.roomId,
          explodeFloors: next.explodeFloors,
          viewMode,
        });
        return next;
      });
    },
    [viewMode],
  );

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(''), 3200);
  };

  const goCampus = useCallback(() => {
    setNav(initialNav);
    setSearchResult(null);
    sceneRef.current?.resetCameraCampus();
    setViewMode('3d');
    sceneRef.current?.applyState({
      buildingId: null,
      floorId: null,
      roomId: null,
      explodeFloors: false,
      viewMode: '3d',
    });
  }, []);

  const selectBuilding = useCallback((buildingId) => {
    setSearchResult(null);
    setNav({ ...initialNav, buildingId, explodeFloors: false, featureId: null });
    sceneRef.current?.applyState({
      buildingId,
      floorId: null,
      roomId: null,
      explodeFloors: false,
      viewMode,
    });
  }, [viewMode]);

  const exploreFloors = useCallback(() => {
    pushScene({ explodeFloors: true, floorId: null, roomId: null });
  }, [pushScene]);

  const selectFloor = useCallback((buildingId, floorId) => {
    setSearchResult(null);
    pushScene({ buildingId, floorId, roomId: null, explodeFloors: true, featureId: null });
  }, [pushScene]);

  const selectRoom = useCallback((roomId) => {
    pushScene({ roomId, explodeFloors: true });
  }, [pushScene]);

  const onFeatureClick = useCallback((id) => {
    setNav({ ...initialNav, featureId: id });
  }, []);

  const runSearch = (q) => {
    const query = (q ?? searchQuery).trim();
    if (!query) {
      showToast('Enter a room, lab, or building name.');
      return;
    }
    const found = findMatch(query);
    if (!found) {
      setSearchResult(null);
      showToast(`No match for "${query}". Try "TPO Office" or "Library".`);
      return;
    }
    setSearchResult(found);
    if (found.type === 'room') {
      setNav({
        buildingId: found.buildingId,
        floorId: found.floorId,
        roomId: found.roomId,
        explodeFloors: true,
        featureId: null,
      });
      sceneRef.current?.applyState({
        buildingId: found.buildingId,
        floorId: found.floorId,
        roomId: found.roomId,
        explodeFloors: true,
        viewMode,
      });
      showToast(`Found ${found.roomName}`);
    } else {
      setNav({
        buildingId: found.buildingId,
        floorId: null,
        roomId: null,
        explodeFloors: false,
        featureId: null,
      });
      sceneRef.current?.applyState({
        buildingId: found.buildingId,
        floorId: null,
        roomId: null,
        explodeFloors: false,
        viewMode,
      });
      showToast(`Showing ${found.buildingName}`);
    }
  };

  const navigateToSearchResult = () => {
    if (!searchResult) return;
    runSearch(searchResult.roomName || searchResult.buildingName);
  };

  const onAssistantNavigate = (target) => {
    if (!target) return;
    setNav({
      buildingId: target.buildingId,
      floorId: target.floorId || null,
      roomId: target.roomId || null,
      explodeFloors: !!target.explodeFloors,
      featureId: null,
    });
    sceneRef.current?.applyState({
      buildingId: target.buildingId,
      floorId: target.floorId || null,
      roomId: target.roomId || null,
      explodeFloors: !!target.explodeFloors,
      viewMode,
    });
  };

  const setView = (mode) => {
    if (mode === 'floorplan' && !nav.floorId) {
      showToast('Select a floor first.');
      return;
    }
    setViewMode(mode);
    sceneRef.current?.applyState({ viewMode: mode });
  };

  const building = nav.buildingId ? getBuilding(nav.buildingId) : null;
  const floor = building && nav.floorId ? getFloor(building, nav.floorId) : null;
  const room =
    building && floor && nav.roomId ? getRoom(building, floor, nav.roomId) : null;
  const feature = nav.featureId ? getFeatureById(nav.featureId) : null;

  const breadcrumbHandlers = {
    campus: goCampus,
    building: () => selectBuilding(nav.buildingId),
    floor: () => selectFloor(nav.buildingId, nav.floorId),
  };

  return (
    <div className="app">
      <header className="top-bar">
        <div className="brand">
          <span className="brand-title">I²IT CAMPUS TWIN</span>
          <span className="brand-sub">Prototype · Representative campus model</span>
        </div>
        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, labs, offices, buildings…"
            aria-label="Search campus"
          />
          <button type="submit">Search</button>
        </form>
        <div className="view-controls">
          <button
            type="button"
            className={viewMode === '3d' ? 'active' : ''}
            onClick={() => setView('3d')}
          >
            3D View
          </button>
          <button
            type="button"
            className={viewMode === 'floorplan' ? 'active' : ''}
            onClick={() => setView('floorplan')}
          >
            Floor Plan
          </button>
          <button type="button" onClick={goCampus}>Reset</button>
          <button type="button" className="accent" onClick={goCampus}>Demo Reset</button>
        </div>
      </header>

      <main className="main-grid">
        <section className="viewer-section">
          <div className="viewer-wrap">
            <SceneViewport
              ref={sceneRef}
              hidden={viewMode === 'floorplan'}
              onBuildingClick={selectBuilding}
              onFloorClick={selectFloor}
              onFeatureClick={onFeatureClick}
            />
            {viewMode === 'floorplan' && floor && building && (
              <FloorPlanView
                building={building}
                floor={floor}
                selectedRoomId={nav.roomId}
                onSelectRoom={selectRoom}
              />
            )}
            <div className="viewer-footer">
              <div className="footer-tag">
                <strong>Prototype</strong>
                <span>{campusMeta.name}</span>
              </div>
              <div className="quick-actions">
                <button type="button" onClick={goCampus}>Campus Overview</button>
                <button type="button" onClick={() => selectBuilding('B001')}>
                  Explore Academic Building
                </button>
                <button type="button" onClick={() => setView('floorplan')}>Floor Plan</button>
                <button type="button" onClick={() => setAssistantOpen(true)}>Campus Assistant</button>
              </div>
            </div>
          </div>
        </section>

        <aside className="context-column">
          <Breadcrumbs
            building={building}
            floor={floor}
            room={room}
            onNavigate={breadcrumbHandlers}
          />
          <ContextPanel
            nav={nav}
            building={building}
            floor={floor}
            room={room}
            feature={feature}
            searchResult={searchResult}
            onExploreFloors={exploreFloors}
            onSelectRoom={selectRoom}
            onNavigateSearch={navigateToSearchResult}
            fullRoomId={room && floor && building ? fullRoomId(building, floor, room) : null}
          />
          <PrototypeStatus />
        </aside>
      </main>

      {toast && <div className="toast show">{toast}</div>}

      <CampusAssistant
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onNavigate={onAssistantNavigate}
        answer={answerCampusQuery}
      />
      <button
        type="button"
        className="assistant-fab"
        onClick={() => setAssistantOpen(true)}
      >
        Campus Assistant
      </button>
    </div>
  );
}
