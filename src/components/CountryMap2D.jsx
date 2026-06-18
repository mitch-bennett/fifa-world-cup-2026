import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';

export default function CountryMap2D({ country }) {
  if (!country) {
    return null;
  }

  return (
    <section className="card">
      <h3>Regional Map</h3>
      <div className="map-wrap">
        <MapContainer
          center={[country.lat, country.lng]}
          zoom={4}
          scrollWheelZoom={false}
          style={{ height: '320px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker center={[country.lat, country.lng]} radius={9} pathOptions={{ color: '#f97316' }}>
            <Tooltip direction="top" offset={[0, -8]} permanent>
              {country.name}
            </Tooltip>
          </CircleMarker>
        </MapContainer>
      </div>
    </section>
  );
}
