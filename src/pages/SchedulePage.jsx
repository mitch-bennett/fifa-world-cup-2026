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
  const [dateFilter, setDateFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('ASC');

  const groups = useMemo(
    () => ['ALL', ...Array.from(new Set(matches.map((match) => match.group))).sort()],
    [matches],
  );

  const matchDates = useMemo(
    () => ['ALL', ...Array.from(new Set(matches.map((match) => match.date.slice(0, 10)))).sort()],
    [matches],
  );

  const filteredMatches = useMemo(() => {
    const filtered = matches.filter((match) => {
      const groupPass = groupFilter === 'ALL' || match.group === groupFilter;
      const teamPass = teamFilter === 'ALL' || match.home === teamFilter || match.away === teamFilter;
      const datePass = dateFilter === 'ALL' || match.date.startsWith(dateFilter);
      return groupPass && teamPass && datePass;
    });

    return filtered.sort((left, right) => {
      const leftTime = new Date(left.date).getTime();
      const rightTime = new Date(right.date).getTime();
      return sortOrder === 'ASC' ? leftTime - rightTime : rightTime - leftTime;
    });
  }, [matches, groupFilter, teamFilter, dateFilter, sortOrder]);

  function resetFilters() {
    setGroupFilter('ALL');
    setTeamFilter('ALL');
    setDateFilter('ALL');
    setSortOrder('ASC');
  }

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

        <label>
          Date
          <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
            {matchDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="ASC">Earliest first</option>
            <option value="DESC">Latest first</option>
          </select>
        </label>

        <button type="button" className="reset-btn" onClick={resetFilters}>
          Reset filters
        </button>
      </div>

      <ScheduleTable matches={filteredMatches} teamsByCode={byCode} />
      <ScoresLinks />
    </section>
  );
}
