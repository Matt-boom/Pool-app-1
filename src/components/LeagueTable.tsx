import React from 'react';
import { Team } from '../types';

interface Props {
  teams: Team[];
}

export const LeagueTable: React.FC<Props> = ({ teams }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-4 py-3 text-left">Pos</th>
            <th className="px-4 py-3 text-left">Team</th>
            <th className="px-4 py-3 text-center">P</th>
            <th className="px-4 py-3 text-center">W</th>
            <th className="px-4 py-3 text-center">L</th>
            <th className="px-4 py-3 text-center">F</th>
            <th className="px-4 py-3 text-center">A</th>
            <th className="px-4 py-3 text-center">Diff</th>
            <th className="px-4 py-3 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr 
              key={team.id}
              className={`
                ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                ${index < 4 ? 'border-l-4 border-green-500' : ''}
              `}
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 font-medium">{team.name}</td>
              <td className="px-4 py-3 text-center">{team.played}</td>
              <td className="px-4 py-3 text-center">{team.won}</td>
              <td className="px-4 py-3 text-center">{team.lost}</td>
              <td className="px-4 py-3 text-center">{team.framesFor}</td>
              <td className="px-4 py-3 text-center">{team.framesAgainst}</td>
              <td className="px-4 py-3 text-center">
                {team.framesFor - team.framesAgainst}
              </td>
              <td className="px-4 py-3 text-center font-bold">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};