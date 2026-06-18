const scoreSources = [
  { label: 'FIFA Match Centre', href: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup' },
  { label: 'ESPN Scores', href: 'https://www.espn.com/soccer/scoreboard' },
  { label: 'Google Scores', href: 'https://www.google.com/search?q=fifa+world+cup+scores' },
];

export default function ScoresLinks() {
  return (
    <section className="card">
      <h3>Live and Recent Scores</h3>
      <div className="link-row">
        {scoreSources.map((source) => (
          <a key={source.href} className="pill-link" href={source.href} target="_blank" rel="noreferrer">
            {source.label}
          </a>
        ))}
      </div>
    </section>
  );
}
