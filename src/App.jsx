import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Now the Home Hub
import Profile from './pages/Profile';     // New dedicated page
import Notes from './pages/Notes';
import MemeZone from './pages/MemeZone';
import Discussion from './pages/Discussion';
import ThreadView from './pages/ThreadView';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import NotificationBell from './components/NotificationBell';
import { FaUserCircle } from 'react-icons/fa'; // Import icon for profile link
import VerifyEmail from './pages/VerifyEmail';
import GoogleSuccess from './pages/GoogleSuccess'; // Import

// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <nav className="navbar">
      <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)'}}>UpStart</div>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Link to="/dashboard">Home</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/memes">MemeZone</Link>
        <Link to="/discussion">Chat</Link>
        
        {user.role === 'admin' && (
          <Link to="/admin" style={{ color: '#ff4444', fontWeight: 'bold' }}>Admin Panel</Link>
        )}
        
        {/* Updated Profile Link with Icon */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#9C27B0' }}>
          <FaUserCircle size={20} /> Profile
        </Link>

        <SettingsToggle /> {/* Placeholder for settings icon/link if you prefer */}
        <NotificationBell />
        <Link to="/" onClick={() => localStorage.clear()} style={{marginLeft: '10px'}}>Logout</Link>
      </div>
    </nav>
  );
};

// Small helper for settings link to keep navbar clean
const SettingsToggle = () => <Link to="/settings">⚙️</Link>;


// --- MAIN APP COMPONENT ---
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Login />} />
        
        {/* Routes with Navbar */}
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} /> {/* NEW ROUTE */}
        <Route path="/notes" element={<><Navbar /><Notes /></>} />
        <Route path="/memes" element={<><Navbar /><MemeZone /></>} />
        <Route path="/discussion" element={<><Navbar /><Discussion /></>} />
        <Route path="/discussion/:id" element={<ThreadView />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        
        <Route 
          path="/settings" 
          element={
            <>
              <Navbar />
              <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </>
          } 
        />

        <Route path="/admin" element={<><Navbar /><AdminDashboard /></>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;