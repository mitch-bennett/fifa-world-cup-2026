function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function ScheduleTable({ matches, teamsByCode }) {
  if (!matches.length) {
    return <p className="empty">No matches found for these filters.</p>;
  }

  return (
    <div className="card table-shell">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Group</th>
            <th>Match</th>
            <th>Venue</th>
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
