import CountrySummary from './CountrySummary';

export default function GroupCard({ group, teams, selectedCode, onSelect }) {
  const selectedCountry = teams.find((team) => team.code === selectedCode) || teams[0] || null;

  return (
    <section className="card group-card">
      <h3>Group {group}</h3>
      {teams.length === 0 ? (
        <p className="empty">No teams seeded yet for this group.</p>
      ) : (
        <>
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
          <CountrySummary country={selectedCountry} />
        </>
      )}
    </section>
  );
}
