import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function MiniGlobe({ country }) {
  const globeRef = useRef(null);

  useEffect(() => {
    if (!globeRef.current) {
      return;
    }
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;

    globeRef.current.pointOfView({ lat: country.lat, lng: country.lng, altitude: 1.8 }, 600);
  }, [country]);

  if (!country) {
    return null;
  }

  return (
    <div className="mini-globe card">
      <h3>Team Location</h3>
      <div className="mini-globe-canvas">
        <Globe
          ref={globeRef}
          width={320}
          height={280}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          pointsData={[{ ...country, size: 0.45, color: '#00d1ff' }]}
          pointAltitude="size"
          pointColor="color"
          pointRadius={0.35}
          atmosphereColor="#7dc7ff"
          atmosphereAltitude={0.13}
        />
      </div>
    </div>
  );
}
