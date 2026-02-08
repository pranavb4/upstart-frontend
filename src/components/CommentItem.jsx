import { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaReply, FaMinusSquare, FaPlusSquare } from 'react-icons/fa';
import API from '../api';

const CommentItem = ({ comment, postId, refreshComments }) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [collapsed, setCollapsed] = useState(false); // Collapsing Logic

  const handleVote = async (type) => {
    try {
      await API.put(`/discussion/comment/${comment._id}/vote`, { type });
      refreshComments(); // Reload to show new score
    } catch (err) {
      console.error(err);
    }
  };

  const submitReply = async () => {
    try {
      await API.post(`/discussion/${postId}/comment`, {
        content: replyContent,
        parentId: comment._id // This creates the nesting!
      });
      setReplying(false);
      setReplyContent('');
      refreshComments();
    } catch (err) {
      console.error(err);
    }
  };

  const score = (comment.upvotes?.length || 0) - (comment.downvotes?.length || 0);

  // --- RENDERING ---
  return (
    <div style={{ 
      marginLeft: '20px', 
      borderLeft: '2px solid #333', 
      paddingLeft: '10px', 
      marginTop: '10px' 
    }}>
      {/* 1. Comment Header (Author + Collapse Toggle) */}
      <div style={{ fontSize: '0.85rem', color: '#888', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer' }}>
          {collapsed ? <FaPlusSquare /> : <FaMinusSquare />}
        </span>
        <strong>{comment.author?.username || 'Unknown'}</strong> • {score} points
      </div>

      {/* 2. Content (Hidden if Collapsed) */}
      {!collapsed && (
        <>
          <p style={{ margin: '5px 0', color: 'white' }}>{comment.content}</p>

          {/* 3. Actions (Vote / Reply) */}
          <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: '#ccc' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => handleVote('upvote')}><FaArrowUp /></span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleVote('downvote')}><FaArrowDown /></span>
            <span style={{ cursor: 'pointer' }} onClick={() => setReplying(!replying)}><FaReply /> Reply</span>
          </div>

          {/* 4. Reply Form */}
          {replying && (
            <div style={{ marginTop: '10px' }}>
              <input 
                type="text" 
                value={replyContent} 
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                style={{ background: '#222', border: '1px solid #444', color: 'white', padding: '5px' }}
              />
              <button onClick={submitReply} style={{ marginLeft: '5px', background: '#9C27B0' }}>Post</button>
            </div>
          )}

          {/* 5. RECURSION: Render Children */}
          {comment.children && comment.children.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              {comment.children.map(child => (
                <CommentItem 
                  key={child._id} 
                  comment={child} 
                  postId={postId} 
                  refreshComments={refreshComments} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentItem;