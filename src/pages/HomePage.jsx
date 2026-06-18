import { Suspense, lazy, useMemo, useState } from 'react';
import CountrySummary from '../components/CountrySummary';
import useCountries from '../hooks/useCountries';

const GlobeView = lazy(() => import('../components/GlobeView'));

export default function HomePage() {
  const { countries, byCode } = useCountries();
  const [selectedCode, setSelectedCode] = useState(countries[0]?.code || null);

  const selectedCountry = useMemo(() => byCode[selectedCode], [byCode, selectedCode]);

  return (
    <section className="hero-grid">
      <div className="card globe-panel">
        <h2>Interactive Globe</h2>
        <p>Click a highlighted country to open a preview before navigating to the full profile.</p>
        <Suspense fallback={<p className="empty">Loading globe...</p>}>
          <GlobeView countries={countries} onCountrySelect={setSelectedCode} />
        </Suspense>
      </div>
      <aside>
        <h2>Country Preview</h2>
        <CountrySummary country={selectedCountry} />
      </aside>
    </section>
  );
}
