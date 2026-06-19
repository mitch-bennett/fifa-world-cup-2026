import CountrySummary from './CountrySummary';

export default function GroupCard({ group, teams, standings, selectedCode, onSelect, nextMatchLabel }) {
  const selectedCountry = teams.find((team) => team.code === selectedCode) || teams[0] || null;
  const teamsByCode = teams.reduce((acc, team) => {
    acc[team.code] = team;
    return acc;
  }, {});

  return (
    <section className="card group-card">
      <h3>Group {group}</h3>
      {teams.length === 0 ? (
        <p className="empty">No teams seeded yet for this group.</p>
      ) : (
        <>
          {standings?.length > 0 && (
            <div className="standings-wrap">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row) => {
                    const team = teamsByCode[row.code];
                    return (
                      <tr key={row.code}>
                        <td>{team ? `${team.flag} ${team.name}` : row.code}</td>
                        <td>{row.played}</td>
                        <td>{row.wins}</td>
                        <td>{row.draws}</td>
                        <td>{row.losses}</td>
                        <td>{row.gf}</td>
                        <td>{row.ga}</td>
                        <td>{row.gd}</td>
                        <td>{row.pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="team-selector">
            {teams.map((country) => (
              <button
                key={country.code}
                type="button"
                className={`team-pill${country.code === selectedCountry?.code ? ' active' : ''}`}
                onClick={() => onSelect(country.code)}
              >
                {country.flag} {country.name}
              </button>
            ))}
          </div>
          <CountrySummary country={selectedCountry} nextMatchLabel={nextMatchLabel} />
        </>
      )}
    </section>
  );
}
