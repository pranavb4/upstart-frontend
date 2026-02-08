import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { FaGoogle, FaApple } from 'react-icons/fa';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false); 
  
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/register') setIsRegistering(true);
    else setIsRegistering(false);
  }, [location]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await API.post('/auth/register', formData);
        setVerificationSent(true);
      } else {
        const response = await API.post('/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication Failed');
    }
  };

  const handleGoogleLogin = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${apiURL}/auth/google`, '_self');
  };

  if (verificationSent) {
    return (
      <div className="auth-container">
        <div className="auth-box" style={{ textAlign: 'center' }}>
          <FaEnvelope size={50} color="#9C27B0" />
          <h2 style={{marginTop: '20px'}}>Check Your Email</h2>
          <p style={{color: '#ccc'}}>
            We sent a verification link to <strong>{formData.email}</strong>.
          </p>
          <p style={{color: '#ff9800', fontSize: '0.9rem'}}>
            The link expires in 3 minutes.
          </p>
          <button onClick={() => setVerificationSent(false)} style={{marginTop: '20px'}}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1 style={{ color: 'white', marginBottom: '20px' }}>UpStart</h1>
      <div className="auth-box">
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={handleGoogleLogin}
            style={{ background: '#DB4437', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <FaGoogle /> Sign in with Google
          </button>
  
          <button 
            type="button" 
            onClick={() => alert("Requires Apple Developer Account ($99/yr)")}
            style={{ background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <FaApple /> Sign in with Apple
          </button>
        </div>

        <div style={{textAlign: 'center', color: '#aaa', margin: '10px 0'}}>OR</div>
        
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input name="username" type="text" placeholder="Username" onChange={handleChange} required />
          )}
          <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          
          <button type="submit">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center', color: '#ccc' }}>
          {isRegistering ? 'Already have an account?' : 'New here?'}
          <span 
            style={{ color: '#9C27B0', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}
            onClick={() => {
              setIsRegistering(!isRegistering);
              navigate(isRegistering ? '/' : '/register');
            }}
          >
            {isRegistering ? 'Login' : 'Create Account'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;