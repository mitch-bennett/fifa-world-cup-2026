import { Suspense, lazy, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ScoresLinks from '../components/ScoresLinks';
import useCountries from '../hooks/useCountries';
import useSchedule from '../hooks/useSchedule';

const MiniGlobe = lazy(() => import('../components/MiniGlobe'));
const CountryMap2D = lazy(() => import('../components/CountryMap2D'));

function formatPopulation(value) {
  return new Intl.NumberFormat().format(value);
}

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function CountryProfilePage() {
  const { code } = useParams();
  const teamCode = (code || '').toUpperCase();
  const { byCode } = useCountries();
  const { byTeam } = useSchedule();

  const country = byCode[teamCode];
  const fixtures = useMemo(() => byTeam[teamCode] || [], [byTeam, teamCode]);

  if (!country) {
    return (
      <section className="card">
        <h2>Country not found</h2>
        <p>Try selecting a team from the globe or groups view.</p>
        <Link className="pill-link" to="/">
          Back to globe
        </Link>
      </section>
    );
  }

  return (
    <section className="stack-lg">
      <header className="card profile-header">
        <p className="flag">{country.flag}</p>
        <div>
          <h2>{country.name}</h2>
          <p>{country.blurb}</p>
          <p>
            Group {country.team.group} • FIFA rank {country.team.fifaRank} • {country.team.confederation}
          </p>
        </div>
      </header>

      <div className="profile-grid">
        <article className="card">
          <h3>Country Facts</h3>
          <ul className="facts-list">
            <li>Capital: {country.capital}</li>
            <li>Population: {formatPopulation(country.population)}</li>
            <li>Region: {country.region}</li>
            <li>Languages: {country.languages.join(', ')}</li>
          </ul>
        </article>

        <article className="card">
          <h3>Team Snapshot</h3>
          <ul className="facts-list">
            <li>Head coach: {country.team.coach}</li>
            <li>Appearances: {country.team.appearances}</li>
            <li>Best finish: {country.team.bestFinish}</li>
            <li>Qualification: {country.team.qualificationNote}</li>
            <li>Key players: {country.team.keyPlayers.join(', ')}</li>
          </ul>
        </article>
      </div>

      <div className="profile-grid">
        <Suspense fallback={<p className="empty">Loading mini globe...</p>}>
          <MiniGlobe country={country} />
        </Suspense>
        <Suspense fallback={<p className="empty">Loading map...</p>}>
          <CountryMap2D country={country} />
        </Suspense>
      </div>

      <article className="card">
        <h3>Fixtures</h3>
        {fixtures.length === 0 ? (
          <p className="empty">No fixtures in the initial dataset yet.</p>
        ) : (
          <ul className="facts-list">
            {fixtures.map((match) => {
              const opponentCode = match.home === country.code ? match.away : match.home;
              const opponent = byCode[opponentCode];
              return (
                <li key={match.id}>
                  {formatDate(match.date)} • vs {opponent?.name || opponentCode} • {match.venue}, {match.city}
                </li>
              );
            })}
          </ul>
        )}
      </article>

      <ScoresLinks />
    </section>
  );
}
