import { useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeView({ countries, selectedCode, onCountrySelect }) {
  const globeRef = useRef(null);

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
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
  }, []);

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

  return (
    <div className="globe-canvas">
      <Globe
        ref={globeRef}
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
