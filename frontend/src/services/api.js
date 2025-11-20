const API_BASE_URL = '/';

// Students API
export const studentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}students/${id}`);
    if (!response.ok) throw new Error('Failed to fetch student');
    return response.json();
  },

  create: async (studentData) => {
    const response = await fetch(`${API_BASE_URL}students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) throw new Error('Failed to create student');
    return response.json();
  },

  update: async (id, studentData) => {
    const response = await fetch(`${API_BASE_URL}students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}students/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete student');
    return response.json();
  },
};

// Teams API
export const teamsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}teams`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
  },

  create: async (teamData) => {
    const response = await fetch(`${API_BASE_URL}teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) throw new Error('Failed to create team');
    return response.json();
  },

  addMember: async (teamId, studentId) => {
    const response = await fetch(`${API_BASE_URL}teams/${teamId}/add_member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id: studentId }),
    });
    if (!response.ok) throw new Error('Failed to add member to team');
    return response.json();
  },
};
