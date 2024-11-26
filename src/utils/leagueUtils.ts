export const calculateTotalWeeks = (teamCount: number): number => {
  // Each team plays home and away = (teamCount - 1) * 2
  return (teamCount - 1) * 2;
};

export const generateFixtures = (teams: Team[]): Match[] => {
  const fixtures: Match[] = [];
  const totalRounds = teams.length - 1;
  const matchesPerRound = teams.length / 2;

  // Generate first half of season (home games)
  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const homeIndex = (round + match) % (teams.length - 1);
      const awayIndex = (teams.length - 1 - match + round) % (teams.length - 1);
      
      // Last team stays fixed, others rotate
      const homeTeam = match === 0 ? teams[teams.length - 1] : teams[homeIndex];
      const awayTeam = match === 0 ? teams[round] : teams[awayIndex];

      fixtures.push({
        id: `${round + 1}-${homeTeam.id}-${awayTeam.id}`,
        homeTeam,
        awayTeam,
        homeScore: 0,
        awayScore: 0,
        week: round + 1,
        isCompleted: false,
        date: ''
      });
    }
  }

  // Generate second half of season (away games - reverse of first half)
  const firstHalfFixtures = [...fixtures];
  firstHalfFixtures.forEach(match => {
    fixtures.push({
      id: `return-${match.id}`,
      homeTeam: match.awayTeam,
      awayTeam: match.homeTeam,
      homeScore: 0,
      awayScore: 0,
      week: match.week + totalRounds,
      isCompleted: false,
      date: ''
    });
  });

  return fixtures;
};

export const updateLeagueTable = (teams: Team[], matches: Match[]): Team[] => {
  // Reset all team stats
  teams.forEach(team => {
    team.played = 0;
    team.won = 0;
    team.lost = 0;
    team.framesFor = 0;
    team.framesAgainst = 0;
    team.points = 0;
  });

  // Calculate new stats based on completed matches
  matches.forEach(match => {
    if (match.isCompleted) {
      const homeTeam = teams.find(t => t.id === match.homeTeam.id);
      const awayTeam = teams.find(t => t.id === match.awayTeam.id);

      if (homeTeam && awayTeam) {
        // Update home team stats
        homeTeam.played++;
        homeTeam.framesFor += match.homeScore;
        homeTeam.framesAgainst += match.awayScore;
        if (match.homeScore > match.awayScore) {
          homeTeam.won++;
          homeTeam.points += 2;
        } else {
          homeTeam.lost++;
        }

        // Update away team stats
        awayTeam.played++;
        awayTeam.framesFor += match.awayScore;
        awayTeam.framesAgainst += match.homeScore;
        if (match.awayScore > match.homeScore) {
          awayTeam.won++;
          awayTeam.points += 2;
        } else {
          awayTeam.lost++;
        }
      }
    }
  });

  // Sort teams by points, then frame difference
  return [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aFrameDiff = a.framesFor - a.framesAgainst;
    const bFrameDiff = b.framesFor - b.framesAgainst;
    return bFrameDiff - aFrameDiff;
  });
};