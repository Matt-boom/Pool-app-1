export interface Team {
  id: string;
  name: string;
  played: number;
  won: number;
  lost: number;
  framesFor: number;
  framesAgainst: number;
  points: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  week: number;
  isCompleted: boolean;
  date: string;
}

export interface League {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
  currentWeek: number;
  totalWeeks: number;
}