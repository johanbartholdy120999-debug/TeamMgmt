import React, { useState } from 'react';
import Students from './components/Students';
import Teams from './components/Teams';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="App">
      <header className="app-header">
        <h1>Team Management System</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={`nav-tab ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Teams
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'students' && <Students />}
        {activeTab === 'teams' && <Teams />}
      </main>
    </div>
  );
}

export default App;
