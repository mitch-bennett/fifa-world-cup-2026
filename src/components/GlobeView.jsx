import { useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeView({ countries, selectedCode, onCountrySelect, autoRotate = false }) {
  const globeRef = useRef(null);
  const wrapperRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 760, height: 520 });

  const pointsData = useMemo(
    () =>
      countries.map((country) => ({
        ...country,
        size: country.code === selectedCode ? 0.62 : 0.4,
        color: country.code === selectedCode ? '#00d1ff' : '#f9d342',
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
  }, [autoRotate]);

  useEffect(() => {
    if (!globeRef.current || !selectedCode) {
      return;
    }
    const selected = countries.find((country) => country.code === selectedCode);
    if (!selected) {
      return;
    }
    globeRef.current.pointOfView({ lat: selected.lat, lng: selected.lng, altitude: 1.65 }, 700);
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
        pointsData={pointsData}
        pointAltitude="size"
        pointColor="color"
        pointRadius={0.25}
        atmosphereColor="#7dc7ff"
        atmosphereAltitude={0.16}
        pointLabel={(d) => `${d.flag} ${d.name}`}
        onPointClick={(point) => onCountrySelect(point.code)}
      />
    </div>
  );
}
