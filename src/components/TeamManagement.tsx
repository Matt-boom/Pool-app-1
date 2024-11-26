import React, { useState } from 'react';
import { Team } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  teams: Team[];
  onAddTeam: (name: string) => void;
  onRemoveTeam: (id: string) => void;
}

export const TeamManagement: React.FC<Props> = ({ teams, onAddTeam, onRemoveTeam }) => {
  const [newTeamName, setNewTeamName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim() && teams.length < 12) {
      onAddTeam(newTeamName.trim());
      setNewTeamName('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Enter team name"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={30}
          />
          <button
            type="submit"
            disabled={teams.length >= 12}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Team
          </button>
        </div>
        {teams.length >= 12 && (
          <p className="text-red-500 text-sm mt-2">
            Maximum number of teams (12) reached
          </p>
        )}
      </form>

      <div className="grid gap-2">
        {teams.map(team => (
          <div
            key={team.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="font-medium">{team.name}</span>
            <button
              onClick={() => onRemoveTeam(team.id)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};