export const getBaseURL = () => {
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiURL.replace('/api', '');
};

export const getFileURL = (path) => {
  if (!path) return '';
  const baseURL = getBaseURL();
  const normalizedPath = path.replace(/\\/g, '/');
  return `${baseURL}/${normalizedPath}`;
};