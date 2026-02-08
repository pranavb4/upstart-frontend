import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import CommentItem from '../components/CommentItem';
import { buildCommentTree } from '../utils/buildTree'; // Helper we made

const ThreadView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentTree, setCommentTree] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Use useCallback to memoize the function
  const fetchThreadData = useCallback(async () => {
    try {
      const res = await API.get(`/discussion/${id}`);
      setPost(res.data.post);
      
      // Convert Flat List -> Tree Structure
      const tree = buildCommentTree(res.data.comments);
      setCommentTree(tree);
    } catch (err) {
      console.error(err);
    }
  }, [id]); // Dependency array includes id

  useEffect(() => {
    fetchThreadData();
  }, [fetchThreadData]); // Dependency is the memoized function

  const postComment = async () => {
    if (!newComment.trim()) return;
    await API.post(`/discussion/${id}/comment`, { content: newComment }); // No parentId = Top Level
    setNewComment('');
    fetchThreadData();
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="main-content" style={{ padding: '20px', color: 'white' }}>
      {/* 1. Original Post (OP) */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
        <h1 style={{ color: '#90caf9' }}>{post.title}</h1>
        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Posted by u/{post.author?.username}</p>
        <hr style={{ borderColor: '#333' }} />
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{post.content}</p>
      </div>

      {/* 2. Add Top-Level Comment */}
      <div style={{ marginTop: '20px' }}>
        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          style={{ width: '100%', height: '80px', background: '#222', color: 'white', padding: '10px' }}
        />
        <button onClick={postComment} style={{ marginTop: '10px', background: '#9C27B0' }}>Comment</button>
      </div>

      {/* 3. Recursive Comment Tree */}
      <div style={{ marginTop: '30px' }}>
        <h3>Comments</h3>
        {commentTree.map(rootComment => (
          <CommentItem 
            key={rootComment._id} 
            comment={rootComment} 
            postId={id} 
            refreshComments={fetchThreadData} 
          />
        ))}
      </div>
    </div>
  );
};

export default ThreadView;