function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function MatchCard({ match, teamsByCode }) {
  const home = teamsByCode[match.home];
  const away = teamsByCode[match.away];
  const hasScore = Number.isFinite(match.homeScore) && Number.isFinite(match.awayScore);

  return (
    <article className="card match-card">
      <p className="summary-meta">Group {match.group}</p>
      <h3>{formatDate(match.date)}</h3>
      <p className="match-sides">
        <strong>
          {home ? `${home.flag} ${home.name}` : match.home}
          {hasScore ? ` ${match.homeScore}` : ''}
        </strong>
        <span>{hasScore ? '-' : 'vs'}</span>
        <strong>
          {hasScore ? `${match.awayScore} ` : ''}
          {away ? `${away.flag} ${away.name}` : match.away}
        </strong>
      </p>
      <p>
        {match.venue}, {match.city}
      </p>
    </article>
  );
}
