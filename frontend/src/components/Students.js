import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../services/api';

function Students() {
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsAPI.getAll();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        ...(formData.age && { age: parseInt(formData.age) }),
        ...(formData.email && { email: formData.email }),
      };

      if (editingId) {
        await studentsAPI.update(editingId, payload);
      } else {
        await studentsAPI.create(payload);
      }

      setFormData({ name: '', age: '', email: '' });
      setEditingId(null);
      loadStudents();
    } catch (err) {
      setError(editingId ? 'Failed to update student' : 'Failed to create student');
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      age: student.age || '',
      email: student.email || '',
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsAPI.delete(id);
        loadStudents();
      } catch (err) {
        setError('Failed to delete student');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', age: '', email: '' });
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="students-container">
      <h2>Student Management</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="student-form">
        <h3>{editingId ? 'Edit Student' : 'Add New Student'}</h3>

        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Add'} Student
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="students-list">
        <h3>Students List</h3>
        {Object.keys(students).length === 0 ? (
          <p>No students found. Add your first student above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(students).map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age || 'N/A'}</td>
                  <td>{student.email || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(student)}
                      className="btn btn-small btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="btn btn-small btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Students;
