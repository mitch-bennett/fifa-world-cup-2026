import { useMemo, useState } from 'react';
import groups from '../data/groups.json';
import GroupCard from '../components/GroupCard';
import useCountries from '../hooks/useCountries';
import useSchedule from '../hooks/useSchedule';
import { formatMatchPreview, getNextMatch } from '../utils/matches';

export default function GroupsPage() {
  const { byCode } = useCountries();
  const { byTeam } = useSchedule();
  const seededGroups = useMemo(
    () =>
      groups.map((entry) => ({
        group: entry.group,
        teams: entry.teams.map((code) => byCode[code]).filter(Boolean),
        standings: entry.standings || [],
      })),
    [byCode],
  );

  const [selectedByGroup, setSelectedByGroup] = useState(() => {
    return seededGroups.reduce((acc, entry) => {
      acc[entry.group] = entry.teams[0]?.code || null;
      return acc;
    }, {});
  });

  function handleSelect(group, code) {
    setSelectedByGroup((current) => ({
      ...current,
      [group]: code,
    }));
  }

  return (
    <section className="stack-lg">
      <header>
        <h2>Groups A-L</h2>
        <p>Select a country in any group to preview the shared team summary card (official full-draw group structure).</p>
      </header>
      {seededGroups.map((entry) => {
        return (
          <GroupCard
            key={entry.group}
            group={entry.group}
            teams={entry.teams}
            standings={entry.standings}
            selectedCode={selectedByGroup[entry.group]}
            onSelect={(code) => handleSelect(entry.group, code)}
            nextMatchLabel={formatMatchPreview(
              getNextMatch(byTeam[selectedByGroup[entry.group]], selectedByGroup[entry.group]),
              selectedByGroup[entry.group],
              byCode,
            )}
          />
        );
      })}
    </section>
  );
}
