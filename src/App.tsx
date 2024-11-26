import React, { useState, useEffect } from 'react';
import { Team, Match, League } from './types';
import { LeagueTable } from './components/LeagueTable';
import { FixtureList } from './components/FixtureList';
import { TeamManagement } from './components/TeamManagement';
import { generateFixtures, updateLeagueTable, calculateTotalWeeks } from './utils/leagueUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [league, setLeague] = useState<League>({
    id: '1',
    name: 'Pool League 2024',
    teams: [],
    matches: [],
    currentWeek: 1,
    totalWeeks: 0
  });

  useEffect(() => {
    if (league.teams.length >= 2) {
      const fixtures = generateFixtures(league.teams);
      const totalWeeks = calculateTotalWeeks(league.teams.length);
      setLeague(prev => ({
        ...prev,
        matches: fixtures,
        totalWeeks
      }));
    }
  }, [league.teams]);

  const handleAddTeam = (name: string) => {
    if (league.teams.length < 12) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name,
        played: 0,
        won: 0,
        lost: 0,
        framesFor: 0,
        framesAgainst: 0,
        points: 0
      };
      setLeague(prev => ({
        ...prev,
        teams: [...prev.teams, newTeam]
      }));
    }
  };

  const handleRemoveTeam = (id: string) => {
    setLeague(prev => ({
      ...prev,
      teams: prev.teams.filter(team => team.id !== id),
      matches: prev.matches.filter(
        match => match.homeTeam.id !== id && match.awayTeam.id !== id
      )
    }));
  };

  const handleScoreUpdate = (matchId: string, homeScore: number, awayScore: number) => {
    setLeague(prev => {
      const updatedMatches = prev.matches.map(match => {
        if (match.id === matchId) {
          const newMatch = {
            ...match,
            homeScore,
            awayScore,
            isCompleted: homeScore + awayScore === 10
          };
          return newMatch;
        }
        return match;
      });

      const updatedTeams = updateLeagueTable([...prev.teams], updatedMatches);

      return {
        ...prev,
        matches: updatedMatches,
        teams: updatedTeams
      };
    });
  };

  const changeWeek = (delta: number) => {
    setLeague(prev => ({
      ...prev,
      currentWeek: Math.max(1, Math.min(prev.currentWeek + delta, prev.totalWeeks))
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{league.name}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          <div className="space-y-8">
            {league.teams.length >= 2 ? (
              <>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => changeWeek(-1)}
                    disabled={league.currentWeek === 1}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-semibold">
                    Week {league.currentWeek} of {league.totalWeeks}
                  </h2>
                  <button
                    onClick={() => changeWeek(1)}
                    disabled={league.currentWeek === league.totalWeeks}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <FixtureList
                  matches={league.matches}
                  currentWeek={league.currentWeek}
                  onScoreUpdate={handleScoreUpdate}
                />
                <LeagueTable teams={league.teams} />
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome to the Pool League Manager
                </h2>
                <p className="text-gray-600">
                  Add at least 2 teams to start generating fixtures
                </p>
              </div>
            )}
          </div>
          
          <div>
            <TeamManagement
              teams={league.teams}
              onAddTeam={handleAddTeam}
              onRemoveTeam={handleRemoveTeam}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;