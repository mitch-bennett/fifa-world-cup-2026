export function getNextMatch(matches, teamCode) {
  if (!matches?.length || !teamCode) {
    return null;
  }

  const now = new Date();
  const sorted = [...matches].sort((left, right) => new Date(left.date) - new Date(right.date));
  const teamMatches = sorted.filter((match) => match.home === teamCode || match.away === teamCode);

  // Prefer the next upcoming fixture relative to current date.
  return teamMatches.find((match) => new Date(match.date) >= now) || null;
}

export function formatMatchPreview(match, teamCode, byCode) {
  if (!match) {
    return 'Next: no upcoming fixture in current schedule';
  }

  const opponentCode = match.home === teamCode ? match.away : match.home;
  const opponentName = byCode[opponentCode]?.name || opponentCode;

  const stamp = new Date(match.date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `Next: ${stamp} vs ${opponentName}`;
}
