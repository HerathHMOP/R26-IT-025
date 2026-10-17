
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

// General Layout
import MainLayout from './components/layout/MainLayout';

// General Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';

// English Speech & Pronunciation Component
import EnglishModule from './components/english/EnglishModule';

// Module Wrapper Component
const ModuleWrapper = ({ Component, exitPath = '/dashboard' }) => {
  const navigate = useNavigate();

  return (
    <Component onExit={() => navigate(exitPath)} />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* General Website Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* General Dashboards */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/teacher/dashboard"
            element={<TeacherDashboard />}
          />

          {/* English Speech & Pronunciation Module */}
          <Route
            path="/module/english"
            element={
              <ModuleWrapper
                Component={EnglishModule}
                exitPath="/dashboard"
              />
            }
          />

          {/* Fallback Route */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
