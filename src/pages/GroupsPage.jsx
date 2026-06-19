import { useEffect, useMemo, useState } from 'react';
import groups from '../data/groups.json';
import GroupCard from '../components/GroupCard';
import useCountries from '../hooks/useCountries';
import useSchedule from '../hooks/useSchedule';
import { formatMatchPreview, getNextMatch } from '../utils/matches';
import { computeGroupStandings } from '../utils/standings';

export default function GroupsPage() {
  const { byCode } = useCountries();
  const { byTeam, matches } = useSchedule();
  const seededGroups = useMemo(
    () =>
      groups.map((entry) => ({
        group: entry.group,
        teamCodes: entry.teams,
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

  useEffect(() => {
    setSelectedByGroup((current) => {
      const next = { ...current };
      let changed = false;

      seededGroups.forEach((entry) => {
        const selectedCode = next[entry.group];
        const hasSelected = entry.teams.some((team) => team.code === selectedCode);
        if (!hasSelected) {
          next[entry.group] = entry.teams[0]?.code || null;
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [seededGroups]);

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
        const selectedCode = selectedByGroup[entry.group];
        const fallbackCode = entry.teams[0]?.code || null;
        const activeCode = entry.teams.some((team) => team.code === selectedCode) ? selectedCode : fallbackCode;

        const computedStandings = computeGroupStandings(
          matches.filter((match) => match.group === entry.group),
          entry.teamCodes,
        );
        const standings = computedStandings.length > 0 ? computedStandings : entry.standings;

        return (
          <GroupCard
            key={entry.group}
            group={entry.group}
            teams={entry.teams}
            standings={standings}
            selectedCode={activeCode}
            onSelect={(code) => handleSelect(entry.group, code)}
            nextMatchLabel={formatMatchPreview(
              getNextMatch(byTeam[activeCode], activeCode),
              activeCode,
              byCode,
            )}
          />
        );
      })}
    </section>
  );
}
