import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const Discussion = () => {
  const [threads, setThreads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    const res = await API.get('/discussion');
    setThreads(res.data);
  };

  const createThread = async (e) => {
    e.preventDefault();
    await API.post('/discussion', newThread);
    setShowForm(false);
    fetchThreads();
  };

  return (
    <div className="main-content" style={{ padding: '20px', color: 'white' }}>
      <h1>Discussion Forum</h1>
      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px', background: '#9C27B0' }}>
        + Create New Thread
      </button>

      {/* New Thread Form */}
      {showForm && (
        <form onSubmit={createThread} style={{ background: '#222', padding: '20px', marginBottom: '20px' }}>
          <input 
            placeholder="Title" 
            value={newThread.title}
            onChange={(e) => setNewThread({...newThread, title: e.target.value})}
            style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            required
          />
          <textarea 
            placeholder="Text Content (OP)" 
            value={newThread.content}
            onChange={(e) => setNewThread({...newThread, content: e.target.value})}
            style={{ width: '100%', height: '100px', padding: '10px' }}
            required
          />
          <button type="submit">Post Thread</button>
        </form>
      )}

      {/* Thread List */}
      <div className="thread-list">
        {threads.map(thread => (
          <div key={thread._id} style={{ border: '1px solid #444', padding: '15px', marginBottom: '10px', background: '#1a1a1a' }}>
            <Link to={`/discussion/${thread._id}`} style={{ textDecoration: 'none', color: 'white' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#90caf9' }}>{thread.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Posted by u/{thread.author?.username}</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(thread.createdAt).toLocaleDateString()}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussion;