import { useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeView({ countries, onCountrySelect }) {
  const globeRef = useRef(null);

  const pointsData = useMemo(
    () =>
      countries.map((country) => ({
        ...country,
        size: 0.4,
        color: '#f9d342',
      })),
    [countries],
  );

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
        pointLabel={(d) => `${d.flag} ${d.name}`}
        onPointClick={(point) => onCountrySelect(point.code)}
      />
    </div>
  );
}
