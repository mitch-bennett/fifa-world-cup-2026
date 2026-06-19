import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';

export default function CountryMap2D({ country }) {
  if (!country) {
    return null;
  }
  const markerLat = country.capitalLat ?? country.lat;
  const markerLng = country.capitalLng ?? country.lng;

  return (
    <section className="card">
      <h3>Capital Map</h3>
      <div className="map-wrap">
        <MapContainer
          center={[markerLat, markerLng]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: '320px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker center={[markerLat, markerLng]} radius={9} pathOptions={{ color: '#f97316' }}>
            <Tooltip direction="top" offset={[0, -8]} permanent>
              {country.capital}
            </Tooltip>
          </CircleMarker>
        </MapContainer>
      </div>
    </section>
  );
}
