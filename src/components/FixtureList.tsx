import React from 'react';
import { Match } from '../types';
import { Trophy } from 'lucide-react';

interface Props {
  matches: Match[];
  currentWeek: number;
  onScoreUpdate: (matchId: string, homeScore: number, awayScore: number) => void;
}

export const FixtureList: React.FC<Props> = ({ matches, currentWeek, onScoreUpdate }) => {
  const weekMatches = matches.filter(match => match.week === currentWeek);

  const handleScoreChange = (
    matchId: string,
    isHome: boolean,
    value: string,
    currentMatch: Match
  ) => {
    const numValue = value === '' ? 0 : Math.min(10, Math.max(0, parseInt(value) || 0));
    if (isHome) {
      onScoreUpdate(matchId, numValue, currentMatch.awayScore);
    } else {
      onScoreUpdate(matchId, currentMatch.homeScore, numValue);
    }
  };

  return (
    <div>
      <h2>Week {currentWeek} Fixtures</h2>
      <ul>
        {weekMatches.map(match => (
          <li key={match.id}>
            <div>
              {match.isCompleted && <Trophy />}
              <span>{match.date || 'Date TBD'}</span>
            </div>
            <div>
              <span>{match.homeTeam.name}</span>
              <input
                type="number"
                value={match.homeScore}
                onChange={(e) => handleScoreChange(match.id, true, e.target.value, match)}
                className="w-12 text-center border rounded p-1"
                disabled={match.isCompleted}
              />
              -
              <input
                type="number"
                value={match.awayScore}
                onChange={(e) => handleScoreChange(match.id, false, e.target.value, match)}
                className="w-12 text-center border rounded p-1"
                disabled={match.isCompleted}
              />
              <span>{match.awayTeam.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};