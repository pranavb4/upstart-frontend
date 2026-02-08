import { useEffect, useState, useRef } from 'react'; // Import useRef
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { FaCheckCircle, FaTimesCircle, FaHourglassEnd, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const param = useParams();
  const navigate = useNavigate();
  
  // Ref to prevent double-firing in React Strict Mode
  const hasFetched = useRef(false);

  useEffect(() => {
    const verifyEmailUrl = async () => {
      // Prevent running twice
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        await API.get(`/auth/verify/${param.token}`);
        setStatus('success');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);

      } catch (error) {
        console.error(error);
        if (error.response && error.response.data.message === "Link expired") {
          setStatus('expired');
        } else {
          // If it fails, we assume it's invalid.
          // Note: If you already verified successfully, the token is gone, 
          // so refreshing this page WILL show 'Invalid Link'. That is expected security behavior.
          setStatus('error');
        }
      }
    };

    verifyEmailUrl();
  }, [param, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        
        {status === 'loading' && (
          <>
            <FaSpinner className="spin" size={50} color="#9C27B0" />
            <h2 style={{marginTop: '20px'}}>Verifying...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <FaCheckCircle size={60} color="#4CAF50" />
            <h2 style={{color: '#4CAF50', marginTop: '15px'}}>Account Verified!</h2>
            <p style={{color: '#ccc', margin: '10px 0'}}>Redirecting to login...</p>
            <button onClick={() => navigate('/')}>Login Now</button>
          </>
        )}

        {status === 'expired' && (
          <>
            <FaHourglassEnd size={60} color="#FF9800" />
            <h2 style={{color: '#FF9800', marginTop: '15px'}}>Link Expired</h2>
            <p style={{color: '#ccc'}}>This link is too old.</p>
            <button onClick={() => navigate('/register')}>Register Again</button>
          </>
        )}

        {status === 'error' && (
          <>
            <FaTimesCircle size={60} color="#ff4444" />
            <h2 style={{color: '#ff4444', marginTop: '15px'}}>Link Invalid</h2>
            <p style={{color: '#ccc'}}>Please try registering again.</p>
            <button onClick={() => navigate('/register')}>Back to Register</button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;