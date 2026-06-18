import { useMemo, useState } from 'react';
import useCountries from '../hooks/useCountries';
import useSchedule from '../hooks/useSchedule';
import ScheduleTable from '../components/ScheduleTable';
import ScoresLinks from '../components/ScoresLinks';

export default function SchedulePage() {
  const { matches } = useSchedule();
  const { countries, byCode } = useCountries();

  const [groupFilter, setGroupFilter] = useState('ALL');
  const [teamFilter, setTeamFilter] = useState('ALL');

  const groups = useMemo(
    () => ['ALL', ...Array.from(new Set(matches.map((match) => match.group))).sort()],
    [matches],
  );

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const groupPass = groupFilter === 'ALL' || match.group === groupFilter;
      const teamPass = teamFilter === 'ALL' || match.home === teamFilter || match.away === teamFilter;
      return groupPass && teamPass;
    });
  }, [matches, groupFilter, teamFilter]);

  return (
    <section className="stack-lg">
      <header>
        <h2>Match Schedule</h2>
        <p>Filter by group or team. Live result links are pinned below.</p>
      </header>

      <div className="card filters">
        <label>
          Group
          <select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label>
          Team
          <select value={teamFilter} onChange={(event) => setTeamFilter(event.target.value)}>
            <option value="ALL">ALL</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ScheduleTable matches={filteredMatches} teamsByCode={byCode} />
      <ScoresLinks />
    </section>
  );
}
