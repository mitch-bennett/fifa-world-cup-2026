function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function ScheduleTable({ matches, teamsByCode }) {
  if (!matches.length) {
    return (
      <div className="card">
        <p className="empty">No matches found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="card table-shell">
      <p className="table-meta">{matches.length} match(es) shown</p>
      <table>
        <caption className="sr-only">Filtered World Cup match schedule</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Group</th>
            <th scope="col">Match</th>
            <th scope="col">Venue</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>{formatDate(match.date)}</td>
              <td>{match.group}</td>
              <td>
                {teamsByCode[match.home]?.name || match.home} vs {teamsByCode[match.away]?.name || match.away}
              </td>
              <td>
                {match.venue}, {match.city}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
