import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

// With a Geoapify key we render vector tiles and relabel them to English.
// Raster tiles are pre-rendered server-side and cannot be relabeled, so the
// keyless fallback is plain OpenStreetMap raster (local-language labels).
const OSM_RASTER_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

const mapStyle = GEOAPIFY_KEY
  ? `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${GEOAPIFY_KEY}`
  : OSM_RASTER_STYLE;

// Repoint every text label to the English name, falling back to a latin
// transliteration and finally the local name where no English name exists.
function localizeLabelsToEnglish(map) {
  const englishName = [
    'coalesce',
    ['get', 'name:en'],
    ['get', 'name:latin'],
    ['get', 'name'],
  ];
  for (const layer of map.getStyle().layers ?? []) {
    if (layer.type === 'symbol' && layer.layout && 'text-field' in layer.layout) {
      map.setLayoutProperty(layer.id, 'text-field', englishName);
    }
  }
}

export default function CountryMap2D({ country }) {
  const containerRef = useRef(null);

  const markerLat = country?.capitalLat ?? country?.lat;
  const markerLng = country?.capitalLng ?? country?.lng;

  useEffect(() => {
    if (!containerRef.current || country == null) {
      return undefined;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: [markerLng, markerLat],
      zoom: 4.5,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      if (GEOAPIFY_KEY) {
        localizeLabelsToEnglish(map);
      }
      // Marker pinpoints the capital; the basemap already labels it by name,
      // so no always-on popup (which collided with the dark theme's text color).
      const marker = new maplibregl.Marker({ color: '#f97316' })
        .setLngLat([markerLng, markerLat])
        .setPopup(
          new maplibregl.Popup({ closeButton: false, offset: 14 }).setText(country.capital),
        )
        .addTo(map);
      marker.getElement().style.cursor = 'pointer';
    });

    return () => map.remove();
  }, [country, markerLat, markerLng]);

  if (!country) {
    return null;
  }

  return (
    <section className="card">
      <h3>Capital Map</h3>
      <div ref={containerRef} className="map-wrap" style={{ height: '320px', width: '100%' }} />
    </section>
  );
}
