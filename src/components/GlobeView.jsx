import { useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeView({ countries, selectedCode, onCountrySelect, autoRotate = false }) {
  const globeRef = useRef(null);
  const wrapperRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 760, height: 520 });

  const markersData = useMemo(
    () =>
      countries.map((country) => ({
        ...country,
        selected: country.code === selectedCode,
      })),
    [countries, selectedCode],
  );

  useEffect(() => {
    if (!globeRef.current) {
      return;
    }
    const controls = globeRef.current.controls();
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.45;
    // Wheel zooms the globe; the side-by-side layout keeps the page short
    // enough that this no longer fights with page scrolling.
    controls.enableZoom = true;
  }, [autoRotate]);

  useEffect(() => {
    if (!globeRef.current || !selectedCode) {
      return;
    }
    const selected = countries.find((country) => country.code === selectedCode);
    if (!selected) {
      return;
    }
    // Recenter on the selected country but preserve the user's current zoom.
    const { altitude } = globeRef.current.pointOfView();
    globeRef.current.pointOfView({ lat: selected.lat, lng: selected.lng, altitude }, 700);
  }, [countries, selectedCode]);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const updateDimensions = () => {
      if (!wrapperRef.current) {
        return;
      }
      const width = Math.max(300, Math.floor(wrapperRef.current.clientWidth));
      const height = Math.max(320, Math.min(540, Math.floor(width * 0.68)));
      setDimensions({ width, height });
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="globe-canvas">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#7dc7ff"
        atmosphereAltitude={0.16}
        htmlElementsData={markersData}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.012}
        htmlElement={(d) => {
          const el = document.createElement('button');
          el.type = 'button';
          el.className = `globe-flag-marker${d.selected ? ' selected' : ''}`;
          el.textContent = d.flag;
          el.title = `${d.flag} ${d.name}`;
          el.setAttribute('aria-label', d.name);
          el.style.pointerEvents = 'auto';
          el.onclick = () => onCountrySelect(d.code);
          return el;
        }}
      />
    </div>
  );
}
