import { useMemo } from 'react';
import schedule from '../data/schedule.json';

export default function useSchedule() {
  const matches = schedule;

  const byTeam = useMemo(() => {
    return matches.reduce((acc, match) => {
      const sides = [match.home, match.away];
      sides.forEach((code) => {
        if (!acc[code]) {
          acc[code] = [];
        }
        acc[code].push(match);
      });
      return acc;
    }, {});
  }, [matches]);

  return {
    matches,
    byTeam,
  };
}
