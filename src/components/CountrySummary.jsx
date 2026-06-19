import { Link } from 'react-router-dom';

export default function CountrySummary({ country, compact = false, nextMatchLabel }) {
  if (!country) {
    return null;
  }

  return (
    <article className={`card country-summary${compact ? ' compact' : ''}`}>
      <div className="summary-head">
        <p className="flag">{country.flag}</p>
        <div>
          <h3>{country.name}</h3>
          <p>
            Group {country.team.group} • FIFA rank {country.team.fifaRank ?? 'TBD'}
          </p>
          {nextMatchLabel && <p className="summary-meta">{nextMatchLabel}</p>}
        </div>
      </div>
      {!compact && <p>{country.blurb}</p>}
      <Link className="pill-link" to={`/country/${country.code}`}>
        Open Profile
      </Link>
    </article>
  );
}
