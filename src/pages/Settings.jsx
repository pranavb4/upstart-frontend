import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaLock, FaTrash } from 'react-icons/fa';

const Settings = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  // Password State
  const [passData, setPassData] = useState({ current: '', new: '' });
  
  // Handlers
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/change-password', {
        currentPassword: passData.current,
        newPassword: passData.new
      });
      alert('Password updated! Please login again.');
      handleLogout();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure? This cannot be undone!')) {
      try {
        await API.delete('/users/delete');
        alert('Account deleted.');
        handleLogout();
      } catch (err) {
        alert('Failed to delete account');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="dashboard" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Settings ⚙️</h2>

      {/* 1. APPEARANCE (SRS 3.6.2) */}
      <div className="auth-box" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}>
        <h3>Appearance</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Theme Mode</span>
          <button 
            onClick={toggleTheme}
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '10px', background: isDarkMode ? '#333' : '#ddd', color: isDarkMode ? 'white' : 'black' }}
          >
            {isDarkMode ? <><FaMoon /> Dark</> : <><FaSun /> Light</>}
          </button>
        </div>
      </div>

      {/* 2. ACCOUNT SECURITY (SRS 3.6.1) */}
      <div className="auth-box" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}>
        <h3>Security</h3>
        <form onSubmit={handlePasswordChange}>
          <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Change Password</label>
          <input 
            type="password" 
            placeholder="Current Password"
            value={passData.current}
            onChange={(e) => setPassData({...passData, current: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="New Password"
            value={passData.new}
            onChange={(e) => setPassData({...passData, new: e.target.value})}
            required
          />
          <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaLock /> Update Password
          </button>
        </form>
      </div>

      {/* 3. DANGER ZONE (SRS 3.6.1) */}
      <div className="auth-box" style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #ff4444' }}>
        <h3 style={{ color: '#ff4444' }}>Danger Zone</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
          Deleting your account will remove all your data permanently.
        </p>
        <button 
          onClick={handleDeleteAccount}
          style={{ background: '#ff4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <FaTrash /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;