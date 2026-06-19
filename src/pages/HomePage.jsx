import { Suspense, lazy, useMemo, useState } from 'react';
import CountrySummary from '../components/CountrySummary';
import useCountries from '../hooks/useCountries';
import useSchedule from '../hooks/useSchedule';
import { formatMatchPreview, getNextMatch } from '../utils/matches';

const GlobeView = lazy(() => import('../components/GlobeView'));

export default function HomePage() {
  const { countries, byCode } = useCountries();
  const { byTeam } = useSchedule();
  const [selectedCode, setSelectedCode] = useState(countries[0]?.code || null);
  const [isSpinning, setIsSpinning] = useState(false);

  const selectedCountry = useMemo(() => byCode[selectedCode], [byCode, selectedCode]);
  const nextMatchLabel = useMemo(() => {
    if (!selectedCountry) {
      return null;
    }
    const nextMatch = getNextMatch(byTeam[selectedCountry.code], selectedCountry.code);
    return formatMatchPreview(nextMatch, selectedCountry.code, byCode);
  }, [byCode, byTeam, selectedCountry]);

  return (
    <section className="stack-lg">
      <div className="card globe-panel">
        <div className="title-row">
          <h2>Interactive Globe</h2>
          <button
            type="button"
            className="reset-btn"
            onClick={() => setIsSpinning((current) => !current)}
          >
            {isSpinning ? 'Pause spin' : 'Play spin'}
          </button>
        </div>
        <p>Click a highlighted country to open a preview before navigating to the full profile.</p>
        <Suspense fallback={<p className="empty">Loading globe...</p>}>
          <GlobeView
            countries={countries}
            selectedCode={selectedCode}
            onCountrySelect={setSelectedCode}
            autoRotate={isSpinning}
          />
        </Suspense>
      </div>
      <aside className="card home-preview">
        <h2>Country Preview</h2>
        {selectedCountry ? (
          <CountrySummary country={selectedCountry} nextMatchLabel={nextMatchLabel} />
        ) : (
          <p className="empty">Select a country marker to preview team details.</p>
        )}
      </aside>
    </section>
  );
}
