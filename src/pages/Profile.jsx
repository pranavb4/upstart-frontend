import { useState, useEffect } from 'react';
import API from '../api';
import { FaUserGraduate, FaStar, FaAward } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="dashboard">Loading Profile...</div>;

  // Gamification Logic
  const xpPerLevel = 100;
  const currentLevelXP = user.xp % xpPerLevel;
  const progressPercentage = (currentLevelXP / xpPerLevel) * 100;
  const nextLevelXP = (user.level * xpPerLevel) - user.xp;

  return (
    <div className="dashboard" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* 1. Identity Header */}
      <div className="meme-card" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '30px', background: 'linear-gradient(135deg, var(--card-bg) 0%, #2a2049 100%)' }}>
        <div style={{ width: '100px', height: '100px', background: '#5B2E91', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', border: '4px solid #9C27B0' }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{user.username}</h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem', margin: '10px 0' }}>
            <FaUserGraduate style={{ marginRight: '8px' }} />
            {user.college} • {user.branch} • {user.semester}
          </p>
          <div style={{ background: '#9C27B0', padding: '5px 15px', borderRadius: '20px', display: 'inline-block', fontWeight: 'bold' }}>
            {user.role === 'admin' ? '🛡️ Admin / Moderator' : '🎓 Student'}
          </div>
        </div>
      </div>

      {/* 2. Detailed Gamification Stats */}
      <div className="meme-card" style={{ padding: '30px', marginTop: '25px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFD700' }}>
          <FaStar /> Level {user.level} Progress
        </h2>
        
        <p style={{ marginBottom: '10px', color: '#ccc' }}>
          Total XP: <strong>{user.xp}</strong> | You need {nextLevelXP} more XP to reach Level {user.level + 1}!
        </p>

        {/* Progress Bar Container */}
        <div style={{ height: '25px', background: '#120d26', borderRadius: '15px', overflow: 'hidden', position: 'relative', border: '2px solid #332a55' }}>
          {/* Progress Filler */}
          <div style={{ 
            height: '100%', 
            width: `${progressPercentage}%`, 
            background: 'linear-gradient(90deg, #5B2E91, #9C27B0, #E91E63)',
            transition: 'width 0.5s ease-in-out',
            borderRadius: '15px'
          }}></div>
          <div style={{ position: 'absolute', width: '100%', textAlign: 'center', top: '2px', fontWeight: 'bold', textShadow: '1px 1px 2px black' }}>
            {Math.round(progressPercentage)}% towards Level {user.level + 1}
          </div>
        </div>

        {/* Badges Placeholder (Creative Addition) */}
        <h3 style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaAward /> Achievements
        </h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {user.xp > 50 && (
            <div style={{ background: '#2a2049', padding: '15px', borderRadius: '10px', textAlign: 'center', width: '100px' }}>
              <div style={{ fontSize: '2rem' }}>🚀</div>
              <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>First Steps</div>
            </div>
          )}
          {user.level >= 2 && (
            <div style={{ background: '#2a2049', padding: '15px', borderRadius: '10px', textAlign: 'center', width: '100px' }}>
              <div style={{ fontSize: '2rem' }}>📚</div>
              <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>Level Up!</div>
            </div>
          )}
           {/* Add more placeholders as needed */}
        </div>
      </div>
    </div>
  );
};

export default Profile;