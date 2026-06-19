function hasFinalScore(match) {
  return Number.isFinite(match.homeScore) && Number.isFinite(match.awayScore);
}

function createRow(code) {
  return {
    code,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    pts: 0,
  };
}

export function computeGroupStandings(matches, teamCodes) {
  if (!Array.isArray(matches) || matches.length === 0 || !Array.isArray(teamCodes) || teamCodes.length === 0) {
    return [];
  }

  const allowed = new Set(teamCodes);
  const table = Object.fromEntries(teamCodes.map((code) => [code, createRow(code)]));
  let scoredMatches = 0;

  matches.forEach((match) => {
    if (!hasFinalScore(match)) {
      return;
    }
    if (!allowed.has(match.home) || !allowed.has(match.away)) {
      return;
    }

    const home = table[match.home];
    const away = table[match.away];
    home.played += 1;
    away.played += 1;
    home.gf += match.homeScore;
    home.ga += match.awayScore;
    away.gf += match.awayScore;
    away.ga += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.wins += 1;
      home.pts += 3;
      away.losses += 1;
    } else if (match.homeScore < match.awayScore) {
      away.wins += 1;
      away.pts += 3;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.pts += 1;
      away.pts += 1;
    }

    scoredMatches += 1;
  });

  if (scoredMatches === 0) {
    return [];
  }

  return Object.values(table)
    .map((row) => ({
      ...row,
      gd: row.gf - row.ga,
    }))
    .sort((left, right) => {
      if (right.pts !== left.pts) {
        return right.pts - left.pts;
      }
      if (right.gd !== left.gd) {
        return right.gd - left.gd;
      }
      if (right.gf !== left.gf) {
        return right.gf - left.gf;
      }
      return left.code.localeCompare(right.code);
    });
}
