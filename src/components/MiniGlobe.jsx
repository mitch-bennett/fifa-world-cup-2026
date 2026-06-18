import Globe from 'react-globe.gl';

export default function MiniGlobe({ country }) {
  if (!country) {
    return null;
  }

  return (
    <div className="mini-globe card">
      <h3>Team Location</h3>
      <div className="mini-globe-canvas">
        <Globe
          width={320}
          height={280}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
          pointsData={[{ ...country, size: 0.45, color: '#00d1ff' }]}
          pointAltitude="size"
          pointColor="color"
          pointRadius={0.35}
        />
      </div>
    </div>
  );
}
