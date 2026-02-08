import { useState, useEffect } from 'react';
import API from '../api';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Poll for notifications every 10 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error("Notif Error", err);
    }
  };

  const handleRead = async (notif) => {
    try {
      if (!notif.isRead) {
        await API.put(`/notifications/${notif._id}/read`);
        // Update local state to show as read immediately
        setNotifications(notifications.map(n => 
          n._id === notif._id ? { ...n, isRead: true } : n
        ));
      }
      setIsOpen(false);
      // Navigate based on type
      if (notif.type === 'like' || notif.type === 'comment') {
        navigate('/memes'); // Or navigate to specific ID if you implement single page view
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="nav-icon-container">
      <div onClick={() => setIsOpen(!isOpen)} style={{ position: 'relative' }}>
        <FaBell size={20} color="white" />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="notif-dropdown">
          <div style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #444' }}>
            Notifications
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div className="notif-empty">No new notifications</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
                  onClick={() => handleRead(notif)}
                >
                  <span style={{ fontWeight: 'bold', color: '#9C27B0' }}>
                    {notif.sender?.username || 'System'}
                  </span>{' '}
                  {notif.message}
                  <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '5px' }}>
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;