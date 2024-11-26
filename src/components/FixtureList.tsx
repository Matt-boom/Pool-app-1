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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Week {currentWeek} Fixtures
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {weekMatches.map(match => (
          <div 
            key={match.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {match.isCompleted && <Trophy className="text-yellow-500 w-5 h-5" />}
                <span className="text-sm text-gray-500">
                  {match.date || 'Date TBD'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-right font-medium">{match.homeTeam.name}</div>
              <div className="flex justify-center items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={match.homeScore || ''}
                  onChange={(e) => handleScoreChange(match.id, true, e.target.value, match)}
                  className="w-12 text-center border rounded p-1"
                  disabled={match.isCompleted}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={match.awayScore || ''}
                  onChange={(e) => handleScoreChange(match.id, false, e.target.value, match)}
                  className="w-12 text-center border rounded p-1"
                  disabled={match.isCompleted}
                />
              </div>
              <div className="text-left font-medium">{match.awayTeam.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};