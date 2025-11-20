import React, { useState, useEffect } from 'react';
import { teamsAPI, studentsAPI } from '../services/api';

function Teams() {
  const [teams, setTeams] = useState({});
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, studentsData] = await Promise.all([
        teamsAPI.getAll(),
        studentsAPI.getAll(),
      ]);
      setTeams(teamsData);
      setStudents(studentsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamsAPI.create({ name: teamName });
      setTeamName('');
      loadData();
    } catch (err) {
      setError('Failed to create team');
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !selectedStudent) return;

    try {
      await teamsAPI.addMember(selectedTeam, parseInt(selectedStudent));
      setSelectedStudent('');
      loadData();
    } catch (err) {
      setError('Failed to add member to team');
      console.error(err);
    }
  };

  const getStudentName = (studentId) => {
    const student = students[studentId];
    return student ? student.name : `Unknown (ID: ${studentId})`;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="teams-container">
      <h2>Team Management</h2>

      {error && <div className="error">{error}</div>}

      <div className="teams-grid">
        <div className="team-form-section">
          <form onSubmit={handleCreateTeam} className="team-form">
            <h3>Create New Team</h3>
            <div className="form-group">
              <label>Team Name *</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Team
            </button>
          </form>

          <form onSubmit={handleAddMember} className="team-form">
            <h3>Add Member to Team</h3>
            <div className="form-group">
              <label>Select Team *</label>
              <select
                value={selectedTeam || ''}
                onChange={(e) => setSelectedTeam(e.target.value)}
                required
              >
                <option value="">Choose a team...</option>
                {Object.values(teams).map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Student *</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                <option value="">Choose a student...</option>
                {Object.values(students).map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </form>
        </div>

        <div className="teams-list">
          <h3>Teams List</h3>
          {Object.keys(teams).length === 0 ? (
            <p>No teams found. Create your first team above.</p>
          ) : (
            <div className="teams-cards">
              {Object.values(teams).map((team) => (
                <div key={team.id} className="team-card">
                  <h4>{team.name}</h4>
                  <p className="team-id">Team ID: {team.id}</p>
                  <div className="team-members">
                    <strong>Members ({team.members.length}):</strong>
                    {team.members.length === 0 ? (
                      <p className="no-members">No members yet</p>
                    ) : (
                      <ul>
                        {team.members.map((memberId, index) => (
                          <li key={index}>{getStudentName(memberId)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Teams;
