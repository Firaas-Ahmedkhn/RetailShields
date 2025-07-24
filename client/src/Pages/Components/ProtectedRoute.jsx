// components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // or sessionStorage

  if (!token) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
