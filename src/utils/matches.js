export function getNextMatch(matches, teamCode) {
  if (!matches?.length || !teamCode) {
    return null;
  }

  const sorted = [...matches].sort((left, right) => new Date(left.date) - new Date(right.date));
  return sorted.find((match) => match.home === teamCode || match.away === teamCode) || null;
}

export function formatMatchPreview(match, teamCode, byCode) {
  if (!match) {
    return 'Next match: TBA';
  }

  const opponentCode = match.home === teamCode ? match.away : match.home;
  const opponentName = byCode[opponentCode]?.name || opponentCode;

  const stamp = new Date(match.date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `Next: ${stamp} vs ${opponentName}`;
}
