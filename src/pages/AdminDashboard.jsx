import { useState, useEffect } from 'react';
import API from '../api';
import { FaTrash, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getFileURL } from '../utils/urlHelper';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await API.get('/admin/reports');
      setReports(data);
    } catch (err) {
      alert("Access Denied: You are not an Admin");
      navigate('/dashboard');
    }
  };

  const handleBan = async (id) => {
    if (!window.confirm("Delete this meme permanently?")) return;
    try {
      await API.delete(`/admin/memes/${id}`);
      setReports(reports.filter(r => r._id !== id)); // Remove from UI
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleDismiss = async (id) => {
    try {
      await API.put(`/admin/memes/${id}/dismiss`);
      setReports(reports.filter(r => r._id !== id)); // Remove from UI
    } catch (err) {
      alert("Failed to dismiss");
    }
  };


  return (
    <div className="dashboard" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#ff4444', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaExclamationTriangle /> Moderation Dashboard
      </h2>
      <p style={{ color: '#aaa', marginBottom: '20px' }}>
        Review content flagged by students.
      </p>

      {reports.length === 0 ? (
        <div className="auth-box" style={{ textAlign: 'center', padding: '40px', color: '#4CAF50' }}>
          <h3>All Clean! 🛡️</h3>
          <p>No reported content pending review.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {reports.map((item) => (
            <div key={item._id} className="meme-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', padding: '15px' }}>
              
              {/* Image Preview */}
              <img 
                src={getFileURL(item.imageUrl)} 
                alt="reported" 
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px', marginRight: '20px' }} 
              />

              {/* Details */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#ff4444' }}>
                  Reports: {item.reports}
                </h4>
                <p><strong>Uploader:</strong> {item.uploadedBy?.username}</p>
                <p><strong>Caption:</strong> "{item.caption}"</p>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>
                  Posted: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => handleBan(item._id)}
                  style={{ background: '#ff4444', border: 'none', padding: '10px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <FaTrash /> Ban Content
                </button>
                <button 
                  onClick={() => handleDismiss(item._id)}
                  style={{ background: '#4CAF50', border: 'none', padding: '10px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <FaCheck /> Keep / Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;