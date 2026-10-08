import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createSceneManager } from '../three/sceneManager.js';

const SceneViewport = forwardRef(function SceneViewport(
  { hidden, onBuildingClick, onFloorClick, onFeatureClick },
  ref,
) {
  const canvasRef = useRef(null);
  const hotspotRef = useRef(null);
  const wrapRef = useRef(null);
  const managerRef = useRef(null);
  const callbacksRef = useRef({ onBuildingClick, onFloorClick, onFeatureClick });
  callbacksRef.current = { onBuildingClick, onFloorClick, onFeatureClick };

  useImperativeHandle(ref, () => ({
    applyState: (s) => managerRef.current?.applyState(s),
    resetCameraCampus: () => managerRef.current?.resetCameraCampus(),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = hotspotRef.current;
    if (!canvas || !layer) return;

    managerRef.current = createSceneManager(canvas, layer, {
      onBuildingClick: (id) => callbacksRef.current.onBuildingClick?.(id),
      onFloorClick: (b, f) => callbacksRef.current.onFloorClick?.(b, f),
      onFeatureClick: (id) => callbacksRef.current.onFeatureClick?.(id),
    });

    const ro = new ResizeObserver(() => {
      const el = wrapRef.current;
      if (!el || !managerRef.current) return;
      managerRef.current.resize(el.clientWidth, el.clientHeight);
    });
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => {
      ro.disconnect();
      managerRef.current?.dispose();
      managerRef.current = null;
    };
  }, []);

  return (
    <div ref={wrapRef} className={`scene-host${hidden ? ' hidden' : ''}`}>
      <canvas ref={canvasRef} id="scene-canvas" />
      <div className="drag-hint">Drag to orbit · scroll to zoom · click buildings & floors</div>
      <div ref={hotspotRef} className="hotspot-layer" />
    </div>
  );
});

export default SceneViewport;
