import { useState, useEffect } from 'react';
import API from '../api';
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaFire, FaClock } from 'react-icons/fa';
import { getFileURL } from '../utils/urlHelper';

const MemeZone = () => {
  // Data State
  const [memes, setMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('newest'); // 'newest' or 'trending'
  
  // Upload State
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  
  // Interaction State
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  // Initial Load or Filter Change
  useEffect(() => {
    setMemes([]);     // Clear list
    setPage(1);       // Reset page
    setHasMore(true); // Reset "Load More"
    loadMemes(1, true); // Fetch page 1
  }, [filter]);

  const loadMemes = async (pageNum, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await API.get(`/memes?page=${pageNum}&limit=5&filter=${filter}`);
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        if (reset) {
          setMemes(data);
        } else {
          setMemes((prev) => [...prev, ...data]); // Append new memes
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMemes(nextPage);
  };

  // --- ACTIONS ---

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("Please select an image");

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('caption', uploadCaption);

    try {
      await API.post('/memes', formData);
      alert('Meme Posted! +20 XP');
      setUploadCaption('');
      setUploadFile(null);
      // Refresh feed
      setMemes([]);
      setPage(1);
      loadMemes(1, true);
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleLike = async (id) => {
    try {
      const { data: updatedLikes } = await API.put(`/memes/${id}/like`);
      // Update local state specifically for this meme
      setMemes(memes.map(meme => 
        meme._id === id ? { ...meme, likes: updatedLikes } : meme
      ));
    } catch (err) {
      console.error("Like failed");
    }
  };

  const handleComment = async (id) => {
    if (!commentText.trim()) return;
    try {
      const { data: updatedComments } = await API.post(`/memes/${id}/comment`, { text: commentText });
      
      setMemes(memes.map(meme => 
        meme._id === id ? { ...meme, comments: updatedComments } : meme
      ));
      setCommentText('');
    } catch (err) {
      alert("Comment failed");
    }
  };

  return (
    <div className="dashboard" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>MemeZone 🎭</h2>

      {/* 1. UPLOAD BOX */}
      <div className="meme-card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Share something funny</h3>
        <form onSubmit={handleUpload}>
          <input 
            type="text" 
            placeholder="Write a caption..." 
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setUploadFile(e.target.files[0])}
            required
          />
          <button type="submit" style={{ marginTop: '10px' }}>Post Meme</button>
        </form>
      </div>

      {/* 2. FILTER TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setFilter('newest')}
          style={{ flex: 1, background: filter === 'newest' ? '#9C27B0' : '#332a55', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <FaClock /> Newest
        </button>
        <button 
          onClick={() => setFilter('trending')}
          style={{ flex: 1, background: filter === 'trending' ? '#9C27B0' : '#332a55', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <FaFire /> Trending
        </button>
      </div>

      {/* 3. MEME FEED */}
      {memes.map((meme) => {
        const isLiked = meme.likes.includes(currentUser.id);

        return (
          <div key={meme._id} className="meme-card">
            {/* Header */}
            <div className="meme-header">
              <div style={{ width: '40px', height: '40px', background: '#5B2E91', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                {meme.uploadedBy?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{meme.uploadedBy?.username}</div>
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(meme.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '0 15px 10px 15px' }}>{meme.caption}</div>
            <img src={getFileURL(meme.imageUrl)} alt="meme" className="meme-img" />

            {/* Actions */}
            <div className="meme-actions">
              <button 
                className={`action-btn ${isLiked ? 'liked' : ''}`} 
                onClick={() => handleLike(meme._id)}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />} 
                {meme.likes.length} Likes
              </button>
              
              <button 
                className="action-btn"
                onClick={() => setActiveCommentId(activeCommentId === meme._id ? null : meme._id)}
              >
                <FaComment /> {meme.comments.length} Comments
              </button>

              <button 
                className="action-btn"
                onClick={async () => {
                    if (window.confirm("Report this content as inappropriate?")) {
                    await API.put(`/memes/${meme._id}/report`);
                    alert("Report submitted to Admins.");
                    }
                }}
                style={{ marginLeft: 'auto', color: '#aaa' }} // Push to right
                >
                ⚠️ Report
               </button>
            </div>

            {/* Comments Section */}
            {activeCommentId === meme._id && (
              <div className="comments-section">
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                  {meme.comments.length === 0 && <p style={{color: '#777', fontStyle: 'italic', fontSize: '0.9rem'}}>No comments yet.</p>}
                  {meme.comments.map((c, idx) => (
                    <div key={idx} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#9C27B0', marginRight: '5px' }}>
                        {c.user?.username}:
                      </span>
                      <span style={{ color: '#ddd' }}>{c.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex' }}>
                  <input 
                    className="comment-input" 
                    placeholder="Add a comment..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button 
                    onClick={() => handleComment(meme._id)}
                    style={{ width: 'auto', padding: '0 15px', borderRadius: '20px' }}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* 4. LOAD MORE BUTTON */}
      {hasMore && (
        <button 
          onClick={handleLoadMore} 
          disabled={loading}
          style={{ 
            display: 'block', 
            margin: '20px auto', 
            background: 'transparent', 
            border: '1px solid #9C27B0', 
            color: '#9C27B0', 
            width: 'auto',
            padding: '10px 20px'
          }}
        >
          {loading ? 'Loading...' : 'Load More Memes'}
        </button>
      )}
      {!hasMore && memes.length > 0 && (
        <p style={{textAlign: 'center', color: '#777', marginTop: '20px'}}>You've reached the end! 🎉</p>
      )}
    </div>
  );
};

export default MemeZone;