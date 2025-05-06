import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import RoadmapsList from './components/RoadmapsList/RoadmapsList';
import AddTechStackForm from './components/AddTechStackForm/AddTechStackForm';

function App() {
  const [showAddForm, setShowAddForm] = useState(false);

  // Handle adding a new tech stack
  const handleTechStackAdded = (newTechStack) => {
    // Reset form visibility
    setShowAddForm(false);
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main className="main-content">
          <Container fluid="lg" className="py-4">
            <Routes>
              {/* Home route - shows the dropdown only */}
              <Route path="/" element={<Dashboard view="dropdown-only" />} />
              
              {/* All techstacks route - shows the header and all roadmaps list */}
              <Route path="/alltechstacks" element={<Dashboard view="all-roadmaps" />} />
              
              {/* Roadmaps route - shows the published roadmaps list */}
              <Route path="/roadmaps" element={<RoadmapsList />} />
              
              {/* New techstack route - shows the add form */}
              <Route path="/newtechstack" element={<AddTechStackForm onTechStackAdded={handleTechStackAdded} />} />
              
              {/* Redirect any unknown paths to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </main>

      </div>
    </Router>
  );
}

export default App;