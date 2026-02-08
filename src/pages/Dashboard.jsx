import { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { FaUpload, FaGrinSquint, FaComments, FaBolt, FaFileAlt, FaImage } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await API.get('/users/profile');
        setUser(profileRes.data);
        const activityRes = await API.get('/activity');
        setActivityFeed(activityRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (loading || !user) return <div className="dashboard">Loading your hub...</div>;

  return (
    <div className="dashboard" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* LEFT COLUMN: Main Content */}
      <div>
        {/* 1. Welcome Banner */}
        <div className="meme-card" style={{ padding: '30px', background: 'linear-gradient(90deg, #5B2E91, #332a55)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Hey, {user.username}! 👋</h1>
            <p style={{ color: '#ccc', marginTop: '10px' }}>Ready to level up your learning today?</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FFD700' }}>{user.xp} XP</div>
            <div style={{ color: '#ccc' }}>Level {user.level} Student</div>
          </div>
        </div>

        {/* 2. Live Activity Feed (Creative Addition) */}
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
          <FaBolt style={{ color: '#FFD700' }} /> What's Happening Now
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activityFeed.map((item) => (
            <div key={item._id} className="meme-card" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '12px', borderRadius: '50%', background: item.type === 'note' ? '#2196F3' : '#E91E63' }}>
                {item.type === 'note' ? <FaFileAlt color="white" /> : <FaImage color="white" />}
              </div>
              <div style={{ flex: 1 }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#9C27B0' }}>{item.uploadedBy?.username}</span>
                  {' '}posted a new{' '}
                  {item.type === 'note' ? <strong>Note</strong> : <strong>Meme</strong>}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '4px' }}>
                  {item.type === 'note' ? item.title : `"${item.caption ? item.caption.substring(0, 30) : 'Image'}..."`}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar */}
      <div>
        {/* 3. Quick Actions Grid */}
        <h3 style={{ margin: '0 0 15px 0' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <Link to="/notes" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ background: '#2196F322', border: '1px solid #2196F3', color: '#2196F3', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', transition: 'transform 0.2s' }}>
              <FaUpload size={24} />
              <span>Upload Note</span>
            </div>
          </Link>
          <Link to="/memes" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ background: '#E91E6322', border: '1px solid #E91E63', color: '#E91E63', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px' }}>
              <FaGrinSquint size={24} />
              <span>Post Meme</span>
            </div>
          </Link>
          <Link to="/discussion" style={{ textDecoration: 'none', gridColumn: 'span 2' }}>
            <div className="stat-card" style={{ background: '#9C27B022', border: '1px solid #9C27B0', color: '#9C27B0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px' }}>
              <FaComments size={24} />
              <span>Join Discussion</span>
            </div>
          </Link>
        </div>
        
        {/* 4. Profile Nudge */}
        <div className="meme-card" style={{ padding: '20px', marginTop: '25px', textAlign: 'center' }}>
          <h3>Your Journey</h3>
          <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Check your full stats, badges, and progress.</p>
          <Link to="/profile">
            <button style={{ marginTop: '10px', width: '100%' }}>View Full Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;