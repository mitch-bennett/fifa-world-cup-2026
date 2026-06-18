import CountrySummary from './CountrySummary';

export default function GroupCard({ group, teams }) {
  return (
    <section className="card group-card">
      <h3>Group {group}</h3>
      <div className="group-grid">
        {teams.map((country) => (
          <CountrySummary key={country.code} country={country} compact />
        ))}
      </div>
    </section>
  );
}
