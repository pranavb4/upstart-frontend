import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', userStr); // Already JSON stringified by backend
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [searchParams, navigate]);

  return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Logging you in...</div>;
};

export default GoogleSuccess;