function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function MatchCard({ match, teamsByCode }) {
  const home = teamsByCode[match.home];
  const away = teamsByCode[match.away];

  return (
    <article className="card match-card">
      <p className="summary-meta">Group {match.group}</p>
      <h3>{formatDate(match.date)}</h3>
      <p className="match-sides">
        <strong>{home ? `${home.flag} ${home.name}` : match.home}</strong>
        <span>vs</span>
        <strong>{away ? `${away.flag} ${away.name}` : match.away}</strong>
      </p>
      <p>
        {match.venue}, {match.city}
      </p>
    </article>
  );
}
